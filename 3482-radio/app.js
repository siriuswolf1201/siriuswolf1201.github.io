/* ============================================================================
 * FM348.2 ON AIR — 調頻邏輯 / 播放器 / WebAudio 佔位音
 * ========================================================================== */
import { STATIONS, BAND, TOLERANCE } from "./data/stations.js";

/* ---------- DOM ---------- */
const $ = (id) => document.getElementById(id);
const tunerWindow = document.querySelector(".tuner-window");
const needle = $("tunerNeedle");
const scaleEl = $("tunerScale");
const marksEl = $("tunerMarks");
const freqValueEl = $("freqValue");
const onairLamp = $("onairLamp");
const speakerL = $("speakerLeft");
const speakerR = $("speakerRight");
const cassette = $("cassette");
const cassetteLabel = document.querySelector(".cassette-label");
const playBtn = $("playBtn");
const volumeEl = $("volume");
const staticToggle = $("staticToggle");
const stationListEl = $("stationList");
const nowName = $("nowName");
const nowIntro = $("nowIntro");
const powerOn = $("powerOn");
const powerBtn = $("powerBtn");

/* ---------- 狀態 ---------- */
const sorted = [...STATIONS].sort((a, b) => a.freq - b.freq);
let currentFreq = 348.2;     // 指針所在頻率
let lockedStation = null;    // 目前鎖定的台 (或 null = 雜訊空檔)
let isPlaying = false;       // 全域播放狀態
let staticEnabled = true;    // 掃台雜訊開關
let masterVolume = 0.75;

/* ============================================================================
 * 頻率 <-> 位置 換算
 * ========================================================================== */
const span = BAND.max - BAND.min;
const freqToPct = (f) => ((f - BAND.min) / span) * 100;
const clampFreq = (f) => Math.min(BAND.max, Math.max(BAND.min, f));

function nearestStation(freq) {
  let best = null;
  let bestDiff = Infinity;
  for (const s of sorted) {
    const d = Math.abs(s.freq - freq);
    if (d < bestDiff) { bestDiff = d; best = s; }
  }
  return bestDiff <= TOLERANCE ? best : null;
}

/* ============================================================================
 * 建立刻度 + 各台標記 + 頻道清單
 * ========================================================================== */
function buildScale() {
  const start = Math.ceil(BAND.min);
  const end = Math.floor(BAND.max);
  for (let f = start; f <= end; f += 0.5) {
    const tick = document.createElement("div");
    const isMajor = Number.isInteger(f) && f % 2 === 0;
    tick.className = "tick " + (isMajor ? "major" : "minor");
    tick.style.left = freqToPct(f) + "%";
    scaleEl.appendChild(tick);
    if (isMajor) {
      const label = document.createElement("div");
      label.className = "tick-label";
      label.style.left = freqToPct(f) + "%";
      label.textContent = f.toFixed(0);
      scaleEl.appendChild(label);
    }
  }
}

function buildMarks() {
  for (const s of sorted) {
    const flag = document.createElement("div");
    flag.className = "station-flag";
    flag.style.left = freqToPct(s.freq) + "%";
    flag.title = `${s.name} · FM ${s.freq.toFixed(1)}`;
    flag.dataset.id = s.id;
    const pip = document.createElement("span");
    pip.className = "pip";
    pip.style.background = s.color;
    flag.appendChild(pip);
    marksEl.appendChild(flag);
  }
}

function buildStationList() {
  for (const s of sorted) {
    const li = document.createElement("li");
    li.className = "station-item";
    li.dataset.id = s.id;
    li.innerHTML = `
      <span class="station-swatch" style="background:${s.color}"></span>
      <span class="station-meta">
        <span class="station-name">${s.name}</span>
        <span class="station-freq">FM ${s.freq.toFixed(1)}</span>
      </span>`;
    li.addEventListener("click", () => tuneTo(s.freq, true));
    stationListEl.appendChild(li);
  }
}

/* ============================================================================
 * 指針移動 / 選台
 * ========================================================================== */
function setNeedle(freq, animate) {
  currentFreq = clampFreq(freq);
  needle.style.transition = animate ? "left 0.5s cubic-bezier(.22,1,.36,1)" : "none";
  needle.style.left = freqToPct(currentFreq) + "%";
  freqValueEl.textContent = currentFreq.toFixed(1);
  updateLock();
}

