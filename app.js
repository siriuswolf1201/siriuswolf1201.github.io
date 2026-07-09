/**
 * 國際扶輪 3482 地區 2026-27 年度扶青社社團介紹網站
 * 核心交互邏輯與資料庫 (app.js)
 * Slogan: WOW! 青年影響力 共創新世紀！ (YOUTH IMPACT • NEW ERA)
 */

// 1. 17 個扶青社的完整資料庫 (每個分社皆配置完整的 8 位核心內閣幹部)
const CLUBS_DATA = [
  {
    id: "taipei-central",
    name: "台北城中社",
    englishName: "Rotaract Club of Taipei Central",
    sponsor: "台北城中扶輪社",
    meetingTime: "每雙週六 14:00 - 16:30",
    meetingPlace: "台北市中正區徐州路2號 (地區會所 / 輔導社例會所)",
    category: "business",
    categoryLabel: "學術商務",
    tags: ["職業發展", "商務實戰", "簡報演說", "業界對接"],
    slogan: "城懷大志，中流砥柱！創造持恆商務影響力。",
    intro: "台北城中扶青社是地區最具代表性的商務與職業發展特色社團之一。我們致力於為青年提供商業趨勢論壇、公開演說培訓及跨界資源對接，引導團員在服務中探索職業方向，為職涯鋪路。",
    officers: [
      { role: "社長 President", name: "陳宇軒", title: "科技業專案經理", avatar: "👨‍💻" },
      { role: "秘書 Secretary", name: "林妤庭", title: "外商行銷專員", avatar: "👩‍💼" },
      { role: "財務 Treasurer", name: "黃子豪", title: "會計師事務所審計員", avatar: "📊" },
      { role: "輔導顧問 Advisor", name: "徐國豪", title: "前社長 / 生技公司創辦人", avatar: "👨‍💼" },
      { role: "社務主委 Club Service", name: "周智傑", title: "資訊工程師", avatar: "💻" },
      { role: "社服主委 Community Service", name: "謝欣妤", title: "活動企劃專員", avatar: "❤️" },
      { role: "職業主委 Vocational", name: "梁哲瑋", title: "新創產品經理", avatar: "🚀" },
      { role: "國際(公關)主委 Int. & PR", name: "蔡雅雯", title: "品牌公關顧問", avatar: "📢" }
    ],
    annualActivities: [
      { time: "08月", title: "年度青年商業與創業論壇", desc: "邀請知名企業創辦人與新創導師，分享商業實戰經驗。" },
      { time: "11月", title: "跨業模擬商務談判競賽", desc: "模擬跨國商務合作談判，鍛鍊溝通與談判能力。" },
      { time: "02月", title: "輔導社社友企業實地參訪", desc: "走訪前輩企業，汲取經營管理心法與兩代對談。" },
      { time: "04月", title: "卓越職業力提昇工作坊", desc: "履歷面試模擬與高階商務簡報力培訓。" }
    ],
    socialLinks: { ig: "https://instagram.com", fb: "https://facebook.com", email: "central@rid3482.org" }
  },
  {
    id: "taipei-east",
    name: "台北城東社",
    englishName: "Rotaract Club of Taipei East",
    sponsor: "台北城東扶輪社",
    meetingTime: "每雙週日 10:00 - 12:30",
    meetingPlace: "台北市大安區和平東路一段 (城東藝文空間)",
    category: "international",
    categoryLabel: "國際多元",
    tags: ["國際交流", "英語口說", "跨國友誼", "多元包容"],
    slogan: "城東視界，連結國際！展現新世代國際影響力。",
    intro: "台北城東扶青社以國際視野與多元包容為核心精神。定期舉辦全英文例會與跨國文化沙龍，並與多個海外姊妹團體保持緊密合作，為青年打造一個無需出國就能對接國際的優質社交平台。",
    officers: [
      { role: "社長 President", name: "張志豪", title: "跨國貿易專員", avatar: "🌍" },
      { role: "秘書 Secretary", name: "陳冠廷", title: "英語口譯師", avatar: "🗣️" },
      { role: "財務 Treasurer", name: "廖珮珊", title: "外商採購經理", avatar: "💳" },
      { role: "輔導顧問 Advisor", name: "簡東賢", title: "前社長 / 貿易公司副總", avatar: "👨‍💼" },
      { role: "社務主委 Club Service", name: "游淑敏", title: "人資管理師", avatar: "👥" },
      { role: "社服主委 Community Service", name: "洪家明", title: "NGO 專案幹事", avatar: "🌱" },
      { role: "職業主委 Vocational", name: "吳佩儒", title: "外商獵頭顧問", avatar: "💼" },
      { role: "國際(公關)主委 Int. & PR", name: "羅子恩", title: "英語文案撰寫師", avatar: "📝" }
    ],
    annualActivities: [
      { time: "09月", title: "國際文化美食嘉年華", desc: "邀請在台外籍青年與團員共同交流各國文化與美食。" },
      { time: "12月", title: "姐妹社跨國線上聯合例會", desc: "與日本、韓國姐妹社互動，探討全球青年社會責任。" },
      { time: "03月", title: "亞太青年國際大使選拔", desc: "提供團員前往海外參與扶青國際論壇的全額贊助機會。" },
      { time: "05月", title: "英語簡報力與演講大賽", desc: "提升全英文商務簡報技巧與國際談判表達。" }
    ],
    socialLinks: { ig: "https://instagram.com", fb: "https://facebook.com", email: "east@rid3482.org" }
  },
  {
    id: "taipei-dadaocheng",
    name: "台北大稻埕社",
    englishName: "Rotaract Club of Taipei Dadaocheng",
    sponsor: "台北大稻埕扶輪社",
    meetingTime: "每雙週六 10:00 - 12:30",
    meetingPlace: "台北市大同區迪化街一段 (大稻埕歷史街區埕樂軒)",
    category: "culture",
    categoryLabel: "在地文化",
    tags: ["在地文化", "地方創生", "古蹟活化", "休閒聯誼"],
    slogan: "埕現經典，創藝無限！讓在地文化發揮持恆影響。",
    intro: "根植於大稻埕深厚的歷史底蘊，台北大稻埕扶青社將傳統文化與現代創意完美融合。我們致力於地方創生、古蹟活化推廣以及迪化街商圈導覽服務，以創新的青年視角為老街區注入源源不絕的活力。",
    officers: [
      { role: "社長 President", name: "葉致遠", title: "文創品牌共同創辦人", avatar: "🏺" },
      { role: "秘書 Secretary", name: "劉子瑄", title: "歷史文博研究員", avatar: "📜" },
      { role: "財務 Treasurer", name: "施柏毅", title: "室內設計師", avatar: "📐" },
      { role: "輔導顧問 Advisor", name: "莊朝敏", title: "迪化街茶行傳承人", avatar: "🍵" },
      { role: "社務主委 Club Service", name: "方怡婷", title: "社群行銷規劃師", avatar: "📱" },
      { role: "社服主委 Community Service", name: "曾建宇", title: "社區營造工作者", avatar: "🏡" },
      { role: "職業主委 Vocational", name: "薛宇凱", title: "獨立策展人", avatar: "🖼️" },
      { role: "國際(公關)主委 Int. & PR", name: "吳欣倫", title: "旅遊部落客 / 網紅", avatar: "📸" }
    ],
    annualActivities: [
      { time: "08月", title: "大稻埕文化創藝節", desc: "在迪化街舉辦復古市集、古蹟導覽與文創產品發表。" },
      { time: "10月", title: "老字號店家數位轉型計畫", desc: "協助大稻埕傳統南北貨及茶行建立社群品牌與行銷策略。" },
      { time: "01月", title: "迪化街年貨大街暖心導覽", desc: "提供市民與外國遊客深度年俗與歷史建物導覽。" },
      { time: "04月", title: "茶藝美學與香道體驗工作坊", desc: "邀請大稻埕茶師親自授課，體驗茶香文化精髓。" }
    ],
    socialLinks: { ig: "https://instagram.com", fb: "https://facebook.com", email: "dadaocheng@rid3482.org" }
  },
  {
    id: "taipei-northsea",
    name: "台北北海社",
    englishName: "Rotaract Club of Taipei North Sea",
    sponsor: "台北北海扶輪社",
    meetingTime: "每雙週日 14:00 - 16:30",
    meetingPlace: "台北市中正區忠孝西路一段 (天成商業大樓)",
    category: "service",
    categoryLabel: "社會服務",
    tags: ["環境保護", "海洋生態", "無塑生活", "環保科技"],
    slogan: "愛護海洋，北海最行！共創蔚藍新世紀。",
    intro: "台北北海扶青社是一個高度專注於海洋生態保育與環境永續發展的行動派社團。我們秉持「用行動代替口號」的信念，長年深耕北海岸海洋淨灘、無塑生活推廣，並結合環保知識教育，共創永續家園。",
    officers: [
      { role: "社長 President", name: "王俊傑", title: "ESG 永續規劃師", avatar: "🌱" },
      { role: "秘書 Secretary", name: "蔡依珊", title: "環境科學研究助理", avatar: "🧪" },
      { role: "財務 Treasurer", name: "徐浩軒", title: "綠能科技工程師", avatar: "⚡" },
      { role: "輔導顧問 Advisor", name: "吳正雄", title: "環保設備廠總經理", avatar: "🏭" },
      { role: "社務主委 Club Service", name: "許哲銘", title: "硬體工程師", avatar: "🔧" },
      { role: "社服主委 Community Service", name: "梁凱特", title: "荒野保護協會志工", avatar: "☘️" },
      { role: "職業主委 Vocational", name: "詹明峰", title: "專利代理人", avatar: "⚖️" },
      { role: "國際(公關)主委 Int. & PR", name: "鄧佩蓉", title: "永續科技公關經理", avatar: "🌍" }
    ],
    annualActivities: [
      { time: "07月", title: "北海岸夏日大型聯合淨灘", desc: "號召地區上百名青年深入海岸，清理海洋廢棄物並進行垃圾分類監測。" },
      { time: "10月", title: "減塑生活挑戰與低碳講座", desc: "推廣無塑飲食概念，邀請環保意見領袖舉辦座談。" },
      { time: "03月", title: "小學生海洋保育推廣營隊", desc: "前往沿海偏鄉小學舉辦海洋知識科普與手作體驗。" },
      { time: "05月", title: "綠色永續綠生活市集", desc: "與環保品牌合作，舉辦低碳商品與蔬食體驗推廣活動。" }
    ],
    socialLinks: { ig: "https://instagram.com", fb: "https://facebook.com", email: "northsea@rid3482.org" }
  },
  {
    id: "taipei-daan",
    name: "台北大安社",
    englishName: "Rotaract Club of Taipei Da-An",
    sponsor: "台北大安扶輪社",
    meetingTime: "每雙週六 19:00 - 21:30",
    meetingPlace: "台北市大安區忠孝東路四段 (大安青年活動中心)",
    category: "service",
    categoryLabel: "社會服務",
    tags: ["偏鄉教育", "弱勢關懷", "陪伴計畫", "慈善公益"],
    slogan: "大愛無疆，安居樂業！深耕社區弱勢關懷。",
    intro: "台北大安扶青社長期關注偏鄉教育與社區弱勢族群。透過長期穩定的「小太陽陪伴計畫」，為弱勢家庭孩童提供課後輔導、科普教育與探索成長營，用愛與耐心陪伴孩子跨越障礙，創造溫暖改變。",
    officers: [
      { role: "社長 President", name: "林志明", title: "社工師", avatar: "❤️" },
      { role: "秘書 Secretary", name: "許家瑜", title: "兒童心理輔導師", avatar: "🧸" },
      { role: "財務 Treasurer", name: "高偉哲", title: "非營利組織專案主任", avatar: "💰" },
      { role: "輔導顧問 Advisor", name: "陳志強", title: "前社長 / 特殊教育學校校長", avatar: "👨‍🏫" },
      { role: "社務主委 Club Service", name: "黃郁雯", title: "活動企劃經理", avatar: "🎉" },
      { role: "社服主委 Community Service", name: "楊智超", title: "職能治療師", avatar: "👨‍⚕️" },
      { role: "職業主委 Vocational", name: "董佳玲", title: "職涯發展諮詢師", avatar: "💼" },
      { role: "國際(公關)主委 Int. & PR", name: "江宜庭", title: "社群品牌視覺設計師", avatar: "🎨" }
    ],
    annualActivities: [
      { time: "08月", title: "大安小太陽山林探索夏令營", desc: "帶領弱勢學童走出城市，進行三天兩夜的生態與自我挑戰探索。" },
      { time: "11月", title: "銀髮與幼童代間聯合彩繪牆", desc: "結合社區長輩與學童，共同彩繪社區老舊牆面，活化社區。" },
      { time: "01月", title: "歲末暖心義賣與送暖活動", desc: "籌集社會資源，為獨居長者與清寒家庭配送禦寒物資。" },
      { time: "04月", title: "偏鄉小學書庫與圖書室重建", desc: "募集二手優質童書，前往偏鄉學校協助建立專屬閱讀角。" }
    ],
    socialLinks: { ig: "https://instagram.com", fb: "https://facebook.com", email: "daan@rid3482.org" }
  },
  {
    id: "taipei-dalongdong",
    name: "台北大龍峒社",
    englishName: "Rotaract Club of Taipei Dalongdong",
    sponsor: "台北大龍峒扶輪社",
    meetingTime: "每雙週日 14:00 - 16:30",
    meetingPlace: "台北市大同區哈密街 (大龍峒保安宮藝文教室)",
    category: "culture",
    categoryLabel: "在地文化",
    tags: ["文資保存", "傳統技藝", "社區走讀", "民俗文化"],
    slogan: "大龍騰飛，峒心協力！活化傳統民俗生命力。",
    intro: "以古老歷史街區大龍峒為基地，台北大龍峒扶青社深耕於傳統建築藝術、廟宇民俗與傳統手工藝的推廣。我們與大龍峒保安宮、台北孔廟等單位密切合作，策劃走讀與技藝工作坊，將文化資產轉化為青年的時尚新語言。",
    officers: [
      { role: "社長 President", name: "李博文", title: "古蹟修復助理規劃師", avatar: "🏯" },
      { role: "秘書 Secretary", name: "吳庭妤", title: "文化導覽解說員", avatar: "🎤" },
      { role: "財務 Treasurer", name: "謝佳霖", title: "傳統工藝研究家", avatar: "🎨" },
      { role: "輔導顧問 Advisor", name: "張大同", title: "文資學者 / 大同區史專家", avatar: "👨‍🏫" },
      { role: "社務主委 Club Service", name: "林士傑", title: "餐飲服務經理", avatar: "☕" },
      { role: "社服主委 Community Service", name: "黃詩婷", title: "藝術治療師", avatar: "🧸" },
      { role: "職業主委 Vocational", name: "陳俊安", title: "建築設計師", avatar: "📐" },
      { role: "國際(公關)主委 Int. & PR", name: "盧筱晴", title: "文化局專案執行長", avatar: "📰" }
    ],
    annualActivities: [
      { time: "09月", title: "孔廟釋奠典禮青年走讀會", desc: "引導青年深入體驗教師節孔廟八佾舞與祭孔大典的歷史意涵。" },
      { time: "11月", title: "保生文化祭民俗體驗工作坊", desc: "辦理剪紙、掌中戲、傳統捏麵人等傳統技藝教學與體驗。" },
      { time: "02月", title: "元宵大龍峒尋寶解謎走讀", desc: "以實境解謎方式引導大眾探訪古街古廟，推動寓教於樂的觀光。" },
      { time: "05月", title: "傳統木雕與漆藝美學講座", desc: "邀請國家級工藝大師，親自分享古建修復與藝術創作經驗。" }
    ],
    socialLinks: { ig: "https://instagram.com", fb: "https://facebook.com", email: "dalongdong@rid3482.org" }
  },
  {
    id: "taipei-northwest",
    name: "台北西北區社",
    englishName: "Rotaract Club of Taipei Northwest",
    sponsor: "台北西北區扶輪社",
    meetingTime: "每雙週防 14:00 - 16:30",
    meetingPlace: "台北市中山區南京東路二段 (輔導社例會所)",
    category: "business",
    categoryLabel: "學術商務",
    tags: ["職涯探索", "職場實力", "商務引薦", "技能培訓"],
    slogan: "西北領航，職引未來！共創專業發展影響力。",
    intro: "台北西北區扶青社是青年的「職涯加速器」。我們重點培育團員的職場硬實力與軟實力，包含 AI 辦公工具應用、專案管理、簡報演說以及跨業人脈引薦，幫助剛踏入社會的青年快速適應並在職場上脫穎而出。",
    officers: [
      { role: "社長 President", name: "周子修", title: "外商獵頭顧問", avatar: "👔" },
      { role: "秘書 Secretary", name: "楊采婕", title: "UI/UX 設計師", avatar: "🎨" },
      { role: "財務 Treasurer", name: "張皓倫", title: "金融投資分析師", avatar: "📈" },
      { role: "輔導顧問 Advisor", name: "潘俊良", title: "前社長 / 外商科技亞太總監", avatar: "👨‍💻" },
      { role: "社務主委 Club Service", name: "郭家豪", title: "前端工程師", avatar: "💻" },
      { role: "社服主委 Community Service", name: "戴郁軒", title: "偏鄉教育志工領隊", avatar: "🏫" },
      { role: "職業主委 Vocational", name: "鄭宇傑", title: "外商產品經理 (PM)", avatar: "🚀" },
      { role: "國際(公關)主委 Int. & PR", name: "蘇筠媛", title: "商務英語培訓講師", avatar: "🗣️" }
    ],
    annualActivities: [
      { time: "08月", title: "青年模擬面試與履歷健檢大會", desc: "邀請高階經理人與 HR 主管，提供一對一深度履歷指導與模擬面試。" },
      { time: "11月", title: "高效專案管理與數位工具實戰", desc: "精實培訓專案管理邏輯，並分享 Notion、Slack 等高效工具系統架構。" },
      { time: "01月", title: "西北青年跨業人才媒合沙龍", desc: "創造各行各業青年深度交流的平台，探尋潛在合作機會。" },
      { time: "04月", title: "職場高EQ與商務談判技能課", desc: "掌握高難度溝通技巧，提升危機處理與商務談判優勢。" }
    ],
    socialLinks: { ig: "https://instagram.com", fb: "https://facebook.com", email: "northwest@rid3482.org" }
  },
  {
    id: "taipei-hundredcastles",
    name: "台北百城社",
    englishName: "Rotaract Club of Taipei Hundred Castles",
    sponsor: "台北百城扶輪社",
    meetingTime: "每雙週日 14:00 - 16:30",
    meetingPlace: "台北市信義區基隆路一段 (百城新創基地)",
    category: "tech",
    categoryLabel: "新創科技",
    tags: ["青年創業", "新創沙龍", "創投媒合", "商業模式"],
    slogan: "百城聚力，築夢新創！引領青年創業新世代。",
    intro: "台北百城扶青社是青年創業家的搖籃。我們聚集了許多新創公司創辦人、自媒體工作者以及有志創業的青年，透過商業模式分析、創業資源對接、品牌行銷實戰以及創投沙龍，將好的點子落地生根，共築事業新城堡。",
    officers: [
      { role: "社長 President", name: "柯宗達", title: "電商科技公司創辦人", avatar: "🚀" },
      { role: "秘書 Secretary", name: "簡嘉宏", title: "募資顧問平台總監", avatar: "💼" },
      { role: "財務 Treasurer", name: "游雅婷", title: "新創財務分析師", avatar: "📊" },
      { role: "輔導顧問 Advisor", name: "孫建平", title: "天使投資人 / 創投合夥人", avatar: "💸" },
      { role: "社務主委 Club Service", name: "廖元智", title: "自媒體運營總監", avatar: "📱" },
      { role: "社服主委 Community Service", name: "曾韋捷", title: "綠能社企發起人", avatar: "🌱" },
      { role: "職業主委 Vocational", name: "傅怡樺", title: "品牌策略總監", avatar: "🎪" },
      { role: "國際(公關)主委 Int. & PR", name: "邱宇萱", title: "群眾募資專案主任", avatar: "📢" }
    ],
    annualActivities: [
      { time: "09月", title: "百城青年新創路演與Demo Day", desc: "提供創業青年向輔導社企業家及專業創投人展示商業計畫的機會。" },
      { time: "12月", title: "品牌自媒體與數位行銷實戰營", desc: "邀請頂尖行銷人傳授社群行銷、SEO 佈局與個人品牌變現邏輯。" },
      { time: "02月", title: "矽谷商業模式與新創趨勢座談", desc: "研討國際新興商業模式，激發跨領域創新思考。" },
      { time: "05月", title: "創業者心路歷程與心理韌性沙龍", desc: "探討創業路上的壓力管理與心智韌性，打造支持性同儕網絡。" }
    ],
    socialLinks: { ig: "https://instagram.com", fb: "https://facebook.com", email: "hundredcastles@rid3482.org" }
  },
  {
    id: "taipei-harmony",
    name: "台北圓滿社",
    englishName: "Rotaract Club of Taipei Harmony",
    sponsor: "台北圓滿扶輪社",
    meetingTime: "每雙週六 14:00 - 16:30",
    meetingPlace: "台北市大安區新生南路三段 (圓滿生活美學館)",
    category: "fellowship",
    categoryLabel: "聯誼休閒",
    tags: ["生活美學", "心靈成長", "手作美感", "健康生活"],
    slogan: "生活圓滿，心靈富足！共創品味生活新哲學。",
    intro: "台北圓滿扶青社提倡「生活與工作的完美平衡 (Work-Life Balance)」。我們以心靈成長、美感手作、健康養生以及品味生活為出發點，定期舉辦茶道體驗、花藝美學、戶外瑜珈與閱讀分享，讓青年在繁忙的步調中找到安頓身心的圓滿港灣。",
    officers: [
      { role: "社長 President", name: "孫立廷", title: "生活美學空間策劃師", avatar: "🧘" },
      { role: "秘書 Secretary", name: "鄭伊珊", title: "精油芳療諮詢師", avatar: "🌸" },
      { role: "財務 Treasurer", name: "郭建均", title: "健身營養教練", avatar: "🥑" },
      { role: "輔導顧問 Advisor", name: "劉圓滿", title: "前社長 / 瑜珈會館創辦人", avatar: "🧘‍♀️" },
      { role: "社務主委 Club Service", name: "蔡政宏", title: "精品咖啡烘豆師", avatar: "☕" },
      { role: "社服主委 Community Service", name: "林佳蓉", title: "流浪動物之家志工", avatar: "🐶" },
      { role: "職業主委 Vocational", name: "施佑儒", title: "花藝設計師", avatar: "💐" },
      { role: "國際(公關)主委 Int. & PR", name: "陳心怡", title: "藝術策展經理", avatar: "🖼️" }
    ],
    annualActivities: [
      { time: "09月", title: "森林療癒與秋日戶外瑜珈營", desc: "走入大自然，結合正念冥想與瑜珈，釋放都市生活的壓力。" },
      { time: "11月", title: "花藝設計與生活美感體驗課", desc: "透過親手插花，學習色彩搭配與生活空間美化技巧。" },
      { time: "02月", title: "春日圍爐茶會與精油香氛調配", desc: "品茗優質台茶，並親自調配專屬個人的心靈香氛精油。" },
      { time: "04月", title: "圓滿生活美學閱讀沙龍", desc: "深入研討身心健康、極簡生活與自我實踐等經典好書。" }
    ],
    socialLinks: { ig: "https://instagram.com", fb: "https://facebook.com", email: "harmony@rid3482.org" }
  },
  {
    id: "taipei-uptown",
    name: "台北上城社",
    englishName: "Rotaract Club of Taipei Uptown",
    sponsor: "台北上城扶輪社",
    meetingTime: "每雙週五 19:30 - 22:00",
    meetingPlace: "台北市信義區信義路五段 (台北101商務會議中心)",
    category: "business",
    categoryLabel: "學術商務",
    tags: ["英語簡報", "高階社交", "跨領域合作", "國際商務"],
    slogan: "上城風範，追求卓越！成就新世代商業菁英。",
    intro: "台北上城扶青社致力於為青年菁英打造一個高質感的雙語社交與專業合作網絡。聚會多以全英文或中英雙語進行，涵蓋國際財經脈動趨勢、地緣政治、商務談判以及精緻禮儀培訓，旨在培養具有國際視野與領導魅力的上城青年。",
    officers: [
      { role: "社長 President", name: "何承翰", title: "外商投行法務分析師", avatar: "🤵" },
      { role: "秘書 Secretary", name: "沈佳瑩", title: "跨國公關經理", avatar: "👩‍💼" },
      { role: "財務 Treasurer", name: "賴宇涵", title: "國際精算師", avatar: "🧮" },
      { role: "輔導顧問 Advisor", name: "羅上城", title: "律師事務所高級合夥人", avatar: "⚖️" },
      { role: "社務主委 Club Service", name: "錢克強", title: "金融外匯分析師", avatar: "📈" },
      { role: "社服主委 Community Service", name: "孫維辰", title: "國際慈善基金會專員", avatar: "🌍" },
      { role: "職業主委 Vocational", name: "汪筱婷", title: "跨國管理諮詢師 (Consultant)", avatar: "💼" },
      { role: "國際(公關)主委 Int. & PR", name: "白恩宇", title: "雙語商務公關總監", avatar: "📢" }
    ],
    annualActivities: [
      { time: "09月", title: "上城雙語商務簡報大賽", desc: "模擬向國際創投進行商業募資路演，競逐最高榮譽與創業資金。" },
      { time: "12月", title: "跨業菁英雞尾酒晚會與商業沙龍", desc: "在精緻場所進行深度社交，引薦多元商務資源與潛在合作夥伴。" },
      { time: "02月", title: "國際金融與地緣政治趨勢講堂", desc: "邀請知名財經學者與智庫顧問，深入剖析當前全球經濟演變。" },
      { time: "04月", title: "西式商務禮儀與美酒品鑑雅集", desc: "學習專業的高階商務社交禮儀、著裝規範與紅酒文化常識。" }
    ],
    socialLinks: { ig: "https://instagram.com", fb: "https://facebook.com", email: "uptown@rid3482.org" }
  },
  {
    id: "taipei-yide",
    name: "台北邑德社",
    englishName: "Rotaract Club of Taipei Yi-De",
    sponsor: "台北邑德扶輪社",
    meetingTime: "每雙週日 10:00 - 12:30",
    meetingPlace: "台北市松山區民生東路五段 (民生社區活動中心教室)",
    category: "service",
    categoryLabel: "社會服務",
    tags: ["銀髮關懷", "代間共融", "長青陪伴", "社區共生"],
    slogan: "邑聚賢德，暖心相伴！打造代間和諧新世紀。",
    intro: "台北邑德扶青社的核心使命是推動「高齡友善社會」與「代間共融」。我們相信長輩的智慧是社會的寶藏，透過創新的長青陪伴方案、數位科技教學、青銀共創手作等，消弭世代隔閡，打造溫暖和諧的社區共生圈。",
    officers: [
      { role: "社長 President", name: "徐若嵐", title: "高齡福祉照照護師", avatar: "👵" },
      { role: "秘書 Secretary", name: "劉致遠", title: "復健物理治療師", avatar: "👨‍⚕️" },
      { role: "財務 Treasurer", name: "鍾心怡", title: "高齡營養調理師", avatar: "🍲" },
      { role: "輔導顧問 Advisor", name: "陳邑德", title: "安養機構運營長", avatar: "🏡" },
      { role: "社務主委 Club Service", name: "李德華", title: "社區活動規劃師", avatar: "🎉" },
      { role: "社服主委 Community Service", name: "蔡淑芬", title: "老人社工專員", avatar: "❤️" },
      { role: "職業主委 Vocational", name: "張慶祥", title: "長照科技系統顧問", avatar: "📱" },
      { role: "國際(公關)主委 Int. & PR", name: "游美林", title: "社區發展協會聯絡官", avatar: "📢" }
    ],
    annualActivities: [
      { time: "08月", title: "青銀共創樂齡數位科技體驗營", desc: "教導社區銀髮長輩使用智慧型手機、社群軟體及常用便利生活 App。" },
      { time: "10月", title: "憶起幸福：長輩故事手繪繪本展", desc: "聆聽長者人生故事，由青年插畫師繪製成精美繪本並公開展覽。" },
      { time: "01月", title: "邑德暖心歲末樂齡圍爐歌唱大賽", desc: "結合社區長輩與青年，共同舉辦年菜圍爐、經典老歌歡唱，散播溫暖。" },
      { time: "04月", title: "樂齡防跌與銀髮健走健康推廣", desc: "協同物理治療師，為社區長輩提供肌力檢測、防跌衛教與健走活動。" }
    ],
    socialLinks: { ig: "https://instagram.com", fb: "https://facebook.com", email: "yide@rid3482.org" }
  },
  {
    id: "taipei-lily",
    name: "台北百合社",
    englishName: "Rotaract Club of Taipei Lily",
    sponsor: "台北百合扶輪社",
    meetingTime: "每雙週六 14:00 - 16:30",
    meetingPlace: "台北市中正區忠孝東路一段 (華山文創園區藝文空間)",
    category: "fellowship",
    categoryLabel: "聯誼休閒",
    tags: ["女力賦權", "性別平等", "多元包容", "生命教育"],
    slogan: "百合綻放，女力領航！綻放新世紀多元包容影響力。",
    intro: "台北百合扶青社以「女性賦權 (Women Empowerment)」與「多元平等包容 (DEI)」為核心理念。我們倡導不分性別的個人成長，透過傑出女性創辦人分享會、生命美學教育、性別友善講座以及女力公益專案，支持青年綻放獨一無二的自我。",
    officers: [
      { role: "社長 President", name: "羅婉婷", title: "新創女力社群主理人", avatar: "👩" },
      { role: "秘書 Secretary", name: "邱宇承", title: "多元多元倡議專員", avatar: "🤝" },
      { role: "財務 Treasurer", name: "江映璇", title: "自由平面設計師", avatar: "🎨" },
      { role: "輔導顧問 Advisor", name: "葉百合", title: "前社長 / 兩性平權基金會主委", avatar: "👩‍🏫" },
      { role: "社務主委 Club Service", name: "陳筱萱", title: "活動企劃經理", avatar: "🎉" },
      { role: "社服主委 Community Service", name: "謝承翰", title: "性別友善熱線諮詢師", avatar: "📞" },
      { role: "職業主委 Vocational", name: "簡妤蓁", title: "人力資源分析師", avatar: "📊" },
      { role: "國際(公關)主委 Int. & PR", name: "林瑞琪", title: "跨國非營利組織公關", avatar: "🌍" }
    ],
    annualActivities: [
      { time: "09月", title: "百合卓越女力先鋒論壇", desc: "邀請不同領域的女性領導者與創業者，分享突破玻璃天花板的心路歷程。" },
      { time: "11月", title: "DEI 多元包容企業參訪與對談", desc: "走訪落實性別平等與多元包容的知名企業，探討友善職場環境。" },
      { time: "03月", title: "國際婦女節彩虹公益路跑", desc: "倡導健康生活與平權，所得款項全數捐贈予婦女救援社會團體。" },
      { time: "05月", title: "自我探索與情緒療癒藝術工作坊", desc: "透過繪畫與戲劇治療，引導團員認識自我內在，提升心理韌性。" }
    ],
    socialLinks: { ig: "https://instagram.com", fb: "https://facebook.com", email: "lily@rid3482.org" }
  },
  {
    id: "taipei-yidong",
    name: "台北怡東社",
    englishName: "Rotaract Club of Taipei Yi-Dong",
    sponsor: "台北怡東扶輪社",
    meetingTime: "每雙週日 14:00 - 16:30",
    meetingPlace: "台北市信義區光復南路 (怡東綠色共享空間)",
    category: "service",
    categoryLabel: "社會服務",
    tags: ["都市永續", "綠色生活", "減碳科普", "生態農耕"],
    slogan: "怡然自得，綠色永續！怡東引領低碳生活新潮流。",
    intro: "台北怡東扶青社聚焦於「綠色永續發展 (Sustainability)」與「都市低碳生活」。我們推廣都市小農契作、廚餘回收製肥、綠色盆栽療癒以及氣候變遷科普教育，讓綠色環保不再是沉重的負擔，而是青年日常時尚的新潮流。",
    officers: [
      { role: "社長 President", name: "潘俊瑋", title: "綠色永續供應鏈顧問", avatar: "🌲" },
      { role: "秘書 Secretary", name: "郭秀敏", title: "植物療法美學師", avatar: "🌿" },
      { role: "財務 Treasurer", name: "蘇星宇", title: "碳權交易專案副理", avatar: "📊" },
      { role: "輔導顧問 Advisor", name: "高怡東", title: "有機農業產銷班長", avatar: "🚜" },
      { role: "社務主委 Club Service", name: "鄧亦翔", title: "綠色建材銷售總監", avatar: "🏡" },
      { role: "社服主委 Community Service", name: "羅逸帆", title: "濕地生態保育解說員", avatar: "🌾" },
      { role: "職業主委 Vocational", name: "楊瑞琪", title: "低碳飲食營養師", avatar: "🥗" },
      { role: "國際(公關)主委 Int. & PR", name: "葉芷妤", title: "環保倡議品牌公關", avatar: "📢" }
    ],
    annualActivities: [
      { time: "08月", title: "怡東都市屋頂小農契作體驗", desc: "在市區頂樓推行都市農耕，親手栽種無毒蔬菜，推廣地產地消。" },
      { time: "11月", title: "低碳生活挑戰賽與綠生活市集", desc: "號召社員進行為期一週的低碳排挑戰，並辦理環保低碳市集。" },
      { time: "02月", title: "氣候變遷與減碳經濟科普沙龍", desc: "邀請環境工程博士，深入淺出剖析全球碳中和與氣候變遷趨勢。" },
      { time: "04月", title: "都市盆栽療癒與永生花盆景手作", desc: "結合綠意植物與美學設計，體驗親手製作能綠化空間的盆栽。" }
    ],
    socialLinks: { ig: "https://instagram.com", fb: "https://facebook.com", email: "yidong@rid3482.org" }
  },
  {
    id: "taipei-tmu",
    name: "台北城中北醫大社",
    englishName: "Rotaract Club of Taipei Central TMU",
    sponsor: "台北城中扶輪社",
    meetingTime: "每雙週五 18:30 - 21:00",
    meetingPlace: "台北市信義區吳興街250號 (台北醫學大學校區)",
    category: "campus",
    categoryLabel: "校園大專",
    tags: ["大專校園", "醫學科普", "衛教服務", "健康防老"],
    slogan: "北醫城中，醫心守護！發揮醫學大專青年影響力。",
    intro: "作為地區少數的校園與大專特色社團，台北城中北醫大扶青社將醫學專業、衛教科普與社會服務緊密結合。我們常深入偏鄉小學與原民部落，提供衛教科普服務、健康健檢宣導，以實踐大專青年的社會責任。",
    officers: [
      { role: "社長 President", name: "高子婷", title: "北醫醫學系大四", avatar: "👩‍⚕️" },
      { role: "秘書 Secretary", name: "黃品嘉", title: "北醫藥學系大三", avatar: "💊" },
      { role: "財務 Treasurer", name: "廖柏宇", title: "北醫牙醫系大三", avatar: "🦷" },
      { role: "輔導顧問 Advisor", name: "邱醫德", title: "附設醫院住院醫師 / 前社長", avatar: "👨‍⚕️" },
      { role: "社務主委 Club Service", name: "楊健康", title: "北醫呼吸治療系大三", avatar: "🌬️" },
      { role: "社服主委 Community Service", name: "林科普", title: "北醫公共衛生系大三", avatar: "🧬" },
      { role: "職業主委 Vocational", name: "張生技", title: "北醫高齡健康管理系大二", avatar: "🧓" },
      { role: "國際(公關)主委 Int. & PR", name: "廖保健", title: "北醫護理系大三", avatar: "🩺" }
    ],
    annualActivities: [
      { time: "07月", title: "暑期偏鄉醫療關懷與健康衛教營", desc: "深入台灣偏遠部落，為當地居民提供基礎衛教諮詢與兒童科普科學營。" },
      { time: "10月", title: "都市銀髮族防智力退化大腦活化營", desc: "在台北社區辦理腦力益智遊戲與長輩心理健康諮詢服務。" },
      { time: "03月", title: "醫學大專青年健康促進大會", desc: "校內大型健康促進宣導，提供免費體脂肪量測與均衡飲食衛教。" },
      { time: "05月", title: "精油芳療與中藥養生手作例會", desc: "結合現代醫學與中醫養生，親自調配舒壓草本精油及草本茶包。" }
    ],
    socialLinks: { ig: "https://instagram.com", fb: "https://facebook.com", email: "tmu@rid3482.org" }
  },
  {
    id: "taipei-risingsun",
    name: "台北旭日社",
    englishName: "Rotaract Club of Taipei Rising Sun",
    sponsor: "台北旭日扶輪社",
    meetingTime: "每雙週六 14:00 - 16:30",
    meetingPlace: "台北市中山區民權東路三段 (旭日創客工坊)",
    category: "service",
    categoryLabel: "社會服務",
    tags: ["教育輔導", "閱讀推廣", "二手書香", "永續學習"],
    slogan: "旭日東升，希望無窮！用教育與書香溫暖人心。",
    intro: "台北旭日扶青社秉持「知識改變命運」的核心信念，長年專注於弱勢教育輔導與二手書推廣。我們在社區建立「旭日書屋」，募集社會二手優質圖書，並由團員定期舉辦說故事與課後多元輔導，照亮弱勢孩童的求學之路。",
    officers: [
      { role: "社長 President", name: "謝宗翰", title: "實驗教育機構教師", avatar: "👨‍🏫" },
      { role: "秘書 Secretary", name: "陳宛妤", title: "兒童文學作家", avatar: "✍️" },
      { role: "財務 Treasurer", name: "鄭子揚", title: "網路書店行銷經理", avatar: "📚" },
      { role: "輔導顧問 Advisor", name: "黃旭日", title: "前社長 / 兒童課輔基金會主委", avatar: "👨‍💼" },
      { role: "社務主委 Club Service", name: "廖晨光", title: "兒童心理諮商師", avatar: "🧸" },
      { role: "社服主委 Community Service", name: "林愛心", title: "偏鄉伴讀志工組長", avatar: "📖" },
      { role: "職業主委 Vocational", name: "張書香", title: "出版企劃編輯", avatar: "🖋️" },
      { role: "國際(公關)主委 Int. & PR", name: "郭希望", title: "教育新創行銷主任", avatar: "📢" }
    ],
    annualActivities: [
      { time: "09月", title: "旭日暖心二手書香募書計畫", desc: "號召企業與市民募集適合少兒閱讀的經典叢書，分裝運送至偏鄉學校。" },
      { time: "11月", title: "社區少兒說故事與科普繪本營", desc: "在社區圖書館定期辦理週六趣味科普閱讀沙龍，激發孩童學習熱情。" },
      { time: "01月", title: "旭日清寒青年築夢獎學金評選", desc: "為偏鄉清寒學子提供學習耗材與築夢專款獎助，協助其完成夢想。" },
      { time: "04月", title: "自媒體閱讀推廣與寫作工作坊", desc: "教導青年利用自媒體進行經典書籍解析與寫作輸出，提升軟實力。" }
    ],
    socialLinks: { ig: "https://instagram.com", fb: "https://facebook.com", email: "risingsun@rid3482.org" }
  },
  {
    id: "taipei-gemini-ai",
    name: "台北雙子星AI社",
    englishName: "Rotaract Club of Taipei Gemini AI",
    sponsor: "台北雙子星扶輪社",
    meetingTime: "每雙週六 10:00 - 12:30",
    meetingPlace: "台北市信義區信義路四段 (雙子星科技AI孵化器)",
    category: "tech",
    categoryLabel: "新創科技",
    tags: ["人工智慧", "數位轉型", "AI工作流", "科技創新"],
    slogan: "智啟雙子，AI創新！用先進科技共創嶄新世紀。",
    intro: "台北雙子星AI扶青社是全台首創以「AI科技創新與數位轉型」為核心定位的扶青社。團員多為 AI 研發工程師、數據分析師、UI 設計師與科技愛好者。我們積極推廣 AI 普惠教育、AI 工作流優化工作坊及科技創新服務，賦能青年共創 AI 時代的持恆影響。",
    officers: [
      { role: "社長 President", name: "林哲宇", title: "AI 演算法工程師", avatar: "🤖" },
      { role: "秘書 Secretary", name: "蔡明宏", title: "生成式 AI 工作流講師", avatar: "⚡" },
      { role: "財務 Treasurer", name: "黃郁晴", title: "科技創投投資分析師", avatar: "💻" },
      { role: "輔導顧問 Advisor", name: "蕭科技", title: "AI 晶片公司研發處長", avatar: "👨‍💻" },
      { role: "社務主委 Club Service", name: "張智慧", title: "全端開發工程師", avatar: "💻" },
      { role: "社服主委 Community Service", name: "廖自動", title: "自動化流程架構師", avatar: "⚙️" },
      { role: "職業主委 Vocational", name: "楊數據", title: "資料科學大師", avatar: "📊" },
      { role: "國際(公關)主委 Int. & PR", name: "賴聯絡", title: "科技公關商務拓展", avatar: "📢" }
    ],
    annualActivities: [
      { time: "08月", title: "雙子星青年 AI 創新黑客松", desc: "針對社會與環境問題，利用生成式 AI 技術於 24 小時內開發創新解決方案。" },
      { time: "11月", title: "中小企業 AI 數位轉型義診服務", desc: "協助地方傳統店家及公益組織，設計並導入免費 AI 自動化客服與行銷工作流。" },
      { time: "02月", title: "全球 AI 先鋒科技論壇與產業展望", desc: "邀請國內外頂尖 AI 學者與獨角獸公司主管，解析未來五年人工智慧趨勢。" },
      { time: "05月", title: "AI 高效能辦公與影音創作實戰營", desc: "培訓團員與外部大眾使用 Midjourney、ChatGPT 等工具提高生產力。" }
    ],
    socialLinks: { ig: "https://instagram.com", fb: "https://facebook.com", email: "geminiai@rid3482.org" }
  },
  {
    id: "taipei-just",
    name: "台北景文科大社",
    englishName: "Rotaract Club of Taipei Just",
    sponsor: "台北景文扶輪社",
    meetingTime: "每雙週三 12:30 - 15:00",
    meetingPlace: "新北市新店區安忠路99號 (景文科技大學校區)",
    category: "campus",
    categoryLabel: "校園大專",
    tags: ["大專校園", "技職技能", "在地創生", "社區服務"],
    slogan: "景文創藝，青創力行！展現技職青年在地影響力。",
    intro: "台北景文科大扶青社以大專青年的活力與景文科大豐沛的技職技能為基礎。我們深入社區進行新店溪流域環境監測、設計創意地方創生方案，並利用觀光餐旅與設計等專業技能辦理長輩關懷例會，充分實踐社會關懷。",
    officers: [
      { role: "社長 President", name: "張志誠", title: "景文餐飲管理系大三", avatar: "👨‍🍳" },
      { role: "秘書 Secretary", name: "許家榮", title: "景文視覺傳達系大三", avatar: "🎨" },
      { role: "財務 Treasurer", name: "吳欣儒", title: "景文旅遊管理系大三", avatar: "✈️" },
      { role: "輔導顧問 Advisor", name: "鄭景文", title: "前社長 / 精品連鎖咖啡店店長", avatar: "👨‍💼" },
      { role: "社務主委 Club Service", name: "蔡技能", title: "景文應用外語系大三", avatar: "🗣️" },
      { role: "社服主委 Community Service", name: "黃創藝", title: "景文多媒體設計系大三", avatar: "🖥️" },
      { role: "職業主委 Vocational", name: "陳餐飲", title: "景文烘焙廚藝系大三", avatar: "🍞" },
      { role: "國際(公關)主委 Int. & PR", name: "林旅遊", title: "景文航空服務系大三", avatar: "🛫" }
    ],
    annualActivities: [
      { time: "09月", title: "新店溪生態保育與聯合淨溪", desc: "結合學校環安組，定期舉辦新店溪沿岸淨溪與水質安全監測服務。" },
      { time: "11月", title: "溫暖長青：養生餐飲與手作大會", desc: "發揮餐飲與餐旅專業，為社區獨居長者親手製作美味營養膳食與手作互動。" },
      { time: "03月", title: "景文大專青年創意市集大會", desc: "校內大型創意市集，展示學生創藝手作，義賣所得支持偏鄉教育。" },
      { time: "05月", title: "技職之光：偏鄉學子技能導引營", desc: "邀請偏鄉青少年到校，體驗咖啡拉花、餐飲調酒及包裝設計基礎實作。" }
    ],
    socialLinks: { ig: "https://instagram.com", fb: "https://facebook.com", email: "just@rid3482.org" }
  }
];

