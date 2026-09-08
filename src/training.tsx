import React from "react";

export type HoleState = "open" | "closed" | "half";

export type TrainingNote = {
  id: string;
  label: string;
  midi: number;
  thumb: HoleState;
  holes: HoleState[];
  hint?: string;
  fingeringStatus?: "confirmed" | "reference";
};

const NOTE_NAMES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];

// Common classroom / Boomwhackers-style pitch colours.
// Accidentals inherit the colour of their letter name.
export const NOTE_COLOURS: Record<string, string> = {
  C: "#d85b5b",
  D: "#dc8a43",
  E: "#d8bc4f",
  F: "#6fa66c",
  G: "#5e91c5",
  A: "#8b6fb5",
  B: "#c97094",
};

export function noteColour(noteIdOrLabel: string) {
  const letter = noteIdOrLabel.trim().charAt(0).toUpperCase();
  return NOTE_COLOURS[letter] ?? "#c9c5bb";
}

export function noteColourStyle(noteIdOrLabel: string): React.CSSProperties {
  return { "--note-colour": noteColour(noteIdOrLabel) } as React.CSSProperties;
}


const O: HoleState = "open";
const X: HoleState = "closed";
const H: HoleState = "half";

export const DEFAULT_TRAINING_NOTES: TrainingNote[] = [
  { id: "C4",  label: "C4",      midi: 60, thumb: X, holes: [X,X,X,X,X,X,X], fingeringStatus: "confirmed" },
  { id: "Cs4", label: "C♯4/D♭4", midi: 61, thumb: X, holes: [X,X,X,X,X,X,H], hint: "Half-cover the bottom hole", fingeringStatus: "confirmed" },
  { id: "D4",  label: "D4",      midi: 62, thumb: X, holes: [X,X,X,X,X,X,O], fingeringStatus: "confirmed" },

  // Standard Baroque reference fingering. Not yet confirmed on this Carry-on.
  { id: "Ds4", label: "D♯4/E♭4", midi: 63, thumb: X, holes: [X,X,X,X,X,H,O], hint: "Reference fingering — calibrate this note on your instrument", fingeringStatus: "reference" },

  { id: "E4",  label: "E4",      midi: 64, thumb: X, holes: [X,X,X,X,X,O,O], fingeringStatus: "confirmed" },
  { id: "F4",  label: "F4",      midi: 65, thumb: X, holes: [X,X,X,X,O,O,O], hint: "Confirmed Carry-on R-mode fingering; differs from standard Baroque low F", fingeringStatus: "confirmed" },
  { id: "Fs4", label: "F♯4/G♭4", midi: 66, thumb: X, holes: [X,X,X,O,X,X,O], fingeringStatus: "confirmed" },
  { id: "G4",  label: "G4",      midi: 67, thumb: X, holes: [X,X,X,O,O,O,O], fingeringStatus: "confirmed" },

  // Standard Baroque reference fingering. Not yet confirmed on this Carry-on.
  { id: "Gs4", label: "G♯4/A♭4", midi: 68, thumb: X, holes: [X,X,O,X,X,O,O], hint: "Reference fingering — calibrate this note on your instrument", fingeringStatus: "reference" },

  { id: "A4",  label: "A4",      midi: 69, thumb: X, holes: [X,X,O,O,O,O,O], fingeringStatus: "confirmed" },
  { id: "Bb4", label: "B♭4/A♯4", midi: 70, thumb: X, holes: [X,O,X,X,O,O,O], fingeringStatus: "confirmed" },
  { id: "B4",  label: "B4",      midi: 71, thumb: X, holes: [X,O,O,O,O,O,O], fingeringStatus: "confirmed" },
  { id: "C5",  label: "C5",      midi: 72, thumb: X, holes: [O,X,O,O,O,O,O], fingeringStatus: "confirmed" },

  // Confirmed separately: thumb covered + no front holes gives MIDI 73.
  { id: "Cs5", label: "C♯5/D♭5", midi: 73, thumb: X, holes: [O,O,O,O,O,O,O], hint: "Also used for the 3-blow quick-reset gesture", fingeringStatus: "confirmed" },

  { id: "D5",  label: "D5",      midi: 74, thumb: O, holes: [O,X,O,O,O,O,O], fingeringStatus: "confirmed" },
];

export type MidiMap = Record<string, number>;

export const DEFAULT_MIDI_MAP: MidiMap = Object.fromEntries(
  DEFAULT_TRAINING_NOTES.map(note => [note.id, note.midi])
);

