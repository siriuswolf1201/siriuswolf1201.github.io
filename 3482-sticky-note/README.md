# 活動即時回應天幕（Rotary Event Wall）

參考 Driftmuration 做的活動互動天幕：參加者用手機填寫回應，卡片即時浮上大螢幕，
還能互相按讚。**純前端 + Google Sheet 當後端**，零伺服器成本、非工程師也能維護。

## 功能（MVP）

- **入口頁** — 我要填寫 / 看天幕 / 邀請朋友（QR）
- **填寫頁** — 選身份 → 填名字/單位 → 抽題或選題 → 寫回答 → 送出
- **天幕頁** — 大螢幕投影：卡片浮現輪播、每幾秒自動換、可上一張/下一張、「我也認同」按讚、回應列表側欄、（選）YouTube 背景音樂
- **邀請頁** — 自動產生 QR code 指向填寫頁

## 架構

```
手機/大螢幕瀏覽器  ──►  純前端 SPA（index.html + assets/）
                          │  fetch（GET 讀、POST 寫，皆免 CORS preflight）
                          ▼
                 Google Apps Script Web App（apps-script/Code.gs）
                          │
                          ▼
                 Google Sheet：Config / Questions / Cards
```

- 即時性：天幕每 5 秒輪詢一次最新卡片（可在 `config.js` 調整）。
- 無需建置工具、無框架，直接開檔就能跑。

## 快速開始

### 1) 先看畫面（展示模式，免後端）
```bash
# 在專案根目錄開一個本機伺服器
python -m http.server 5599
# 瀏覽器開 http://localhost:5599
```
此時用內建假資料，可完整點過入口 / 填寫 / 天幕 / QR。

### 2) 接上真實資料
照 [`apps-script/SETUP.md`](apps-script/SETUP.md) 建立 Google Sheet 與 Apps Script，
把網址填進 [`assets/config.js`](assets/config.js) 的 `WEBAPP_URL`。

### 3) 上線
把整個資料夾（`index.html` + `assets/` + `config.js`）丟到任一靜態主機：
GitHub Pages、Netlify、Cloudflare Pages、或活動現場的任何網頁空間皆可。

## 檔案結構

```
tipper/
├─ index.html            SPA 進入點
├─ assets/
│  ├─ config.js          ★ 唯一要改：WEBAPP_URL 與活動設定
│  ├─ app.css            全部樣式（含天幕動畫）
│  └─ app.js             路由 + 四個頁面 + API 串接
├─ apps-script/
│  ├─ Code.gs            Google Apps Script 後端
│  └─ SETUP.md           後端部署教學
└─ README.md
```

## 現場操作小抄

- **大螢幕**：開 `.../#/wall`，按 F11 全螢幕。想放音樂點右上「🔈 音樂」。
- **報到桌**：印出 `.../#/qr` 的 QR，或直接投影邀請頁。
- **控場**：天幕會自動輪播；想停在某張，用底部 ‹ › 或「回應列表」點選。
- **刪不當回應**：到 Google Sheet 的 Cards 分頁刪那一列，幾秒後天幕就更新。

## 之後可加（非 MVP）

- 後台管理頁（改設定不用開試算表）
- 多種天幕動畫模式（瀑布流、跑馬燈…）
- 上傳背景圖 / logo、卡片版面自訂
- 按讚防洗（目前用瀏覽器本機記錄，同裝置不重複）
