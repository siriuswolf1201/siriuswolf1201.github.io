# 後端設定：Google Sheet + Apps Script（約 10 分鐘）

這個專案的「資料庫」就是一份 Google Sheet，透過 Apps Script 變成 API。
非工程師也能直接打開試算表改資料、看回應。

---

## 步驟 1：建立試算表

1. 到 [sheets.new](https://sheets.new) 開一份新的 Google Sheet，命名例如「環河活動天幕」。

## 步驟 2：貼上程式碼

1. 上方選單 **擴充功能 → Apps Script**。
2. 把預設的 `Code.gs` 內容全部刪掉，貼上本資料夾裡 [`Code.gs`](./Code.gs) 的全部內容。
3. 按 💾 儲存。

## 步驟 3：初始化資料表

1. 在 Apps Script 上方函式下拉選單選 **`setup`**，按 **▶ 執行**。
2. 第一次會跳出授權：選你的 Google 帳號 → 「進階」→「前往（不安全）」→ 允許。
   （這是你自己的專案，安全無虞。）
3. 回到試算表，會自動出現三個分頁：
   - **Config**：活動標題、副標、按讚文字、音樂連結等設定
   - **Questions**：題目清單（id / 文字 / 顏色 / 是否啟用）
   - **Cards**：所有人的回應（自動寫入）

之後要改標題、加題目、換顏色，直接在試算表編輯即可。

## 步驟 4：部署成 Web App

1. Apps Script 右上角 **部署 → 新增部署作業**。
2. 齒輪選 **網頁應用程式（Web app）**。
3. 設定：
   - **執行身分**：我（你自己）
   - **誰可以存取**：**任何人**（Anyone）← 一定要選這個，前端才連得到
4. 按 **部署**，複製出現的 **網頁應用程式網址**（結尾是 `/exec`）。

> ⚠️ 每次改完 `Code.gs` 要讓變更生效，要 **部署 → 管理部署作業 → 編輯（鉛筆）→ 版本選「新版本」→ 部署**。
> 網址不會變。

## 步驟 5：把網址填進前端

打開 [`../assets/config.js`](../assets/config.js)，把：

```js
WEBAPP_URL: "貼上你的_APPS_SCRIPT_WEB_APP_網址",
```

換成剛剛複製的 `/exec` 網址。存檔後重新整理網頁，就會從展示模式切換成真實資料。

---

## 資料表欄位說明

**Config**（key / value）

| key            | 說明                                                       |
| -------------- | ---------------------------------------------------------- |
| brand_org      | 品牌主字（預設 `Rotaract`）                                |
| brand_district | 品牌次字（預設 `District 3482`）                           |
| brand_impact   | 品牌標語，空白會自動斷行（預設 `CREATE LASTING IMPACT`）   |
| event_stamp    | 紅色印章文字（預設 `ON AIR`）                              |
| brush_title    | 手寫筆刷大標（預設 `FM348.2`，英數才有筆刷效果）           |
| brush_tagline  | 大標下的珊瑚紅筆刷字（預設 `ON AIR`）                      |
| event_title    | 活動主標（顯示為大標下的小字主題，如「時光輪轉初心不變」） |
| event_subtitle | 入口頁說明文字                                             |
| wall_subtitle  | 天幕右上角小字                                             |
| like_label     | 按讚按鈕文字（如「我也認同」）                             |
| music_url      | 背景音樂 YouTube 連結（選填）                              |
| form_url       | QR 指向的填寫網址（留空會自動用目前網址）                  |

> 身份選項（扶青社員／來賓）與「所屬扶青社」的社團清單寫在前端
> [`assets/config.js`](../assets/config.js) 的 `CLUBS`，要增減社團改那裡即可。

**Questions**（id / text / color / enabled）

- `color` 用色碼（如 `#9fc9ff`），會變成卡片標籤與光暈顏色
- `enabled` 填 `FALSE` 可暫時隱藏某題

**Cards**（自動寫入，通常不用手動改）

- 想刪除不當回應：直接刪那一列即可
- `likes` 欄是讚數
- `type` 空白＝一般回應，`hs`＝工作人員在 `#/hs` 登錄的 H&S；`amount` 是 H&S 金額
- 已經部署過舊版的人：把 `Code.gs` 更新後**再執行一次 `setup()`**，
  它會自動在 Cards 補上 `type` / `amount` 兩欄，既有資料不受影響

---

## 常見問題

**Q：前端顯示「展示模式」？**
A：`config.js` 的 `WEBAPP_URL` 還沒填，或填錯。

**Q：送出後試算表沒資料 / 主控台出現 CORS 錯誤？**
A：多半是「誰可以存取」沒設成「任何人」，或改了程式碼卻沒重新部署新版本。

**Q：即時更新有多快？**
A：天幕每 `POLL_SECONDS`（預設 5 秒）向試算表要一次最新資料。Google Sheet 不是即時推播，
所以是「幾秒內」而非「瞬間」，對現場活動完全夠用。若要更快可把 `config.js` 的 `POLL_SECONDS` 調小
（但別小於 3，以免撞到 Apps Script 流量限制）。