/* 拖曳 / 掃台後決定鎖定哪一台 */
function updateLock() {
  const station = nearestStation(currentFreq);
  if (station !== lockedStation) {
    lockedStation = station;
    onStationChange();
  }
  highlightActive();
}

/* 點清單或程式選台：移到台心並鎖定 */
function tuneTo(freq, animate) {
  setNeedle(freq, animate);
  const s = nearestStation(freq);
  if (s) { setNeedle(s.freq, animate); } // 對齊到台心
}

function highlightActive() {
  document.querySelectorAll(".station-item").forEach((el) => {
    el.classList.toggle("is-active", lockedStation && Number(el.dataset.id) === lockedStation.id);
  });
  document.querySelectorAll(".station-flag").forEach((el) => {
    const on = lockedStation && Number(el.dataset.id) === lockedStation.id;
    el.querySelector(".pip").style.transform = on ? "scale(1.5)" : "scale(1)";
  });
}

/* ============================================================================
 * 拖曳 (pointer events，平板觸控也適用)
 * ========================================================================== */
let dragging = false;
function pointerToFreq(clientX) {
  const rect = tunerWindow.getBoundingClientRect();
  const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  return BAND.min + ratio * span;
}
function onDown(e) {
  dragging = true;
  tunerWindow.setPointerCapture?.(e.pointerId);
  setNeedle(pointerToFreq(e.clientX), false);
}
function onMove(e) { if (dragging) setNeedle(pointerToFreq(e.clientX), false); }
function onUp() {
  if (!dragging) return;
  dragging = false;
  const s = nearestStation(currentFreq);
  if (s) setNeedle(s.freq, true); // 放開 → 吸附到最近台心
}
tunerWindow.addEventListener("pointerdown", onDown);
tunerWindow.addEventListener("pointermove", onMove);
tunerWindow.addEventListener("pointerup", onUp);
tunerWindow.addEventListener("pointercancel", onUp);
tunerWindow.addEventListener("pointerleave", onUp);

/* ============================================================================
 * WebAudio：佔位合成音 + 掃台雜訊
 * ========================================================================== */
let audioCtx = null;
let masterGain = null;
let staticNodes = null;   // { src, gain }
let toneNodes = null;     // { oscs:[], gain, lfo }
let noiseBuffer = null;

/* 真實 mp3 用 HTMLAudioElement 播放（避免外部 URL 的 CORS 問題） */
const audioEl = new Audio();
audioEl.loop = true;
audioEl.preload = "none";
let realAudioActive = false;

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = masterVolume;
  masterGain.connect(audioCtx.destination);

  // 白噪 buffer (給 static 用)
  const len = audioCtx.sampleRate * 2;
  noiseBuffer = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
}

/* 每台的佔位音高：A 大調五聲音階往上疊 */
function stationPitch(station) {
  const idx = sorted.indexOf(station);
  const pent = [0, 2, 4, 7, 9];
  const semis = Math.floor(idx / 5) * 12 + pent[idx % 5];
  return 220 * Math.pow(2, semis / 12);
}

