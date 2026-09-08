import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import { CalibrationPanel } from "./calibration";
import { SongDemoControls } from "./audio/SongDemoControls";
import type { GuideLevel } from "./audio/recorderSynth";
import {
  RhythmGame,
  type RhythmGameResult,
  type RhythmMidiSignal,
} from "./rhythmGame";
import { MidiTester, type MidiMessage } from "./tester";
import {
  DEFAULT_MIDI_MAP,
  DEFAULT_TRAINING_NOTES,
  RecorderPattern,
  TrainingPanel,
  applyMidiMap,
  noteColourStyle,
  midiToNote,
  type MidiMap,
} from "./training";
import { ENGLISH_FOLK_SONGS } from "./music/english-folk";
import { LEVEL_0_SONGS } from "./music/level-0";
import { LEVEL_1_SONGS } from "./music/level-1";
import { SEA_SHANTIES } from "./music/sea-shanties";
import { ZELDA_SONGS } from "./music/zelda";
import { LOTR_SONGS } from "./music/lord-of-the-rings";
import {
  articulationLabel,
  eventLengthLabel,
  notesToEvents,
  type Song,
  type SongEvent,
} from "./music/songTypes";
import {
  clearSongRating,
  loadSongRatings,
  saveSongResult,
  SONG_RATINGS_STORAGE_KEY,
  type SongRatings,
} from "./songRatings";
import {
  deleteScore,
  fetchLeaderboards,
  loadPlayerName,
  samePlayer,
  savePlayerName,
  submitScore,
  type Leaderboards,
} from "./leaderboard";

type Tab =
  | "tester"
  | "training"
  | "calibration"
  | "level0"
  | "level1"
  | "songs"
  | "shanties"
  | "zelda"
  | "lotr";
type SongSection =
  | "level0"
  | "level1"
  | "songs"
  | "shanties"
  | "zelda"
  | "lotr";

const STORAGE_KEY = "carryon-recorder-midi-map-v1";
const MIDI_INPUT_STORAGE_KEY = "carryon-midi-input-v1";
const RESET_NOTE_ID = "Cs5";
const DEFAULT_RESET_BLOWS = 3;
const SAFE_RESET_BLOWS = 5;

type SavedMidiInput = {
  id: string;
  name: string;
  manufacturer: string;
};

function loadSavedMidiInput(): SavedMidiInput | null {
  try {
    const raw = localStorage.getItem(MIDI_INPUT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<SavedMidiInput>;
    return typeof parsed.id === "string"
      ? {
          id: parsed.id,
          name: parsed.name ?? "",
          manufacturer: parsed.manufacturer ?? "",
        }
      : null;
  } catch {
    return null;
  }
}

function saveMidiInput(input: MIDIInput) {
  try {
    localStorage.setItem(
      MIDI_INPUT_STORAGE_KEY,
      JSON.stringify({
        id: input.id,
        name: input.name ?? "",
        manufacturer: input.manufacturer ?? "",
      } satisfies SavedMidiInput),
    );
  } catch {
    // Manual connection remains available if storage is unavailable.
  }
}

function loadMidiMap(): MidiMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_MIDI_MAP };

    const parsed = JSON.parse(raw) as unknown;
    const mappings: MidiMap =
      typeof parsed === "object" &&
      parsed !== null &&
      "mappings" in parsed &&
      typeof (parsed as { mappings?: unknown }).mappings === "object" &&
      (parsed as { mappings?: unknown }).mappings !== null
        ? (parsed as { mappings: MidiMap }).mappings
        : (parsed as MidiMap);

    return { ...DEFAULT_MIDI_MAP, ...mappings };
  } catch {
    return { ...DEFAULT_MIDI_MAP };
  }
}

function saveMidiMap(mappings: MidiMap) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: 1,
      mappings,
    }),
  );
}

function Stars({ count }: { count: number }) {
  return (
    <span className="stars" aria-label={`${count} out of 5 difficulty`}>
      {"★".repeat(count)}
      <span className="emptyStars">{"★".repeat(5 - count)}</span>
    </span>
  );
}

