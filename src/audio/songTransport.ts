import type { SongEvent } from "../music/songTypes";
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

function makeTimeline(events: SongEvent[]): TimedEvent[] {
  const result: TimedEvent[] = [];
  let beat = 0;

  for (let index = 0; index < events.length; index += 1) {
    const event = events[index];
    let beats = event.beats;

    // A tie to the same following pitch should sound as one continuous note.
    while (
      event.tieToNext &&
      index + 1 < events.length &&
      events[index + 1].note === event.note
    ) {
      beats += events[index + 1].beats;
      index += 1;
      if (!events[index].tieToNext) break;
    }

    result.push({
      ...event,
      beats,
      startBeat: beat,
      endBeat: beat + beats,
    });

    beat += beats;
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
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

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
    options: TransportOptions = {}
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
    const totalBeats = timeline.length ? timeline[timeline.length - 1].endBeat : 0;

    // Small scheduling cushion avoids first-note jitter.
    const nowAudio = context.currentTime;
    const startAudioTime = nowAudio + 0.08 + leadInBeats * secondsPerBeat;
    const startPerformanceTime =
      performance.now() + (startAudioTime - nowAudio) * 1000;

    if (options.metronome) {
      for (let beat = -leadInBeats; beat <= Math.ceil(totalBeats); beat += 1) {
        const at = startAudioTime + beat * secondsPerBeat;
        if (at < context.currentTime) continue;
        this.voices.push(
          scheduleMetronomeClick(context, context.destination, at, beat % 4 === 0)
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
        event.articulation ?? "normal"
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
    return (this.context.currentTime - this.started.startAudioTime) / this.started.secondsPerBeat;
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
