/* ================================================================
 *  Rotary 活動天幕 — Google Apps Script 後端 (API)
 *  資料存在同一個 Google Sheet 的三個分頁：Config / Questions / Cards
 *
 *  部署方式見 SETUP.md。重點：
 *   - 讀取用 GET（?action=...），是「簡單請求」不會觸發 CORS preflight
 *   - 寫入用 POST，body 是純文字 JSON（Content-Type: text/plain），
 *     同樣避開 preflight，所以前端可從任何網域呼叫。
 * ================================================================ */

// 第一次執行 setup() 會自動建立分頁與範例資料。
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var config = getOrCreateSheet_(ss, "Config");
  if (config.getLastRow() === 0) {
    config.getRange(1, 1, 1, 2).setValues([["key", "value"]]);
    config.getRange(2, 1, 12, 2).setValues([
      ["brand_org", "Rotaract"],
      ["brand_district", "District 3482"],
      ["brand_impact", "CREATE LASTING IMPACT"],
      ["event_stamp", "ON AIR"],
      ["brush_title", "FM348.2"],
      ["brush_tagline", "ON AIR"],
      ["event_title", "時光輪轉初心不變"],
      [
        "event_subtitle",
        "歡迎參加！在這裡寫下你的想法，一起把扶青的聲音放送出去。",
      ],
      ["wall_subtitle", "Rotaract District 3482 · 扶青放送"],
      ["like_label", "我也認同"],
      ["music_url", ""],
      ["form_url", ""], // 可留空；QR 頁會自動用目前網址
    ]);
  }

  var q = getOrCreateSheet_(ss, "Questions");
  if (q.getLastRow() === 0) {
    q.getRange(1, 1, 1, 4).setValues([["id", "text", "color", "enabled"]]);
    q.getRange(2, 1, 3, 4).setValues([
      [1, "用一句話形容你的扶青社", "#79b6d6", true],
      [2, "我的扶青初心", "#f4b942", true],
      [3, "我如何創造持恆影響力", "#86c2b5", true],
    ]);
  }

  var c = getOrCreateSheet_(ss, "Cards");
  if (c.getLastRow() === 0) {
    c.getRange(1, 1, 1, 11).setValues([
      [
        "id",
        "created_at",
        "question_id",
        "question_text",
        "question_color",
        "answer",
        "identity",
        "display_name",
        "extra_label",
        "extra_value",
        "likes",
      ],
    ]);
  }
}

// ---- HTTP handlers ------------------------------------------------

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || "wall";
  try {
    if (action === "bootstrap")
      return json_({
        ok: true,
        config: readConfig_(),
        questions: readQuestions_(),
      });
    // 預設 wall：回傳設定 + 題目 + 所有卡片
    return json_({
      ok: true,
      config: readConfig_(),
      questions: readQuestions_(),
      cards: readCards_(),
    });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  var body = {};
  try {
    body = JSON.parse(e.postData.contents);
  } catch (_) {}
  var action = body.action;
  try {
    if (action === "submit") return json_(submitCard_(body.card || {}));
    if (action === "like") return json_(likeCard_(body.id));
    return json_({ ok: false, error: "unknown action: " + action });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// ---- data reads ---------------------------------------------------

function readConfig_() {
  var rows = sheet_("Config").getDataRange().getValues();
  var out = {};
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0]) out[String(rows[i][0])] = rows[i][1];
  }
  return out;
}

function readQuestions_() {
  var rows = sheet_("Questions").getDataRange().getValues();
  var out = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (r[0] === "" || r[0] === null) continue;
    if (r[3] === false || String(r[3]).toLowerCase() === "false") continue;
    out.push({
      id: Number(r[0]),
      text: String(r[1] || ""),
      color: String(r[2] || "#9fc9ff"),
      enabled: true,
    });
  }
  return out;
}

function readCards_() {
  var rows = sheet_("Cards").getDataRange().getValues();
  var out = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (r[0] === "" || r[0] === null) continue;
    out.push({
      id: Number(r[0]),
      created_at: r[1] ? new Date(r[1]).getTime() : 0,
      question_id: Number(r[2]) || 0,
      question_text: String(r[3] || ""),
      question_color: String(r[4] || "#9fc9ff"),
      answer: String(r[5] || ""),
      identity: String(r[6] || ""),
      display_name: String(r[7] || ""),
      extra_label: String(r[8] || ""),
      extra_value: String(r[9] || ""),
      likes: Number(r[10]) || 0,
    });
  }
  return out;
}

// ---- data writes --------------------------------------------------

function submitCard_(card) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sh = sheet_("Cards");
    var id = nextId_(sh);
    var now = new Date();
    sh.appendRow([
      id,
      now,
      Number(card.question_id) || 0,
      String(card.question_text || ""),
      String(card.question_color || "#9fc9ff"),
      String(card.answer || "").slice(0, 500),
      String(card.identity || ""),
      String(card.display_name || "").slice(0, 60),
      String(card.extra_label || ""),
      String(card.extra_value || "").slice(0, 120),
      0,
    ]);
    return { ok: true, id: id, created_at: now.getTime() };
  } finally {
    lock.releaseLock();
  }
}

function likeCard_(id) {
  id = Number(id);
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sh = sheet_("Cards");
    var rows = sh.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (Number(rows[i][0]) === id) {
        var likes = (Number(rows[i][10]) || 0) + 1;
        sh.getRange(i + 1, 11).setValue(likes);
        return { ok: true, id: id, likes: likes };
      }
    }
    return { ok: false, error: "card not found" };
  } finally {
    lock.releaseLock();
  }
}

// ---- helpers ------------------------------------------------------

function nextId_(sh) {
  var last = sh.getLastRow();
  if (last < 2) return 1;
  var ids = sh.getRange(2, 1, last - 1, 1).getValues();
  var max = 0;
  for (var i = 0; i < ids.length; i++)
    max = Math.max(max, Number(ids[i][0]) || 0);
  return max + 1;
}

function sheet_(name) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sh) throw new Error("缺少分頁：" + name + "（請先執行一次 setup）");
  return sh;
}

function getOrCreateSheet_(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
