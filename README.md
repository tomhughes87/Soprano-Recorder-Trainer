# Soprano-Recorder-Trainer

An app to learn how to play the "carry-on" digital wind instrument as a soprano recorder, using its MIDI output.

## Features

- **MIDI tester** — view raw MIDI messages from the connected device.
- **Training** — practise fingerings against randomly (or sequentially) picked target notes.
- **Calibration** — remap MIDI note numbers to recorder fingerings if your device's defaults differ.
- **Song libraries** — play along to English folk songs, Zelda (Ocarina of Time), and Lord of the Rings tunes.

## Requirements

- [Node.js](https://nodejs.org/) 18+
- A browser with [Web MIDI](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API) support (Chrome or Edge)
- A carry-on digital wind instrument connected via USB/MIDI

## Getting started

Install Dependencies:

```bash
npm install
```

Run the app in development mode:

```bash
npm run dev
```

This starts a Vite dev server (default: http://localhost:5173) — open it in Chrome or Edge.

Other scripts:

```bash
npm run build     # build for production into dist/
npm run preview   # preview the production build locally
```

## Device setup

Before connecting, set the carry-on device to:

- **Voice:** Soprano Recorder — press `v`, set to `1`
- **Fingering:** Recorder — press `f`, set to `r`

Then click **Connect MIDI** in the app and select your device as the MIDI input. Default note mappings are preloaded; use the Calibration tab if your device's notes don't match.
