const SEMITONES: Record<string, number> = {
  C: 0,
  Cs: 1,
  Db: 1,
  D: 2,
  Ds: 3,
  Eb: 3,
  E: 4,
  F: 5,
  Fs: 6,
  Gb: 6,
  G: 7,
  Gs: 8,
  Ab: 8,
  A: 9,
  As: 10,
  Bb: 10,
  B: 11,
};

export function noteIdToMidi(noteId: string) {
  const match = /^([A-G](?:s|b)?)(-?\d+)$/.exec(noteId);

  if (!match) {
    throw new Error(`Unsupported note id: ${noteId}`);
  }

  const [, pitchClass, octaveText] = match;
  const semitone = SEMITONES[pitchClass];

  if (semitone === undefined) {
    throw new Error(`Unsupported pitch class: ${pitchClass}`);
  }

  const octave = Number(octaveText);
  return (octave + 1) * 12 + semitone;
}

export function midiToFrequency(midi: number) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function noteIdToFrequency(noteId: string) {
  return midiToFrequency(noteIdToMidi(noteId));
}
