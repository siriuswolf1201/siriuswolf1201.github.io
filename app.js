/**
 * 國際扶輪 3482 地區 2026-27 年度扶青社社團介紹網站
 * 核心交互邏輯與資料庫 (app.js)
 * Slogan: WOW! 青年影響力 共創新世紀！ (YOUTH IMPACT • NEW ERA)
 */

// 1. 站台資料一律從 data/ 目錄的 JSON 檔動態載入，資料內容與顯示邏輯分開維護。
//    CLUBS_DATA / TIMELINE_DATA / DISTRICT_CABINET 在 loadSiteData() resolve 前都是空的，
//    所有會用到它們的 init 函式都必須等 loadSiteData() 完成後才能呼叫。
const CLUB_IDS = [
  "taipei-central", "taipei-east", "taipei-dadaocheng", "taipei-northsea",
  "taipei-daan", "taipei-dalongdong", "taipei-northwest", "taipei-hundredcastles",
  "taipei-harmony", "taipei-uptown", "taipei-yide", "taipei-lily",
  "taipei-yidong", "taipei-tmu", "taipei-risingsun", "taipei-gemini-ai", "taipei-just"
];

let CLUBS_DATA = [];
let TIMELINE_DATA = [];
let DISTRICT_CABINET = null;

async function loadSiteData() {
  const [clubs, district] = await Promise.all([
    Promise.all(CLUB_IDS.map(id => fetch(`data/clubs/${id}.json`).then(res => res.json()))),
    fetch("data/district.json").then(res => res.json())
  ]);
  CLUBS_DATA = clubs;
  TIMELINE_DATA = district.timeline;
  DISTRICT_CABINET = district.cabinet;
}

// 2. 媒合器測驗題目資料庫
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "在週六或週日的閒暇時光，你最嚮往哪種活動？",
    options: [
      { text: "聽一場關於 AI 科技、創業或數位轉型的工作坊", score: { tech: 3, business: 2 } },
      { text: "戴上厚手套去北海岸淨灘，或是去偏鄉陪伴孩子讀書", score: { service: 4 } },
      { text: "探訪迪化街的傳統古蹟，或是親自體驗廟宇木雕技藝", score: { culture: 4 } },
      { text: "在文青空間練習花藝、品味茶道，或是在森林裡練瑜珈", score: { fellowship: 4 } },
      { text: "參與全英文商務交流，練習英語簡報演說技巧", score: { international: 3, business: 3 } }
    ]
  },
  {
    id: 2,
    question: "如果要在社團中發揮你的「影響力」，你最想成就哪件事？",
    options: [
      { text: "利用最新的 AI 技術，免費幫傳統商家優化工作流程", score: { tech: 4 } },
      { text: "建立一個二手書屋，長期為清寒偏鄉學子提供課後輔導", score: { service: 4, campus: 2 } },
      { text: "將在地傳統老字號結合數位包裝，進行文化地方創生", score: { culture: 4, business: 1 } },
      { text: "拓展國際姐妹社網絡，爭取代表地區出國演講交流的機會", score: { international: 4 } },
      { text: "學習商務談判、高階公關簡報，為職涯和創業奠定基礎", score: { business: 4, tech: 1 } }
    ]
  },
  {
    id: 3,
    question: "你理想中的同儕社交圈，呈現出什麼樣的面貌？",
    options: [
      { text: "充滿新創企業家、電商主理人與科技狂熱者的創新團隊", score: { tech: 3, business: 2 } },
      { text: "有一群溫暖、熱心公益且默默深耕社區服務的貼心夥伴", score: { service: 4 } },
      { text: "熱愛文化歷史、古蹟走讀與傳統工藝美學的文青同好", score: { culture: 4 } },
      { text: "重視工作與生活平衡，愛好精緻美學手作的心靈知己", score: { fellowship: 4 } },
      { text: "崇尚國際視野，能用雙語自信暢談地緣政治與財經趨勢的菁英群體", score: { international: 4, business: 2 } }
    ]
  },
  {
    id: 4,
    question: "你的目前的身份或生活狀態，比較接近以下哪一項？",
    options: [
      { text: "在校大專學生或研究生，希望能將所學專業實踐於社區", score: { campus: 4, service: 1 } },
      { text: "新創公司創業者、自媒體工作者或有創業意願的青年", score: { tech: 2, business: 3 } },
      { text: "剛步入職場的社會新鮮人，希望能快速升級職場生存技能", score: { business: 4 } },
      { text: "日常工作緊湊，下班或假日極度需要美學手作或身心靈放鬆者", score: { fellowship: 4 } },
      { text: "希望能多參與跨國聯誼交流，培養全球化思維者", score: { international: 4 } }
    ]
  }
];

