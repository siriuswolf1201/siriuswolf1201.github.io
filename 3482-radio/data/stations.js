/* ============================================================================
 * FM348.2 ON AIR — 頻道設定檔 (這是你之後唯一需要維護的檔案)
 * ----------------------------------------------------------------------------
 * 每一社 = 一個頻道。欄位說明：
 *   id    : 流水號（不要重複即可）
 *   name  : 社團名稱（顯示在便利貼 / 清單）
 *   freq  : 頻率，建議照預設的 340.2 ~ 356.2、間距 1.0（正中央 348.2 是主題頻道）
 *           ─ 指針進入該頻率 ±0.4 範圍就會「鎖台」，所以選台很容錯。
 *   audio : mp3 路徑，例如 "audio/abc-club.mp3"。
 *           ─ 留空字串 "" → 自動用合成提示音當佔位（畫面照常運作）。
 *           ─ 之後把 mp3 丟進 audio/ 資料夾、把路徑填這裡即可，不用改其他程式。
 *   intro : 介紹文字（顯示在便利貼）。可用 \n 換行。
 *   color : 該台主題色（HEX），影響便利貼/清單色塊。
 *
 * 想增減社團 → 直接增刪陣列項目即可，版面與調頻刻度會自動重算。
 * ========================================================================== */

export const STATIONS = [
  { id: 1,  name: "扶輪社 01",      freq: 340.2, audio: "audio/demo.mp3", intro: "歡迎收聽 01 社的故事，這一年我們一起做了好多事。", color: "#f4a259" },
  { id: 2,  name: "扶輪社 02",      freq: 341.2, audio: "audio/demo.mp3", intro: "02 社頻道放送中，分享我們的服務與夥伴情誼。",        color: "#f4b942" },
  { id: 3,  name: "扶輪社 03",      freq: 342.2, audio: "audio/demo.mp3", intro: "03 社的這一年，從相遇到並肩，謝謝有你。",            color: "#e8c468" },
  { id: 4,  name: "扶輪社 04",      freq: 343.2, audio: "audio/demo.mp3", intro: "04 社上線囉，讓我們把溫暖傳出去。",                  color: "#c7d49a" },
  { id: 5,  name: "扶輪社 05",      freq: 344.2, audio: "audio/demo.mp3", intro: "05 社頻道，記錄每一場行動與感動。",                  color: "#9ec9a3" },
  { id: 6,  name: "扶輪社 06",      freq: 345.2, audio: "audio/demo.mp3", intro: "06 社報到，這個頻率屬於我們的回憶。",                color: "#86c2b5" },
  { id: 7,  name: "扶輪社 07",      freq: 346.2, audio: "audio/demo.mp3", intro: "07 社放送中，一起聽聽我們的成長。",                  color: "#7fc0c8" },
  { id: 8,  name: "扶輪社 08",      freq: 347.2, audio: "audio/demo.mp3", intro: "08 社頻道，謝謝每一位同行的夥伴。",                  color: "#79b6d6" },
  { id: 9,  name: "FM348.2 主頻道", freq: 348.2, audio: "audio/demo.mp3", intro: "FM348.2，這個頻率，讓我們連結在一起。\nCreate Lasting Impact！", color: "#e76f6f" },
  { id: 10, name: "扶輪社 10",      freq: 349.2, audio: "audio/demo.mp3", intro: "10 社上線，把這一年的精彩說給你聽。",                color: "#6c9bd1" },
  { id: 11, name: "扶輪社 11",      freq: 350.2, audio: "audio/demo.mp3", intro: "11 社頻道放送中，服務不打烊。",                      color: "#7e8fcf" },
  { id: 12, name: "扶輪社 12",      freq: 351.2, audio: "audio/demo.mp3", intro: "12 社報到，我們的友誼跨越每一個頻率。",              color: "#9384c9" },
  { id: 13, name: "扶輪社 13",      freq: 352.2, audio: "audio/demo.mp3", intro: "13 社頻道，一起創造更多美好。",                      color: "#b083c2" },
  { id: 14, name: "扶輪社 14",      freq: 353.2, audio: "audio/demo.mp3", intro: "14 社放送中，謝謝你願意停下來聆聽。",                color: "#c987bb" },
  { id: 15, name: "扶輪社 15",      freq: 354.2, audio: "audio/demo.mp3", intro: "15 社上線囉，新的一年繼續閃亮。",                    color: "#dd8bb0" },
  { id: 16, name: "扶輪社 16",      freq: 355.2, audio: "audio/demo.mp3", intro: "16 社頻道，記得鎖定我們的故事。",                    color: "#ec90a3" },
  { id: 17, name: "扶輪社 17",      freq: 356.2, audio: "audio/demo.mp3", intro: "17 社放送，最後一台、滿滿的感謝。",                  color: "#f49191" },
];

/* 調頻刻度的顯示範圍（兩端各留一點邊，純粹是刻度好看用，不影響選台容差） */
export const BAND = {
  min: 339.6,
  max: 356.8,
};

/* 選台容差：指針距離某台中心 < tolerance 即鎖定該台 */
export const TOLERANCE = 0.4;
