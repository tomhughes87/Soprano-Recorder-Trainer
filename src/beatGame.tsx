import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { RecorderPattern, noteColourStyle, type TrainingNote } from "./training";
import { eventLengthLabel, mergeTiedEvents, type SongEvent } from "./music/songTypes";
import { SongTransport } from "./audio/songTransport";
import type { GuideLevel } from "./audio/recorderSynth";

export type BeatMidiSignal = {
  nonce: number;
  kind: "on" | "off";
  midi: number;
  at: number;
};

type Judgement = "perfect" | "good" | "okay" | "miss";

type Props = {
  events: SongEvent[];
  notes: TrainingNote[];
  bpm: number;
  midiSignal: BeatMidiSignal | null;
  resetMidi: number;
  resetKey: number;
  guideLevel: GuideLevel;
  onGuideLevelChange: (level: GuideLevel) => void;
  onBpmChange: (bpm: number) => void;
};

const HIT_WINDOW_BEATS = 0.42;
const LOOKAHEAD_BEATS = 3;
const RESULT_STORAGE = "carryon-beat-game-best-v1";

const NOTE_HEIGHT_ORDER = [
  "D5",
  "Cs5",
  "C5",
  "B4",
  "Bb4",
  "A4",
  "Gs4",
  "G4",
  "Fs4",
  "F4",
  "E4",
  "Ds4",
  "D4",
  "Cs4",
  "C4",
] as const;

// Musically clearer vertical spacing:
// - naturals get the main spacing
// - accidentals sit between them
// - this still allows some overlap, but reads less like a compressed spreadsheet
const NOTE_GRID_POSITIONS: Record<(typeof NOTE_HEIGHT_ORDER)[number], number> = {
  D5: 36,
  Cs5: 64,
  C5: 92,
  B4: 148,
  Bb4: 176,
  A4: 204,
  Gs4: 232,
  G4: 260,
  Fs4: 288,
  F4: 316,
  E4: 372,
  Ds4: 400,
  D4: 428,
  Cs4: 456,
  C4: 484,
};

function pitchRowIndexForNoteId(noteId: string) {
  const index = NOTE_HEIGHT_ORDER.indexOf(noteId as (typeof NOTE_HEIGHT_ORDER)[number]);
  return index >= 0 ? index : NOTE_HEIGHT_ORDER.length - 1;
}

function verticalPositionForNoteId(noteId: string) {
  const key =
    (NOTE_HEIGHT_ORDER.includes(noteId as (typeof NOTE_HEIGHT_ORDER)[number])
      ? noteId
      : "C4") as (typeof NOTE_HEIGHT_ORDER)[number];

  return NOTE_GRID_POSITIONS[key];
}


function primaryGameLabel(label: string) {
  return label.split("/")[0].trim();
}


function loadBest() {
  try {
    const raw = localStorage.getItem(RESULT_STORAGE);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { bestScore?: number };
    return Number(parsed.bestScore) || 0;
  } catch {
    return 0;
  }
}

function saveBest(bestScore: number) {
  try {
    localStorage.setItem(RESULT_STORAGE, JSON.stringify({ bestScore }));
  } catch {
    // Practice still works if storage is unavailable.
  }
}

