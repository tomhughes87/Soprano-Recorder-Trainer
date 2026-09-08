import React from "react";

export type MidiMessage = {
  time: string;
  type: string;
  channel: number;
  data1: number;
  data2: number;
  raw: string;
};

type Props = {
  lastNote: string;
  lastMidi: number | null;
  velocity: string;
  messages: MidiMessage[];
};

export function MidiTester({ lastNote, lastMidi, velocity, messages }: Props) {
  return (
    <>
      <section className="panel readout">
        <div className="note">{lastNote}</div>

        <div className="meta">
          <div><span>MIDI</span><strong>{lastMidi ?? "—"}</strong></div>
          <div><span>Velocity</span><strong>{velocity}</strong></div>
        </div>
      </section>

      <section className="panel">
        <h2>Live MIDI messages</h2>

        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Type</th>
                <th>Ch</th>
                <th>Data 1</th>
                <th>Data 2</th>
                <th>Raw</th>
              </tr>
            </thead>

            <tbody>
              {messages.length === 0 ? (
                <tr><td colSpan={6} className="empty">Play something…</td></tr>
              ) : (
                messages.map((m, idx) => (
                  <tr key={idx}>
                    <td>{m.time}</td>
                    <td>{m.type}</td>
                    <td>{m.channel}</td>
                    <td>{m.data1}</td>
                    <td>{m.data2}</td>
                    <td><code>{m.raw}</code></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