function SongLibrary({
  songs,
  title,
  subtitle,
  onStart,
  section,
  ratings,
  onClearRating,
  leaderboards,
  playerName,
}: {
  songs: Song[];
  title: string;
  subtitle: string;
  onStart: (song: Song) => void;
  section: SongSection;
  ratings: SongRatings;
  onClearRating: (songId: string) => void;
  leaderboards: Leaderboards;
  playerName: string;
}) {
  return (
    <section
      className={`panel songLibrary ${
        section === "songs"
          ? "folkPanel"
          : section === "level0"
            ? "levelZeroPanel"
            : section === "level1"
              ? "levelOnePanel"
              : section === "shanties"
                ? "shantyPanel"
                : section === "zelda"
                  ? "zeldaPanel"
                  : "lotrPanel"
      }`}
    >
      <div className="songHeader">
        <div>
          <h2>{title}</h2>
          <p className="sub">{subtitle}</p>
        </div>
      </div>

      <div className="songGrid">
        {songs.map((song) => {
          const rating = ratings[song.id];
          const leaders = leaderboards[song.id] ?? [];
          const leader = leaders[0];
          const playerIsLeader = Boolean(
            playerName && leader && samePlayer(playerName, leader.playerName),
          );
          const playerHasServerScore = leaders.some((entry) =>
            samePlayer(playerName, entry.playerName),
          );

          return (
            <div
              className={`songCardShell ${playerIsLeader ? "topScorer" : ""}`}
              key={song.id}
            >
              <button
                className={`songCard ${song.playable ? "" : "comingSoon"}`}
                onClick={() => onStart(song)}
                disabled={!song.playable}
              >
                <div className="songCardTop">
                  <strong>{song.title}</strong>
                  <div className="songCardResult">
                    <Stars count={song.difficulty} />
                    {rating ? (
                      <span
                        className="songGrade"
                        title={`${rating.attempts} completed attempt${rating.attempts === 1 ? "" : "s"}`}
                      >
                        Best {rating.bestGrade} · {rating.bestPercentage}%
                      </span>
                    ) : (
                      <span className="songGrade unrated">Not rated</span>
                    )}
                  </div>
                </div>

                <p>{song.description}</p>

                {playerIsLeader && (
                  <div className="topScorerMessage">
                    🏆 You are the top scorer on this song!
                  </div>
                )}

                <div className="songScoreboard">
                  <strong>Top scores</strong>
                  {leaders.length ? (
                    <ol>
                      {leaders.slice(0, 3).map((entry, index) => (
                        <li key={entry.playerName.toLocaleLowerCase()}>
                          <span>
                            {index === 0 ? "🏆 " : ""}
                            {entry.playerName}
                          </span>
                          <b>{entry.percentage}%</b>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <span className="noScores">No scores yet</span>
                  )}
                </div>

                <span className="songStatus">
                  {song.playable ? "Practise →" : "Add melody tab"}
                </span>
              </button>

              {(rating || playerHasServerScore) && (
                <button
                  type="button"
                  className="clearSongRating"
                  aria-label={`Clear saved rating for ${song.title}`}
                  title="Clear saved rating"
                  onClick={() => onClearRating(song.id)}
                >
                  <span aria-hidden="true">🗑</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function App() {
  const [tab, setTab] = useState<Tab>("tester");
  const [status, setStatus] = useState("Not connected");
  const [inputs, setInputs] = useState<MIDIInput[]>([]);
  const [selectedId, setSelectedId] = useState(
    () => loadSavedMidiInput()?.id ?? "",
  );
  const [lastNote, setLastNote] = useState("—");
  const [lastMidi, setLastMidi] = useState<number | null>(null);
  const [velocity, setVelocity] = useState("—");
  const [messages, setMessages] = useState<MidiMessage[]>([]);

  const [midiMap, setMidiMap] = useState<MidiMap>(() => loadMidiMap());
  const [calibrationNoteId, setCalibrationNoteId] = useState("C4");

  const trainingNotes = useMemo(
    () => applyMidiMap(DEFAULT_TRAINING_NOTES, midiMap),
    [midiMap],
  );

  const [targetIndex, setTargetIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState("Play the fingering shown");
  const [shuffleMode, setShuffleMode] = useState(true);

  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [selectedSongSection, setSelectedSongSection] =
    useState<SongSection>("songs");
  const [songStep, setSongStep] = useState(0);
  const [songMistakes, setSongMistakes] = useState(0);
  const [songFeedback, setSongFeedback] = useState("Play the first note");
  const [zeldaVersion, setZeldaVersion] = useState<"short" | "long">("short");
  const [safeResetMode, setSafeResetMode] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [metronomeEnabled, setMetronomeEnabled] = useState(false);
  const [bpm, setBpm] = useState(90);
  const [guideLevel, setGuideLevel] = useState<GuideLevel>("soft");
  const [songMode, setSongMode] = useState<"practice" | "rhythm">("practice");
  const [rhythmMidiSignal, setRhythmMidiSignal] =
    useState<RhythmMidiSignal | null>(null);
  const [rhythmGameResetKey, setRhythmGameResetKey] = useState(0);
  const [songRatings, setSongRatings] = useState<SongRatings>(() =>
    loadSongRatings(),
  );
  const [playerName, setPlayerName] = useState(() => loadPlayerName());
  const [playerNameDraft, setPlayerNameDraft] = useState(() =>
    loadPlayerName(),
  );
  const [leaderboards, setLeaderboards] = useState<Leaderboards>({});
  const [leaderboardStatus, setLeaderboardStatus] = useState(
    "Loading server scores…",
  );

  const resetBlowCountRef = useRef(0);
  const metronomeTimerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const autoConnectAttemptedRef = useRef(false);

  const selectedInput = useMemo(
    () => inputs.find((input) => input.id === selectedId) ?? null,
    [inputs, selectedId],
  );

  const target = trainingNotes[targetIndex];

  const songCollection: Song[] =
    selectedSongSection === "zelda"
      ? ZELDA_SONGS
      : selectedSongSection === "lotr"
        ? (LOTR_SONGS as Song[])
        : selectedSongSection === "shanties"
          ? SEA_SHANTIES
          : selectedSongSection === "level1"
            ? LEVEL_1_SONGS
            : selectedSongSection === "level0"
              ? LEVEL_0_SONGS
              : (ENGLISH_FOLK_SONGS as Song[]);

  const selectedSong =
    songCollection.find((song) => song.id === selectedSongId) ?? null;

  const saveRhythmGameRating = useCallback(
    (result: RhythmGameResult) => {
      if (!selectedSong) return;
      setSongRatings(saveSongResult(selectedSong.id, result.percentage));

      if (!playerName) {
        setLeaderboardStatus("Set a player name in Settings to submit scores.");
        return;
      }

      void submitScore({
        songId: selectedSong.id,
        playerName,
        percentage: result.percentage,
        score: result.score,
        maximumScore: result.maximumScore,
      })
        .then((next) => {
          setLeaderboards(next);
          setLeaderboardStatus("Scoreboard updated");
        })
        .catch(() => {
          setLeaderboardStatus("Could not reach the score server");
        });
    },
    [playerName, selectedSong],
  );

  const clearSavedSongRating = (songId: string) => {
    setSongRatings(clearSongRating(songId));
    if (!playerName) return;

    void deleteScore(songId, playerName)
      .then((next) => {
        setLeaderboards(next);
        setLeaderboardStatus("Saved score removed");
      })
      .catch(() => {
        setLeaderboardStatus("Local rating cleared; server was unavailable");
      });
  };

  const savePlayerProfile = () => {
    const next = savePlayerName(playerNameDraft);
    setPlayerName(next);
    setPlayerNameDraft(next);
    setLeaderboardStatus(
      next ? `Playing as ${next}` : "Enter a name to submit scores",
    );
  };

  const refreshLeaderboards = useCallback(() => {
    void fetchLeaderboards()
      .then((next) => {
        setLeaderboards(next);
        setLeaderboardStatus("Server scoreboard connected");
      })
      .catch(() => {
        setLeaderboardStatus("Score server unavailable");
      });
  }, []);

  const activeSongEvents: SongEvent[] = selectedSong
    ? selectedSongSection === "zelda"
      ? zeldaVersion === "long"
        ? selectedSong.longEvents?.length
          ? selectedSong.longEvents
          : notesToEvents(selectedSong.longNotes ?? [])
        : (() => {
            const shortEvents = selectedSong.events?.length
              ? selectedSong.events
              : notesToEvents(selectedSong.notes ?? []);
            return [...shortEvents, ...shortEvents];
          })()
      : selectedSong.events?.length
        ? selectedSong.events
        : notesToEvents(selectedSong.notes ?? [])
    : [];

  const currentSongEvent = activeSongEvents[songStep] ?? null;
  const currentSongNote =
    trainingNotes.find((note) => note.id === currentSongEvent?.note) ?? null;
  const resetBlowsRequired = safeResetMode
    ? SAFE_RESET_BLOWS
    : DEFAULT_RESET_BLOWS;

  const pageTheme =
    tab === "level0"
      ? "themeLevel0"
      : tab === "level1"
        ? "themeLevel1"
        : tab === "songs"
          ? "themeFolk"
          : tab === "shanties"
            ? "themeShanty"
            : tab === "zelda"
              ? "themeZelda"
              : tab === "lotr"
                ? "themeLotr"
                : "themeCharcoal";

  const updateMapping = (noteId: string, midi: number) => {
    setMidiMap((previous) => {
      const next = { ...previous, [noteId]: midi };
      saveMidiMap(next);
      return next;
    });
  };

  const resetMappings = () => {
    const defaults = { ...DEFAULT_MIDI_MAP };
    setMidiMap(defaults);
    saveMidiMap(defaults);
  };

  const refreshInputs = (access: MIDIAccess) => {
    const list = Array.from(access.inputs.values());
    const remembered = loadSavedMidiInput();
    setInputs(list);

    setSelectedId((current) => {
      if (current && list.some((input) => input.id === current)) return current;

      const rememberedInput = remembered
        ? (list.find((input) => input.id === remembered.id) ??
          list.find(
            (input) =>
              (input.name ?? "") === remembered.name &&
              (input.manufacturer ?? "") === remembered.manufacturer,
          ))
        : undefined;

      const carryOn = list.find((input) => {
        const text =
          `${input.name ?? ""} ${input.manufacturer ?? ""}`.toLowerCase();
        return text.includes("wind") || text.includes("carry");
      });

      const next = rememberedInput ?? carryOn ?? list[0];
      if (next && (!remembered || rememberedInput)) saveMidiInput(next);
      return next?.id ?? "";
    });

    return list;
  };

  const connect = async () => {
    if (!("requestMIDIAccess" in navigator)) {
      setStatus(
        "Web MIDI is not supported in this browser. Use Chrome or Edge.",
      );
      return;
    }

    try {
      const access = await navigator.requestMIDIAccess({ sysex: false });
      const list = refreshInputs(access);
      access.onstatechange = () => {
        const refreshed = refreshInputs(access);
        setStatus(
          refreshed.length > 0
            ? "MIDI device connected"
            : "MIDI access granted — connect your saved device",
        );
      };
      setStatus(
        list.length > 0
          ? "MIDI access granted"
          : "MIDI access granted — connect your saved device",
      );
    } catch (error) {
      console.error(error);
      setStatus("MIDI permission was denied or unavailable.");
    }
  };

  useEffect(() => {
    if (!loadSavedMidiInput() || autoConnectAttemptedRef.current) return;
    autoConnectAttemptedRef.current = true;
    void connect();
  }, []);

  const selectMidiInput = (id: string) => {
    setSelectedId(id);
    const input = inputs.find((candidate) => candidate.id === id);
    if (input) saveMidiInput(input);
  };

  const pickNext = (current: number) => {
    if (trainingNotes.length <= 1) return current;
    if (!shuffleMode) return (current + 1) % trainingNotes.length;

    let next = current;
    while (next === current) {
      next = Math.floor(Math.random() * trainingNotes.length);
    }

    return next;
  };

  const resetTraining = () => {
    setScore(0);
    setAttempts(0);
    setStreak(0);
    setFeedback("Play the fingering shown");
    setTargetIndex(0);
  };

  useEffect(() => {
    const refreshRatings = (event: StorageEvent) => {
      if (event.key === SONG_RATINGS_STORAGE_KEY) {
        setSongRatings(loadSongRatings());
      }
    };

    window.addEventListener("storage", refreshRatings);
    return () => window.removeEventListener("storage", refreshRatings);
  }, []);

  useEffect(() => {
    refreshLeaderboards();
    const timer = window.setInterval(refreshLeaderboards, 30_000);
    window.addEventListener("focus", refreshLeaderboards);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshLeaderboards);
    };
  }, [refreshLeaderboards]);

  const useLastPlayedForTarget = () => {
    if (lastMidi === null) return;
    updateMapping(target.id, lastMidi);
    setFeedback(
      `Saved ${target.label} → ${midiToNote(lastMidi)} (MIDI ${lastMidi})`,
    );
  };

  const startSong = (song: Song, section: SongSection) => {
    if (!song.playable) return;

    setSelectedSongSection(section);
    setSelectedSongId(song.id);
    setSongStep(0);
    setSongMistakes(0);
    setSongFeedback("Play the first note");
    resetBlowCountRef.current = 0;
    setSafeResetMode(false);
    setFocusMode(false);
    setMetronomeEnabled(false);
    setSongMode("practice");
    setRhythmGameResetKey((value) => value + 1);

    if (section === "zelda") {
      setZeldaVersion("short");
    }
  };

  const leaveSong = () => {
    setSelectedSongId(null);
    setSongStep(0);
    setSongMistakes(0);
    resetBlowCountRef.current = 0;
    setFocusMode(false);
    setMetronomeEnabled(false);
    setSongMode("practice");
    setRhythmGameResetKey((value) => value + 1);
  };

  const resetCurrentSong = () => {
    setSongStep(0);
    setSongMistakes(0);
    setSongFeedback("↺ Song reset — play the first note");
    resetBlowCountRef.current = 0;
  };

  const playMetronomeClick = () => {
    const AudioContextCtor =
      window.AudioContext ?? (window as any).webkitAudioContext;
    if (!AudioContextCtor) return;

    const context = audioContextRef.current ?? new AudioContextCtor();

    audioContextRef.current = context;

    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.11, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.045);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.05);
  };

  useEffect(() => {
    if (metronomeTimerRef.current !== null) {
      window.clearInterval(metronomeTimerRef.current);
      metronomeTimerRef.current = null;
    }

    if (!metronomeEnabled || !selectedSong) return;

    playMetronomeClick();
    metronomeTimerRef.current = window.setInterval(
      playMetronomeClick,
      Math.round(60000 / bpm),
    );

    return () => {
      if (metronomeTimerRef.current !== null) {
        window.clearInterval(metronomeTimerRef.current);
        metronomeTimerRef.current = null;
      }
    };
  }, [metronomeEnabled, bpm, selectedSong]);

  useEffect(() => {
    if (!selectedInput) return;

    const handleMidi = (event: MIDIMessageEvent) => {
      const data = Array.from(event.data ?? []);
      const statusByte = data[0] ?? 0;
      const data1 = data[1] ?? 0;
      const data2 = data[2] ?? 0;
      const command = statusByte & 0xf0;
      const channel = (statusByte & 0x0f) + 1;

      let type = `0x${command.toString(16).toUpperCase()}`;

      if (command === 0x90 && data2 > 0) {
        type = "Note On";

        const noteName = midiToNote(data1);
        setLastNote(noteName);
        setLastMidi(data1);
        setVelocity(String(data2));
        setRhythmMidiSignal({
          nonce: performance.now(),
          kind: "on",
          midi: data1,
          at: performance.now(),
        });

        if (tab === "training") {
          setAttempts((value) => value + 1);

          if (data1 === target.midi) {
            setScore((value) => value + 1);
            setStreak((value) => value + 1);
            setFeedback(`✓ Correct — ${target.label}`);

            window.setTimeout(() => {
              setTargetIndex((current) => pickNext(current));
              setFeedback("Play the fingering shown");
            }, 400);
          } else {
            setStreak(0);
            setFeedback(`✗ Input ${noteName}. Try again.`);
          }
        }

        const inSongSection =
          tab === "level0" ||
          tab === "level1" ||
          tab === "songs" ||
          tab === "shanties" ||
          tab === "zelda" ||
          tab === "lotr";

        if (
          inSongSection &&
          selectedSong &&
          currentSongNote &&
          activeSongEvents.length
        ) {
          const resetMidi =
            midiMap[RESET_NOTE_ID] ?? DEFAULT_MIDI_MAP[RESET_NOTE_ID];

          if (data1 === resetMidi) {
            resetBlowCountRef.current += 1;

            if (resetBlowCountRef.current >= resetBlowsRequired) {
              if (songMode === "rhythm") {
                setRhythmGameResetKey((value) => value + 1);
                setSongFeedback("↺ Rhythm game reset");
              } else {
                resetCurrentSong();
              }

              resetBlowCountRef.current = 0;
              return;
            }

            // If C♯5 is actually the current song note, let it count normally.
            // Otherwise treat it only as part of the reset gesture.
            if (songMode === "practice" && currentSongNote.midi !== resetMidi) {
              setSongFeedback(
                `Reset gesture ${resetBlowCountRef.current}/${resetBlowsRequired}`,
              );
              return;
            }
          } else {
            resetBlowCountRef.current = 0;
          }

          if (songMode === "practice") {
            if (data1 === currentSongNote.midi) {
              const isLast = songStep >= activeSongEvents.length - 1;

              if (isLast) {
                setSongFeedback("✓ Tune complete!");
              } else {
                setSongFeedback(`✓ ${currentSongNote.label}`);

                window.setTimeout(() => {
                  setSongStep((step) => step + 1);
                  setSongFeedback("Next note");
                }, 300);
              }
            } else {
              setSongMistakes((value) => value + 1);
              setSongFeedback(`✗ Try ${currentSongNote.label} again`);
            }
          }
        }
      } else if (command === 0x80 || (command === 0x90 && data2 === 0)) {
        type = "Note Off";
        setRhythmMidiSignal({
          nonce: performance.now(),
          kind: "off",
          midi: data1,
          at: performance.now(),
        });
      } else if (command === 0xb0) {
        type = "Control Change";
      } else if (command === 0xe0) {
        type = "Pitch Bend";
      }

      const message: MidiMessage = {
        time: new Date().toLocaleTimeString(),
        type,
        channel,
        data1,
        data2,
        raw: data
          .map((value) => value.toString(16).padStart(2, "0").toUpperCase())
          .join(" "),
      };

      setMessages((previous) => [message, ...previous].slice(0, 30));
    };

    selectedInput.onmidimessage = handleMidi;
    setStatus(`Listening to ${selectedInput.name ?? "MIDI input"}`);

    return () => {
      selectedInput.onmidimessage = null;
    };
  }, [
    selectedInput,
    tab,
    target.midi,
    target.label,
    trainingNotes,
    shuffleMode,
    selectedSong,
    currentSongNote,
    songStep,
    activeSongEvents,
    midiMap,
    resetBlowsRequired,
    songMode,
  ]);

  const songTotal = activeSongEvents.length;
  const songProgress =
    songTotal === 0 ? 0 : Math.round(((songStep + 1) / songTotal) * 100);

  const renderSongPlayer = () => {
    if (
      !selectedSong ||
      !currentSongNote ||
      !currentSongEvent ||
      !activeSongEvents.length
    )
      return null;

    return (
      <section
        className={`panel songPlayer ${focusMode ? "focusMode" : ""} ${
          selectedSongSection === "songs"
            ? "folkPanel"
            : selectedSongSection === "level0"
              ? "levelZeroPanel"
              : selectedSongSection === "level1"
                ? "levelOnePanel"
                : selectedSongSection === "shanties"
                  ? "shantyPanel"
                  : selectedSongSection === "zelda"
                    ? "zeldaPanel"
                    : "lotrPanel"
        }`}
      >
        {songMode === "rhythm" ? (
          <div className="rhythmOnlyHeader">
            <button
              className="secondary"
              onClick={() => {
                setSongMode("practice");
                setRhythmGameResetKey((value) => value + 1);
              }}
            >
              ← Practice
            </button>

            <div className="rhythmOnlyTitle">
              <strong>{selectedSong.title}</strong>
              <span>Rhythm Game</span>
            </div>

            <button className="secondary" onClick={leaveSong}>
              Songs
            </button>
          </div>
        ) : (
          <>
            <div className="songPlayerHeader">
              <button className="secondary" onClick={leaveSong}>
                ← Songs
              </button>

              <div>
                <h2>{selectedSong.title}</h2>
                <Stars count={selectedSong.difficulty} />
              </div>

              <div className="songCounter">
                {songStep + 1} / {activeSongEvents.length}
              </div>
            </div>

            <div className="songResetHint">
              <div className="songResetCopy">
                <strong>Quick reset:</strong>
                <span>
                  play your calibrated C♯5 {resetBlowsRequired} times in a row.
                </span>
              </div>

              <label className="resetSafetyToggle">
                <input
                  type="checkbox"
                  checked={safeResetMode}
                  onChange={(event) => {
                    setSafeResetMode(event.target.checked);
                    resetBlowCountRef.current = 0;
                    setSongFeedback("Play the next note");
                  }}
                />
                <span>5-blow safe reset</span>
              </label>

              <div className="resetSafetyHelp">
                Turn this on for songs that contain repeated C♯5 notes, so
                normal playing is less likely to reset the tune.
              </div>
            </div>

            <div className="songModeSwitch">
              <button
                className="secondary"
                disabled={selectedSong.rhythmVerified !== true}
                onClick={() => {
                  setSongMode("rhythm");
                  setMetronomeEnabled(false);
                  setFocusMode(false);
                  setRhythmGameResetKey((value) => value + 1);
                }}
              >
                Rhythm Game
              </button>

              {selectedSong.rhythmVerified !== true && (
                <span className="sub small">
                  Rhythm Game needs verified rhythm
                </span>
              )}
            </div>
          </>
        )}

        {songMode === "practice" ? (
          <>
            {selectedSongSection === "zelda" && (
              <div className="zeldaVersionSwitch">
                <button
                  className={
                    zeldaVersion === "short"
                      ? "secondary selectedMode"
                      : "secondary"
                  }
                  onClick={() => {
                    setZeldaVersion("short");
                    resetCurrentSong();
                  }}
                >
                  Short · Link input ×2
                </button>

                <button
                  className={
                    zeldaVersion === "long"
                      ? "secondary selectedMode"
                      : "secondary"
                  }
                  disabled={!selectedSong.longNotes?.length}
                  onClick={() => {
                    setZeldaVersion("long");
                    resetCurrentSong();
                  }}
                >
                  Long · game continues
                </button>

                {!selectedSong.longNotes?.length && (
                  <span className="sub small">
                    Long version not verified yet
                  </span>
                )}
              </div>
            )}

            <div className="playModePanel">
              <div className="playModeTitle">
                <strong>Play mode</strong>
                <span className="sub small">
                  Rhythm is guidance only — pitch recognition still waits for
                  the correct note.
                </span>
              </div>

              <div className="playModeControls">
                <label className="playToggle">
                  <input
                    type="checkbox"
                    checked={focusMode}
                    onChange={(event) => setFocusMode(event.target.checked)}
                  />
                  <span>Focus</span>
                </label>

                <label className="playToggle">
                  <input
                    type="checkbox"
                    checked={metronomeEnabled}
                    onChange={(event) =>
                      setMetronomeEnabled(event.target.checked)
                    }
                  />
                  <span>Metronome</span>
                </label>

                <div className="speedPresets" aria-label="Song speed">
                  <button
                    className={
                      bpm === 60 ? "secondary selectedMode" : "secondary"
                    }
                    onClick={() => setBpm(60)}
                  >
                    Slow
                  </button>
                  <button
                    className={
                      bpm === 90 ? "secondary selectedMode" : "secondary"
                    }
                    onClick={() => setBpm(90)}
                  >
                    Normal
                  </button>
                  <button
                    className={
                      bpm === 120 ? "secondary selectedMode" : "secondary"
                    }
                    onClick={() => setBpm(120)}
                  >
                    Fast
                  </button>
                </div>

                <div className="bpmControl">
                  <button
                    className="secondary bpmButton"
                    onClick={() => setBpm((value) => Math.max(40, value - 5))}
                  >
                    −
                  </button>
                  <strong>{bpm} BPM</strong>
                  <button
                    className="secondary bpmButton"
                    onClick={() => setBpm((value) => Math.min(200, value + 5))}
                  >
                    +
                  </button>
                </div>
              </div>

              <SongDemoControls
                events={activeSongEvents}
                bpm={bpm}
                guideLevel={guideLevel}
                metronome={metronomeEnabled}
                onGuideLevelChange={setGuideLevel}
              />

              {selectedSong.rhythmVerified === false && (
                <div className="rhythmUnverified">
                  Timing for this arrangement has not been verified yet, so its
                  notes currently display as equal 1-beat notes.
                </div>
              )}
            </div>

            <div className="progressTrack">
              <div
                className="progressFill"
                style={{ width: `${songProgress}%` }}
              />
            </div>

            {focusMode ? (
              <div className="practiceFocus">
                <button
                  className="focusBackButton"
                  onClick={() => setFocusMode(false)}
                >
                  ← Back
                </button>

                <div className="practiceFocusCenter">
                  <div
                    className="practiceFocusNote noteColouredText"
                    style={noteColourStyle(currentSongNote.id)}
                  >
                    {currentSongNote.label}
                  </div>

                  <div
                    className="practiceFocusFingering noteColourSurface"
                    style={noteColourStyle(currentSongNote.id)}
                  >
                    <RecorderPattern note={currentSongNote} large />
                  </div>

                  <div className="practiceFocusRhythm">
                    <strong>{eventLengthLabel(currentSongEvent)}</strong>
                    {articulationLabel(currentSongEvent) && (
                      <span>{articulationLabel(currentSongEvent)}</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="songNow">
                <div className="trainingTop songTarget">
                  <span className="trainingLabel">Next note</span>
                  <span
                    className="targetNote noteColouredText"
                    style={noteColourStyle(currentSongNote.id)}
                  >
                    {currentSongNote.label}
                  </span>
                </div>

                <div
                  className="fingeringStage noteColourSurface"
                  style={noteColourStyle(currentSongNote.id)}
                >
                  <RecorderPattern note={currentSongNote} large />
                </div>

                {currentSongNote.hint && (
                  <div className="fingeringHint">{currentSongNote.hint}</div>
                )}

                <div className="currentRhythm">
                  <span className="rhythmLength">
                    {eventLengthLabel(currentSongEvent)}
                  </span>
                  {articulationLabel(currentSongEvent) && (
                    <span className="rhythmArticulation">
                      {articulationLabel(currentSongEvent)}
                    </span>
                  )}
                  <span
                    className="rhythmBar rhythmBarLarge"
                    style={{
                      width: `${Math.max(18, Math.min(100, currentSongEvent.beats * 42))}%`,
                    }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            )}

            <div
              className={`feedback ${songFeedback.startsWith("✓") ? "correct" : songFeedback.startsWith("✗") ? "wrong" : ""}`}
            >
              {songFeedback}
            </div>

            <div className="upcomingTitle">Notes around your position</div>

            <div className="songWindow">
              {(() => {
                const BEFORE = 3;
                const AFTER = 5;
                const start = Math.max(0, songStep - BEFORE);
                const end = Math.min(
                  activeSongEvents.length,
                  songStep + AFTER + 1,
                );
                const visibleEvents = activeSongEvents.slice(start, end);

                return (
                  <>
                    {start > 0 && (
                      <div className="songWindowEllipsis" aria-hidden="true">
                        …
                      </div>
                    )}

                    {visibleEvents.map((event, offset) => {
                      const absoluteIndex = start + offset;
                      const note = trainingNotes.find(
                        (item) => item.id === event.note,
                      );
                      if (!note) return null;

                      return (
                        <div
                          key={`${event.note}-${absoluteIndex}`}
                          className={`songStripNote noteColourCard ${
                            absoluteIndex === songStep ? "current" : ""
                          } ${absoluteIndex < songStep ? "done" : ""}`}
                          style={noteColourStyle(note.id)}
                        >
                          <strong>{note.label}</strong>
                          <RecorderPattern note={note} compact />

                          <div className="miniRhythm">
                            <span
                              className="rhythmBar"
                              style={{
                                width: `${Math.max(22, Math.min(100, event.beats * 50))}%`,
                              }}
                            />
                            {(event.tieToNext ||
                              event.articulation === "slur") && (
                              <span
                                className="slurMark"
                                title={
                                  event.tieToNext
                                    ? "Hold into next"
                                    : "Blend to next"
                                }
                              >
                                ↝
                              </span>
                            )}
                            {event.articulation === "staccato" && (
                              <span
                                className="staccatoMark"
                                title="Short / detached"
                              >
                                •
                              </span>
                            )}
                          </div>

                          <span className="miniBeatLabel">
                            {eventLengthLabel(event)}
                          </span>
                        </div>
                      );
                    })}

                    {end < activeSongEvents.length && (
                      <div className="songWindowEllipsis" aria-hidden="true">
                        …
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            <div className="stats songStats">
              <div>
                <span>Position</span>
                <strong>{songStep + 1}</strong>
              </div>
              <div>
                <span>Notes</span>
                <strong>{activeSongEvents.length}</strong>
              </div>
              <div>
                <span>Mistakes</span>
                <strong>{songMistakes}</strong>
              </div>
              <div>
                <span>Complete</span>
                <strong>{songProgress}%</strong>
              </div>
            </div>

            <div className="trainingActions">
              <button className="secondary" onClick={resetCurrentSong}>
                Restart tune
              </button>
            </div>
          </>
        ) : (
          <RhythmGame
            events={activeSongEvents}
            notes={trainingNotes}
            bpm={bpm}
            midiSignal={rhythmMidiSignal}
            resetMidi={
              midiMap[RESET_NOTE_ID] ?? DEFAULT_MIDI_MAP[RESET_NOTE_ID]
            }
            resetKey={rhythmGameResetKey}
            guideLevel={guideLevel}
            onGuideLevelChange={setGuideLevel}
            onBpmChange={setBpm}
            savedRating={songRatings[selectedSong.id]}
            onComplete={saveRhythmGameRating}
          />
        )}
      </section>
    );
  };

  return (
    <div
      className={`appShell ${pageTheme} ${songMode === "rhythm" && selectedSong ? "rhythmGamePage" : ""}`}
    >
      <main className="page">
        <section className="panel appHeader">
          <div className="eyebrow">Carry-on Digital Wind Instrument</div>
          <h1>Soprano recorder trainer</h1>

          <div className="tabs" role="tablist">
            <button
              className={tab === "tester" ? "tab active" : "tab"}
              onClick={() => {
                setTab("tester");
                leaveSong();
              }}
            >
              MIDI tester
            </button>

            <button
              className={tab === "training" ? "tab active" : "tab"}
              onClick={() => {
                setTab("training");
                leaveSong();
              }}
            >
              Training
            </button>

            <button
              className={tab === "calibration" ? "tab active" : "tab"}
              onClick={() => {
                setTab("calibration");
                leaveSong();
              }}
            >
              Settings
            </button>

            <button
              className={tab === "level0" ? "tab active" : "tab"}
              onClick={() => {
                setTab("level0");
                leaveSong();
              }}
            >
              Level 0
            </button>

            <button
              className={tab === "level1" ? "tab active" : "tab"}
              onClick={() => {
                setTab("level1");
                leaveSong();
              }}
            >
              Level 1
            </button>

            <button
              className={tab === "songs" ? "tab active" : "tab"}
              onClick={() => {
                setTab("songs");
                leaveSong();
              }}
            >
              English folk songs
            </button>

            <button
              className={tab === "shanties" ? "tab active" : "tab"}
              onClick={() => {
                setTab("shanties");
                leaveSong();
              }}
            >
              Sea shanties
            </button>

            <button
              className={tab === "zelda" ? "tab active" : "tab"}
              onClick={() => {
                setTab("zelda");
                leaveSong();
              }}
            >
              Zelda
            </button>

            <button
              className={tab === "lotr" ? "tab active" : "tab"}
              onClick={() => {
                setTab("lotr");
                leaveSong();
              }}
            >
              Lord of the Rings
            </button>
          </div>
        </section>

        {tab === "tester" && (
          <MidiTester
            lastNote={lastNote}
            lastMidi={lastMidi}
            velocity={velocity}
            messages={messages}
          />
        )}

        {tab === "training" && (
          <TrainingPanel
            trainingNotes={trainingNotes}
            targetIndex={targetIndex}
            feedback={feedback}
            score={score}
            attempts={attempts}
            streak={streak}
            shuffleMode={shuffleMode}
            lastNote={lastNote}
            lastMidi={lastMidi}
            onTargetIndex={(index) => {
              setTargetIndex(index);
              setFeedback("Play the fingering shown");
            }}
            onSkip={() => setTargetIndex((index) => pickNext(index))}
            onReset={resetTraining}
            onShuffleMode={setShuffleMode}
            onMapLast={useLastPlayedForTarget}
          />
        )}

        {tab === "calibration" && (
          <>
            <section className="panel midiSettingsPanel">
              <div className="settingsHeading">
                <div>
                  <div className="eyebrow">Settings</div>
                  <h2>MIDI connection</h2>
                  <p className="sub">
                    Your chosen input is remembered and reconnected
                    automatically when possible.
                  </p>
                </div>
                <span className="status">{status}</span>
              </div>

              <div className="setupNote">
                <div className="setupTitle">Carry-on instrument setup</div>
                <div className="setupSettings">
                  <span>
                    <strong>Voice:</strong> Soprano Recorder — press V and set
                    it to 1
                  </span>
                  <span>
                    <strong>Fingering:</strong> Recorder — press F and set it to
                    R
                  </span>
                </div>
                <p>
                  The Carry-on defaults are preloaded. If its notes do not
                  match, use the calibration map below.
                </p>
              </div>

              <div className="actions">
                <button className="primary" onClick={connect}>
                  {selectedInput ? "Reconnect MIDI" : "Connect MIDI"}
                </button>
              </div>

              {inputs.length > 0 && (
                <label className="selectRow">
                  MIDI input
                  <select
                    value={selectedId}
                    onChange={(event) => selectMidiInput(event.target.value)}
                  >
                    {inputs.map((input) => (
                      <option key={input.id} value={input.id}>
                        {input.name || "Unnamed MIDI device"}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </section>

            <CalibrationPanel
              notes={trainingNotes}
              midiMap={midiMap}
              selectedId={calibrationNoteId}
              lastMidi={lastMidi}
              lastNote={lastNote}
              onSelect={setCalibrationNoteId}
              onSave={updateMapping}
              onResetAll={resetMappings}
            />
          </>
        )}

        {tab === "level0" &&
          (selectedSongSection === "level0" && selectedSong ? (
            renderSongPlayer()
          ) : (
            <SongLibrary
              songs={LEVEL_0_SONGS}
              title="Level 0 — your first two notes"
              subtitle="Start with B only, then add A through eight short rhythm and fingering exercises."
              onStart={(song) => startSong(song, "level0")}
              section="level0"
              ratings={songRatings}
              onClearRating={clearSavedSongRating}
            />
          ))}

        {tab === "level1" &&
          (selectedSongSection === "level1" && selectedSong ? (
            renderSongPlayer()
          ) : (
            <SongLibrary
              songs={LEVEL_1_SONGS}
              title="Level 1 — B, A and G"
              subtitle="First recorder tunes and clearly labelled three-note adaptations, all playable with B, A and G."
              onStart={(song) => startSong(song, "level1")}
              section="level1"
              ratings={songRatings}
              onClearRating={clearSavedSongRating}
            />
          ))}

        {tab === "songs" &&
          (selectedSongSection === "songs" && selectedSong ? (
            renderSongPlayer()
          ) : (
            <SongLibrary
              songs={ENGLISH_FOLK_SONGS as Song[]}
              title="English folk songs"
              subtitle="Traditional tunes for soprano recorder. Your saved MIDI calibration is applied automatically."
              onStart={(song) => startSong(song, "songs")}
              section="songs"
              ratings={songRatings}
              onClearRating={clearSavedSongRating}
            />
          ))}

        {tab === "shanties" &&
          (selectedSongSection === "shanties" && selectedSong ? (
            renderSongPlayer()
          ) : (
            <SongLibrary
              songs={SEA_SHANTIES}
              title="Sea shanties"
              subtitle="Traditional English-language maritime work songs arranged for soprano recorder."
              onStart={(song) => startSong(song, "shanties")}
              section="shanties"
              ratings={songRatings}
              onClearRating={clearSavedSongRating}
            />
          ))}

        {tab === "zelda" &&
          (selectedSongSection === "zelda" && selectedSong ? (
            renderSongPlayer()
          ) : (
            <>
              <SongLibrary
                songs={ZELDA_SONGS}
                title="Zelda — Ocarina of Time"
                subtitle="Short mode plays Link's phrase twice. Your saved MIDI calibration is applied automatically."
                onStart={(song) => startSong(song, "zelda")}
                section="zelda"
                ratings={songRatings}
                onClearRating={clearSavedSongRating}
              />

              <section className="panel noticeCard zeldaPanel">
                <strong>Short vs Long</strong>
                <p className="sub small">
                  Short is Link's 5–8 note input played twice. Long is the
                  expanded melody heard after the game recognises it.
                </p>
              </section>
            </>
          ))}

        {tab === "lotr" &&
          (selectedSongSection === "lotr" && selectedSong ? (
            renderSongPlayer()
          ) : (
            <>
              <SongLibrary
                songs={LOTR_SONGS as Song[]}
                title="The Lord of the Rings"
                subtitle="Film themes arranged for recorder practice."
                onStart={(song) => startSong(song, "lotr")}
                section="lotr"
                ratings={songRatings}
                onClearRating={clearSavedSongRating}
              />

              <section className="panel noticeCard lotrPanel">
                <strong>Melody source</strong>
                <p className="sub small">
                  The film themes are set up as song slots. Add a tab or note
                  sequence you own/provide and it can use the same calibration,
                  fingering display and reset system.
                </p>
              </section>
            </>
          ))}
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
