/* ------------------------------------------------------------------
 *  設定檔  (config)
 *  部署 Google Apps Script 後，把 WEBAPP_URL 換成你的網址即可。
 *  這是唯一「一定要改」的地方。
 * ------------------------------------------------------------------ */
window.APP_CONFIG = {
  // 1) 貼上你部署好的 Apps Script Web App 網址（結尾像 /exec）
  //    參考 apps-script/SETUP.md 的步驟。
  WEBAPP_URL: "https://script.google.com/macros/s/AKfycbzLleeURKZeiFVywzBfl6xufqCbLVXhYUHUe9DirhoFpsj7xUVfJPi4SnYk1HB2B4RJ/exec",

  // 2) 活動 ID（可放多場活動，這個字串會當作 Google Sheet 分頁前綴/識別）
  //    先用一場即可，維持預設。
  EVENT_ID: "rotary-2026",

  // 3) 天幕（大螢幕）每張卡片停留秒數；輪詢新卡片的間隔秒數
  SWAP_SECONDS: 6,
  POLL_SECONDS: 5,

  // 4) 扶青（Rotaract）品牌字樣，沿用 FM348.2 收音機那套。可在 Google Sheet 的
  //    Config 分頁加同名 key 覆蓋（brand_org / brand_district / brand_impact / event_stamp）。
  CLUBS: [
    "台北城中社", "台北城東社", "台北大稻埕社", "台北北海社", "台北圓滿社",
    "台北大安社", "台北大龍峒社", "台北西北區社", "台北百城社", "台北上城社",
    "台北邑德社", "台北百合社", "台北怡東社", "台北城中北醫大社", "台北旭日社",
    "台北雙子星AI社", "台北景文科大社"
  ],

  // 5) 若後端還沒接好，前端會用這份「假資料」讓你先看畫面與動畫。
  //    WEBAPP_URL 設定好之後，這份假資料就會被真資料取代。
  DEMO: {
    config: {
      brand_org: "Rotaract",
      brand_district: "District 3482",
      brand_impact: "CREATE LASTING IMPACT",
      event_stamp: "ON AIR",
      brush_title: "FM348.2",
      brush_tagline: "ON AIR",
      event_title: "地區就職暨地區公訪暨招生說明會",
      event_subtitle: "歡迎參加！在這裡寫下你的想法，一起把扶青的聲音放送出去。",
      wall_subtitle: "Rotaract District 3482 · 扶青放送",
      like_label: "我也認同",
      music_url: "" // 例：https://www.youtube.com/watch?v=xxxx
    },
    questions: [
      { id: 1, text: "用一句話形容你的扶青社", color: "#79b6d6", enabled: true },
      { id: 2, text: "我的扶青初心",          color: "#f4b942", enabled: true },
      { id: 3, text: "我如何創造持恆影響力",    color: "#86c2b5", enabled: true }
    ],
    cards: [
      { id: 1, question_id: 1, question_text: "用一句話形容你的扶青社", question_color: "#79b6d6",
        answer: "臥虎藏龍，青春無敵", identity: "來賓", display_name: "Grace",
        extra_label: "公司／單位", extra_value: "全球動力科技", likes: 3, created_at: Date.now() - 90000 },
      { id: 2, question_id: 1, question_text: "用一句話形容你的扶青社", question_color: "#79b6d6",
        answer: "一群願意為別人多做一點的人", identity: "扶青社員", display_name: "Jason",
        extra_label: "所屬扶青社", extra_value: "台北城中社", likes: 5, created_at: Date.now() - 60000 },
      { id: 3, question_id: 2, question_text: "我的扶青初心", question_color: "#f4b942",
        answer: "服務比自己更重要的事，讓身邊多一點光。", identity: "扶青社員", display_name: "Angela",
        extra_label: "所屬扶青社", extra_value: "台北大安社", likes: 2, created_at: Date.now() - 30000 },
      // H&S（工作人員在 #/hs 登錄的快樂捐），和一般回應一起輪播上天幕
      { id: 4, type: "hs", amount: 2000, question_id: 0, question_text: "H&S", question_color: "#f4b942",
        answer: "祝地區就職順利，大家平安喜樂！", identity: "", display_name: "小明",
        extra_label: "所屬扶青社", extra_value: "台北城中社", likes: 4, created_at: Date.now() - 15000 }
    ]
  }
};