// 4. 初始化與事件監聽
document.addEventListener("DOMContentLoaded", async () => {
  initNavbar();

  try {
    await loadSiteData();
  } catch (err) {
    console.error("站台資料載入失敗，請確認網站是透過伺服器（而非直接開啟檔案）瀏覽：", err);
    return;
  }

  initCabinetGrid();
  initEventCarousel();
  initClubExplorer();
  initTimeline();
  initQuiz();
  initContactForm();
  initSponsors();
  initScrollAnimations();
});

// A. 導覽列優雅變色與滾動監聽
function initNavbar() {
  const header = document.querySelector(".main-header");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const navMenu = document.getElementById("nav-menu");

  // 滾動時 Header 加深毛玻璃背景
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }

    // 滾動區域啟用 active class
    let currentId = "";
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = sec.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentId}`) {
        link.classList.add("active");
      }
    });
  });

  // 手機版漢堡選單點擊
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenuBtn.classList.toggle("open");
    navMenu.classList.toggle("active");
  });

  // 點擊連結後收起手機選單
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenuBtn.classList.remove("open");
      navMenu.classList.remove("active");
    });
  });
}

// B. 動態渲染地區內閣介紹 (樹狀組織架構)
function initCabinetGrid() {
  const treeContainer = document.getElementById("cabinet-tree") || document.getElementById("cabinet-grid");
  if (!treeContainer) return;

  // 1. 樹狀層級資料改由 loadSiteData() 從 data/district.json 讀入的 DISTRICT_CABINET 提供
  const treeData = DISTRICT_CABINET;

  // 2. 清空容器並重置 Class 為樹狀排版
  treeContainer.innerHTML = "";
  treeContainer.className = "cabinet-tree";

  // 輔助函數：渲染幹部卡片 HTML (包含頭像與大頭貼優雅降級機制)
  function renderCard(officer, tierClass) {
    const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%233A5166" opacity="0.05"/><text x="50%" y="65%" font-size="50" dominant-baseline="middle" text-anchor="middle">${officer.avatar}</text></svg>`;
    const avatarHTML = `<img src="${officer.image || fallbackSvg}" alt="${officer.name}" onerror="this.onerror=null; this.src='${fallbackSvg}';">`;
    
    return `
      <div class="cabinet-card ${tierClass} fade-in-up">
        <div class="cabinet-avatar">${avatarHTML}</div>
        <div class="cabinet-role">${officer.role}</div>
        <h3 class="cabinet-name">${officer.name}</h3>
        <div class="cabinet-club">${officer.club}</div>
        <p class="cabinet-desc">${officer.desc}</p>
      </div>
    `;
  }

  // 3. 動態建構樹狀結構 HTML
  let treeHTML = `
    <!-- Tier 1: 地區代表 (DRR) -->
    <div class="cabinet-tier tier-1-wrapper">
      <div class="tier-cards-container">
        ${treeData.tier1.map(o => renderCard(o, "cabinet-drr-card")).join("")}
      </div>
    </div>
    
    <!-- 樹狀連接線 1 -->
    <div class="tree-connector-line"></div>
    
    <!-- Tier 2: 秘書/副秘書/財務與顧問 -->
    <div class="cabinet-tier-label">─── 核心行政財務暨顧問團隊 Executive Secretariat, Finance & Advisor ───</div>
    <div class="cabinet-tier tier-2-wrapper">
      <div class="tier-cards-grid grid-4">
        ${treeData.tier2.map(o => renderCard(o, "cabinet-sec-card")).join("")}
      </div>
    </div>
    
    <!-- 樹狀連接線 2 -->
    <div class="tree-connector-line"></div>
    
    <!-- Tier 3: 三位副代表 -->
    <div class="cabinet-tier-label">─── 地區副代表 Associate DRRs ───</div>
    <div class="cabinet-tier tier-3-wrapper">
      <div class="tier-cards-grid grid-3">
        ${treeData.tier3.map(o => renderCard(o, "cabinet-adrr-card")).join("")}
      </div>
    </div>

    <!-- 樹狀連接線 3 -->
    <div class="tree-connector-line"></div>

    <!-- Tier 4: 各大主委暨副主委 -->
    <div class="cabinet-tier-label">─── 委員會主委暨副主委團隊 Service Chairs & Vice Chairs ───</div>
    <div class="cabinet-tier tier-4-wrapper">
      <div class="tier-cards-grid grid-4">
        ${treeData.tier4.map(o => renderCard(o, "cabinet-chair-card")).join("")}
      </div>
    </div>
  `;

  treeContainer.innerHTML = treeHTML;
}

