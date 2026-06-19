/* ============================================================================
 * FM348.2 ON AIR — 調頻邏輯 / 播放器 / WebAudio（漸變交叉淡入版）
 * ----------------------------------------------------------------------------
 * 真實收音機感：依指針到「最近電台中心」的距離，連續調整
 *   節目聲(訊號) 與 沙沙雜訊 的比例 —— 越近越清楚、越遠越雜訊。
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
const lampDot = document.querySelector(".lamp-dot");
const speakerL = $("speakerLeft");
const speakerR = $("speakerRight");
const cassette = $("cassette");
const cassetteLabel = document.querySelector(".cassette-label");
const playBtn = $("playBtn");
const volumeEl = $("volume");
const staticToggle = $("staticToggle");
const stationListEl = $("stationList");
const stickyNote = $("stickyNote");
const nowName = $("nowName");
const nowIntro = $("nowIntro");
const powerOn = $("powerOn");
const powerBtn = $("powerBtn");

/* ---------- 狀態 ---------- */
const sorted = [...STATIONS].sort((a, b) => a.freq - b.freq);
let currentFreq = 348.2;     // 指針所在頻率
let isPlaying = false;       // 全域播放狀態
let staticEnabled = true;    // 掃台雜訊開關
let masterVolume = 0.75;

/* ---------- 漸變參數 ---------- */
const CLEAN = 0.12;          // 距台心 < 此值：訊號全滿、完全清楚
const FADE = TOLERANCE;      // 距台心 >= 此值(0.4)：訊號為 0、全是雜訊
const TONE_BASE = 0.18;      // 佔位音基礎音量
const STATIC_MAX = 0.06;     // 雜訊最大音量

/* ============================================================================
 * 頻率 <-> 位置 換算
 * ========================================================================== */
const span = BAND.max - BAND.min;
const freqToPct = (f) => ((f - BAND.min) / span) * 100;
const clampFreq = (f) => Math.min(BAND.max, Math.max(BAND.min, f));

/* 最近的台（不設門檻，純粹找最近） */
function nearestByDistance(freq) {
  let best = sorted[0], bd = Infinity;
  for (const s of sorted) {
    const d = Math.abs(s.freq - freq);
    if (d < bd) { bd = d; best = s; }
  }
  return { station: best, dist: bd };
}
/* 容差內才回傳（給「吸附」與「跳台」用） */
function nearestStation(freq) {
  const { station, dist } = nearestByDistance(freq);
  return dist <= TOLERANCE ? station : null;
}
/* 訊號強度 0~1：台心附近=1，平滑下降到 FADE 處=0 */
function signalStrength(d) {
  if (d <= CLEAN) return 1;
  if (d >= FADE) return 0;
  const x = (FADE - d) / (FADE - CLEAN);
  return x * x * (3 - 2 * x); // smoothstep，淡入淡出更自然
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
  updateReception();
}

/* 點清單或程式選台：移到台心（訊號全滿、最清楚） */
function tuneTo(freq, animate) {
  const s = nearestStation(freq) || nearestByDistance(freq).station;
  setNeedle(s.freq, animate);
}

function highlightActive(station) {
  document.querySelectorAll(".station-item").forEach((el) => {
    el.classList.toggle("is-active", station && Number(el.dataset.id) === station.id);
  });
  document.querySelectorAll(".station-flag").forEach((el) => {
    const on = station && Number(el.dataset.id) === station.id;
    el.querySelector(".pip").style.transform = on ? "scale(1.5)" : "scale(1)";
  });
}

