/* ============================================================================
 * FM348.2 ON AIR — 頻道設定檔 (這是你之後唯一需要維護的檔案)
 * ----------------------------------------------------------------------------
 * 每一社 = 一個頻道。欄位說明：
 *   id    : 流水號（不要重複即可）
 *   name  : 社團名稱（顯示在便利貼 / 清單）
 *   freq  : 頻率，建議照預設的 340.2 ~ 357.2、間距 1.0（正中央 348.2 是主題頻道）
 *           ─ 指針進入該頻率 ±0.4 範圍就會「鎖台」，所以選台很容錯。
 *   audio : mp3 路徑，例如 "audio/abc-club.mp3"。
 *           ─ 留空字串 "" → 該台不出聲（畫面照常運作；已無合成佔位音）。
 *           ─ 之後把 mp3 丟進 audio/ 資料夾、把路徑填這裡即可，不用改其他程式。
 *   intro : 介紹文字（顯示在便利貼）。可用 \n 換行。目前先帶各社標語，可自行改寫。
 *   color : 該台主題色（HEX），影響便利貼/清單色塊。
 *
 * 想增減社團 → 直接增刪陣列項目即可，版面與調頻刻度會自動重算。
 * 頻道依社序排列，正中央 348.2 保留為 FM348.2 就職主題頻道。
 * ========================================================================== */

export const STATIONS = [
  { id: 1,  name: "台北城中社",     freq: 340.2, audio: "audio/demo.mp3", intro: "城懷大志，中流砥柱！創造持恆商務影響力。",           color: "#f4a259" },
  { id: 2,  name: "台北城東社",     freq: 341.2, audio: "audio/demo.mp3", intro: "城東視界，連結國際！展現新世代國際影響力。",         color: "#f4b942" },
  { id: 3,  name: "台北大稻埕社",   freq: 342.2, audio: "audio/demo.mp3", intro: "埕現經典，創藝無限！讓在地文化發揮持恆影響。",       color: "#e8c468" },
  { id: 4,  name: "台北北海社",     freq: 343.2, audio: "audio/demo.mp3", intro: "愛護海洋，北海最行！共創蔚藍新世紀。",               color: "#c7d49a" },
  { id: 5,  name: "台北圓環社",     freq: 344.2, audio: "audio/demo.mp3", intro: "圓聚老城，環扣人情！以美食與共餐溫暖社區。",           color: "#9ec9a3" },
  { id: 6,  name: "台北大安社",     freq: 345.2, audio: "audio/demo.mp3", intro: "大愛無疆，安居樂業！深耕社區弱勢關懷。",             color: "#86c2b5" },
  { id: 7,  name: "台北大龍峒社",   freq: 346.2, audio: "audio/demo.mp3", intro: "大龍騰飛，峒心協力！活化傳統民俗生命力。",           color: "#7fc0c8" },
  { id: 8,  name: "台北西北區社",   freq: 347.2, audio: "audio/demo.mp3", intro: "西北領航，職引未來！共創專業發展影響力。",           color: "#79b6d6" },
  { id: 9,  name: "FM348.2 主頻道", freq: 348.2, audio: "audio/demo.mp3", intro: "FM348.2，這個頻率，讓我們連結在一起。\nCreate Lasting Impact！", color: "#e76f6f" },
  { id: 10, name: "台北百城社",     freq: 349.2, audio: "audio/demo.mp3", intro: "百城聚力，築夢新創！引領青年創業新世代。",           color: "#6c9bd1" },
  { id: 11, name: "台北上城社",     freq: 350.2, audio: "audio/demo.mp3", intro: "上城風範，追求卓越！成就新世代商業菁英。",           color: "#7e8fcf" },
  { id: 12, name: "台北邑德社",     freq: 351.2, audio: "audio/demo.mp3", intro: "邑聚賢德，暖心相伴！打造代間和諧新世紀。",           color: "#9384c9" },
  { id: 13, name: "台北百合社",     freq: 352.2, audio: "audio/demo.mp3", intro: "百合綻放，女力領航！綻放新世紀多元包容影響力。",     color: "#b083c2" },
  { id: 14, name: "台北怡東社",     freq: 353.2, audio: "audio/demo.mp3", intro: "怡然自得，綠色永續！怡東引領低碳生活新潮流。",       color: "#c987bb" },
  { id: 15, name: "台北城中北醫大社", freq: 354.2, audio: "audio/demo.mp3", intro: "北醫城中，醫心守護！發揮醫學大專青年影響力。",     color: "#dd8bb0" },
  { id: 16, name: "台北旭日社",     freq: 355.2, audio: "audio/demo.mp3", intro: "旭日東升，希望無窮！用教育與書香溫暖人心。",         color: "#ec90a3" },
  { id: 17, name: "台北雙子星AI社",  freq: 356.2, audio: "audio/demo.mp3", intro: "智啟雙子，AI創新！用先進科技共創嶄新世紀。",         color: "#f49191" },
  { id: 18, name: "台北景文科大社",  freq: 357.2, audio: "audio/demo.mp3", intro: "景文創藝，青創力行！展現技職青年在地影響力。",       color: "#f6a5a0" },
];

/* 調頻刻度的顯示範圍（兩端各留一點邊，純粹是刻度好看用，不影響選台容差） */
export const BAND = {
  min: 339.6,
  max: 357.8,
};

/* 選台容差：指針距離某台中心 < tolerance 即鎖定該台 */
export const TOLERANCE = 0.4;