// C. 實作「17社團宇宙」搜尋與篩選
let currentCategory = "all";
let searchQuery = "";

function initClubExplorer() {
  const clubGrid = document.getElementById("club-grid");
  const searchInput = document.getElementById("club-search");
  const filterBtns = document.querySelectorAll(".filter-btn");

  if (!clubGrid) return;

  // 首次渲染全部社團
  renderClubs(CLUBS_DATA);

  // 篩選按鈕事件
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.getAttribute("data-filter");
      filterAndRender();
    });
  });

  // 搜尋輸入事件
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    filterAndRender();
  });

  function filterAndRender() {
    let filtered = CLUBS_DATA;

    // 類別篩選
    if (currentCategory !== "all") {
      filtered = filtered.filter(club => club.category === currentCategory);
    }

    // 關鍵字搜尋
    if (searchQuery !== "") {
      filtered = filtered.filter(club => 
        club.name.toLowerCase().includes(searchQuery) ||
        club.englishName.toLowerCase().includes(searchQuery) ||
        club.sponsor.toLowerCase().includes(searchQuery) ||
        club.tags.some(tag => tag.toLowerCase().includes(searchQuery))
      );
    }

    renderClubs(filtered);
  }

  function renderClubs(clubs) {
    clubGrid.innerHTML = "";
    if (clubs.length === 0) {
      clubGrid.innerHTML = `
        <div class="no-results">
          <p>🔍 找不到符合條件的社團，請嘗試其他關鍵字或特色類別！</p>
        </div>
      `;
      return;
    }

    clubs.forEach(club => {
      const card = document.createElement("div");
      card.className = "club-card fade-in-up";
      card.setAttribute("data-id", club.id);
      
      const tagsHTML = club.tags.map(tag => `<span class="tag">#${tag}</span>`).join("");

      card.innerHTML = `
        <div class="club-card-header">
          <span class="club-badge badge-${club.category}">${club.categoryLabel}</span>
          <span class="club-meeting-badge">📅 ${club.meetingTime.split(" ")[0]}</span>
        </div>
        <h3 class="club-card-title">${club.name}</h3>
        <p class="club-card-english">${club.englishName}</p>
        <p class="club-card-slogan">「 ${club.slogan} 」</p>
        <div class="club-card-tags">${tagsHTML}</div>
        <div class="club-card-footer">
          <span class="club-sponsor">輔導：${club.sponsor}</span>
          <button class="club-more-btn" onclick="openClubModal('${club.id}')">深入探索</button>
        </div>
      `;
      clubGrid.appendChild(card);
    });
  }
}

