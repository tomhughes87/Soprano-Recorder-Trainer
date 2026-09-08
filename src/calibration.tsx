import React from "react";
import {
  RecorderPattern,
  midiToNote,
  noteColourStyle,
  type MidiMap,
  type TrainingNote,
} from "./training";

type Props = {
  notes: TrainingNote[];
  midiMap: MidiMap;
  selectedId: string;
  lastMidi: number | null;
  lastNote: string;
  onSelect: (id: string) => void;
  onSave: (id: string, midi: number) => void;
  onResetAll: () => void;
};

export function CalibrationPanel({
  notes,
  midiMap,
  selectedId,
  lastMidi,
  lastNote,
  onSelect,
  onSave,
  onResetAll,
}: Props) {
  const selected = notes.find(note => note.id === selectedId) ?? notes[0];
  const selectedMidi = midiMap[selected.id] ?? selected.midi;

  return (
    <>
      <section className="panel calibrationHero">
        <div className="calibrationHeading">
          <div>
            <div className="eyebrow">Instrument setup</div>
            <h2>Calibrate your recorder</h2>
            <p className="sub">
              The music stores note names, not device MIDI numbers. Calibration tells the app
              what MIDI value your instrument sends for each note.
            </p>
          </div>

          <div className="savedLocally">Saved locally in this browser</div>
        </div>

        <div className="calibrationWorkspace">
          <div className="calibrationTarget">
            <span className="trainingLabel">Selected note</span>
            <strong className="noteColouredText" style={noteColourStyle(selected.id)}>{selected.label}</strong>

            <div className="fingeringStage calibrationStage noteColourSurface" style={noteColourStyle(selected.id)}>
              <RecorderPattern note={selected} large />
            </div>

            {selected.fingeringStatus === "reference" && (
              <div className="referenceWarning">
                This is a standard Baroque reference fingering, not yet confirmed on the Carry-on.
                Use whatever fingering produces this pitch on your instrument, then save its MIDI output.
              </div>
            )}

            {selected.hint && selected.fingeringStatus !== "reference" && (
              <div className="fingeringHint">{selected.hint}</div>
            )}
          </div>

          <div className="captureCard">
            <span className="captureLabel">Current saved mapping</span>
            <strong className="captureMidi">MIDI {selectedMidi}</strong>
            <span className="captureNote">{midiToNote(selectedMidi)}</span>

            <div className="captureDivider" />

            <span className="captureLabel">Last note received</span>
            <strong className="captureMidi">{lastMidi === null ? "—" : `MIDI ${lastMidi}`}</strong>
            <span className="captureNote">{lastMidi === null ? "Play the selected note" : lastNote}</span>

            <button
              className="primary"
              disabled={lastMidi === null}
              onClick={() => lastMidi !== null && onSave(selected.id, lastMidi)}
            >
              Save mapping
            </button>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="calibrationListHeader">
          <div>
            <h2>C4–D5 chromatic map</h2>
            <p className="sub small">
              Select a note, play it on your instrument, then save the MIDI result.
              Every trainer and song uses this map automatically.
            </p>
          </div>

          <button className="secondary" onClick={onResetAll}>
            Reset to Carry-on defaults
          </button>
        </div>

        <div className="calibrationGrid">
          {notes.map(note => {
            const mappedMidi = midiMap[note.id] ?? note.midi;
            const active = selected.id === note.id;

            return (
              <button
                key={note.id}
                className={`calibrationRow noteColourCard ${active ? "selected" : ""}`}
                style={noteColourStyle(note.id)}
                onClick={() => onSelect(note.id)}
              >
                <RecorderPattern note={note} compact />

                <div className="calibrationRowText">
                  <strong>{note.label}</strong>
                  <span>
                    MIDI {mappedMidi} · {midiToNote(mappedMidi)}
                  </span>
                </div>

                <span className={note.fingeringStatus === "reference" ? "referenceBadge" : "confirmedBadge"}>
                  {note.fingeringStatus === "reference" ? "reference" : "confirmed"}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}