function startTone(station) {
  stopTone();
  const base = stationPitch(station);
  const gain = audioCtx.createGain();
  gain.gain.value = 0.0001;
  gain.connect(masterGain);
  gain.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + 0.4);

  const o1 = audioCtx.createOscillator();
  o1.type = "sine"; o1.frequency.value = base;
  const o2 = audioCtx.createOscillator();
  o2.type = "triangle"; o2.frequency.value = base * 1.5; o2.detune.value = 4;
  o1.connect(gain); o2.connect(gain);

  // 緩慢顫音 (tremolo) 讓佔位音柔和不死板
  const lfo = audioCtx.createOscillator();
  lfo.frequency.value = 0.6;
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 0.06;
  lfo.connect(lfoGain); lfoGain.connect(gain.gain);

  o1.start(); o2.start(); lfo.start();
  toneNodes = { oscs: [o1, o2], gain, lfo };
}
function stopTone() {
  if (!toneNodes) return;
  const { oscs, gain, lfo } = toneNodes;
  gain.gain.cancelScheduledValues(audioCtx.currentTime);
  gain.gain.setValueAtTime(gain.gain.value, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
  oscs.forEach((o) => o.stop(audioCtx.currentTime + 0.2));
  lfo.stop(audioCtx.currentTime + 0.2);
  toneNodes = null;
}

function startStatic() {
  stopStatic();
  if (!staticEnabled) return;
  const src = audioCtx.createBufferSource();
  src.buffer = noiseBuffer; src.loop = true;
  const lp = audioCtx.createBiquadFilter();
  lp.type = "bandpass"; lp.frequency.value = 1800; lp.Q.value = 0.5;
  const gain = audioCtx.createGain();
  gain.gain.value = 0.05;
  src.connect(lp); lp.connect(gain); gain.connect(masterGain);
  src.start();
  staticNodes = { src, gain };
}
function stopStatic() {
  if (!staticNodes) return;
  try { staticNodes.src.stop(); } catch (_) {}
  staticNodes = null;
}

function stopRealAudio() {
  if (realAudioActive) { audioEl.pause(); realAudioActive = false; }
}

/* ============================================================================
 * 播放狀態整合
 * ========================================================================== */
function onStationChange() {
  updateNowPlaying();
  if (isPlaying) refreshAudio();
}

function refreshAudio() {
  if (!audioCtx) return;
  stopTone();
  stopStatic();
  stopRealAudio();

  if (!isPlaying) { setPlayingVisual(false); return; }

  if (lockedStation) {
    setPlayingVisual(true);
    if (lockedStation.audio) {
      // 真實 mp3
      if (audioEl.dataset.src !== lockedStation.audio) {
        audioEl.src = lockedStation.audio;
        audioEl.dataset.src = lockedStation.audio;
      }
      audioEl.volume = masterVolume;
      audioEl.play().then(() => { realAudioActive = true; })
        .catch(() => { startTone(lockedStation); }); // 播不動就退回佔位音
    } else {
      startTone(lockedStation); // 佔位合成音
    }
  } else {
    // 空檔：雜訊、不算正在放送
    setPlayingVisual(false);
    startStatic();
  }
}

function setPlayingVisual(on) {
  onairLamp.classList.toggle("is-live", on);
  speakerL.classList.toggle("is-playing", on);
  speakerR.classList.toggle("is-playing", on);
  cassette.classList.toggle("is-playing", on);
}

function updateNowPlaying() {
  if (lockedStation) {
    nowName.textContent = lockedStation.name;
    nowIntro.textContent = lockedStation.intro;
    cassetteLabel.textContent = "FM " + lockedStation.freq.toFixed(1);
    document.documentElement.style.setProperty("--accent", lockedStation.color);
  } else {
    nowName.textContent = "掃台中…";
    nowIntro.textContent = "（沙沙沙）轉動指針，對準頻道就能收聽各社的故事。";
    cassetteLabel.textContent = "—— · ——";
  }
}

/* ============================================================================
 * 控制：播放鈕 / 音量 / 雜訊開關 / 開機
 * ========================================================================== */
function setPlaying(on) {
  isPlaying = on;
  playBtn.classList.toggle("is-playing", on);
  if (on) { refreshAudio(); } else { stopTone(); stopStatic(); stopRealAudio(); setPlayingVisual(false); }
}

playBtn.addEventListener("click", () => setPlaying(!isPlaying));

volumeEl.addEventListener("input", () => {
  masterVolume = Number(volumeEl.value) / 100;
  if (masterGain) masterGain.gain.value = masterVolume;
  if (realAudioActive) audioEl.volume = masterVolume;
  volumeEl.style.background =
    `linear-gradient(90deg, var(--coral) 0 ${volumeEl.value}%, #b9b2a4 ${volumeEl.value}% 100%)`;
});

staticToggle.addEventListener("click", () => {
  staticEnabled = !staticEnabled;
  staticToggle.classList.toggle("is-on", staticEnabled);
  staticToggle.setAttribute("aria-pressed", String(staticEnabled));
  if (isPlaying && !lockedStation) { staticEnabled ? startStatic() : stopStatic(); }
});

function powerUp() {
  initAudio();
  if (audioCtx.state === "suspended") audioCtx.resume();
  powerOn.classList.add("is-off");
  tuneTo(currentFreq, true);   // 對齊到主頻道
  setPlaying(true);
}
powerBtn.addEventListener("click", powerUp);

/* ============================================================================
 * 初始化
 * ========================================================================== */
buildScale();
buildMarks();
buildStationList();
setNeedle(currentFreq, false); // 預設停在 348.2 主頻道
updateNowPlaying();
