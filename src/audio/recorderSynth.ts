import { noteIdToFrequency } from "./pitch";
import type { Articulation } from "../music/songTypes";

export type GuideLevel = "off" | "soft" | "full";

export type ScheduledVoice = {
  stop: () => void;
};

function guideGain(level: GuideLevel) {
  if (level === "off") return 0;
  if (level === "soft") return 0.075;
  return 0.18;
}

function scheduleNoise(
  context: AudioContext,
  destination: AudioNode,
  startTime: number,
  stopTime: number,
  amount: number,
) {
  const length = Math.max(
    1,
    Math.ceil((stopTime - startTime) * context.sampleRate),
  );
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * 0.22;
  }

  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  source.buffer = buffer;
  filter.type = "bandpass";
  filter.frequency.value = 3400;
  filter.Q.value = 0.7;
  gain.gain.value = amount;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);

  source.start(startTime);
  source.stop(stopTime);

  return source;
}

export function scheduleRecorderNote(
  context: AudioContext,
  destination: AudioNode,
  noteId: string,
  startTime: number,
  durationSeconds: number,
  level: GuideLevel,
  articulation: Articulation = "normal",
): ScheduledVoice | null {
  const volume = guideGain(level);
  if (volume <= 0 || durationSeconds <= 0) return null;

  const frequency = noteIdToFrequency(noteId);

  const requestedAttack =
    articulation === "slur"
      ? 0.012
      : articulation === "staccato"
        ? 0.006
        : 0.008;

  const requestedRelease =
    articulation === "staccato"
      ? 0.025
      : articulation === "slur"
        ? 0.06
        : 0.045;

  const gatedDuration =
    articulation === "staccato"
      ? durationSeconds * 0.58
      : articulation === "slur"
        ? durationSeconds
        : durationSeconds * 0.92;

  // The entire envelope must fit inside the event's musical duration. A fixed
  // release added after the event makes short notes overlap a much larger part
  // of the following card than long notes, so their pitch change sounds late.
  const soundEnd = startTime + Math.min(durationSeconds, gatedDuration);
  const soundingDuration = soundEnd - startTime;
  const attack = Math.min(requestedAttack, soundingDuration * 0.2);
  const release = Math.min(requestedRelease, soundingDuration * 0.35);
  const releaseStart = Math.max(startTime + attack, soundEnd - release);

  const master = context.createGain();
  const toneFilter = context.createBiquadFilter();

  toneFilter.type = "lowpass";
  toneFilter.frequency.value = Math.min(6200, frequency * 11);
  toneFilter.Q.value = 0.6;

  master.gain.setValueAtTime(0.0001, startTime);
  master.gain.exponentialRampToValueAtTime(volume, startTime + attack);
  master.gain.setValueAtTime(volume, releaseStart);
  master.gain.exponentialRampToValueAtTime(0.0001, soundEnd);

  master.connect(toneFilter);
  toneFilter.connect(destination);

  // Recorder-like spectrum: strong fundamental, progressively softer harmonics.
  const partials = [
    { multiple: 1, gain: 1.0, type: "sine" as OscillatorType },
    { multiple: 2, gain: 0.28, type: "sine" as OscillatorType },
    { multiple: 3, gain: 0.13, type: "sine" as OscillatorType },
    { multiple: 4, gain: 0.055, type: "sine" as OscillatorType },
  ];

  const sources: AudioScheduledSourceNode[] = [];

  for (const partial of partials) {
    const oscillator = context.createOscillator();
    const partialGain = context.createGain();

    oscillator.type = partial.type;
    oscillator.frequency.setValueAtTime(
      frequency * partial.multiple,
      startTime,
    );
    partialGain.gain.value = partial.gain;

    oscillator.connect(partialGain);
    partialGain.connect(master);

    oscillator.start(startTime);
    oscillator.stop(soundEnd);
    sources.push(oscillator);
  }

  // A tiny breath component helps it read as a wind instrument rather than a beep.
  const noise = scheduleNoise(context, master, startTime, soundEnd, 0.07);
  sources.push(noise);

  return {
    stop: () => {
      for (const source of sources) {
        try {
          source.stop();
        } catch {
          // Already stopped.
        }
      }
    },
  };
}

export function scheduleMetronomeClick(
  context: AudioContext,
  destination: AudioNode,
  at: number,
  accent = false,
): ScheduledVoice {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = accent ? 1180 : 820;

  gain.gain.setValueAtTime(accent ? 0.09 : 0.055, at);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.045);

  oscillator.connect(gain);
  gain.connect(destination);

  oscillator.start(at);
  oscillator.stop(at + 0.05);

  return {
    stop: () => {
      try {
        oscillator.stop();
      } catch {
        // Already stopped.
      }
    },
  };
}