export function BeatGame({
  events,
  notes,
  bpm,
  midiSignal,
  resetMidi: _resetMidi,
  resetKey,
  guideLevel,
  onGuideLevelChange,
  onBpmChange,
}: Props) {
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [, setClockTick] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [feedback, setFeedback] = useState("Press Start when you're ready");
  const [judgements, setJudgements] = useState<Record<number, Judgement>>({});
  const [bestScore, setBestScore] = useState(loadBest);
  const [holdStarts, setHoldStarts] = useState<Record<number, { at: number; eventIndex: number }>>({});

  const startAtRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const transportRef = useRef<SongTransport | null>(null);
  const laneRef = useRef<HTMLDivElement | null>(null);
  const [laneWidth, setLaneWidth] = useState(0);

  const beatMs = 60000 / bpm;

  const timeline = useMemo(() => {
    let cursor = 0;

    return mergeTiedEvents(events).map((event, index) => {
      const startBeat = cursor;
      cursor += event.beats;

      return {
        ...event,
        index,
        startBeat,
        endBeat: cursor,
      };
    });
  }, [events]);

  const totalBeats = timeline.length ? timeline[timeline.length - 1].endBeat : 0;
  const currentBeat =
    running && transportRef.current
      ? transportRef.current.currentBeat()
      : 0;

  const noteById = (id: string) => notes.find(note => note.id === id);

  const getTransport = () => {
    if (!transportRef.current) transportRef.current = new SongTransport();
    return transportRef.current;
  };

  const resetGame = () => {
    setRunning(false);
    setFinished(false);
    setClockTick(0);
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setFeedback("Press Start when you're ready");
    setJudgements({});
    setHoldStarts({});
    transportRef.current?.stop();

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  };

  const startGame = async () => {
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setJudgements({});
    setHoldStarts({});
    setFinished(false);
    setFeedback("Get ready…");

    try {
      const transport = getTransport();
      const info = await transport.start(events, bpm, {
        guideLevel,
        metronome: true,
        leadInBeats: 2,
      });

      startAtRef.current = info.startPerformanceTime;
      setClockTick(performance.now());
      setRunning(true);
    } catch (error) {
      console.error(error);
      setFeedback("Audio could not start");
      setRunning(false);
    }
  };

  useLayoutEffect(() => {
    const lane = laneRef.current;
    if (!lane) return;

    const updateWidth = () => {
      setLaneWidth(lane.getBoundingClientRect().width);
    };

    updateWidth();

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(updateWidth);
      observer.observe(lane);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetKey]);

  useEffect(() => {
    return () => transportRef.current?.stop();
  }, []);

  useEffect(() => {
    if (!running) return;

    const tick = (time: number) => {
      setClockTick(time);
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [running]);

  useEffect(() => {
    if (!running || finished) return;

    // Automatically mark overdue notes as misses.
    setJudgements(previous => {
      let changed = false;
      const next = { ...previous };

      for (const event of timeline) {
        if (next[event.index]) continue;

        if (currentBeat > event.startBeat + HIT_WINDOW_BEATS) {
          next[event.index] = "miss";
          changed = true;
          setCombo(0);
          setFeedback(`Miss · ${noteById(event.note)?.label ?? event.note}`);
        }
      }

      return changed ? next : previous;
    });

    if (currentBeat > totalBeats + 0.65) {
      transportRef.current?.stop();
      setRunning(false);
      setFinished(true);
      setFeedback("Song complete");

      setBestScore(previous => {
        const next = Math.max(previous, score);
        if (next !== previous) saveBest(next);
        return next;
      });
    }
  }, [currentBeat, running, finished, timeline, totalBeats, score]);

  useEffect(() => {
    if (!running || !midiSignal) return;

    const signalBeat = (midiSignal.at - startAtRef.current) / beatMs;

    if (midiSignal.kind === "on") {
      const candidates = timeline
        .filter(event => !judgements[event.index])
        .map(event => ({
          event,
          distance: Math.abs(signalBeat - event.startBeat),
        }))
        .filter(candidate => candidate.distance <= HIT_WINDOW_BEATS)
        .sort((a, b) => a.distance - b.distance);

      const candidate = candidates[0];

      if (!candidate) {
        setFeedback("Too early / late");
        setCombo(0);
        return;
      }

      const expected = noteById(candidate.event.note);

      if (!expected || expected.midi !== midiSignal.midi) {
        setFeedback(`Wrong pitch · aim for ${expected?.label ?? candidate.event.note}`);
        setCombo(0);
        return;
      }

      const distance = candidate.distance;
      const judgement: Judgement =
        distance <= 0.10 ? "perfect" :
        distance <= 0.23 ? "good" :
        "okay";

      const points =
        judgement === "perfect" ? 100 :
        judgement === "good" ? 70 :
        40;

      setJudgements(previous => ({
        ...previous,
        [candidate.event.index]: judgement,
      }));

      setScore(value => value + points);
      setCombo(value => {
        const next = value + 1;
        setBestCombo(best => Math.max(best, next));
        return next;
      });

      setFeedback(
        judgement === "perfect" ? "Perfect!" :
        judgement === "good" ? "Good" :
        "Okay"
      );

      // Track long notes so releasing close to the intended duration can earn a bonus.
      if (candidate.event.beats > 1) {
        setHoldStarts(previous => ({
          ...previous,
          [midiSignal.midi]: {
            at: midiSignal.at,
            eventIndex: candidate.event.index,
          },
        }));
      }
    } else {
      const hold = holdStarts[midiSignal.midi];
      if (!hold) return;

      const event = timeline[hold.eventIndex];
      if (!event) return;

      const heldMs = midiSignal.at - hold.at;
      const expectedMs = event.beats * beatMs;
      const ratio = heldMs / expectedMs;

      if (ratio >= 0.72) {
        setScore(value => value + 30);
        setFeedback("Hold ✓");
      } else {
        setFeedback("Released early");
      }

      setHoldStarts(previous => {
        const next = { ...previous };
        delete next[midiSignal.midi];
        return next;
      });
    }
  }, [midiSignal?.nonce]);

  const visibleEvents = timeline.filter(event => {
    const untilStart = event.startBeat - currentBeat;
    const untilEnd = event.endBeat - currentBeat;

    // Keep a held note visible until its trailing edge has passed the hit line.
    return untilEnd >= -0.18 && untilStart <= LOOKAHEAD_BEATS;
  });

  const judgedCount = Object.keys(judgements).length;
  const hitCount = Object.values(judgements).filter(value => value !== "miss").length;
  const accuracy = judgedCount === 0 ? 0 : Math.round((hitCount / judgedCount) * 100);

  // One geometry system for every screen size and tempo.
  // Beat length is derived from the measured usable lane width.
  const hitLineRatio = 0.12;
  const rightPadding = 24;
  const hitLineX = laneWidth * hitLineRatio;
  const usableTravelWidth = Math.max(1, laneWidth - hitLineX - rightPadding);
  const pxPerBeat = usableTravelWidth / LOOKAHEAD_BEATS;

  return (
    <div className="beatGame">
      <div className="beatHud">
        <div className="beatHudStat"><span>Score</span><strong>{score}</strong></div>
        <div className="beatHudStat"><span>Combo</span><strong>{combo}×</strong></div>
        <div className="beatHudStat"><span>Accuracy</span><strong>{accuracy}%</strong></div>

        <label className="beatGuideSelect">
          <span>Guide</span>
          <select
            value={guideLevel}
            disabled={running}
            onChange={event => onGuideLevelChange(event.target.value as GuideLevel)}
          >
            <option value="off">Off</option>
            <option value="soft">Soft</option>
            <option value="full">Full</option>
          </select>
        </label>

        <div className="beatGameSpeed">
          <button className="secondary" disabled={running} onClick={() => onBpmChange(Math.max(40, bpm - 5))}>−</button>
          <strong>{bpm} BPM</strong>
          <button className="secondary" disabled={running} onClick={() => onBpmChange(Math.min(200, bpm + 5))}>+</button>
        </div>
      </div>

      <div ref={laneRef} className="beatLane" aria-label="Beat game note highway">
        <div className="pitchScale" aria-hidden="true">
          {NOTE_HEIGHT_ORDER.map(noteId => (
            <div
              key={noteId}
              className="pitchScaleMark"
              style={{ top: `${verticalPositionForNoteId(noteId)}px` }}
            >
              {noteId.replace("s", "♯")}
            </div>
          ))}
        </div>

        {visibleEvents.map(event => {
          const note = noteById(event.note);
          if (!note) return null;

          const beatsUntilHit = event.startBeat - currentBeat;

          // The left edge is note-on, the right edge is note-off.
          // Both are calculated from the measured lane width, so the duration
          // stays exact on desktop, tablet and mobile.
          const leadingEdgeX = hitLineX + beatsUntilHit * pxPerBeat;
          const durationWidthPx = Math.max(1, event.beats * pxPerBeat);

          const y = verticalPositionForNoteId(event.note);
          const judgement = judgements[event.index];

          return (
            <div
              key={event.index}
              className={`fallingNote ${event.beats > 1 ? "heldNote" : ""} ${judgement ? `judged ${judgement}` : ""}`}
              style={{
                left: `${leadingEdgeX}px`,
                top: `${y}px`,
                width: `${durationWidthPx}px`,
                ...noteColourStyle(note.id),
              }}
            >
              <div className="noteHead noteColourCard">
                <strong>{primaryGameLabel(note.label)}</strong>
                <RecorderPattern note={note} compact />
              </div>

              <span className="fallingDuration">{eventLengthLabel(event)}</span>
            </div>
          );
        })}

        <div className="hitLine" style={{ left: `${hitLineX}px` }}>
          <span>HIT</span>
        </div>

        {!running && (
          <div className="beatGameOverlay">
            {finished ? (
              <>
                <strong>Finished</strong>
                <span>Score {score} · Best saved score {Math.max(bestScore, score)}</span>
                <button className="primary" onClick={startGame}>Play again</button>
              </>
            ) : (
              <>
                <strong>Ready?</strong>
                <span>Two-beat count-in, then the notes start falling.</span>
                <button className="primary" onClick={startGame}>Start Beat Game</button>
              </>
            )}
          </div>
        )}
      </div>

      <div className={`beatGameFeedback ${feedback === "Perfect!" ? "perfect" : ""}`}>
        {feedback}
      </div>

      <div className="beatGameLegend">
        <span><b>Perfect</b> ±0.10 beat</span>
        <span><b>Good</b> ±0.23 beat</span>
        <span><b>Long notes</b> hold until the tail reaches the line</span>
      </div>
    </div>
  );
}
