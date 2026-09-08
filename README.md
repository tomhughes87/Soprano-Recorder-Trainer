# Soprano-Recorder-Trainer

An app to learn how to play the "carry-on" digital wind instrument as a soprano recorder, using its MIDI output.

## Features

- **MIDI tester** — view raw MIDI messages from the connected device.
- **Training** — practise fingerings against randomly (or sequentially) picked target notes.
- **Settings** — connect MIDI, choose a player name, and calibrate recorder fingerings.
- **Song libraries** — play along to English folk songs, Zelda (Ocarina of Time), and Lord of the Rings tunes.
- **Scoreboards** — keep each player's best Rhythm Game score for every song on the server.

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

This starts a Vite dev server (default: http://localhost:5173), including the local score API — open it in Chrome or Edge.

Build and run the production version locally:

```bash
npm start
```

This builds the app into `dist/` and starts the production Node server on every network interface (default: http://localhost:4173).

Other scripts:

```bash
npm run build     # build for production into dist/
npm run preview   # preview the production build locally
```

## Mini PC scoreboard server

Run `npm start` on the mini PC, then open `http://MINI-PC-IP:4173` from devices on the same network. You can change the port or score-file location:

```bash
PORT=8080 SCORE_DATA_FILE=/path/to/song-scores.json npm start
```

By default, scores are stored in `data/song-scores.json`. Back up that file to preserve the leaderboard. The server stores only each player's best score for each song, not every attempt.

Player names have no passwords or authentication. This setup is intended for a trusted private network; do not expose it directly to the public internet without adding authentication and HTTPS.

## Device setup

Before connecting, set the carry-on device to:

- **Voice:** Soprano Recorder — press `v`, set to `1`
- **Fingering:** Recorder — press `f`, set to `r`

Then open **Settings**, click **Connect MIDI**, and select your device. Default note mappings are preloaded; use the calibration map in Settings if the notes don't match.