// 2. 地區年度重大活動資料庫 (互動時間軸)
const TIMELINE_DATA = [
  {
    month: "07月",
    title: "地區代表及地區團隊就職典禮暨交接年會",
    type: "district",
    typeLabel: "地區活動",
    desc: "宣告 2026-27 年度正式啟航！地區代表 DRR 林冠宇帶領全體地區內閣宣誓就職，並以「WOW! 青年影響力 共創新世紀！」為口號，開啟年度首個精彩盛會。"
  },
  {
    month: "09月",
    title: "地區扶青社社團幹部訓練講習會 (DOTS)",
    type: "training",
    typeLabel: "培訓講習",
    desc: "為 17 社的核心幹部 (社長、秘書、財務、主委) 提供全方位的領導力與社務營運指導。規劃財務控管、公關推廣、專案企劃及輔導社資源對接等專業講座。"
  },
  {
    month: "10月",
    title: "扶輪青年領袖營 RYLA (Rotary Youth Leadership Awards)",
    type: "training",
    typeLabel: "培訓講習",
    desc: "兩天一夜的封閉式高強度領袖培訓。邀請國內頂尖新創領袖、社會創新實踐者授課，透過團隊合作破冰、問題解決挑戰與黑客松，全方位賦能青年領袖力。"
  },
  {
    month: "12月",
    title: "地區扶青聯合聖誕暨愛心慈善晚會",
    type: "fellowship",
    typeLabel: "聯誼慈善",
    desc: "全地區最盛大的歲末聯誼盛宴。結合聖誕派對與慈善公益拍賣，所得款項全數捐贈予 3482 地區年度聯合社會服務專案，用青年的愛心照亮寒冬。"
  },
  {
    month: "02月",
    title: "地區扶青運動會暨聯誼年會",
    type: "fellowship",
    typeLabel: "聯誼慈善",
    desc: "打破各社藩籬的趣味運動競技大會。包含羽球賽、躲避球賽與團隊障礙賽，以強身健體促進跨社團員之間的深厚情誼，展現青春陽光與朝氣。"
  },
  {
    month: "03月",
    title: "地區年會暨社會服務成果大展 (District Conference)",
    type: "district",
    typeLabel: "地區活動",
    desc: "年度最重要的成果回顧盛會。17 個扶青社齊聚一堂展示全年度服務影響力，邀請扶輪總監、各輔導社社長見證。大會頒發年度卓越社團、傑出專案等大獎。"
  },
  {
    month: "05月",
    title: "「共創新世紀」年度地區聯合永續綠色倡議行動",
    type: "service",
    typeLabel: "社會服務",
    desc: "17 個社團與地區團隊攜手發起的跨領域社會服務。結合低碳城市減碳宣導與北海岸聯合淨灘，將「Create Lasting Impact」的理念化為具體的集體行動。"
  }
];