/* 每次指針移動都會跑：算訊號強度 → 更新音訊 + 畫面 */
function updateReception() {
  const { station, dist } = nearestByDistance(currentFreq);
  const strength = signalStrength(dist);
  updateNowPlaying(station, strength);
  highlightActive(strength > 0.45 ? station : null);
  if (isPlaying && engine) updateAudio(station, strength);
  updateSignalVisual(strength);
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
  if (s) setNeedle(s.freq, true); // 放開 → 在容差內就吸附到台心（聽得最清楚）
}
tunerWindow.addEventListener("pointerdown", onDown);
tunerWindow.addEventListener("pointermove", onMove);
tunerWindow.addEventListener("pointerup", onUp);
tunerWindow.addEventListener("pointercancel", onUp);
tunerWindow.addEventListener("pointerleave", onUp);

/* ============================================================================
 * WebAudio 引擎：持續運作的「節目聲」+「雜訊」兩個聲道，靠音量交叉淡變
 * ========================================================================== */
let audioCtx = null;
let masterGain = null;
let noiseBuffer = null;
let engine = null; // { o1,o2,charGain,strengthGain,lfo, sSrc,sGain, toneStation }

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

function startEngine() {
  if (!audioCtx || engine) return;

  // ── 節目聲（佔位合成音）：oscs → charGain(含顫音) → strengthGain(訊號強度) → master
  const charGain = audioCtx.createGain();
  charGain.gain.value = TONE_BASE;
  const strengthGain = audioCtx.createGain();
  strengthGain.gain.value = 0.0001;
  charGain.connect(strengthGain);
  strengthGain.connect(masterGain);

  const o1 = audioCtx.createOscillator(); o1.type = "sine";
  const o2 = audioCtx.createOscillator(); o2.type = "triangle"; o2.detune.value = 4;
  o1.connect(charGain); o2.connect(charGain);

  const lfo = audioCtx.createOscillator(); lfo.frequency.value = 0.6;
  const lfoGain = audioCtx.createGain(); lfoGain.gain.value = 0.05;
  lfo.connect(lfoGain); lfoGain.connect(charGain.gain);
  o1.start(); o2.start(); lfo.start();

  // ── 雜訊：noise → bandpass → sGain → master
  const sSrc = audioCtx.createBufferSource();
  sSrc.buffer = noiseBuffer; sSrc.loop = true;
  const bp = audioCtx.createBiquadFilter();
  bp.type = "bandpass"; bp.frequency.value = 1800; bp.Q.value = 0.5;
  const sGain = audioCtx.createGain();
  sGain.gain.value = 0.0001;
  sSrc.connect(bp); bp.connect(sGain); sGain.connect(masterGain);
  sSrc.start();

  engine = { o1, o2, charGain, strengthGain, lfo, sSrc, sGain, toneStation: null };
}

function stopEngine() {
  if (!engine) return;
  const t = audioCtx.currentTime;
  try {
    engine.strengthGain.gain.cancelScheduledValues(t);
    engine.strengthGain.gain.setTargetAtTime(0.0001, t, 0.03);
    engine.sGain.gain.setTargetAtTime(0.0001, t, 0.03);
    [engine.o1, engine.o2, engine.lfo, engine.sSrc].forEach((n) => n.stop(t + 0.12));
  } catch (_) {}
  engine = null;
}

function ensureRealAudio(station) {
  if (audioEl.dataset.src !== station.audio) {
    audioEl.src = station.audio;
    audioEl.dataset.src = station.audio;
    realAudioActive = false;
    audioEl.play().then(() => { realAudioActive = true; }).catch(() => { realAudioActive = false; });
  } else if (audioEl.paused) {
    audioEl.play().then(() => { realAudioActive = true; }).catch(() => { realAudioActive = false; });
  }
}
function stopRealAudio() {
  if (!audioEl.paused) audioEl.pause();
  realAudioActive = false;
}

