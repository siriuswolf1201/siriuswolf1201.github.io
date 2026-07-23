/* ==================================================================
   時光輪轉初心不變 — 前端 SPA
   Hash 路由： #/(入口)  #/form(填寫)  #/wall(天幕)  #/qr(邀請)
              #/hs(H&S 登錄，工作人員專用；入口不放連結，靠網址進入)
   後端：Google Apps Script Web App（見 apps-script/SETUP.md）
   ================================================================== */
(function () {
  "use strict";

  var CFG = window.APP_CONFIG || {};
  var app = document.getElementById("app");

  /* ---------------- small helpers ---------------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function on(node, evt, fn) { if (node) node.addEventListener(evt, fn); }
  function toast(msg) {
    var t = qs(".toast") || document.body.appendChild(Object.assign(document.createElement("div"), { className: "toast" }));
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }
  function ls(key, val) {
    try {
      if (val === undefined) return JSON.parse(localStorage.getItem(key));
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }
  function clientToken() {
    var t = ls("client_token");
    if (!t) { t = (Date.now().toString(36) + Math.random().toString(36).slice(2, 9)); ls("client_token", t); }
    return t;
  }

  /* ---------------- API (Google Sheets via Apps Script) ---------------- */
  var USE_DEMO = !CFG.WEBAPP_URL || /貼上你的/.test(CFG.WEBAPP_URL);
  var api = {
    _get: function (params) {
      var url = CFG.WEBAPP_URL + (CFG.WEBAPP_URL.indexOf("?") < 0 ? "?" : "&") + params;
      return fetch(url, { method: "GET" }).then(function (r) { return r.json(); });
    },
    _post: function (body) {
      // text/plain 避免 CORS preflight（Apps Script 讀 e.postData.contents）
      return fetch(CFG.WEBAPP_URL, {
        method: "POST", redirect: "follow",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(body)
      }).then(function (r) { return r.json(); });
    },
    wall: function () {
      if (USE_DEMO) return Promise.resolve(clone(CFG.DEMO));
      return this._get("action=wall").catch(function () { return clone(CFG.DEMO); });
    },
    bootstrap: function () {
      if (USE_DEMO) return Promise.resolve(clone(CFG.DEMO));
      return this._get("action=bootstrap").catch(function () { return clone(CFG.DEMO); });
    },
    submit: function (card) {
      if (USE_DEMO) return Promise.resolve({ ok: true, id: Date.now(), demo: true });
      return this._post({ action: "submit", card: card, client_token: clientToken() });
    },
    like: function (id) {
      if (USE_DEMO) return Promise.resolve({ ok: true, id: id });
      return this._post({ action: "like", id: id, client_token: clientToken() });
    }
  };
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* ---------------- router ---------------- */
  var routes = {
    "": renderEntry, "/": renderEntry,
    "/form": renderForm, "/wall": renderWall, "/qr": renderQR, "/cloud": renderCloud,
    "/hs": renderHS
  };
  function route() {
    stopWall(); // 離開天幕時清定時器
    var hash = location.hash.replace(/^#/, "") || "/";
    var view = routes[hash] || renderEntry;
    view();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);

  /* ---------------- shared config cache ---------------- */
  var CONFIG = (CFG.DEMO && CFG.DEMO.config) || {};
  var QUESTIONS = (CFG.DEMO && CFG.DEMO.questions) || [];
  function loadBootstrap() {
    return api.bootstrap().then(function (d) {
      if (d && d.config) CONFIG = d.config;
      if (d && d.questions && d.questions.length) QUESTIONS = d.questions;
      return d;
    });
  }

  /* ================================================================
     入口 (Entry)
     ================================================================ */
  function renderEntry() {
    loadBootstrap().then(function () {
      app.innerHTML =
        '<div class="wrap">' +
          brandLockup() +
          '<div class="entry-hero stack center">' +
            '<span class="stamp">' + esc(CONFIG.event_stamp || "ON AIR") + '</span>' +
            '<h1 class="brush-title">' + esc(CONFIG.brush_title || "FM348.2") + '</h1>' +
            '<span class="brush-onair">' + esc(CONFIG.brush_tagline || "ON AIR") + '</span>' +
            (CONFIG.event_title ? '<p class="subtitle">' + esc(CONFIG.event_title) + '</p>' : "") +
            '<p class="muted">' + esc(CONFIG.event_subtitle || "") + '</p>' +
          '</div>' +
          '<div class="entry-actions">' +
            tile("form", "azure", "✍️", "我要填寫", "分享你的想法") +
            tile("wall", "gold", "🌌", "看天幕", "大家的即時回應") +
            tile("qr", "plain", "📱", "邀請朋友", "出示 QR code，讓更多人一起寫") +
            tile("cloud", "azure", "☁️", "文字雲", "活動收尾，看大家的關鍵字") +
          '</div>' +
          '<div class="spacer"></div>' +
          '<p class="muted center" style="font-size:12px">' + (USE_DEMO ? "⚙️ 目前為展示模式（尚未接後端）" : "") + '</p>' +
        '</div>';
      qsa(".tile").forEach(function (t) { on(t, "click", function () { location.hash = "#/" + t.dataset.go; }); });
    });
  }
  function tile(go, cls, emoji, title, sub) {
    return '<button class="tile ' + cls + '" data-go="' + go + '">' +
      '<span class="emoji">' + emoji + '</span>' +
      '<span><b>' + title + '</b><small>' + sub + '</small></span>' +
      '<span class="chev">→</span></button>';
  }

  // 扶青品牌字樣（沿用 FM348.2 收音機那套），入口與天幕頂端共用
  function brandLockup() {
    var org = CONFIG.brand_org || "Rotaract";
    var district = CONFIG.brand_district || "District 3482";
    var impact = CONFIG.brand_impact || "CREATE LASTING IMPACT";
    return '<div class="brand">' +
      '<img class="brand-logo" src="assets/logo.png" alt="" onerror="this.classList.add(\'is-missing\')">' +
      '<div class="brand-text">' +
        '<span class="brand-rotaract">' + esc(org) + '</span>' +
        '<span class="brand-district">' + esc(district) + '</span>' +
      '</div>' +
      '<div class="brand-impact">' + esc(impact).replace(/\s+/g, "<br>") + '</div>' +
    '</div>';
  }

  // 扶青社下拉建議（所屬扶青社輸入框用）
  function clubDatalist() {
    var clubs = (window.APP_CONFIG && window.APP_CONFIG.CLUBS) || [];
    if (!clubs.length) return "";
    return '<datalist id="club-list">' +
      clubs.map(function (c) { return '<option value="' + esc(c) + '">'; }).join("") + '</datalist>';
  }

  /* ================================================================
     填寫 (Form)
     ================================================================ */
  var form = { identity: "", name: "", extra: "", question: null, answer: "", picking: false };

  function renderForm() {
    loadBootstrap().then(function () { form.question = null; drawForm(); });
  }

  function drawForm() {
    var isMember = form.identity === "扶青社員";
    var extraLabel = isMember ? "所屬扶青社" : "公司／單位";
    var ready = form.identity && form.name.trim();

    app.innerHTML =
      '<div class="wrap stack">' +
        '<a class="backlink" href="#/">← 回入口</a>' +
        '<div><div class="brandline">寫下你的想法</div>' +
          '<h1 class="title" style="font-size:26px">' + esc(CONFIG.event_title || "") + '</h1>' +
          '<p class="muted" style="margin-top:8px">每回答一題，就會有一張卡片浮上天幕 ✨</p></div>' +

        '<div class="card">' +
          '<h2>先讓大家認識你</h2>' +
          '<div class="field"><span>你的身份</span><div class="row">' +
            identChip("扶青社員") + identChip("來賓") +
          '</div></div>' +
          (form.identity ?
            '<div class="stack" style="margin-top:12px">' +
              '<label class="field"><span>你的名字 <span class="req">*</span></span>' +
                '<input class="input" id="f-name" placeholder="會顯示在天幕卡片上（如：王小明）" value="' + esc(form.name) + '"></label>' +
              '<label class="field"><span>' + extraLabel + '</span>' +
                '<input class="input" id="f-extra"' + (isMember ? ' list="club-list"' : '') +
                  ' placeholder="' + (isMember ? "選擇或輸入你的扶青社" : "選填（公司、學校或單位）") + '" value="' + esc(form.extra) + '"></label>' +
              (isMember ? clubDatalist() : "") +
            '</div>' : "") +
        '</div>' +

        (ready ? questionSection() : "") +
      '</div>';

    // bindings
    qsa(".chip[data-ident]").forEach(function (c) {
      on(c, "click", function () { form.identity = c.dataset.ident; form.extra = ""; drawForm(); });
    });
    on(qs("#f-name"), "input", function (e) { form.name = e.target.value; syncReady(); });
    on(qs("#f-extra"), "input", function (e) { form.extra = e.target.value; });
    bindQuestionSection();
  }

  function identChip(v) {
    return '<button class="chip' + (form.identity === v ? " active" : "") + '" data-ident="' + v + '">' + v + "</button>";
  }
  function syncReady() {
    // 名字從無到有時，補上題目區塊（避免整頁重繪讓輸入失焦）
    if (form.identity && form.name.trim() && !qs("#q-section")) {
      var sec = document.createElement("div");
      sec.innerHTML = questionSection();
      qs(".wrap").appendChild(sec.firstChild);
      bindQuestionSection();
    }
  }

  function questionSection() {
    if (form.question) return answerSection();
    return '<div class="card" id="q-section">' +
      '<h2>想回答哪一題？</h2>' +
      (form.picking ?
        '<div class="q-list">' + QUESTIONS.map(function (q) {
          return '<button class="q-pick" data-qid="' + q.id + '" style="--qc:' + esc(q.color) + '">' + esc(q.text) + "</button>";
        }).join("") + '</div>' +
        '<div class="row" style="margin-top:12px"><button class="btn-ghost btn" id="q-back">↩︎ 返回</button></div>'
        :
        '<div class="row">' +
          '<button class="btn btn-gold" id="q-random">🎲 隨機抽一題</button>' +
          '<button class="btn btn-ghost" id="q-choose">📋 自己選題</button>' +
        '</div>') +
      '</div>';
  }

  function answerSection() {
    var q = form.question;
    return '<div class="card" id="q-section">' +
      '<div class="row" style="justify-content:space-between;align-items:center;margin-bottom:14px">' +
        '<span class="chosen-q" style="--qc:' + esc(q.color) + '">📝 ' + esc(q.text) + '</span>' +
        '<button class="btn-ghost btn" id="q-change" style="padding:8px 14px;font-size:13px">換一題</button>' +
      '</div>' +
      '<label class="field"><span>你的回答 <span class="req">*</span></span>' +
        '<textarea class="input" id="f-answer" maxlength="140" placeholder="用一句話，寫下你的想法…">' + esc(form.answer) + '</textarea>' +
        '<div class="counter"><span id="cnt">' + form.answer.length + '</span>/140</div></label>' +
      '<button class="btn btn-block" id="f-submit">送出，讓卡片浮上天幕 →</button>' +
    '</div>';
  }

  function bindQuestionSection() {
    on(qs("#q-random"), "click", function () {
      var pool = QUESTIONS.length ? QUESTIONS : [];
      form.question = pool[Math.floor(Math.random() * pool.length)]; form.picking = false; drawForm();
    });
    on(qs("#q-choose"), "click", function () { form.picking = true; drawForm(); });
    on(qs("#q-back"), "click", function () { form.picking = false; drawForm(); });
    qsa(".q-pick").forEach(function (b) {
      on(b, "click", function () {
        form.question = QUESTIONS.filter(function (q) { return String(q.id) === b.dataset.qid; })[0];
        form.picking = false; drawForm();
      });
    });
    on(qs("#q-change"), "click", function () { form.question = null; form.answer = ""; form.picking = false; drawForm(); });
    on(qs("#f-answer"), "input", function (e) {
      form.answer = e.target.value; var c = qs("#cnt"); if (c) c.textContent = form.answer.length;
    });
    on(qs("#f-submit"), "click", submitForm);
  }

  function submitForm() {
    if (!form.answer.trim()) { toast("先寫下你的回答唷"); return; }
    var isMember = form.identity === "扶青社員";
    var btn = qs("#f-submit"); btn.disabled = true; btn.textContent = "送出中…";
    var card = {
      question_id: form.question.id, question_text: form.question.text, question_color: form.question.color,
      answer: form.answer.trim(), identity: form.identity, display_name: form.name.trim(),
      extra_label: isMember ? "所屬扶青社" : "公司／單位", extra_value: form.extra.trim()
    };
    api.submit(card).then(function (res) {
      if (res && res.ok !== false) { showSuccess(card); }
      else { btn.disabled = false; btn.textContent = "送出，讓卡片浮上天幕 →"; toast("送出失敗，再試一次"); }
    }).catch(function () {
      btn.disabled = false; btn.textContent = "送出，讓卡片浮上天幕 →"; toast("網路連線有點問題");
    });
  }

  function showSuccess(card) {
    app.innerHTML =
      '<div class="wrap"><div class="spacer"></div>' +
        '<div class="success card">' +
          '<div class="tick">✓</div>' +
          '<h2 style="font-size:22px">卡片已浮上天幕！</h2>' +
          '<p class="muted" style="margin:10px 0 22px">你的回應正在大螢幕上與大家相遇 🌌</p>' +
          '<div class="chosen-q" style="--qc:' + esc(card.question_color) + ';margin-bottom:10px">' + esc(card.question_text) + '</div>' +
          '<p style="font-size:20px;font-weight:800;line-height:1.5">「' + esc(card.answer) + '」</p>' +
          '<div class="stack" style="margin-top:26px">' +
            '<a class="btn btn-gold btn-block" href="#/wall">🌌 去看天幕</a>' +
            '<button class="btn btn-ghost btn-block" id="again">✍️ 再寫一題</button>' +
          '</div>' +
        '</div><div class="spacer"></div></div>';
    on(qs("#again"), "click", function () {
      form.question = null; form.answer = ""; form.picking = false; location.hash = "#/form";
      // hashchange 相同時不觸發，強制重繪
      renderForm();
    });
  }

  /* ================================================================
     H&S 登錄 (Happy & Sad) — 工作人員專用
     入口頁不放連結，工作人員直接用 #/hs 網址進入。
     送出的卡片 type = "hs"，會和一般回應一起輪播上天幕。
     ================================================================ */
  var hsForm = { amount: "", club: "", nickname: "", message: "" };
  var HS_COLOR = "#f4b942";

  function money(n) {
    var v = Math.max(0, Math.round(Number(n) || 0));
    return "NT$ " + String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function renderHS() {
    loadBootstrap().then(drawHS);
  }

  function drawHS() {
    app.innerHTML =
      '<div class="wrap stack">' +
        '<a class="backlink" href="#/">← 回入口</a>' +
        '<div><div class="brandline">工作人員專區</div>' +
          '<h1 class="title" style="font-size:26px;margin-top:10px">登錄 H&amp;S</h1>' +
          '<p class="muted" style="margin-top:8px">送出後，這筆 H&amp;S 會變成一張金色便利貼浮上天幕 💛</p></div>' +

        '<div class="card hs-card">' +
          '<h2>H&amp;S 資料</h2>' +
          '<div class="stack">' +
            '<label class="field"><span>H&amp;S 金額 <span class="req">*</span></span>' +
              '<input class="input" id="h-amount" type="number" inputmode="numeric" min="0" step="100" ' +
                'placeholder="例如：2000" value="' + esc(hsForm.amount) + '"></label>' +
            '<label class="field"><span>哪個社 <span class="req">*</span></span>' +
              '<input class="input" id="h-club" list="club-list" placeholder="例如：台北城中社" value="' + esc(hsForm.club) + '"></label>' +
            clubDatalist() +
            '<label class="field"><span>暱稱 <span class="req">*</span></span>' +
              '<input class="input" id="h-nick" placeholder="會顯示在天幕卡片上（如：小明）" value="' + esc(hsForm.nickname) + '"></label>' +
            '<label class="field"><span>祝賀詞 <span class="req">*</span></span>' +
              '<textarea class="input" id="h-msg" maxlength="140" placeholder="例如：祝大家新的一年順順利利！">' + esc(hsForm.message) + '</textarea>' +
              '<div class="counter"><span id="h-cnt">' + hsForm.message.length + '</span>/140</div></label>' +
          '</div>' +
          '<button class="btn btn-gold btn-block" id="h-submit" style="margin-top:10px">送出，讓 H&amp;S 上天幕 →</button>' +
        '</div>' +

        '<a class="btn btn-ghost btn-block" href="#/wall">🌌 前往天幕</a>' +
      '</div>';

    on(qs("#h-amount"), "input", function (e) { hsForm.amount = e.target.value; });
    on(qs("#h-club"), "input", function (e) { hsForm.club = e.target.value; });
    on(qs("#h-nick"), "input", function (e) { hsForm.nickname = e.target.value; });
    on(qs("#h-msg"), "input", function (e) {
      hsForm.message = e.target.value; var c = qs("#h-cnt"); if (c) c.textContent = hsForm.message.length;
    });
    on(qs("#h-submit"), "click", submitHS);
  }

  function submitHS() {
    var amount = Math.round(Number(hsForm.amount));
    if (!(amount > 0)) { toast("請填 H&S 金額"); return; }
    if (!hsForm.club.trim()) { toast("請填是哪個社"); return; }
    if (!hsForm.nickname.trim()) { toast("請填暱稱"); return; }
    if (!hsForm.message.trim()) { toast("請填祝賀詞"); return; }

    var btn = qs("#h-submit"); btn.disabled = true; btn.textContent = "送出中…";
    var card = {
      type: "hs", amount: amount,
      question_id: 0, question_text: "H&S", question_color: CONFIG.hs_color || HS_COLOR,
      answer: hsForm.message.trim(), identity: "",
      display_name: hsForm.nickname.trim(),
      extra_label: "所屬扶青社", extra_value: hsForm.club.trim()
    };
    api.submit(card).then(function (res) {
      if (res && res.ok !== false) { showHSSuccess(card); }
      else { btn.disabled = false; btn.textContent = "送出，讓 H&S 上天幕 →"; toast("送出失敗，再試一次"); }
    }).catch(function () {
      btn.disabled = false; btn.textContent = "送出，讓 H&S 上天幕 →"; toast("網路連線有點問題");
    });
  }

  function showHSSuccess(card) {
    app.innerHTML =
      '<div class="wrap"><div class="spacer"></div>' +
        '<div class="success card">' +
          '<div class="tick tick-gold">💛</div>' +
          '<h2 style="font-size:22px">H&amp;S 已登錄！</h2>' +
          '<p class="muted" style="margin:10px 0 22px">金色便利貼正在天幕上為大家慶祝 🌌</p>' +
          '<div class="hs-amt-lg">' + esc(money(card.amount)) + '</div>' +
          '<p style="font-weight:900;color:var(--navy);margin-bottom:10px">' + esc(card.extra_value) + '</p>' +
          '<p style="font-size:19px;font-weight:800;line-height:1.5">「' + esc(card.answer) + '」</p>' +
          '<p class="muted" style="margin-top:6px">— ' + esc(card.display_name) + '</p>' +
          '<div class="stack" style="margin-top:26px">' +
            '<button class="btn btn-gold btn-block" id="hs-again">💛 再登錄一筆</button>' +
            '<a class="btn btn-ghost btn-block" href="#/wall">🌌 去看天幕</a>' +
          '</div>' +
        '</div><div class="spacer"></div></div>';
    on(qs("#hs-again"), "click", function () {
      hsForm = { amount: "", club: "", nickname: "", message: "" };
      drawHS(); window.scrollTo(0, 0);
    });
  }

  /* ================================================================
     天幕 (Wall)
     ================================================================ */
  var GRID = 6;                                    // 一次顯示幾張
  var SLOT_ROT = [-2.2, 1.6, -1.2, 2.0, -1.6, 1.1]; // 每格便利貼的基礎歪斜角
  var wall = { cards: [], deck: [], slots: [], cursor: 0, nextSlot: 0,
               timer: null, poll: null, liked: {}, drawerOpen: false, paused: false, known: {} };

  function stopWall() {
    clearInterval(wall.timer); clearInterval(wall.poll);
    wall.timer = wall.poll = null;
    var yt = qs("#yt-music"); if (yt) yt.remove();
  }

  function renderWall() {
    wall.liked = ls("liked_ids") || {};
    wall.cards = []; wall.deck = []; wall.slots = []; wall.cursor = 0; wall.nextSlot = 0; wall.known = {}; wall.paused = false;
    app.innerHTML =
      '<div class="wall">' +
        '<div class="wall-top">' +
          '<a class="w-btn" href="#/">← 入口</a>' +
          brandLockup() +
          '<div class="grow"></div>' +
          '<div class="w-titlewrap center">' +
            '<div class="w-brush">' + esc(CONFIG.brush_title || "FM348.2") + ' <span class="on">' + esc(CONFIG.brush_tagline || "ON AIR") + '</span></div>' +
            '<div class="w-sub" id="w-sub"></div>' +
          '</div>' +
          '<div class="grow"></div>' +
          '<button class="w-btn" id="w-music" title="背景音樂" style="display:none">🔈 音樂</button>' +
          '<a class="w-btn w-cloud" href="#/cloud" title="活動關鍵字文字雲">☁<span class="lbl"> 文字雲</span></a>' +
          '<button class="w-btn" id="w-list">☰ 回應列表</button>' +
        '</div>' +
        '<div class="wall-grid" id="grid"></div>' +
        '<div class="wall-bottom" id="wbar" style="display:none">' +
          '<button class="w-btn" id="w-pause">⏸ 暫停輪播</button>' +
          '<div class="wall-count" id="w-count">–</div>' +
        '</div>' +
        drawerHTML() +
      '</div>';

    on(qs("#w-list"), "click", toggleDrawer);
    on(qs("#w-music"), "click", toggleMusic);
    on(qs("#w-pause"), "click", togglePause);

    fetchWall(true);
    wall.poll = setInterval(function () { fetchWall(false); }, (CFG.POLL_SECONDS || 5) * 1000);
  }

  function cardById(id) {
    for (var i = 0; i < wall.cards.length; i++) if (wall.cards[i].id === id) return wall.cards[i];
    return null;
  }

  function fetchWall(first) {
    api.wall().then(function (d) {
      if (!d) return;
      if (d.config) {
        CONFIG = d.config;
        var subEl = qs("#w-sub"); if (subEl) subEl.textContent = CONFIG.wall_subtitle || "";
        var brushEl = qs(".w-brush");
        if (brushEl && CONFIG.brush_title) {
          brushEl.innerHTML = esc(CONFIG.brush_title) + ' <span class="on">' + esc(CONFIG.brush_tagline || "ON AIR") + '</span>';
        }
        var mbtn = qs("#w-music");
        if (mbtn && ytId(CONFIG.music_url)) mbtn.style.display = "";
      }
      var incoming = (d.cards || []).slice().sort(function (a, b) { return (a.created_at || 0) - (b.created_at || 0); });
      var hadCards = wall.cards.length > 0;
      wall.cards = incoming;
      wall.deck = incoming.map(function (c) { return c.id; });

      if (!incoming.length) { showEmpty(); renderDrawer(); return; }

      // 找出這次新增的卡片（poll 時可即時撕貼上牆）
      var fresh = [];
      incoming.forEach(function (c) { if (!wall.known[c.id]) fresh.push(c.id); wall.known[c.id] = true; });

      if (!hadCards) {
        initialFill();
      } else {
        likeRefresh();
        growSlots();                                  // 卡片變多時把格子補到 6 格
        if (fresh.length && wall.slots.length) {      // 有新回應：立刻撕一張、貼上新的
          var newest = fresh[fresh.length - 1];
          if (wall.slots.indexOf(newest) === -1) {
            swapSlot(wall.nextSlot, newest, true);
            wall.nextSlot = (wall.nextSlot + 1) % wall.slots.length;
          }
        }
      }
      updateCount();
      renderDrawer();
    });
  }

  function initialFill() {
    var grid = qs("#grid"); if (!grid) return;
    grid.innerHTML = ""; wall.slots = []; wall.cursor = 0; wall.nextSlot = 0;
    var n = wall.cards.length, k = Math.min(GRID, n);
    for (var i = 0; i < k; i++) {
      var card = wall.cards[n - k + i];              // 先貼最新的 k 張（陣列尾端最新）
      var slot = document.createElement("div"); slot.className = "slot"; grid.appendChild(slot);
      wall.slots.push(card.id);
      var note = buildNote(card, i);
      note.classList.add("paste");
      note.style.animationDelay = (i * 0.11) + "s";   // 依序貼上，像佈置一面牆
      slot.appendChild(note);
    }
    updateCount(); startAuto();
  }

  function growSlots() {
    var grid = qs("#grid"); if (!grid) return;
    var want = Math.min(GRID, wall.cards.length);
    while (wall.slots.length < want) {
      var id = pickNext(); if (id == null) break;
      var slot = document.createElement("div"); slot.className = "slot"; grid.appendChild(slot);
      var idx = wall.slots.length; wall.slots.push(id);
      var note = buildNote(cardById(id), idx); note.classList.add("paste");
      slot.appendChild(note);
    }
  }

  function startAuto() {
    clearInterval(wall.timer);
    wall.timer = setInterval(function () {
      if (wall.paused || wall.drawerOpen) return;
      if (wall.cards.length <= wall.slots.length) return; // 卡片沒有比格子多，不需輪換
      var id = pickNext(); if (id == null) return;
      swapSlot(wall.nextSlot, id, true);
      wall.nextSlot = (wall.nextSlot + 1) % wall.slots.length;
    }, (CFG.SWAP_SECONDS || 6) * 1000);
  }

  // 從牌堆挑下一張「目前沒顯示在牆上」的卡
  function pickNext() {
    var n = wall.deck.length; if (!n) return null;
    for (var step = 0; step < n; step++) {
      var id = wall.deck[wall.cursor % n]; wall.cursor++;
      if (wall.slots.indexOf(id) === -1) return id;
    }
    return null;
  }

  // 把第 i 格的便利貼「撕下來」，換上 newId「貼上去」
  function swapSlot(i, newId, animate) {
    var grid = qs("#grid"); if (!grid) return;
    var slot = grid.children[i]; if (!slot) return;
    var card = cardById(newId); if (!card) return;
    wall.slots[i] = newId;
    var old = qs(".snote", slot);
    if (old) {
      if (animate === false) { old.remove(); }
      else {
        old.classList.remove("paste"); old.classList.add("tear");
        (function (dead) { setTimeout(function () { if (dead.parentNode) dead.parentNode.removeChild(dead); }, 760); })(old);
      }
    }
    var note = buildNote(card, i);
    if (animate !== false) note.classList.add("paste");
    slot.appendChild(note);
  }

  function showEmpty() {
    var grid = qs("#grid"); if (grid) grid.innerHTML =
      '<div class="wall-empty"><div class="big">天幕正在等待第一則回應 ✨</div>' +
      '<p>' + esc(CONFIG.empty_wall_text || "掃 QR code 或到「我要填寫」，一起把想法貼上這片天幕") + '</p></div>';
    var bar = qs("#wbar"); if (bar) bar.style.display = "none";
  }

  function likeRefresh() {
    var grid = qs("#grid"); if (!grid) return;
    for (var i = 0; i < wall.slots.length; i++) {
      var c = cardById(wall.slots[i]); if (!c) continue;
      var slot = grid.children[i]; if (!slot) continue;
      var n = qs(".snote .like .n", slot);
      if (n && !wall.liked[c.id]) n.textContent = c.likes || 0;
    }
  }

  function updateCount() {
    var hsCount = 0, hsTotal = 0;
    wall.cards.forEach(function (c) { if (c.type === "hs") { hsCount++; hsTotal += Number(c.amount) || 0; } });
    var el = qs("#w-count");
    if (el) el.textContent = "共 " + wall.cards.length + " 則" + (hsCount ? " · 💛 H&S " + money(hsTotal) : "");
    var bar = qs("#wbar"); if (bar) bar.style.display = wall.cards.length ? "" : "none";
    var pb = qs("#w-pause"); if (pb) pb.style.display = wall.cards.length > GRID ? "" : "none";
  }

  function togglePause() {
    wall.paused = !wall.paused;
    var b = qs("#w-pause"); if (b) b.textContent = wall.paused ? "▶ 繼續輪播" : "⏸ 暫停輪播";
  }
  function pauseBriefly() {
    wall.paused = true; var b = qs("#w-pause"); if (b) b.textContent = "▶ 繼續輪播";
    clearTimeout(wall._r); wall._r = setTimeout(function () {
      wall.paused = false; var bb = qs("#w-pause"); if (bb) bb.textContent = "⏸ 暫停輪播";
    }, 10000);
  }

  function buildNote(c, slotIndex) {
    var isHS = c.type === "hs";
    var note = document.createElement("div");
    note.className = "snote" + (isHS ? " hs" : "");
    note.style.setProperty("--qc", (isHS ? (CONFIG.hs_color || HS_COLOR) : c.question_color) || "#9fc9ff");
    note.style.setProperty("--rot", SLOT_ROT[slotIndex % SLOT_ROT.length] + "deg");

    var liked = !!wall.liked[c.id];
    var likeBtn = '<button class="like' + (liked ? " liked" : "") + '"><span class="heart">' + (liked ? "❤" : "♡") +
      '</span><span class="n">' + (c.likes || 0) + "</span></button>";

    if (isHS) {
      note.innerHTML =
        '<span class="q-tag">💛 H&amp;S</span>' +
        '<div class="hs-amt">' + esc(money(c.amount)) + "</div>" +
        (c.extra_value ? '<div class="hs-club">' + esc(c.extra_value) + "</div>" : "") +
        '<div class="na">「' + esc(c.answer) + "」</div>" +
        '<div class="nby"><span class="nm">— ' + esc(c.display_name || "匿名") + "</span></div>" +
        likeBtn;
    } else {
      var extra = c.extra_value ? '<span class="nx">' + esc(c.extra_label ? c.extra_label + "：" : "") + esc(c.extra_value) + "</span>" : "";
      note.innerHTML =
        (CONFIG.show_question === 0 ? "" : '<span class="q-tag">' + esc(c.question_text) + "</span>") +
        '<div class="na">' + esc(c.answer) + "</div>" +
        '<div class="nby"><span class="nm">' + esc(c.display_name || "匿名") + "</span>" +
          (c.identity ? " · " + esc(c.identity) : "") + extra + "</div>" +
        likeBtn;
    }

    on(qs(".like", note), "click", function (e) { e.stopPropagation(); doLike(c, note); });
    on(note, "pointerdown", pauseBriefly);
    return note;
  }

  function doLike(c, note) {
    var btn = qs(".like", note);
    if (wall.liked[c.id]) { toast("你已經認同過囉"); return; }
    wall.liked[c.id] = true; ls("liked_ids", wall.liked);
    c.likes = (c.likes || 0) + 1;
    btn.classList.add("liked", "burst");
    qs(".heart", btn).textContent = "❤";
    qs(".n", btn).textContent = c.likes;
    setTimeout(function () { btn.classList.remove("burst"); }, 500);
    api.like(c.id).then(function (r) { if (r && r.likes != null) { c.likes = r.likes; var nn = qs(".n", btn); if (nn) nn.textContent = r.likes; } });
  }

  /* drawer */
  function drawerHTML() {
    return '<div class="drawer" id="drawer"><div class="drawer-head"><b>回應列表</b>' +
      '<button class="x" id="d-close">×</button></div><div class="drawer-list" id="d-list"></div></div>';
  }
  function toggleDrawer() {
    wall.drawerOpen = !wall.drawerOpen;
    qs("#drawer").classList.toggle("open", wall.drawerOpen);
    if (!qs("#d-close")._b) { on(qs("#d-close"), "click", toggleDrawer); qs("#d-close")._b = 1; }
  }
  function renderDrawer() {
    var list = qs("#d-list"); if (!list) return;
    list.innerHTML = wall.cards.slice().reverse().map(function (c) {
      var isHS = c.type === "hs";
      return '<button class="d-item' + (isHS ? " hs" : "") + '" data-id="' + c.id +
        '" style="--qc:' + esc(isHS ? (CONFIG.hs_color || HS_COLOR) : c.question_color) + '">' +
        '<div class="da">' + (isHS ? "💛 " + esc(money(c.amount)) + "　" : "") + esc(c.answer) + '</div>' +
        '<div class="dm"><span>' + esc(c.display_name || "匿名") +
          (isHS && c.extra_value ? " · " + esc(c.extra_value) : "") + '</span>' +
        '<span class="dl">❤ ' + (c.likes || 0) + '</span></div></button>';
    }).join("");
    qsa(".d-item", list).forEach(function (b) {
      on(b, "click", function () {
        var id = Number(b.dataset.id);
        // 立刻把這則撕貼到牆上（若還沒顯示）
        if (wall.slots.length && wall.slots.indexOf(id) === -1) {
          swapSlot(wall.nextSlot, id, true);
          wall.nextSlot = (wall.nextSlot + 1) % wall.slots.length;
        }
        toggleDrawer();
      });
    });
  }

  /* youtube 背景音樂（需使用者點擊才能播放） */
  function ytId(url) {
    if (!url) return "";
    var m = String(url).match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
    return m ? m[1] : "";
  }
  function toggleMusic() {
    var btn = qs("#w-music");
    var existing = qs("#yt-music");
    if (existing) { existing.remove(); btn.textContent = "🔈 音樂"; return; }
    var id = ytId(CONFIG.music_url); if (!id) return;
    var f = document.createElement("iframe");
    f.id = "yt-music"; f.allow = "autoplay";
    f.style.cssText = "position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px";
    f.src = "https://www.youtube.com/embed/" + id + "?autoplay=1&loop=1&playlist=" + id +
            (CONFIG.wall_music_loop === 0 ? "" : "&loop=1");
    document.body.appendChild(f); btn.textContent = "🔊 音樂中";
  }

  /* ================================================================
     文字雲 (Keyword Cloud) — 活動收尾，統計常出現的關鍵字
     用瀏覽器內建 Intl.Segmenter 做中文斷詞，純前端、免外部套件
     ================================================================ */
  var cloudSeg = null;
  // 停用詞（虛詞、代名詞、標點類），避免「的、我、很、就是」洗版
  var CLOUD_STOP = strSet(
    "的 了 和 是 我 你 妳 他 她 它 牠 我們 你們 妳們 他們 她們 這 那 這個 那個 這些 那些 這樣 那樣 " +
    "就 都 也 很 更 最 又 還 再 才 讓 把 被 給 對 從 向 於 與 及 或 而 但 卻 並 且 因 因為 所以 " +
    "如果 雖然 但是 然後 而且 之 其 者 以及 一個 一 二 三 四 五 兩 幾 什麼 甚麼 怎麼 為什麼 " +
    "可以 能 會 要 想 覺得 認為 有 沒有 不 沒 在 上 下 中 裡 外 前 後 個 們 " +
    "呢 嗎 吧 啊 喔 哦 呀 啦 耶 欸 嗯 唷 囉 一起 大家 自己 那麼 這麼 就是 還是 只是 而已 " +
    "等 等等 一直 一種 一些 每個 每一 我的 你的 妳的 他的 她的 我們的 之類 以為 這裡 那裡 " +
    "the a an and or but of to in on for with is are was were be been this that these those it its " +
    "i you he she they we my your our their as at by from not no so very just about into out up down");

  var CLOUD_PALETTE = ["#24405e", "#e76f6f", "#3f7aa8", "#d98f2b", "#5a9367", "#8a6fb0"];

  function strSet(s) { var o = Object.create(null); s.split(/\s+/).forEach(function (w) { if (w) o[w] = 1; }); return o; }
  function hashCode(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }

  function renderCloud() {
    app.innerHTML =
      '<div class="cloudpage">' +
        '<div class="cloudpage-top">' +
          '<a class="w-btn" href="#/">← 回入口</a>' +
          '<div class="cloudpage-ttl">' +
            '<div class="cloudpage-h">活動關鍵字文字雲</div>' +
            '<div class="cloudpage-stat" id="cloud-stat">統計中…</div>' +
          '</div>' +
          '<div class="grow"></div>' +
          '<button class="w-btn" id="cloud-refresh">↻ 重新統計</button>' +
          '<a class="w-btn" href="#/wall">🌌 回天幕</a>' +
        '</div>' +
        '<div class="cloudpage-body">' +
          '<div class="cloudbox" id="cloudbox"><div class="cloud-loading">正在整理關鍵字…</div></div>' +
          '<aside class="cloud-side" id="cloud-top"></aside>' +
        '</div>' +
      '</div>';
    on(qs("#cloud-refresh"), "click", buildCloud);
    buildCloud();
  }

  function buildCloud() {
    var box = qs("#cloudbox"); if (box) box.innerHTML = '<div class="cloud-loading">正在整理關鍵字…</div>';
    api.wall().then(function (d) {
      // H&S 是祝賀詞，不列入題目回答的關鍵字統計
      var cards = ((d && d.cards) || []).filter(function (c) { return c.type !== "hs"; });
      paintCloud(tallyKeywords(cards), cards.length);
    }).catch(function () { paintCloud([], 0); });
  }

  // 以「幾則回應提到」為權重（同一則內重複只算一次），比較能反映多數人的共鳴
  function tallyKeywords(cards) {
    var map = Object.create(null);
    cards.forEach(function (c) {
      var seen = Object.create(null);
      segmentText(String(c.answer || "")).forEach(function (w) {
        if (seen[w]) return; seen[w] = 1;
        map[w] = (map[w] || 0) + 1;
      });
    });
    return Object.keys(map).map(function (k) { return { w: k, n: map[k] }; })
      .sort(function (a, b) { return b.n - a.n || b.w.length - a.w.length; });
  }

  function segmentText(text) {
    if (!cloudSeg && typeof Intl !== "undefined" && Intl.Segmenter) {
      try { cloudSeg = new Intl.Segmenter("zh-Hant", { granularity: "word" }); } catch (e) { cloudSeg = null; }
    }
    var raw = [];
    if (cloudSeg) {
      var it = cloudSeg.segment(text);
      // Intl.Segmenter 的結果是可迭代物件
      Array.prototype.forEach.call(Array.from(it), function (s) { if (s.isWordLike) raw.push(s.segment); });
    } else {
      raw = fallbackSegment(text);            // 舊瀏覽器：中文取雙字詞、英文照斷
    }
    var out = [];
    raw.forEach(function (w) { var t = normToken(w); if (t) out.push(t); });
    return out;
  }

  function normToken(w) {
    w = String(w).trim();
    if (!w) return null;
    if (/^[0-9]+$/.test(w)) return null;                 // 純數字
    if (!/[\p{L}]/u.test(w)) return null;                // 純標點/符號
    var isLatin = /^[A-Za-z][A-Za-z'’]*$/.test(w);
    var key = isLatin ? w.toLowerCase() : w;
    if (isLatin && key.length < 2) return null;          // 單一英文字母不算
    if (CLOUD_STOP[key]) return null;
    return key;
  }

  function fallbackSegment(text) {
    var toks = [];
    (text.match(/[A-Za-z][A-Za-z'’]+/g) || []).forEach(function (w) { toks.push(w); });
    (text.match(/[一-鿿]+/g) || []).forEach(function (run) {
      if (run.length === 1) { toks.push(run); return; }
      for (var i = 0; i < run.length - 1; i++) toks.push(run.slice(i, i + 2));
    });
    return toks;
  }

  function paintCloud(arr, total) {
    var box = qs("#cloudbox"), stat = qs("#cloud-stat"), top = qs("#cloud-top");
    if (!box) return;
    if (!arr.length) {
      box.innerHTML = '<div class="cloud-loading">還沒有足夠的回答可以統計，等大家多寫幾則吧 ✨</div>';
      if (stat) stat.textContent = total ? "目前 " + total + " 則回應" : "還沒有回應";
      if (top) top.innerHTML = "";
      return;
    }
    var list = arr.slice(0, 60);
    var max = list[0].n, min = list[list.length - 1].n;
    var shown = list.slice().sort(function () { return Math.random() - 0.5; }); // 打散排列，看起來更像雲
    box.innerHTML = shown.map(function (item, i) {
      var t = max === min ? 1 : Math.sqrt((item.n - min) / (max - min));       // sqrt 讓大小差距不過度
      var h = hashCode(item.w);
      var color = CLOUD_PALETTE[h % CLOUD_PALETTE.length];
      var rot = (h % 7) - 3;                                                    // 固定的 -3~3 度小歪斜
      return '<span class="cw" style="--t:' + t.toFixed(3) + ';--wc:' + color + ';--rot:' + rot +
        'deg;animation-delay:' + (i * 0.03).toFixed(2) + 's" title="' + item.n + ' 則提到">' + esc(item.w) + '</span>';
    }).join("");
    if (stat) stat.textContent = "共 " + total + " 則回應，整理出 " + arr.length + " 個關鍵字";
    if (top) top.innerHTML = '<div class="cloud-top-title">熱門關鍵字 TOP ' + Math.min(8, arr.length) + '</div>' +
      '<ol class="cloud-rank">' + arr.slice(0, 8).map(function (item) {
        return '<li><span class="rw">' + esc(item.w) + '</span><span class="rn">' + item.n + '</span></li>';
      }).join("") + '</ol>';
  }

  /* ================================================================
     邀請 QR
     ================================================================ */
  function renderQR() {
    loadBootstrap().then(function () {
      var base = location.href.split("#")[0];
      var formUrl = (CONFIG.form_url && String(CONFIG.form_url)) || (base + "#/form");
      var qrSrc = "https://api.qrserver.com/v1/create-qr-code/?size=520x520&margin=12&data=" + encodeURIComponent(formUrl);
      app.innerHTML =
        '<div class="wrap stack">' +
          '<a class="backlink" href="#/">← 回入口</a>' +
          '<div class="center"><div class="brandline" style="justify-content:center">邀請朋友</div>' +
            '<h1 class="title" style="font-size:26px;margin-top:8px">一起寫下今天的回應</h1></div>' +
          '<div class="qr-box">' +
            '<img src="' + esc(qrSrc) + '" alt="QR code" />' +
            '<p style="margin-top:14px;font-weight:700">掃描 QR code，馬上填寫</p>' +
            '<p class="qr-url">' + esc(formUrl) + '</p>' +
          '</div>' +
          '<button class="btn btn-block" id="copy">📋 複製連結</button>' +
          '<a class="btn btn-gold btn-block" href="#/wall">🌌 前往天幕</a>' +
        '</div>';
      on(qs("#copy"), "click", function () {
        (navigator.clipboard ? navigator.clipboard.writeText(formUrl) : Promise.reject())
          .then(function () { toast("連結已複製"); })
          .catch(function () { toast(formUrl); });
      });
    });
  }

  /* ---------------- go ---------------- */
  route();
})();
