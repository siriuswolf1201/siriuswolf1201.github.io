# FM348.2 ON AIR 📻

Rotaract District 3482 就職活動主題網頁 — 一台**復古網路收音機**。
不同頻道 = 不同社團的介紹語音，現場可放在平板（建議橫放）當互動展示。

> 設計風格沿用就職海報：淡藍天空、方格紙、手繪塗鴉、手寫筆刷「FM348.2 / ON AIR」、
> 紅色印章、便利貼黃、復古手提音響、植栽。

純靜態網站（HTML / CSS / JS，**無建置步驟**），可直接放上 GitHub Pages。

---

## 🎛 使用方式
- 進場點「**開機收聽**」→ 解鎖音訊、收音機開機。
- **拖曳調頻指針**掃台：對準頻道（有寬容差，會自動吸附）就會亮 `ON AIR` 並播放。
- 或點右側**頻道清單**直接跳到某一社。
- 控制列：播放/暫停、音量、掃台雜訊開關。

---

## 📝 維護（最常用）
99% 的調整都只動一個檔：[`data/stations.js`](data/stations.js)

```js
{ id: 1, name: "○○扶輪社", freq: 340.2, audio: "audio/club-01.mp3", intro: "介紹文字…", color: "#f4a259" },
```

| 想做的事 | 怎麼做 |
| --- | --- |
| 換社名 / 介紹 / 顏色 | 改 `data/stations.js` 對應欄位 |
| 補語音 | mp3 放 `audio/`，把路徑填到該社 `audio` 欄位（留空 `""` 會用佔位音） |
| 增 / 減社團 | 直接增刪陣列項目，刻度與版面會自動重算 |
| 放官方 logo | 把 `logo.png` 放進 `assets/`（見 `assets/README.md`） |

頻率預設分布在 **FM 340.2–356.2**、間距 1.0、正中央 348.2 是主頻道；
每台 **±0.4 容差**，所以選台很好對、不挑手。

---

## 💻 本機預覽
ES module 需要透過本機伺服器（直接點開 `index.html` 會被瀏覽器擋）：

```bash
# 在專案資料夾執行其一
python -m http.server 8000
# 或
npx serve .
```
瀏覽器開 `http://localhost:8000`，視窗拉成橫向。

---

## 🚀 部署到 GitHub Pages
```bash
git init
git add .
git commit -m "FM348.2 ON AIR radio"
git branch -M main
git remote add origin https://github.com/<你的帳號>/<repo>.git
git push -u origin main
```
然後到 GitHub repo → **Settings → Pages** → Source 選 `main` / `(root)` → Save。
稍候會給你網址：`https://<你的帳號>.github.io/<repo>/`

> 已內含 `.nojekyll`，且所有資源走相對路徑，子路徑下不會 404。
> 平板上用瀏覽器全螢幕、或「加入主畫面」當 kiosk。

---

## 📁 結構
```
index.html         版面 + 開機 overlay
styles.css         海報風格 + 收音機外觀 + 橫式 RWD
app.js             調頻/容差吸附/播放器/WebAudio 佔位音與雜訊
data/stations.js   ★ 頻道設定（主要維護檔）
audio/             各社 mp3（見 audio/README.md）
assets/            logo 等圖檔插槽（見 assets/README.md）
.nojekyll          關閉 Jekyll 處理
```
