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

test

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
It also starts a temporary Cloudflare Tunnel and prints a secure `https://...trycloudflare.com` address. Keep the command running while using that address. A new address is generated each time, and anyone with it can access the app and scoreboard.

This requires `cloudflared` to be installed. To build and run without creating a public tunnel, use:

```bash
npm run start:server
```

Other scripts:

```bash
npm run build     # build for production into dist/
npm run preview   # preview the production build locally
npm run start:server # build and run without a public tunnel
```

## Mini PC scoreboard server

For initial testing, run `npm start` on the mini PC and use the temporary HTTPS address it prints. You can change the port or score-file location:

```bash
PORT=8080 SCORE_DATA_FILE=/path/to/song-scores.json npm start
```

By default, scores are stored in `data/song-scores.json`. Back up that file to preserve the leaderboard. The server stores only each player's best score for each song, not every attempt.

Player names have no passwords or authentication. This setup is intended for a trusted private network; do not expose it directly to the public internet without adding authentication and HTTPS.

The temporary tunnel is useful for testing, but it has no uptime guarantee and its address changes after a restart. A continuously running mini PC should eventually use a named tunnel with a fixed hostname and services that start automatically after reboot.

## Device setup

Before connecting, set the carry-on device to:

- **Voice:** Soprano Recorder — press `v`, set to `1`
- **Fingering:** Recorder — press `f`, set to `r`

Then open **Settings**, click **Connect MIDI**, and select your device. Default note mappings are preloaded; use the calibration map in Settings if the notes don't match.