export function applyMidiMap(notes: TrainingNote[], midiMap: MidiMap): TrainingNote[] {
  return notes.map(note => ({
    ...note,
    midi: Number.isFinite(midiMap[note.id]) ? midiMap[note.id] : note.midi,
  }));
}

export function midiToNote(n: number) {
  const name = NOTE_NAMES[n % 12];
  const octave = Math.floor(n / 12) - 1;
  return `${name}${octave}`;
}

function Hole({ state, label }: { state: HoleState; label?: string }) {
  return (
    <span
      className={`recorderHole ${state}`}
      title={label}
      aria-label={`${label ?? "hole"}: ${state}`}
    />
  );
}

export function RecorderPattern({
  note,
  large = false,
  compact = false,
}: {
  note: TrainingNote;
  large?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={`recorderPattern ${large ? "large" : ""} ${compact ? "compact" : ""}`}>
      <div className="patternTopRow">
        <Hole state={note.thumb} label="Thumb hole" />
        <Hole state={note.holes[0]} label="Front hole 1" />
      </div>

      <div className="patternFrontColumn">
        {note.holes.slice(1).map((state, i) => (
          <Hole key={i + 1} state={state} label={`Front hole ${i + 2}`} />
        ))}
      </div>
    </div>
  );
}

type TrainingPanelProps = {
  trainingNotes: TrainingNote[];
  targetIndex: number;
  feedback: string;
  score: number;
  attempts: number;
  streak: number;
  shuffleMode: boolean;
  lastNote: string;
  lastMidi: number | null;
  onTargetIndex: (index: number) => void;
  onSkip: () => void;
  onReset: () => void;
  onShuffleMode: (value: boolean) => void;
  onMapLast: () => void;
};

export function TrainingPanel(props: TrainingPanelProps) {
  const {
    trainingNotes,
    targetIndex,
    feedback,
    score,
    attempts,
    streak,
    shuffleMode,
    lastNote,
    lastMidi,
    onTargetIndex,
    onSkip,
    onReset,
    onShuffleMode,
    onMapLast,
  } = props;

  const target = trainingNotes[targetIndex];
  const accuracy = attempts === 0 ? 0 : Math.round((score / attempts) * 100);

  return (
    <>
      <section className="panel trainingCard">
        <div className="trainingTop">
          <span className="trainingLabel">Play this fingering</span>
          <span className="targetNote noteColouredText" style={noteColourStyle(target.id)}>{target.label}</span>
        </div>

        <div className="fingeringStage noteColourSurface" style={noteColourStyle(target.id)}>
          <RecorderPattern note={target} large />
        </div>

        {target.hint && <div className="fingeringHint">{target.hint}</div>}

        <div className={`feedback ${feedback.startsWith("✓") ? "correct" : feedback.startsWith("✗") ? "wrong" : ""}`}>
          {feedback}
        </div>

        <div className="stats">
          <div><span>Correct</span><strong>{score}</strong></div>
          <div><span>Attempts</span><strong>{attempts}</strong></div>
          <div><span>Accuracy</span><strong>{accuracy}%</strong></div>
          <div><span>Streak</span><strong>{streak}</strong></div>
        </div>

        <div className="trainingActions">
          <button className="secondary" onClick={onSkip}>Skip</button>
          <button className="secondary" onClick={onReset}>Reset score</button>
          <label className="shuffleToggle">
            <input
              type="checkbox"
              checked={shuffleMode}
              onChange={e => onShuffleMode(e.target.checked)}
            />
            Random order
          </label>
        </div>
      </section>

      <section className="panel">
        <h2>Recorder fingerings</h2>
        <p className="sub small">
          Thumb is the left dot on the top row. The right dot and vertical column are front holes 1–7.
          Notes marked “reference” have not yet been physically confirmed on this Carry-on.
        </p>

        <div className="fingerGrid">
          {trainingNotes.map((note, index) => (
            <button
              key={note.id}
              className={`fingerRow noteColourCard ${index === targetIndex ? "selected" : ""}`}
              style={noteColourStyle(note.id)}
              onClick={() => onTargetIndex(index)}
            >
              <RecorderPattern note={note} compact />
              <div>
                <strong>{note.label}</strong>
                {note.fingeringStatus === "reference" && <span className="referenceBadge">reference</span>}
              </div>
              <span className="midiTag">MIDI {note.midi}</span>
            </button>
          ))}
        </div>

        <div className="calibration">
          <div>
            Last played: <strong>{lastNote}</strong>
            {lastMidi !== null ? ` · MIDI ${lastMidi}` : ""}
          </div>

          <button className="secondary" disabled={lastMidi === null} onClick={onMapLast}>
            Save last played for selected note
          </button>
        </div>
      </section>
    </>
  );
}