// D. 各社詳情 Modal 彈出與渲染
function openClubModal(clubId) {
  const modal = document.getElementById("club-modal");
  const club = CLUBS_DATA.find(c => c.id === clubId);
  if (!modal || !club) return;

  const modalBody = document.getElementById("modal-body-content");
  
  // 渲染社團幹部 HTML (共 8 個內閣職位)
  const officersHTML = club.officers.map(officer => {
    // 建立大頭貼渲染邏輯：支援 officer.image，若無圖片則使用 SVG + Emoji 進行優雅降級
    const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%233A5166" opacity="0.05"/><text x="50%" y="65%" font-size="50" dominant-baseline="middle" text-anchor="middle">${officer.avatar}</text></svg>`;
    const avatarHTML = `<img src="${officer.image || fallbackSvg}" alt="${officer.name}" onerror="this.onerror=null; this.src='${fallbackSvg}';">`;
    
    return `
      <div class="modal-officer-card">
        <div class="mo-avatar">${avatarHTML}</div>
        <div class="mo-info">
          <div class="mo-role">${officer.role}</div>
          <div class="mo-name">${officer.name}</div>
          <div class="mo-title">${officer.title}</div>
        </div>
      </div>
    `;
  }).join("");

  // 渲染年度活動 HTML
  const activitiesHTML = club.annualActivities.map(act => `
    <div class="modal-act-item">
      <div class="ma-time">${act.time}</div>
      <div class="ma-content">
        <h4 class="ma-title">${act.title}</h4>
        <p class="ma-desc">${act.desc}</p>
      </div>
    </div>
  `).join("");

  // 渲染 Tags
  const tagsHTML = club.tags.map(tag => `<span class="tag">#${tag}</span>`).join("");

  modalBody.innerHTML = `
    <div class="modal-grid">
      <!-- 左側：基本資訊與介紹 -->
      <div class="modal-col-left">
        <span class="club-badge badge-${club.category}">${club.categoryLabel}</span>
        <h2 class="modal-club-name">${club.name}</h2>
        <p class="modal-club-english">${club.englishName}</p>
        
        <blockquote class="modal-slogan">「 ${club.slogan} 」</blockquote>
        
        <h3 class="modal-section-title">社團簡介</h3>
        <p class="modal-intro-text">${club.intro}</p>
        
        <h3 class="modal-section-title">例會資訊</h3>
        <ul class="modal-info-list">
          <li><strong>📅 例會時間：</strong>${club.meetingTime}</li>
          <li><strong>📍 例會地點：</strong>${club.meetingPlace}</li>
          <li><strong>🏢 輔導扶輪社：</strong>${club.sponsor}</li>
        </ul>

        <div class="modal-tags-container">${tagsHTML}</div>

        <h3 class="modal-section-title">社群聯絡</h3>
        <div class="modal-social-links">
          <a href="${club.socialLinks.ig}" target="_blank" class="social-icon-btn ig-btn">Instagram</a>
          <a href="${club.socialLinks.fb}" target="_blank" class="social-icon-btn fb-btn">Facebook 粉絲頁</a>
          <a href="mailto:${club.socialLinks.email}" class="social-icon-btn mail-btn">電子郵件信箱</a>
        </div>
      </div>
      
      <!-- 右側：幹部與活動規劃 -->
      <div class="modal-col-right">
        <h3 class="modal-section-title">2026-27 年度八大內閣幹部</h3>
        <div class="modal-officers-grid">${officersHTML}</div>
        
        <h3 class="modal-section-title">2026-27 年度精彩活動規劃</h3>
        <div class="modal-activities-timeline">${activitiesHTML}</div>
      </div>
    </div>
  `;

  // 顯示 Modal，並鎖定背景滾動
  modal.style.display = "flex";
  document.body.classList.add("modal-open");
  setTimeout(() => {
    modal.classList.add("show");
  }, 10);
}

function closeClubModal() {
  const modal = document.getElementById("club-modal");
  if (!modal) return;
  modal.classList.remove("show");
  setTimeout(() => {
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
  }, 300);
}

