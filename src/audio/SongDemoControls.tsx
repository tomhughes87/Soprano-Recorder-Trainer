import React, { useEffect, useRef, useState } from "react";
import type { SongEvent } from "../music/songTypes";
import { SongTransport } from "./songTransport";
import type { GuideLevel } from "./recorderSynth";

type Props = {
  events: SongEvent[];
  bpm: number;
  guideLevel: GuideLevel;
  metronome: boolean;
  onGuideLevelChange: (level: GuideLevel) => void;
};

export function SongDemoControls({
  events,
  bpm,
  guideLevel,
  metronome,
  onGuideLevelChange,
}: Props) {
  const transportRef = useRef<SongTransport | null>(null);
  const frameRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const getTransport = () => {
    if (!transportRef.current) {
      transportRef.current = new SongTransport();
    }
    return transportRef.current;
  };

  const stop = () => {
    transportRef.current?.stop();
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    setPlaying(false);
    setProgress(0);
  };

  const play = async () => {
    const transport = getTransport();

    try {
      const info = await transport.start(events, bpm, {
        guideLevel,
        metronome,
        leadInBeats: 1,
      });

      setPlaying(true);

      const tick = () => {
        const beat = transport.currentBeat();
        const nextProgress =
          info.totalBeats <= 0
            ? 0
            : Math.max(0, Math.min(100, (beat / info.totalBeats) * 100));

        setProgress(nextProgress);

        if (transport.isPastEnd(0.15)) {
          transport.stop();
          setPlaying(false);
          setProgress(100);
          return;
        }

        frameRef.current = requestAnimationFrame(tick);
      };

      frameRef.current = requestAnimationFrame(tick);
    } catch (error) {
      console.error(error);
      setPlaying(false);
    }
  };

  useEffect(() => stop, []);

  useEffect(() => {
    if (playing) stop();
  }, [bpm, events, guideLevel, metronome]);

  return (
    <div className="songDemoControls">
      <div className="songDemoButtons">
        <button className="secondary" onClick={playing ? stop : play}>
          {playing ? "■ Stop demo" : "▶ Listen"}
        </button>

        <label className="guideSelect">
          <span>Guide sound</span>
          <select
            value={guideLevel}
            onChange={(event) =>
              onGuideLevelChange(event.target.value as GuideLevel)
            }
          >
            <option value="off">Off</option>
            <option value="soft">Soft</option>
            <option value="full">Full</option>
          </select>
        </label>
      </div>

      <div className="demoProgressTrack" aria-label="Demo playback progress">
        <div className="demoProgressFill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
