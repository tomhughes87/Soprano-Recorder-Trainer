# Music library layout

Each collection has an `index.ts` that exports its ordered song catalogue. Each song lives in a slug-named folder containing:

- `song.ts` — metadata, playable notes, rhythm events, and any alternate/long version.
- `reference.md` — score provenance and verification status.
- Optional source assets such as a permitted score image, MIDI file, or MusicXML file.

Shared event types and helpers remain in `songTypes.ts`.