// 註冊給全域以利 HTML onclick 調用
window.openClubModal = openClubModal;
window.closeClubModal = closeClubModal;

// E. 渲染地區年度重大活動時間軸
function initTimeline() {
  const timelineContainer = document.getElementById("timeline-flow");
  if (!timelineContainer) return;

  timelineContainer.innerHTML = "";
  TIMELINE_DATA.forEach((item, index) => {
    const isLeft = index % 2 === 0;
    const timelineItem = document.createElement("div");
    timelineItem.className = `timeline-item ${isLeft ? "timeline-left" : "timeline-right"} fade-in-up`;
    
    timelineItem.innerHTML = `
      <div class="timeline-date">${item.month}</div>
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <span class="timeline-type timeline-type-${item.type}">${item.typeLabel}</span>
        <h3 class="timeline-title">${item.title}</h3>
        <p class="timeline-desc">${item.desc}</p>
      </div>
    `;
    timelineContainer.appendChild(timelineItem);
  });
}

// F. 扶青社員媒合器 (Rotaract Matcher) 趣味問答邏輯
let currentQuestionIndex = 0;
const userQuizScores = {
  business: 0,
  international: 0,
  culture: 0,
  service: 0,
  tech: 0,
  fellowship: 0,
  campus: 0
};

function initQuiz() {
  const startBtn = document.getElementById("start-quiz-btn");
  const quizIntro = document.getElementById("quiz-intro-pane");
  const quizForm = document.getElementById("quiz-form-pane");
  const quizResults = document.getElementById("quiz-results-pane");
  const questionTitle = document.getElementById("quiz-question-title");
  const optionsBox = document.getElementById("quiz-options");
  const progressText = document.getElementById("quiz-progress-text");
  const progressBarFill = document.getElementById("quiz-progress-fill");

  if (!startBtn) return;

  // 開始測驗
  startBtn.addEventListener("click", () => {
    quizIntro.classList.add("hidden");
    quizForm.classList.remove("hidden");
    currentQuestionIndex = 0;
    // 重設分數
    for (let key in userQuizScores) userQuizScores[key] = 0;
    showQuestion();
  });

  function showQuestion() {
    const q = QUIZ_QUESTIONS[currentQuestionIndex];
    questionTitle.textContent = `${q.id}. ${q.question}`;
    
    // 更新進度條
    const progressPercent = ((currentQuestionIndex) / QUIZ_QUESTIONS.length) * 100;
    progressBarFill.style.width = `${progressPercent}%`;
    progressText.textContent = `問答進度：${currentQuestionIndex + 1} / ${QUIZ_QUESTIONS.length}`;

    // 渲染選項
    optionsBox.innerHTML = "";
    q.options.forEach((opt, idx) => {
      const button = document.createElement("button");
      button.className = "quiz-opt-btn";
      button.innerHTML = `
        <span class="opt-num">${String.fromCharCode(65 + idx)}</span>
        <span class="opt-text">${opt.text}</span>
      `;
      button.addEventListener("click", () => handleOptionSelect(opt.score));
      optionsBox.appendChild(button);
    });
  }

  function handleOptionSelect(score) {
    // 累計分數
    for (let key in score) {
      if (userQuizScores[key] !== undefined) {
        userQuizScores[key] += score[key];
      }
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < QUIZ_QUESTIONS.length) {
      // 播放平滑切換動畫
      optionsBox.classList.add("slide-out");
      setTimeout(() => {
        showQuestion();
        optionsBox.classList.remove("slide-out");
      }, 250);
    } else {
      // 測驗結束，顯示推薦社團
      progressBarFill.style.width = "100%";
      progressText.textContent = "分析完成！";
      calculateResults();
    }
  }

  function calculateResults() {
    quizForm.classList.add("hidden");
    quizResults.classList.remove("hidden");

    // 尋找最高分的類別
    let maxScore = -1;
    let primaryCategory = "service";
    
    for (let cat in userQuizScores) {
      if (userQuizScores[cat] > maxScore) {
        maxScore = userQuizScores[cat];
        primaryCategory = cat;
      }
    }

    // 地區特色標籤對應與推薦算法
    // 取得該類別下的所有社團
    let matches = CLUBS_DATA.filter(club => club.category === primaryCategory);
    
    // 如果推薦社團不足 3 個，從其他與用戶有得分的類別補齊
    if (matches.length < 3) {
      // 依得分高低排序其他類別
      const sortedCats = Object.keys(userQuizScores)
        .filter(c => c !== primaryCategory)
        .sort((a, b) => userQuizScores[b] - userQuizScores[a]);

      for (let extraCat of sortedCats) {
        if (matches.length >= 3) break;
        const extraClubs = CLUBS_DATA.filter(club => club.category === extraCat);
        matches = [...matches, ...extraClubs];
      }
    }

    // 去除重複，並只取前 3 名
    matches = [...new Set(matches)].slice(0, 3);

    // 渲染推薦卡片
    const matchGrid = document.getElementById("match-results-grid");
    matchGrid.innerHTML = "";

    matches.forEach((club, index) => {
      const matchCard = document.createElement("div");
      matchCard.className = `match-card match-rank-${index + 1} fade-in-up`;
      
      const badgeText = index === 0 ? "🏆 最契合推薦" : `星級推薦 ${index + 1}`;

      matchCard.innerHTML = `
        <div class="match-rank-badge">${badgeText}</div>
        <h3 class="match-card-title">${club.name}</h3>
        <p class="match-card-slogan">「 ${club.slogan} 」</p>
        <ul class="match-info">
          <li>📅 ${club.meetingTime}</li>
          <li>📍 ${club.meetingPlace.split(" ")[0]}</li>
          <li>🎯 特色：${club.categoryLabel}</li>
        </ul>
        <button class="match-action-btn" onclick="openClubModal('${club.id}')">查看詳細社介紹 & 聯絡方式</button>
      `;
      matchGrid.appendChild(matchCard);
    });

    // 重新測驗按鈕
    const retakeBtn = document.getElementById("retake-quiz-btn");
    retakeBtn.onclick = () => {
      quizResults.classList.add("hidden");
      quizIntro.classList.remove("hidden");
    };
  }
}