/* 核心：依 station + strength 連續調整節目聲 / 雜訊比例 */
function updateAudio(station, strength) {
  if (!engine) return;
  const t = audioCtx.currentTime;

  // 切換到新的一台（發生在兩台正中間，此時 strength≈0，換音無縫）
  if (station !== engine.toneStation) {
    engine.toneStation = station;
    const f = stationPitch(station);
    engine.o1.frequency.setTargetAtTime(f, t, 0.02);
    engine.o2.frequency.setTargetAtTime(f * 1.5, t, 0.02);
    if (station.audio) ensureRealAudio(station);
    else stopRealAudio();
  }

  // 節目聲：有真實 mp3 且已在播 → 用 mp3 音量隨強度變；否則用佔位合成音
  if (station.audio && realAudioActive) {
    engine.strengthGain.gain.setTargetAtTime(0.0001, t, 0.05);
    audioEl.volume = Math.min(1, strength * masterVolume);
  } else {
    engine.strengthGain.gain.setTargetAtTime(strength, t, 0.05);
  }

  // 雜訊：與訊號互補，越清楚雜訊越小
  const sg = (staticEnabled ? (1 - strength) * STATIC_MAX : 0) + 0.0001;
  engine.sGain.gain.setTargetAtTime(sg, t, 0.06);
}

/* ============================================================================
 * 畫面：指示燈 / 喇叭 / 卡帶 / 便利貼 都隨訊號強度漸變
 * ========================================================================== */
function updateSignalVisual(strength) {
  const s = isPlaying ? strength : 0;
  const live = s >= 0.5;

  onairLamp.classList.toggle("is-live", live);
  if (live) {
    lampDot.style.background = "";   // 交回 CSS（紅燈 + 閃爍）
    lampDot.style.boxShadow = "";
  } else {
    const amb = Math.max(0, (s - 0.1) / 0.4); // 0~1（微弱訊號的暖光）
    lampDot.style.background = amb > 0 ? `rgba(255,90,90,${(0.3 + 0.5 * amb).toFixed(2)})` : "";
    lampDot.style.boxShadow = amb > 0 ? `0 0 ${(4 + 6 * amb).toFixed(0)}px rgba(255,77,77,${(0.6 * amb).toFixed(2)})` : "";
  }

  speakerL.classList.toggle("is-playing", s > 0.5);
  speakerR.classList.toggle("is-playing", s > 0.5);
  cassette.classList.toggle("is-playing", s > 0.15); // 有點訊號就開始轉
}

function updateNowPlaying(station, strength) {
  if (strength > 0.1) {
    nowName.textContent = station.name;
    nowIntro.textContent = strength > 0.5 ? station.intro : "（訊號微弱…再微調一下指針）";
    cassetteLabel.textContent = "FM " + station.freq.toFixed(1);
    stickyNote.style.opacity = (0.82 + 0.18 * strength).toFixed(2);
    document.documentElement.style.setProperty("--accent", station.color);
  } else {
    nowName.textContent = "掃台中…";
    nowIntro.textContent = "（沙沙沙）轉動指針，慢慢靠近就能聽見各社的故事。";
    cassetteLabel.textContent = "—— · ——";
    stickyNote.style.opacity = "1";
  }
}

/* ============================================================================
 * 控制：播放鈕 / 音量 / 雜訊開關 / 開機
 * ========================================================================== */
function setPlaying(on) {
  isPlaying = on;
  playBtn.classList.toggle("is-playing", on);
  if (on) { startEngine(); updateReception(); }
  else { stopEngine(); stopRealAudio(); updateReception(); }
}

playBtn.addEventListener("click", () => setPlaying(!isPlaying));

volumeEl.addEventListener("input", () => {
  masterVolume = Number(volumeEl.value) / 100;
  if (masterGain) masterGain.gain.value = masterVolume;
  updateReception(); // 同步調整真實 mp3 的音量
  volumeEl.style.background =
    `linear-gradient(90deg, var(--coral) 0 ${volumeEl.value}%, #b9b2a4 ${volumeEl.value}% 100%)`;
});

staticToggle.addEventListener("click", () => {
  staticEnabled = !staticEnabled;
  staticToggle.classList.toggle("is-on", staticEnabled);
  staticToggle.setAttribute("aria-pressed", String(staticEnabled));
  updateReception();
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
