import { mergeTiedEvents, type SongEvent } from "../music/songTypes";
import {
  scheduleMetronomeClick,
  scheduleRecorderNote,
  type GuideLevel,
  type ScheduledVoice,
} from "./recorderSynth";

export type TransportOptions = {
  leadInBeats?: number;
  guideLevel?: GuideLevel;
  metronome?: boolean;
};

export type TransportStart = {
  startAudioTime: number;
  startPerformanceTime: number;
  secondsPerBeat: number;
  totalBeats: number;
};

type TimedEvent = SongEvent & {
  startBeat: number;
  endBeat: number;
};

type PresentationClock = {
  contextTime: number;
  performanceTime: number;
};

/**
 * Map the audio timeline to the moment samples reach the output device.
 * AudioContext.currentTime can run ahead by the device output latency, which
 * makes animation driven directly from it appear early.
 */
function getPresentationClock(context: AudioContext): PresentationClock {
  if (typeof context.getOutputTimestamp === "function") {
    const timestamp = context.getOutputTimestamp();

    if (
      Number.isFinite(timestamp.contextTime) &&
      Number.isFinite(timestamp.performanceTime) &&
      timestamp.performanceTime > 0
    ) {
      return timestamp;
    }
  }

  const outputLatency =
    Number.isFinite(context.outputLatency) && context.outputLatency > 0
      ? context.outputLatency
      : context.baseLatency;

  return {
    contextTime: context.currentTime - Math.max(0, outputLatency),
    performanceTime: performance.now(),
  };
}

function makeTimeline(events: SongEvent[]): TimedEvent[] {
  const result: TimedEvent[] = [];
  let beat = 0;

  for (const event of mergeTiedEvents(events)) {
    result.push({
      ...event,
      startBeat: beat,
      endBeat: beat + event.beats,
    });

    beat += event.beats;
  }

  return result;
}

export class SongTransport {
  private context: AudioContext | null = null;
  private voices: ScheduledVoice[] = [];
  private started: TransportStart | null = null;

  private getContext() {
    if (!this.context) {
      const AudioContextCtor =
        window.AudioContext ??
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;

      if (!AudioContextCtor) {
        throw new Error("Web Audio is not supported in this browser.");
      }

      this.context = new AudioContextCtor();
    }

    return this.context;
  }

  async start(
    events: SongEvent[],
    bpm: number,
    options: TransportOptions = {},
  ): Promise<TransportStart> {
    this.stop();

    const context = this.getContext();
    if (context.state === "suspended") {
      await context.resume();
    }

    const safeBpm = Math.max(40, Math.min(220, bpm));
    const secondsPerBeat = 60 / safeBpm;
    const leadInBeats = Math.max(0, options.leadInBeats ?? 0);
    const guideLevel = options.guideLevel ?? "full";
    const timeline = makeTimeline(events);
    const totalBeats = timeline.length
      ? timeline[timeline.length - 1].endBeat
      : 0;

    // Small scheduling cushion avoids first-note jitter.
    const nowAudio = context.currentTime;
    const startAudioTime = nowAudio + 0.08 + leadInBeats * secondsPerBeat;
    const presentationClock = getPresentationClock(context);
    const startPerformanceTime =
      presentationClock.performanceTime +
      (startAudioTime - presentationClock.contextTime) * 1000;

    if (options.metronome) {
      for (let beat = -leadInBeats; beat <= Math.ceil(totalBeats); beat += 1) {
        const at = startAudioTime + beat * secondsPerBeat;
        if (at < context.currentTime) continue;
        this.voices.push(
          scheduleMetronomeClick(
            context,
            context.destination,
            at,
            beat % 4 === 0,
          ),
        );
      }
    }

    for (const event of timeline) {
      const at = startAudioTime + event.startBeat * secondsPerBeat;
      const duration = event.beats * secondsPerBeat;

      const voice = scheduleRecorderNote(
        context,
        context.destination,
        event.note,
        at,
        duration,
        guideLevel,
        event.articulation ?? "normal",
      );

      if (voice) this.voices.push(voice);
    }

    this.started = {
      startAudioTime,
      startPerformanceTime,
      secondsPerBeat,
      totalBeats,
    };

    return this.started;
  }

  currentBeat() {
    if (!this.context || !this.started) return 0;

    const presentationClock = getPresentationClock(this.context);
    const presentedContextTime =
      presentationClock.contextTime +
      (performance.now() - presentationClock.performanceTime) / 1000;

    return (
      (presentedContextTime - this.started.startAudioTime) /
      this.started.secondsPerBeat
    );
  }

  isPastEnd(extraBeats = 0) {
    if (!this.started) return false;
    return this.currentBeat() > this.started.totalBeats + extraBeats;
  }

  stop() {
    for (const voice of this.voices) {
      voice.stop();
    }

    this.voices = [];
    this.started = null;
  }

  get startInfo() {
    return this.started;
  }
}