// G. 諮詢意願表單提交驗證

// 官網諮詢表單 -> Google 表單 (https://forms.gle/mBFya8zAHj4b13Sm7) 的對接設定
const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSel-xOOxTm2wtWrlA5ltWg2AL_Wy6zJM2VJNSPSJtFfpgvAdQ/formResponse";
const GOOGLE_FORM_ENTRY_IDS = {
  name: "entry.454029254",
  phone: "entry.1939506800",
  email: "entry.131539977",
  club: "entry.498700543",
  message: "entry.2012810118"
};
// Google 表單下拉選單的選項文字與官網 CLUBS_DATA 的社名並不完全一致（例如官網「台北圓滿社」對應表單「8 圓環扶青社」），
// 這裡對照官網 club.name 轉換成表單能辨識的選項文字，確保諮詢意願能正確歸類到該社。
const CLUB_NAME_TO_GOOGLE_FORM_OPTION = {
  "台北城中社": "3 城中扶青社",
  "台北城東社": "4 城東扶青社",
  "台北大稻埕社": "6 大稻埕扶青社",
  "台北北海社": "7 北海扶青社",
  "台北大安社": "9 大安扶青社",
  "台北大龍峒社": "10 大龍峒扶青社",
  "台北西北區社": "11 西北區扶青社",
  "台北百城社": "12 百城扶青社",
  "台北圓滿社": "8 圓環扶青社",
  "台北上城社": "17 上城扶青社",
  "台北邑德社": "19 邑德扶青社",
  "台北百合社": "20 百合扶青社",
  "台北怡東社": "21 怡東扶青社",
  "台北城中北醫大社": "22 城中北醫大扶青社",
  "台北旭日社": "23 旭日扶青社",
  "台北雙子星AI社": "24 雙子星AI扶青社",
  "台北景文科大社": "25 景文科大扶青社"
};