// 3. 媒合器測驗題目資料庫
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
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
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

  // 1. 定義樹狀層級資料庫 (新增一位副代表與一位副秘書長，完美符合秘書/副秘書、兩位副代表、各大主委之配置)
  const treeData = {
    tier1: [
      { role: "地區代表 DRR", name: "林冠宇", club: "台北城中扶青社", avatar: "👔", image: "", desc: "「WOW! 青年影響力 共創新世紀！」帶領全體 3482 地區青年共創高峰。" }
    ],
    tier2: [
      { role: "地區秘書長 DS", name: "張逸安", club: "台北大安扶青社", avatar: "✒️", image: "", desc: "統籌地區行政運作、文書資訊傳達與跨地區合作引薦。" },
      { role: "地區副秘書長 DDS", name: "謝欣妤", club: "台北圓滿扶青社", avatar: "✨", image: "", desc: "協助秘書長綜理地區會務，加強各分社行政溝通與紀錄彙整。" },
      { role: "地區財務長 DT", name: "陳品妤", club: "台北上城扶青社", avatar: "📊", image: "", desc: "嚴謹控管年度預算，精準配置地區社會服務與活動專款。" }
    ],
    tier3: [
      { role: "地區副代表 ADRR", name: "徐佳琪", club: "台北大稻埕扶青社", avatar: "👩‍💼", image: "", desc: "分工深耕第一分區，促進分社間的資源串聯與地方創生計畫整合。" },
      { role: "地區副代表 ADRR", name: "黃莉婷", club: "台北百合扶青社", avatar: "👩‍🏫", image: "", desc: "分工輔導第二分區，引領分社多元成長與年度地區聯合專案對接。" }
    ],
    tier4: [
      { role: "團務委員會主委", name: "王哲瑋", club: "台北西北區社", avatar: "💡", image: "", desc: "規劃幹部講習會 (DOTS) 與地區年會，全面提升社務水平。" },
      { role: "社會服務委員會主委", name: "賴佩君", club: "台北北海社", avatar: "🌱", image: "", desc: "策劃年度跨社永續綠色聯合倡議服務，實踐永續影響力。" },
      { role: "職業發展委員會主委", name: "劉建志", club: "台北雙子星AI社", avatar: "🦾", image: "", desc: "對接輔導社企業資源，辦理青年AI工作流實戰等職場增能課。" },
      { role: "國際(公關)服務主委", name: "鄭又瑄", club: "台北城東社", avatar: "✈️", image: "", desc: "暢通亞太扶青會議聯絡窗口，帶領青年代表接軌國際。" }
    ]
  };

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
    
    <!-- Tier 2: 秘書/副秘書與財務 -->
    <div class="cabinet-tier-label">─── 核心行政與財務團隊 Executive Secretariat & Finance ───</div>
    <div class="cabinet-tier tier-2-wrapper">
      <div class="tier-cards-grid grid-3">
        ${treeData.tier2.map(o => renderCard(o, "cabinet-sec-card")).join("")}
      </div>
    </div>
    
    <!-- 樹狀連接線 2 -->
    <div class="tree-connector-line"></div>
    
    <!-- Tier 3: 兩位副代表 -->
    <div class="cabinet-tier-label">─── 地區副代表 Associate DRRs ───</div>
    <div class="cabinet-tier tier-3-wrapper">
      <div class="tier-cards-grid grid-2">
        ${treeData.tier3.map(o => renderCard(o, "cabinet-adrr-card")).join("")}
      </div>
    </div>
    
    <!-- 樹狀連接線 3 -->
    <div class="tree-connector-line"></div>
    
    <!-- Tier 4: 各大主委 -->
    <div class="cabinet-tier-label">─── 委員會服務主委 Service Chairs ───</div>
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
          <!-- <button class="club-more-btn" onclick="openClubModal('${club.id}')">深入探索</button> -->
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
