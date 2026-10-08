/* BARI'S LAB demo data. Every company, price, event and number below is fictional sample data. */
(function () {
"use strict";
var B = function (he, en) { return { he: he, en: en }; };
var D = window.D = {};

D.weights = [15, 15, 20, 15, 25, 10];
D.comps = ["price", "narr", "quality", "fin", "pa", "cat"];
D.sectors = ["tech", "bio", "apparel", "defense", "space"];
D.statuses = ["new", "watch", "wait", "near", "zone", "update", "cancel", "archive"];
D.tfs = [
  { k: "Y1", vol: 3.4 }, { k: "M6", vol: 2.9 }, { k: "M3", vol: 2.4 },
  { k: "M1", vol: 2.0 }, { k: "W1", vol: 1.6 }, { k: "D1", vol: 1.3 },
  { k: "H4", vol: 1.0 }, { k: "H1", vol: 0.8 }, { k: "m15", vol: 0.5 }
];

D.stocks = [
  { t: "NVLX", n: B("נובלוקס סיסטמס", "Novalux Systems"), sec: "tech", price: 41.2, zone: [38.5, 40.2], st: "near", sp: "mid", p: [11, 12, 16, 12, 19, 8], isNew: false, upd: 1, hz: "M3", sc: "liq", ev: 12,
    why: B("מעבר להכנסות חוזרות, והמחיר רחוק מהשיא", "Shift to recurring revenue while price sits well off its high"),
    ch: B("המחיר התקרב לקצה העליון של האזור", "Price moved closer to the top edge of the zone"),
    miss: B("סגירה שמבטאת מומנטום מעל הגבוה של השבוע שעבר", "A close that shows momentum above last week's high"),
    biz: B("תוכנה לניהול תשתיות ענן, בעיקר במנוי שנתי.", "Cloud-infrastructure software, mostly sold on annual subscriptions.") },
  { t: "QNTA", n: B("קוונטורה לאבס", "Quantora Labs"), sec: "tech", price: 17.8, zone: [14.2, 15.6], st: "wait", sp: "high", p: [8, 11, 9, 7, 12, 6], isNew: false, upd: 4, hz: "Y1", sc: null, ev: 30,
    why: B("סיפור טכנולוגי חזק, אבל הכנסות עדיין קטנות", "Strong technology story, but revenue is still small"),
    ch: B("אין שינוי מהותי השבוע", "No material change this week"),
    miss: B("בדיקה של הנמוך השנתי", "A test of the yearly low"),
    biz: B("מפתחת רכיבי חישוב מתקדמים ללקוחות מחקר.", "Builds advanced computing components for research customers.") },
  { t: "HLIX", n: B("הליקס ביולאבס", "Helix Biolabs"), sec: "bio", price: 9.35, zone: [8.6, 9.9], st: "zone", sp: "high", p: [10, 9, 12, 9, 17, 7], isNew: false, upd: 0, hz: "M3", sc: "rng", ev: 9,
    why: B("ניסוי קליני בשלב מתקדם, והמחיר בתוך האזור", "Late-stage clinical trial, and price is inside the zone"),
    ch: B("נכנסה לאזור העניין", "Entered the zone of interest"),
    miss: B("תגובת מחיר ברורה אחרי הכניסה לאזור", "A clear price reaction after entering the zone"),
    biz: B("מפתחת טיפול לדלקות כרוניות, בלי הכנסות מוצר עדיין.", "Develops a chronic-inflammation therapy, with no product revenue yet.") },
  { t: "CLRA", n: B("קלרה הלת׳", "Clara Health"), sec: "bio", price: 24.1, zone: [22.8, 23.9], st: "near", sp: "low", p: [12, 10, 15, 12, 18, 7], isNew: false, upd: 2, hz: "M1", sc: "mom", ev: 20,
    why: B("שולי רווח משתפרים ומאזן יציב", "Improving margins and a steady balance sheet"),
    ch: B("נר שבועי נסגר קרוב לקצה האזור", "A weekly candle closed near the edge of the zone"),
    miss: B("תגובה אחרי לקיחת הנמוך של השבוע הקודם", "A reaction after taking last week's low"),
    biz: B("מכשור רפואי לניטור ביתי, עם הכנסות חוזרות מחומרים מתכלים.", "Home-monitoring medical devices, with recurring revenue from consumables.") },
  { t: "THRL", n: B("תרדליין אפרל", "Threadline Apparel"), sec: "apparel", price: 12.6, zone: [10.8, 11.9], st: "update", sp: "mid", p: [8, 8, 12, 10, 15, 5], isNew: false, upd: 9, hz: "M6", sc: null, ev: 6,
    why: B("מותג צריכה אחרי ירידה ממושכת", "A consumer brand after a long decline"),
    ch: B("נתוני מכירות חדשים מחכים לבדיקה", "New sales data is waiting for review"),
    miss: B("עדכון המחקר לפי הנתונים החדשים", "A research refresh based on the new data"),
    biz: B("בגדי ספורט יומיומיים, מכירה מקוונת ובחנויות.", "Everyday sportswear sold online and in stores.") },
  { t: "SLKE", n: B("סילקנד", "Silkend"), sec: "apparel", price: 33.4, zone: [31.0, 32.4], st: "watch", sp: "low", p: [9, 10, 14, 13, 16, 6], isNew: false, upd: 3, hz: "M3", sc: null, ev: 25,
    why: B("חברה יציבה עם מותג חזק, והמחיר קרוב לטווח מעניין", "A steady company with a strong brand, price near an interesting range"),
    ch: B("המחיר ירד מעט לקראת האזור", "Price slipped slightly toward the zone"),
    miss: B("סימן לחזרת קונים באזור", "A sign of buyers returning in the zone"),
    biz: B("הלבשה עילית, כמחצית מההכנסות מחו״ל.", "Premium apparel, about half of revenue from abroad.") },
  { t: "AERN", n: B("אירן ספייס", "Aerion Space"), sec: "space", price: 52.8, zone: [49.5, 51.0], st: "wait", sp: "mid", p: [11, 11, 13, 10, 18, 8], isNew: false, upd: 2, hz: "M3", sc: "liq", ev: 14,
    why: B("צבר הזמנות גדל, והמחיר מחכה לאזור", "Growing order backlog, with price waiting for the zone"),
    ch: B("צבר ההזמנות עודכן כלפי מעלה", "Order backlog was revised upward"),
    miss: B("ירידה לאזור או סגירה חזקה מעל הגבוה הקודם", "A drop into the zone or a strong close above the previous high"),
    biz: B("שיגור לוויינים קטנים וחלקי חלל, בחוזים רב־שנתיים.", "Small-satellite launches and spacecraft parts under multi-year contracts.") },
  { t: "ORBV", n: B("אורביטה ונצ׳רס", "Orbita Ventures"), sec: "space", price: 6.9, zone: [5.4, 6.2], st: "new", sp: "high", p: [7, 12, 8, 6, 10, 9], isNew: true, upd: 0, hz: "Y1", sc: null, ev: 18,
    why: B("חברה צעירה בתחום תשתית חלל, עם סיכון גבוה", "A young space-infrastructure company with high risk"),
    ch: B("נוספה השבוע למחקר", "Added to research this week"),
    miss: B("בדיקה ראשונית של דוחות ושל מבנה המחיר", "An initial review of filings and price structure"),
    biz: B("שירותי תחנות קרקע ללוויינים מסחריים.", "Ground-station services for commercial satellites.") },
  { t: "DFNX", n: B("דפנקס טכנולוג׳יס", "Defenex Technologies"), sec: "defense", price: 78.4, zone: [70.0, 74.5], st: "watch", sp: "low", p: [9, 12, 14, 11, 16, 7], isNew: false, upd: 5, hz: "M6", sc: "rng", ev: 8,
    why: B("חוזים ממשלתיים ארוכי טווח ותזרים יציב", "Long-term government contracts and steady cash flow"),
    ch: B("חוזה חדש פורסם", "A new contract was announced"),
    miss: B("חזרה לאזור או הוכחת חוזק מעל הטווח", "A return to the zone or proof of strength above the range"),
    biz: B("מערכות הגנה אלקטרוניות לצבאות ולגופי ביטחון.", "Electronic defense systems for armed forces and security agencies.") },
  { t: "VGRD", n: B("ויגארד דיינמיקס", "Vanguard Dynamics"), sec: "defense", price: 29.7, zone: [27.9, 29.1], st: "near", sp: "mid", p: [10, 11, 13, 12, 17, 8], isNew: false, upd: 1, hz: "M1", sc: "mom", ev: 11,
    why: B("תעשייה ביטחונית בינונית עם הזמנות גדלות", "A mid-size defense manufacturer with growing orders"),
    ch: B("המחיר קרוב לקצה העליון של האזור", "Price is close to the top edge of the zone"),
    miss: B("תגובה אחרי לקיחת נזילות בטווח היומי", "A reaction after liquidity is taken on the daily range"),
    biz: B("רחפנים ומערכות ניווט לשימוש צבאי ואזרחי.", "Drones and navigation systems for military and civil use.") }
];

D.stock = function (t) {
  for (var i = 0; i < D.stocks.length; i++) if (D.stocks[i].t === t) return D.stocks[i];
  return null;
};
D.score = function (s) { return s.p.reduce(function (a, b) { return a + b; }, 0); };
/* One rule for distance: zero while price is inside the zone, otherwise percent from the nearest zone edge. */
D.dist = function (s) {
  var lo = s.zone[0], hi = s.zone[1];
  if (s.price >= lo && s.price <= hi) return { inside: true, pct: 0, side: "in" };
  var edge = s.price < lo ? lo : hi;
  return { inside: false, pct: Math.abs(s.price - edge) / edge * 100, side: s.price < lo ? "below" : "above" };
};

D.scTpl = {
  liq: {
    seen: B("המחיר ירד אל האזור אחרי לקיחת נמוך של טווח קודם, והנרות האחרונים מראים תגובה ראשונה.", "Price dropped into the zone after taking a previous range low, and the latest candles show a first reaction."),
    wait: B("סגירה שמחזיקה מעל האזור בטווח הגבוה יותר.", "A close that holds above the zone on the higher timeframe."),
    plus: B("מומנטום שנשמר בנר הבא, והקשר חיובי בין הטווחים.", "Momentum that carries into the next candle, with a supportive link between timeframes."),
    minus: B("סגירה מתחת לנמוך שנלקח, בלי תגובה.", "A close below the low that was taken, without a reaction.")
  },
  rng: {
    seen: B("המחיר נע בטווח ומשתהה בתוך האזור, בלי הכרעה בין הגבוה לנמוך.", "Price moves inside a range and lingers in the zone, with no decision between the high and the low."),
    wait: B("יציאה מהטווח עם סגירה ברורה, ולא רק זנב.", "A break out of the range with a clear close, not just a wick."),
    plus: B("סגירה שבועית מעל הגבוה של הטווח.", "A weekly close above the range high."),
    minus: B("סגירה מתחת לנמוך הטווח.", "A close below the range low.")
  },
  mom: {
    seen: B("נר קודם נסגר עם מומנטום, והנר הנוכחי לוקח את הגבוה ומחכה לתגובה.", "The previous candle closed with momentum, and the current one takes the high and waits for a response."),
    wait: B("מה קורה אחרי לקיחת הגבוה: המשך או חזרה פנימה.", "What happens after the high is taken: continuation or a return inside."),
    plus: B("סגירה שמחזיקה מעל הגבוה שנלקח.", "A close that holds above the high that was taken."),
    minus: B("חזרה מתחת לגבוה ולפתיחת הנר.", "A return below the high and below the candle's open.")
  }
};

/* Seeded random series for sample candles. */
D.hash = function (str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
D.rng = function (seed) { var s = seed >>> 0 || 1; return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; };
D.series = function (key, n, vol, endPrice) {
  var r = D.rng(D.hash(key)), p = 100, drift = 0, out = [];
  for (var i = 0; i < n; i++) {
    var o = p;
    drift = drift * 0.82 + (r() - 0.5) * vol * 0.9;
    var c = o * (1 + (drift + (r() - 0.5) * vol * 0.8) / 100);
    var hi = Math.max(o, c) * (1 + r() * vol / 140);
    var lo = Math.min(o, c) * (1 - r() * vol / 140);
    out.push({ o: o, h: hi, l: lo, c: c });
    p = c;
  }
  if (endPrice) {
    var k = endPrice / out[out.length - 1].c;
    out.forEach(function (x) { x.o *= k; x.h *= k; x.l *= k; x.c *= k; });
  }
  return out;
};

/* Economic events. Dates are offsets from today, times are UTC. Every row is sample data. */
D.events = [
  { id: "e1", d: -1, h: 13, m: 30, cc: "US", cur: "USD", imp: "high", n: B("דוח מחירים לצרכן (דוגמה)", "Consumer price report (sample)"), prev: "3.1%", fc: "3.0%", act: "3.0%", why: B("משפיע על הציפייה לריבית ולכן על מניות צמיחה.", "Shapes rate expectations and therefore growth stocks.") },
  { id: "e2", d: 0, h: 12, m: 30, cc: "US", cur: "USD", imp: "high", n: B("בקשות לדמי אבטלה (דוגמה)", "Jobless claims (sample)"), prev: "214K", fc: "212K", act: null, why: B("מדד שבועי לשוק העבודה.", "A weekly read on the labor market.") },
  { id: "e3", d: 0, h: 14, m: 0, cc: "US", cur: "USD", imp: "med", n: B("מדד ייצור ממוצע (דוגמה)", "Manufacturing index (sample)"), prev: "49.8", fc: "50.1", act: null, why: B("נותן רמז לביקוש בתעשייה.", "A hint about industrial demand.") },
  { id: "e4", d: 1, h: 9, m: 0, cc: "EU", cur: "EUR", imp: "med", n: B("אינפלציה באירופה (דוגמה)", "Eurozone inflation (sample)"), prev: "2.4%", fc: "2.3%", act: null, why: B("משפיע על המטבע ועל הציפייה לריבית באירופה.", "Moves the currency and rate expectations in Europe.") },
  { id: "e5", d: 1, h: 18, m: 0, cc: "US", cur: "USD", imp: "high", n: B("החלטת ריבית ונאום יו״ר הבנק המרכזי (דוגמה)", "Rate decision and central bank chair speech (sample)"), prev: "4.50%", fc: "4.50%", act: null, why: B("האירוע שמזיז הכי הרבה שווקים בשבוע.", "The event that moves markets most this week.") },
  { id: "e6", d: 2, h: 12, m: 30, cc: "US", cur: "USD", imp: "high", n: B("דוח תעסוקה חודשי (דוגמה)", "Monthly employment report (sample)"), prev: "165K", fc: "160K", act: null, why: B("מזיז ריבית, דולר ומניות באותו רגע.", "Moves rates, the dollar and stocks at once.") },
  { id: "e7", d: 2, h: 7, m: 0, cc: "UK", cur: "GBP", imp: "low", n: B("מכירות קמעונאיות בבריטניה (דוגמה)", "UK retail sales (sample)"), prev: "0.3%", fc: "0.2%", act: null, why: B("השפעה מוגבלת על שווקים מחוץ לבריטניה.", "Limited effect on markets outside the UK.") },
  { id: "e8", d: 3, h: 1, m: 30, cc: "JP", cur: "JPY", imp: "med", n: B("החלטת הבנק המרכזי ביפן (דוגמה)", "Bank of Japan decision (sample)"), prev: "0.50%", fc: "0.50%", act: null, why: B("יכול להשפיע על שוק המט״ח העולמי.", "Can affect global currency markets.") },
  { id: "e9", d: 3, h: 12, m: 30, cc: "US", cur: "USD", imp: "med", n: B("מכירות קמעונאיות בארה״ב (דוגמה)", "US retail sales (sample)"), prev: "0.4%", fc: "0.3%", act: null, why: B("רלוונטי למניות צריכה והלבשה.", "Relevant to consumer and apparel stocks.") },
  { id: "e10", d: 4, h: 14, m: 0, cc: "US", cur: "USD", imp: "low", n: B("מלאי עסקים (דוגמה)", "Business inventories (sample)"), prev: "0.1%", fc: "0.1%", act: null, why: B("נתון משני, בדרך כלל בלי תגובה חדה.", "A secondary figure, usually without a sharp reaction.") },
  { id: "e11", d: 5, h: 20, m: 0, cc: "US", cur: "USD", imp: "med", n: B("דוחות רבעוניים של כמה חברות טכנולוגיה (דוגמה)", "Quarterly reports from several tech companies (sample)"), prev: "-", fc: "-", act: null, why: B("נוגע ישירות לסקטור הטכנולוגיה ברדאר.", "Directly relevant to the tech sector on the radar.") },
  { id: "e12", d: 6, h: 9, m: 30, cc: "DE", cur: "EUR", imp: "low", n: B("אמון עסקי בגרמניה (דוגמה)", "German business confidence (sample)"), prev: "86.9", fc: "87.2", act: null, why: B("מדד סנטימנט אזורי.", "A regional sentiment gauge.") }
];

D.lessons = [
  { id: "l1", lv: "basic", ti: B("קריאת נר", "Reading a candle"),
    body: B("נר מתאר מה קרה למחיר בתקופה אחת: איפה נפתח, כמה גבוה ונמוך הגיע, ואיפה נסגר. הגוף הוא המרחק בין הפתיחה לסגירה, והפתילים מראים כמה המחיר הרחיק מעבר לגוף. אותו נר נראה אחרת בכל טווח זמן.", "A candle describes what price did in one period: where it opened, how high and low it reached, and where it closed. The body is the distance between open and close, and the wicks show how far price stretched past the body. The same candle looks different on every timeframe.") },
  { id: "l2", lv: "basic", ti: B("גבוהים ונמוכים", "Highs and lows"),
    body: B("הגבוה והנמוך של טווח קודם הם נקודות ייחוס. המחיר מתייחס אליהן כשהוא מתקרב, עובר אותן או חוזר מהן. לפני שמחפשים משמעות, כותבים מה קרה בפועל.", "The high and low of a previous range are reference points. Price reacts to them as it approaches, passes through or returns from them. Before looking for meaning, write down what actually happened.") },
  { id: "l3", lv: "mid", ti: B("לקיחת נזילות", "Taking liquidity"),
    body: B("לקיחת נזילות מתארת מצב שבו המחיר עובר מעל גבוה קודם או מתחת לנמוך קודם. זה תיאור של מה שקרה ולא אות לפעולה. מה שמעניין הוא התגובה שאחרי. זהו הסבר ראשוני, ברי ידייק אותו בדוגמאות שלו.", "Taking liquidity describes price moving above a previous high or below a previous low. It describes what happened and is not a signal to act. What matters is the reaction afterward. This is a first explanation, and Bari will refine it with his own examples.") },
  { id: "l4", lv: "mid", ti: B("מומנטום", "Momentum"),
    body: B("מומנטום נקרא מתוך אופן הסגירה של נרות קודמים. נר שנסגר חזק משפיע על הציפייה לנר הבא, אבל ציפייה אינה ודאות. הנר הבא יכול להמשיך, להתהפך או לא להתפתח.", "Momentum is read from how earlier candles closed. A strong close shapes the expectation for the next candle, but an expectation is not a certainty. The next candle can continue, reverse or not develop at all.") },
  { id: "l5", lv: "mid", ti: B("הקשר בין טווחי זמן", "Linking timeframes"),
    body: B("נר חודשי מורכב מהרבה נרות קטנים. כשמסתכלים מהטווח הגבוה לנמוך, מבינים באיזה הקשר מתרחשת תנועה קטנה. חשוב לציין תמיד את הטווח במלואו, חודש אינו דקה.", "A monthly candle is made of many smaller candles. Looking from the higher timeframe down shows the context of a small move. Always name the timeframe in full: a month is not a minute.") },
  { id: "l6", lv: "basic", ti: B("תרחיש לעומת ודאות", "Scenario versus certainty"),
    body: B("תרחיש הוא תיאור של מה עשוי להתפתח ובאילו תנאים. כל תרחיש כולל מה יחזק אותו ומה יבטל אותו. תרחיש שלא התפתח אינו כישלון, הוא מידע.", "A scenario describes what may develop and under which conditions. Every scenario includes what would strengthen it and what would cancel it. A scenario that did not develop is not a failure, it is information.") },
  { id: "l7", lv: "basic", ti: B("המתנה לאזור", "Waiting for the zone"),
    body: B("אזור עניין הוא טווח מחירים שבו כדאי להסתכל מקרוב. הגעה לאזור אינה הוראה לפעול. ההמתנה היא חלק מהשיטה: מחכים לאזור ולתנאים, ובינתיים מתעדים.", "A zone of interest is a price range worth watching closely. Reaching a zone is not an instruction to act. Waiting is part of the method: wait for the zone and its conditions, and document in the meantime.") },
  { id: "l8", lv: "basic", ti: B("קריאת דוח", "Reading a report"),
    body: B("בדוח רבעוני מסתכלים על הכנסות וצמיחה, שולי רווח, מזומן וחוב, ועל התחזית של ההנהלה. מעבירים כל מספר דרך שאלה אחת: האם הוא משנה את הסיפור של החברה?", "In a quarterly report, look at revenue and growth, margins, cash and debt, and management guidance. Run every number through one question: does it change the company's story?") },
  { id: "l9", lv: "adv", ti: B("דילול ושריפת מזומנים", "Dilution and cash burn"),
    body: B("חברה שמפסידה כסף צריכה מימון. הנפקת מניות חדשות מקטינה את חלקם של בעלי המניות הקיימים (דילול). בודקים כמה חודשי פעילות המזומן הקיים מכסה.", "A company that loses money needs funding. Issuing new shares shrinks existing holders' stake (dilution). Check how many months of operations the existing cash covers.") },
  { id: "l10", lv: "adv", ti: B("חברה טובה לעומת מחיר מעניין", "A good company versus an interesting price"),
    body: B("חברה איכותית אינה בהכרח מחיר מעניין, ומחיר מעניין אינו הופך חברה לאיכותית. הרדאר בוחן את שני הדברים בנפרד ומציג את הציון עם פירוט.", "A quality company is not necessarily an interesting price, and an interesting price does not make a company a quality one. The radar looks at the two separately and shows the score with a breakdown.") }
];

D.history = [
  { id: "h1", t: "NVLX", d: -62, st: "open", tf: "M3", zone: "38.5 - 40.2", txt: B("תרחיש לדוגמה: המתנה לסגירה שמחזיקה מעל האזור בטווח החודשי.", "Sample scenario: waiting for a close that holds above the zone on the monthly range."), res: B("עדיין פתוח.", "Still open."), rev: null },
  { id: "h2", t: "HLIX", d: -120, st: "dev", tf: "M3", zone: "8.6 - 9.9", txt: B("תרחיש לדוגמה: תגובה אחרי כניסה לאזור, בלי ללכת מעבר לנמוך הקודם.", "Sample scenario: a reaction after entering the zone, without going past the previous low."), res: B("התפתח בהתאם לתנאים שנכתבו.", "Developed according to the written conditions."), rev: B("תחקיר לדוגמה: התנאי היה ברור, והמעקב עזר.", "Sample review: the condition was clear and tracking it helped.") },
  { id: "h3", t: "AERN", d: -200, st: "cancel", tf: "M6", zone: "49.5 - 51.0", txt: B("תרחיש לדוגמה: חזרה לאזור אחרי נר שנסגר חזק.", "Sample scenario: a return to the zone after a strong close."), res: B("בוטל: סגירה מתחת לנמוך שהוגדר.", "Cancelled: a close below the defined low."), rev: B("תחקיר לדוגמה: התרחיש בוטל בזמן ולא נמחק.", "Sample review: the scenario was cancelled on time and not deleted.") },
  { id: "h4", t: "DFNX", d: -300, st: "notrig", tf: "M6", zone: "70.0 - 74.5", txt: B("תרחיש לדוגמה: המתנה לירידה לאזור.", "Sample scenario: waiting for a drop into the zone."), res: B("לא הופעל: המחיר לא הגיע לאזור.", "Not triggered: price never reached the zone."), rev: null },
  { id: "h5", t: "CLRA", d: -420, st: "exp", tf: "M1", zone: "22.8 - 23.9", txt: B("תרחיש לדוגמה: תגובה בטווח של חודש.", "Sample scenario: a reaction within a month."), res: B("עבר הזמן שהוגדר, בלי הכרעה.", "The defined time passed without a decision."), rev: null },
  { id: "h6", t: "VGRD", d: -520, st: "undec", tf: "M1", zone: "27.9 - 29.1", txt: B("תרחיש לדוגמה: סגירה מעל גבוה קודם.", "Sample scenario: a close above a previous high."), res: B("לא ניתן להכריע לפי הכללים שהוגדרו אז.", "Cannot be decided under the rules defined at the time."), rev: B("תחקיר לדוגמה: חסרו כללי מדידה מראש.", "Sample review: measurement rules were missing up front.") }
];

D.weeks = [
  { off: 0, mkt: B("סיכום שוק לדוגמה: שבוע שקט יחסית, עם אירוע ריבית באמצע השבוע. נתוני הדמו אינם מייצגים את השוק.", "Sample market summary: a relatively quiet week with a rate event mid-week. Demo data does not represent the market."), concl: B("מסקנות לדוגמה: שלוש מניות נשארו בהמתנה. לא נוספה מועמדת חדשה כי לא נמצאה אחת ראויה.", "Sample conclusions: three stocks remain waiting. No new candidate was added because none was worthy."), risks: B("סיכון לדוגמה: אירועי מאקרו בשבוע הקרוב עלולים להגדיל תנודתיות.", "Sample risk: macro events next week may increase volatility.") },
  { off: -7, mkt: B("סיכום שוק לדוגמה: שבוע עם תנודתיות גבוהה בסקטור הטכנולוגיה.", "Sample market summary: a week of high volatility in the tech sector."), concl: B("מסקנות לדוגמה: הרדאר לא השתנה מהותית. תרחיש אחד עודכן.", "Sample conclusions: the radar did not change materially. One scenario was updated."), risks: B("סיכון לדוגמה: דוחות רבעוניים בשבוע הבא.", "Sample risk: quarterly reports next week.") },
  { off: -14, mkt: B("סיכום שוק לדוגמה: שבוע של מסחר דליל לפני חג.", "Sample market summary: a week of thin trading before a holiday."), concl: B("מסקנות לדוגמה: כמעט אין שינוי. הוספה מניה אחת למחקר.", "Sample conclusions: almost no change. One stock was added to research."), risks: B("סיכון לדוגמה: נזילות נמוכה מגדילה קפיצות מחיר.", "Sample risk: low liquidity increases price jumps.") }
];

D.il = {
  cats: ["pension", "gemel", "study"],
  tracks: {
    pension: [
      { id: "p1", n: "מסלול מנייתי (דוגמה)", eq: 75, fee: 0.45, r1: 9.2, r3: 7.1, r5: 6.4 },
      { id: "p2", n: "מסלול כללי (דוגמה)", eq: 45, fee: 0.4, r1: 6.1, r3: 5.2, r5: 4.9 },
      { id: "p3", n: "מסלול סולידי (דוגמה)", eq: 12, fee: 0.35, r1: 3.8, r3: 3.1, r5: 3.0 }
    ],
    gemel: [
      { id: "g1", n: "גמל להשקעה מנייתי (דוגמה)", eq: 80, fee: 0.7, r1: 10.1, r3: 7.9, r5: 7.0 },
      { id: "g2", n: "גמל להשקעה כללי (דוגמה)", eq: 40, fee: 0.6, r1: 5.8, r3: 4.9, r5: 4.6 },
      { id: "g3", n: "גמל להשקעה אג״חי (דוגמה)", eq: 8, fee: 0.5, r1: 3.5, r3: 2.8, r5: 2.7 }
    ],
    study: [
      { id: "s1", n: "השתלמות מנייתית (דוגמה)", eq: 78, fee: 0.65, r1: 9.8, r3: 7.5, r5: 6.8 },
      { id: "s2", n: "השתלמות כללית (דוגמה)", eq: 42, fee: 0.55, r1: 5.9, r3: 5.0, r5: 4.7 },
      { id: "s3", n: "השתלמות סולידית (דוגמה)", eq: 10, fee: 0.45, r1: 3.6, r3: 2.9, r5: 2.8 }
    ]
  }
};

D.tracks = ["focus", "calm", "evening", "ambient"];
})();