function initContactForm() {
  const form = document.getElementById("contact-form");
  const successModal = document.getElementById("success-popup");
  const closeSuccessBtn = document.getElementById("close-success-btn");

  if (!form) return;

  // 動態載入社團選項到下拉選單
  const selectClub = document.getElementById("form-club");
  if (selectClub) {
    CLUBS_DATA.forEach(club => {
      const opt = document.createElement("option");
      opt.value = club.name;
      opt.textContent = club.name;
      selectClub.appendChild(opt);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // 基本驗證
    const name = document.getElementById("form-name").value.trim();
    const phone = document.getElementById("form-phone").value.trim();
    const email = document.getElementById("form-email").value.trim();
    const clubSelected = document.getElementById("form-club").value;
    const message = document.getElementById("form-message").value.trim();

    if (!name || !phone || !email) {
      alert("⚠️ 請完整填寫姓名、電話與電子郵件欄位，感謝您的配合！");
      return;
    }

    const submitBtn = form.querySelector(".form-btn-submit");
    if (submitBtn) submitBtn.disabled = true;

    const params = new URLSearchParams();
    params.append(GOOGLE_FORM_ENTRY_IDS.name, name);
    params.append(GOOGLE_FORM_ENTRY_IDS.phone, phone);
    params.append(GOOGLE_FORM_ENTRY_IDS.email, email);
    params.append(GOOGLE_FORM_ENTRY_IDS.club, CLUB_NAME_TO_GOOGLE_FORM_OPTION[clubSelected] || clubSelected);
    params.append(GOOGLE_FORM_ENTRY_IDS.message, message);

    // Google 表單的 formResponse 端點不支援 CORS，用 no-cors 送出即可，
    // 瀏覽器無法讀取回應內容，所以這裡樂觀地把「沒有網路錯誤」當成功，
    // 實際是否有正確寫入回覆試算表，需要另外到 Google 表單後台確認。
    fetch(GOOGLE_FORM_ACTION_URL, {
      method: "POST",
      mode: "no-cors",
      body: params
    })
      .then(() => {
        // 顯示表單提交成功模組，並動態寫入稱呼
        const successMsg = document.getElementById("success-popup-message");
        successMsg.innerHTML = `
          親愛的 <strong>${name}</strong> 您好：<br>
          我們已成功收到您想加入<strong>「${clubSelected}」</strong>的意願申請！<br><br>
          地區團隊與該社秘書長將在 3 個工作天內，以電子郵件 (<strong>${email}</strong>) 或電話與您取得聯繫，並邀請您參與最近一次的精彩例會活動！<br><br>
          讓我們在 2026-27 年度一起：<br>
          <strong>「WOW! 青年影響力 共創新世紀！」</strong>
        `;

        successModal.style.display = "flex";
        setTimeout(() => {
          successModal.classList.add("show");
        }, 10);

        form.reset();
      })
      .catch(() => {
        alert("⚠️ 提交時發生網路問題，請確認網路連線後再試一次。若持續發生，歡迎直接與我們聯繫。");
      })
      .finally(() => {
        if (submitBtn) submitBtn.disabled = false;
      });
  });

  // 關閉成功 Popup
  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener("click", () => {
      successModal.classList.remove("show");
      setTimeout(() => {
        successModal.style.display = "none";
      }, 300);
    });
  }
}

// H. 滾動動畫觸發器
function initScrollAnimations() {
  const faders = document.querySelectorAll(".fade-in-up");

  const appearOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver((entries, appearOnScroll) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      appearOnScroll.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });
}

// I. 實作年度精彩活動輪播 Event Carousel
function initEventCarousel() {
  const slides = document.querySelectorAll(".carousel-slide");
  const indicators = document.querySelectorAll(".indicator");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  const progressBar = document.getElementById("carousel-progress-bar");
  const carouselContainer = document.getElementById("event-carousel");

  if (!slides.length || !carouselContainer) return;

  let currentSlide = 0;
  const slideInterval = 5000; // 5 秒輪播一次
  let slideTimer = null;
  let progressTimer = null;
  let progress = 0;

  // 切換至指定投影片
  function goToSlide(index) {
    // 移除目前 active 狀態
    slides[currentSlide].classList.remove("active");
    indicators[currentSlide].classList.remove("active");

    // 設定新 active 狀態
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
    indicators[currentSlide].classList.add("active");

    // 重設進度條
    resetProgress();
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  // 進度條與定時器邏輯
  function startTimers() {
    // 主定時器
    slideTimer = setInterval(nextSlide, slideInterval);

    // 進度條更新 (每 50 毫秒更新一次，保證極度流暢)
    const updateSpeed = 50;
    const increment = (updateSpeed / slideInterval) * 100;
    progressTimer = setInterval(() => {
      progress += increment;
      if (progress >= 100) {
        progress = 100;
      }
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
    }, updateSpeed);
  }

  function stopTimers() {
    clearInterval(slideTimer);
    clearInterval(progressTimer);
  }

  function resetProgress() {
    progress = 0;
    if (progressBar) {
      progressBar.style.width = "0%";
    }
    stopTimers();
    startTimers();
  }

  // 註冊按鈕事件
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);
  if (nextBtn) nextBtn.addEventListener("click", nextSlide);

  // 註冊指示點點擊事件
  indicators.forEach((indicator, idx) => {
    indicator.addEventListener("click", () => {
      goToSlide(idx);
    });
  });

  // 懸停時暫停輪播與進度條，移開後恢復
  carouselContainer.addEventListener("mouseenter", stopTimers);
  carouselContainer.addEventListener("mouseleave", startTimers);

  // 初始啟動
  startTimers();
}

// H. 支持夥伴與贊助母社動態渲染 (Tiered Sponsors & Partners)
function initSponsors() {
  const sponsorsGridClubs = document.getElementById("sponsors-grid-clubs");
  if (!sponsorsGridClubs) return;

  // 從 17 社資料庫動態擷取所有不重複的輔導扶輪社 (Sponsoring Rotary Clubs)
  const sponsorClubsSet = new Set();
  CLUBS_DATA.forEach(club => {
    if (club.sponsor) {
      sponsorClubsSet.add(club.sponsor);
    }
  });

  const sponsorClubsList = Array.from(sponsorClubsSet).sort((a, b) => a.localeCompare(b, "zh-Hant-TW"));

  // 渲染輔導社卡片
  sponsorsGridClubs.innerHTML = sponsorClubsList.map(sponsorName => {
    // 找出輔導了哪些扶青社 (作為副標題說明)
    const guidedClubs = CLUBS_DATA.filter(club => club.sponsor === sponsorName).map(club => club.name.replace("扶青社", ""));
    const guidedClubsText = guidedClubs.join("、") + " 扶青社";

    return `
      <div class="club-sponsor-card fade-in-up">
        <div class="club-sponsor-icon">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="4"/>
            <path d="M50,15 L50,85 M15,50 L85,50 M25,25 L75,75 M25,75 L75,25" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
            <circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" stroke-width="3"/>
            <path d="M50,10 C27.9,10 10,27.9 10,50 C10,72.1 27.9,90 50,90 C72.1,90 90,72.1 90,50 C90,27.9 72.1,10 50,10 Z M50,18 C67.7,18 82,32.3 82,50 C82,67.7 67.7,82 50,82 C32.3,82 18,67.7 18,50 C18,32.3 32.3,18 50,18 Z" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
          </svg>
        </div>
        <div class="club-sponsor-info">
          <h4 class="club-sponsor-name">${sponsorName}</h4>
          <p class="club-sponsor-relation">輔導社 • ${guidedClubsText}</p>
        </div>
      </div>
    `;
  }).join("");
}
