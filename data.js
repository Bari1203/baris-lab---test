/* BARI'S LAB demo data. Every company, price, event and number below is fictional sample data. */
(function () {
"use strict";
var B = function (he, en) { return { he: he, en: en }; };
var D = window.D = {};

/* Score model v0.3: the ten radar parameters (v0.2 plus wick strength, updated 10/10/2026) from Bari's method brief. The weights are a PLACEHOLDER, not Bari's numbers:
   the brief says they will be calibrated against the journal after 30-50 trades. The score only orders the radar; the decision stays intuitive. */
D.weights = [13, 9, 11, 10, 11, 9, 7, 8, 9, 13];
D.comps = ["liq", "prec", "close", "mom", "open", "candle", "wick", "smt", "rr", "chain"];
D.tier = function (sc) { return sc >= 75 ? "perfect" : sc >= 60 ? "good" : "watch"; };
D.sectors = ["tech", "bio", "apparel", "defense", "space"];
D.styleTfs = { invest: ["Y1", "M6", "M3", "W1"], swing: ["M3", "M1", "W1", "D1", "H4"], day: ["D1", "H4", "H1", "m15"] };
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


/* Indices, crypto and FX. Real instrument names, SAMPLE levels only: nothing here is a market price. */
function A(t, ab, n, kind, mkt, price, dec, zone, st, sp, upd, hz, ev, why, ch, miss, biz) {
  return { t: t, ab: ab, n: n, kind: kind, sec: kind, mkt: mkt, price: price, dec: dec, zone: zone, st: st, sp: sp, p: [0, 0, 0, 0, 0, 0], isNew: false, upd: upd, hz: hz, sc: null, ev: ev, why: why, ch: ch, miss: miss, biz: biz };
}
D.assets = [
  A("SPX", "500", B("S&P 500", "S&P 500"), "index", "us", 5420.5, 2, [5280, 5350], "watch", "low", 1, "M3", 8,
    B("מדד מרכזי שמשקף את מצב השוק האמריקאי", "A key gauge of the US market"), B("המחיר רחוק מעל האזור", "Price sits above the zone"), B("חזרה לבדיקת האזור והתגובה אליו", "A return to test the zone and the reaction"), B("מדד של 500 חברות גדולות הנסחרות בארה״ב.", "An index of 500 large companies listed in the US.")),
  A("NDX", "NDX", B("נאסד״ק 100", "Nasdaq 100"), "index", "us", 18940.2, 2, [18900, 19200], "zone", "mid", 0, "M1", 8,
    B("מדד טכנולוגיה כבד, רגיש לתנודות", "A tech-heavy index, sensitive to swings"), B("נכנס לאזור העניין", "Entered the zone of interest"), B("תגובת מחיר ברורה אחרי הכניסה", "A clear price reaction after entering"), B("מדד של 100 חברות גדולות לא פיננסיות בנאסד״ק.", "An index of 100 large non-financial Nasdaq companies.")),
  A("DJI", "DOW", B("דאו ג׳ונס", "Dow Jones"), "index", "us", 39880, 2, [38600, 39200], "near", "low", 2, "M3", 8,
    B("מדד ותיק של 30 חברות ענק", "An old index of 30 blue-chip companies"), B("התקרב לקצה העליון של האזור", "Moved toward the top edge of the zone"), B("סגירה שמראה כיוון ברור", "A close that shows a clear direction"), B("מדד של 30 חברות גדולות בארה״ב.", "An index of 30 large US companies.")),
  A("TA35", "35", B("ת״א 35", "TA-35"), "index", "il", 2310.4, 2, [2240, 2290], "watch", "low", 1, "M3", 8,
    B("המדד המרכזי של הבורסה בתל אביב", "The main index of the Tel Aviv exchange"), B("אין שינוי מהותי", "No material change"), B("בדיקה של האזור", "A test of the zone"), B("מדד של 35 החברות הגדולות בבורסה בתל אביב.", "An index of the 35 largest companies on the Tel Aviv exchange.")),
  A("TA125", "125", B("ת״א 125", "TA-125"), "index", "il", 2105.3, 2, [2050, 2100], "near", "low", 2, "M3", 8,
    B("מדד רחב יותר של הבורסה בתל אביב", "A broader Tel Aviv index"), B("התקרב לקצה האזור", "Moved close to the zone edge"), B("תגובה בקצה העליון של האזור", "A reaction at the top of the zone"), B("מדד של 125 חברות בבורסה בתל אביב.", "An index of 125 companies on the Tel Aviv exchange.")),
  A("BTC", "BTC", B("ביטקוין", "Bitcoin"), "crypto", "us", 64200, 2, [61500, 63000], "watch", "high", 1, "M1", 0,
    B("מטבע דיגיטלי שנסחר 24 שעות ביממה, תנודתי מאוד", "A digital currency trading around the clock, very volatile"), B("המחיר מעל האזור", "Price is above the zone"), B("חזרה לאזור ותגובה בו", "A return to the zone and a reaction there"), B("אחד המטבעות הדיגיטליים הגדולים.", "One of the largest digital currencies.")),
  A("ETH", "ETH", B("איתריום", "Ethereum"), "crypto", "us", 3120.5, 2, [3150, 3280], "wait", "high", 3, "M1", 0,
    B("פלטפורמה לחוזים חכמים עם מטבע ETH", "A smart-contract platform with the ETH coin"), B("המחיר מתחת לאזור", "Price is below the zone"), B("חזרה לאזור וסגירה בתוכו", "A return into the zone and a close inside"), B("רשת לחוזים חכמים. המטבע שלה נקרא ETH.", "A smart-contract network. Its coin is called ETH.")),
  A("XRP", "XRP", B("אקס־אר־פי", "XRP"), "crypto", "us", 0.58, 4, [0.52, 0.56], "watch", "high", 2, "M1", 0,
    B("מטבע דיגיטלי תנודתי, מחירו נמוך ליחידה", "A volatile digital currency with a low unit price"), B("המחיר מעל האזור", "Price is above the zone"), B("בדיקה של האזור", "A test of the zone"), B("מטבע דיגיטלי הקשור לרשת Ripple.", "A digital currency tied to the Ripple network.")),
  A("DXY", "$", B("מדד הדולר", "US Dollar Index"), "fx", "us", 104.2, 2, [102.8, 103.6], "watch", "low", 1, "M3", 8,
    B("בוחן את הדולר מול סל מטבעות מרכזיים", "Measures the dollar against a basket of major currencies"), B("המחיר מעל האזור", "Price is above the zone"), B("חזרה אל האזור", "A return to the zone"), B("מדד שמודד את הדולר האמריקאי מול סל מטבעות.", "An index measuring the US dollar against a basket of currencies.")),
  A("EURUSD", "€/$", B("אירו / דולר", "EUR/USD"), "fx", "us", 1.0865, 4, [1.075, 1.082], "near", "low", 1, "M1", 8,
    B("זוג המטבעות הנסחר ביותר בעולם", "A very widely traded currency pair"), B("התקרב לקצה העליון של האזור", "Moved toward the top of the zone"), B("תגובה בקצה האזור", "A reaction at the zone edge"), B("שער האירו מול הדולר האמריקאי.", "The euro against the US dollar.")),
  A("GBPUSD", "£/$", B("לירה שטרלינג / דולר", "GBP/USD"), "fx", "us", 1.274, 4, [1.28, 1.29], "wait", "low", 2, "M1", 8,
    B("זוג מטבעות מרכזי עם תנודתיות בינונית", "A major currency pair with moderate volatility"), B("המחיר מתחת לאזור", "Price is below the zone"), B("עלייה לאזור ותגובה בו", "A rise into the zone and a reaction there"), B("שער הלירה שטרלינג מול הדולר האמריקאי.", "Sterling against the US dollar."))
,
  A("ES", "ES", B("חוזה עתידי S&P 500 (ES)", "S&P 500 futures (ES)"), "futures", "us", 5428.25, 2, [5390, 5410], "near", "mid", 0, "H1", 8,
    B("חוזה עתידי על S&P 500, נסחר כמעט 24 שעות ביום", "A futures contract on the S&P 500, trading nearly around the clock"), B("התקרב לקצה האזור", "Moved toward the zone edge"), B("תגובה בקצה האזור באותו יום", "A same-day reaction at the zone edge"), B("חוזה עתידי (E-mini) על מדד S&P 500. בשיטה של ברי קוראים אותו תמיד לצד NQ.", "An E-mini futures contract on the S&P 500 index. In Bari's method it is always read next to NQ.")),
  A("NQ", "NQ", B("חוזה עתידי נאסד״ק (NQ)", "Nasdaq futures (NQ)"), "futures", "us", 19012.5, 2, [18950, 19050], "zone", "high", 0, "H1", 8,
    B("חוזה עתידי על נאסד״ק 100, תנודתי במיוחד", "A futures contract on the Nasdaq 100, especially volatile"), B("בתוך האזור", "Inside the zone"), B("תגובה ברורה אחרי הכניסה", "A clear reaction after entering"), B("חוזה עתידי (E-mini) על מדד נאסד״ק 100. הנכס המרכזי של ברי, נקרא תמיד מול ES.", "An E-mini futures contract on the Nasdaq 100. Bari's main instrument, always read against ES.")),
  A("YM", "YM", B("חוזה עתידי דאו ג׳ונס (YM)", "Dow futures (YM)"), "futures", "us", 39910, 0, [39600, 39750], "watch", "mid", 1, "H1", 8,
    B("חוזה עתידי על דאו ג׳ונס", "A futures contract on the Dow Jones"), B("המחיר מעל האזור", "Price is above the zone"), B("חזרה לאזור ותגובה בו", "A return to the zone and a reaction there"), B("חוזה עתידי (E-mini) על מדד דאו ג׳ונס.", "An E-mini futures contract on the Dow Jones.")),
  A("USDILS", "$/₪", B("דולר / שקל", "USD/ILS"), "fx", "il", 3.7, 4, [3.66, 3.69], "near", "low", 1, "M1", 8,
    B("כמה שקלים שווה דולר אחד", "How many shekels one dollar is worth"), B("התקרב לקצה האזור", "Moved toward the zone edge"), B("תגובה בקצה האזור", "A reaction at the zone edge"), B("שער הדולר מול השקל.", "The dollar against the shekel.")),
  A("EURILS", "€/₪", B("אירו / שקל", "EUR/ILS"), "fx", "il", 4.02, 4, [3.96, 4.0], "watch", "low", 1, "M1", 8,
    B("כמה שקלים שווה אירו אחד", "How many shekels one euro is worth"), B("המחיר מעל האזור", "Price is above the zone"), B("חזרה לאזור", "A return to the zone"), B("שער האירו מול השקל.", "The euro against the shekel.")),
  A("GBPILS", "£/₪", B("לירה שטרלינג / שקל", "GBP/ILS"), "fx", "il", 4.72, 4, [4.8, 4.88], "wait", "low", 2, "M1", 8,
    B("כמה שקלים שווה לירה שטרלינג אחת", "How many shekels one pound is worth"), B("המחיר מתחת לאזור", "Price is below the zone"), B("עלייה לאזור ותגובה בו", "A rise into the zone and a reaction there"), B("שער הלירה שטרלינג מול השקל.", "Sterling against the shekel.")),
  A("JPYILS", "¥/₪", B("ין יפני / שקל", "JPY/ILS"), "fx", "il", 0.0245, 5, [0.0238, 0.0242], "watch", "mid", 2, "M1", 8,
    B("כמה שקלים שווה ין אחד (מחיר נמוך ליחידה)", "How many shekels one yen is worth (a low unit price)"), B("המחיר מעל האזור", "Price is above the zone"), B("בדיקה של האזור", "A test of the zone"), B("שער הין היפני מול השקל.", "The Japanese yen against the shekel."))
];
D.stocks.forEach(function (s) {
  s.kind = "stock"; s.mkt = "us";
  /* spread the old sample total over the nine parameters deterministically (sample values only) */
  var T = s.p.reduce(function (a, b) { return a + b; }, 0), h = 0, i;
  for (i = 0; i < s.t.length; i++) h = (h * 31 + s.t.charCodeAt(i)) % 9973;
  var q = D.weights.map(function (w, k) { var v = 0.82 + (((h * (k + 3) * 7919) % 100) / 100) * 0.36; return Math.min(w, Math.round(w * T / 100 * v)); });
  var diff = T - q.reduce(function (a, b) { return a + b; }, 0), k2 = 0;
  while (diff !== 0 && k2 < 200) { var j = k2 % q.length; if (diff > 0 && q[j] < D.weights[j]) { q[j]++; diff--; } else if (diff < 0 && q[j] > 0) { q[j]--; diff++; } k2++; }
  s.p = q;
});
D.stocks.forEach(function (s) { s.sty = ["invest", "swing"]; });
D.assets.forEach(function (a) {
  a.sty = a.kind === "index" ? ["invest"] : a.kind === "crypto" ? ["invest", "swing"] : a.kind === "futures" ? ["day"] : ["invest", "swing", "day"];
});
D.items = D.stocks.concat(D.assets);

D.stock = function (t) {
  for (var i = 0; i < D.items.length; i++) if (D.items[i].t === t) return D.items[i];
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

/* ---------------------------------------------------------------------------------------------
   Bari's method track. Source: his own brief (TRADE_MOR, updated 9/10/2026). Summarized, not invented.
   The method is intuition-based: nothing here is a mechanical model or a template.
   Hebrew only for now; English shows a short summary. Real figures are from Bari's journal, not recommendations.
   --------------------------------------------------------------------------------------------- */
function M(id, lv, ti, en, sum, blk, tbl) { return { id: id, lv: lv, track: "method", ti: ti, blk: blk, tbl: tbl || null, body: B("", sum), sum: sum, en: en }; }
D.methodLessons = [
  M("m1", "basic", B("עיקרון-על וארבעת עמודי התווך", "Core idea and the four pillars"), "", "Everything is read by intuition and liquidity. Four pillars: closed and open liquidity, momentum, strength and weakness, and basing plus reaction.", [
    { h: "עיקרון-על" },
    { ul: ["הכל לפי אינטואיציה. אין מדע מדויק: בונים תרחישים ועובדים לפי מה שעובד.", "הכל זה נזילות. FVG, PSP, SMT ו-AMD הם רק שמות. לא הופכים שום דבר למודל או לתבנית.", "הנר מספר את ההיסטוריה של מה שהמחיר עשה באותו טיימפריים."] },
    { h: "ארבעת עמודי התווך" },
    { ul: ["נזילות סגורה ופתוחה: איפה האנרגיה כבר נוצלה ואיפה היא עוד מחכה. הפתוחה היא היעד.", "מומנטום: האם לתנועה יש כוח להמשיך.", "חולשה וחוזקה, משחק כוחות: אצל מי הקלף, הקונים או המוכרים.", "ביסוס ותגובה: הרגע שבו הכל מתחבר."] },
    { p: "הסדר: מוצאים נזילות, בודקים מומנטום וכוחות, מחכים לביסוס ותגובה. הנזילות הפתוחה היא היעד." },
    { p: "כל כלי באתר, כולל הציון של הרדאר, נועד לפתח אינטואיציה ולא להחליף אותה." }]),
  M("m2", "basic", B("הנר מספר סיפור: זמן ושעות קריטיות", "The candle tells a story: time"), "", "Read from the big timeframe to the small one. Small candles build big ones. Know which candles have closed.", [
    { h: "טיימפריימים" },
    { p: "עיקריים: 12M, 6M, 3M, 1M, W, D, 8h/7h/6h, 4h, 3h, 1h, 30m, 15m, 5m, 1m. השאר משמשים לחיזוק." },
    { ul: ["מהגדול לקטן. נרות קטנים בונים גדולים (שרשרת, קינון, פרקטלי).", "הגדול נותן ביסוס, הקטן מראה תגובה.", "העסקה הקטנה יושבת בתוך שרשרת: 8h, יומי, שבועי, ATH."] },
    { h: "טיימינג" },
    { ul: ["לדעת אילו נרות נסגרו. Q4 (אוקטובר, נובמבר, דצמבר) קובע את סגירת השנה. ינואר פותח רבעון, חצי שנה ושנה.", "שעות קריטיות לפי שעון ניו יורק: 17:00 (נסגרים 16h, 8h ו-4h) ו-04:00 (נסגר 3h)."] },
    { p: "בגרפים של ברי: TradingView, נרות שחור-לבן, בלי אינדיקטורים, שעון ניו יורק (UTC-4)." }]),
  M("m3", "mid", B("הכל זה נזילות", "Everything is liquidity"), "", "A level is the high or low of a closed candle. Closed liquidity was taken, open liquidity is the target. Taking requires passing it, ideally with a small precise wick.", [
    { h: "מהי רמה" },
    { ul: ["רמה היא הגבוה או הנמוך של נר סגור. הנר הרלוונטי הוא המשמעותי, לא בהכרח הקודם. ATH הוא סתם גבוה של נר סגור.", "סגורה: נלקחה. פתוחה: לא נלקחה, ולכן היא יעד.", "פנימית (LRL): נלקחת בקלות. פנימית-קיצונית: הפתוחה האחרונה לפני הסגורה, שם בדרך כלל התגובה הראשונה. חיצונית-קיצונית: קיצון התנועה, שם היפוך. הכל יחסי לטיימפריים.", "Protected High או Low הוא סיום משימה, ואין סיבה לחזור אליו.", "בתוך נר: הגבוה והנמוך הם נזילות קיצון, הגוף הוא פנימית."] },
    { h: "רמות חזקות" },
    { ul: ["רמה שמרכזת כמה נזילות (חודשי, 6M ושנתי יחד) היא אזור אנרגיה חזק במיוחד.", "רמה פנימית ליד רמה גדולה היא פנימית טובה. אם הגבוה הבא רחוק מאוד, הוא לא רלוונטי.", "רמה פנימית חזקה היא מרווח בין הנמוכים. נמוכים צפופים (דשדוש) הם חולשה."] },
    { h: "לקיחת נזילות" },
    { ul: ["נגיעה לא מספיקה, חייבים לעבור.", "פתיל קטן ומדויק הוא הכי טוב. חריגה גדולה פחות טובה.", "תנועה בלי לקיחת נזילות היא דשדוש או מניפולציה.", "ML הוא רגל מניפולציה, ולא קורית תמיד."] }]),
  M("m4", "mid", B("מומנטום, חולשה וחוזקה", "Momentum, weakness and strength"), "", "A strong candle has a full body and closes near its extreme. Losing momentum shows as a close below the previous candle's high, and shrinking bodies.", [
    { ul: ["נר חזק: גוף מלא, סגירה ליד הקיצון.", "איבוד מומנטום: סגירה מתחת לגבוה של הנר הקודם. הטוב ביותר הוא נר שלוקח את הגבוה וסוגר מתחתיו.", "גופים מתכווצים הם היחלשות.", "סגירה אידיאלית להיפוך: שחור, מתחת לפתיחה, ליד הנמוך.", "לקיחת נמוך ואז סגירה מעל הגבוה היא מומנטום חזק מאוד (ES 2025). הכל במראה."] }]),
  M("m5", "mid", B("ביסוס, תגובה וארבעת סוגי הסגירה", "Basing, reaction and the four closes"), "", "Basing is taking liquidity with a fitting balance of power. Reaction is a meaningful move from the area. Both are needed. Closes a to d rank from most to least liked.", [
    { p: "ביסוס הוא לקיחת נזילות ויחס כוחות מתאים. תגובה היא סגירה או תנועה משמעותית מהאזור. צריך את שניהם." },
    { p: "התרחיש הכי טוב: נזילות סגורה בצד אחד, פתוחה בצד השני, ומומנטום לכיוון הפתוחה." },
    { h: "ארבעת סוגי הסגירה" },
    { ul: ["a (הכי אהוב): לקיחה, ML וסגירה בכיוון. כל הנזילות סגורה.", "b (טוב): לקיחה וסגירה בכיוון, אבל נשארים נמוכים צמודים פתוחים, וזה מגביל את היעד.", "c (פחות): בלי לקיחה, אבל חזק. לא תמיד רלוונטי.", "d (הכי פחות): סגירה עם מומנטום הפוך בלי ML. מחכים לנר הבא."] }]),
  M("m6", "adv", B("התנהגות נר: תשעה עקרונות", "Candle behavior: nine principles"), "", "Always compare the current candle to the last closed one. A candle that rises first without dipping is weak and looks for energy below. When unclear, let the chart print price.", [
    { ul: [
      "תמיד משווים את הנר הנוכחי לנר הקודם שנסגר.",
      "מה הנר עושה קודם: אם הקודם לקח למעלה ונסגר למטה, והנוכחי עולה קודם בלי לרדת (בלי פתיל), הוא לא אסף אנרגיה. זו עלייה חלשה שמחפשת אנרגיה בירידות. במראה, ללונג. נר שיורד קודם ולוקח נזילות ואז עולה הוא עלייה עם אנרגיה.",
      "עד לאן עלייה חלשה מגיעה: לנזילות הפנימית הקרובה הרלוונטית, עדיף צמודה לרמה גדולה. לוקחת וחוזרת, וזה ביסוס.",
      "כניסה: סגירה בטיימפריים גדול יותר חזקה יותר. מחכים לסגירת 15m ולא נכנסים על 5m. ML שנראה בכמה טיימפריימים חזק יותר. הסטופ מעל ה-Protected High של נר האישור (שם גם ה-SMT). היעד קצת מעבר לנזילות הפתוחה.",
      "לקיחת רווחים לפי אזורי עניין: TP1 בפנימית-קיצונית בזמנים הקטנים, TP2 בפנימית-קיצונית בזמנים הגדולים, והסופי בסוף הטווח של הטיימפריים שעליו נבנתה העסקה. ניהול הסטופ אחרי TP1 לפי אינטואיציה: לפעמים מקדם, לפעמים לא נוגע, לפעמים לכניסה.",
      "העסקה הקטנה יושבת בתוך השרשרת (8h, יומי, שבועי, ATH).",
      "כשהתמונה לא ברורה, נותנים לגרף להדפיס מחיר. הרבה פתילים תחתונים: אין כוח לירידות. פתילים לשני הכיוונים: דשדוש. לא מנבאים. שבוע מדשדש: מחכים לשבוע חדש. יום מדשדש: ליום חדש. ביום הסגירה השבועית מחכים לראות איך השבוע נסגר.",
      "מה רוצים מהנר החדש: אחרי סגירה בכיוון רוצים לראות תנועה בכיוון, ועדיף תיקון קצר קודם. תנועה נגדית ארוכה היא בזבוז זמן ואות אזהרה.",
      "היפוך בלי לקיחת נזילות (למשל ES שלא לקח את הגבוה היומי) פחות אהוב. תגובה חזקה והתרחקות בונות מומנטום, אבל לא נכנסים על ההיפוך עצמו."] }]),
  M("m7", "adv", B("NQ מול ES: קורלציה", "NQ versus ES: correlation"), "", "Same companies, same macro. Lack of correlation means one took liquidity and the other did not. SMT is not the reason for a reversal; the liquidity taken is.", [
    { ul: ["אותן חברות, אותו מאקרו. חוסר קורלציה אומר שנלקחה נזילות או שלא נלקחה.", "SMT הוא לא הסיבה להיפוך. הסיבה היא לקיחת הנזילות.", "אם נכס אחד לקח נזילות חשובה, זה יכול להספיק גם לשני. קורלציה חשובה יותר מחוסר קורלציה.", "חוסר קורלציה איכותי: אחד לוקח קיצונית והשני פנימית-קיצונית."] },
    { h: "גאפים ו-PSP" },
    { ul: ["גאפים הם אזורי נזילות, לרוב קיצון. מתייחסים אליהם רק בכניסה אליהם: מחכים ללקיחה ולתגובה, לא ל\"תמיכה אוטומטית\".", "PSP ו-SMT אינם איתות כניסה. האיכות נמדדת לפי חוזק הנזילות שנלקחה."] }]),
  M("m12", "adv", B("סחיטה בשתי שכבות, פתילים ו-SMT", "Two-layer sweeps, wicks and SMT"), "", "Principles 10 to 13: a sweep has two layers; wick length when the previous candle was not taken; SMT leaves open liquidity; NQ and ES swap roles.", [
    { p: "עקרונות 10 עד 13, נלמדו ב-10/10/2026. כמו כל השיטה: כלים לאינטואיציה, לא נוסחה." },
    { h: "10. סחיטה בשתי שכבות" },
    { ul: ["קודם לוקחים את הרמה הרלוונטית האחרונה בטיימפריים גדול. זה העיקר.", "אחר כך סחיטה אחרונה של הפנימי-קיצוני בטיימפריים אחד מתחת, שיושב ממש מעבר לרמה, וחזרה. הוא נבחר כי הוא הנזילות הפתוחה האחרונה ליד הרמה, ויש מרווח בינו לבין הנר שלפניו. פנימי-קיצוני בתוך פנימי-קיצוני.", "אחרי סחיטה אמיתית לא נשאר מה לאסוף, והאנרגיה מתהפכת.", "דוגמאות: BTC ינואר 2026, ES ב-1/10/2026 למטה עד 7,672.75, ES ב-6/10/2026 למעלה עד 7,897.50."] },
    { h: "11. אורך הפתיל כשלא נלקחה נזילות של הנר הקודם" },
    { ul: ["מיומי ומעלה מדברים על פתילים. נר שירד או עלה קצת והתהפך בלי לקחת את הנר הקודם כנראה לקח נזילות בזמנים קטנים.", "השאלה: איזו נזילות, והאם היא חזקה מספיק מול מה שנלקח בצד השני. סחיטה אמיתית היא חזקה. אם זו רק פנימית, היא חלשה, והנמוך או הגבוה הזה הופך ליעד.", "דוגמה: NQ באוקטובר 2026, פתיל תחתון קטן ב-30,529.25 מול ATH שנלקח למעלה. זה הפך ליעד.", "פתיל תחתון ארוך כשהנר בדרך למעלה אומר עוד כוח לעליות, ולכן ירידה איטית יותר."] },
    { h: "12. SMT משאיר נזילות פתוחה" },
    { ul: ["נכס אחד לוקח והשני לא, אז השני משאיר נזילות פתוחה. צריך לשפוט מתי היא רלוונטית ומתי רחוקה מדי.", "SMT איכותי: אחד לוקח חיצונית-קיצונית והשני רק פנימית-קיצונית."] },
    { h: "13. NQ ו-ES מתחלפים בתפקידים" },
    { ul: ["כל פעם אחד לוקח והשני נשאר \"חייב\" לכיוון שלו. מי שחייב ונסגר חלש מוביל את התנועה.", "לא לשכוח מומנטום: איפה כל נכס נסגר בטווח שלו.", "מדידה: כמה אחוזים ES רחוק מהיעד שלו. אותה תנועה ב-NQ נותנת את הרמה המקבילה."] }]),
  M("m8", "adv", B("סבלנות: מה אוהבים, ממה נזהרים", "Patience: what Bari likes and avoids"), "", "A list of what Bari likes to see and what he avoids. Waiting is part of the method.", [
    { h: "מה ברי אוהב" },
    { ul: ["נזילות סגורה בצד אחד, פתוחה בצד השני, ומומנטום לכיוון הפתוחה.", "פתיל קטן ומדויק.", "נר היפוך שחור ליד הנמוך.", "עוד לקיחה לפני ההיפוך.", "רמה שמרכזת כמה נזילות.", "שני הנכסים לוקחים.", "סגירה a.", "שרשרת שמספרת סיפור אחד."] },
    { h: "ממה ברי נזהר" },
    { ul: ["תנועה בלי לקיחה.", "חריגה גדולה מהרמה.", "סגירה d.", "נמוכים צמודים פתוחים (b).", "ביסוס בלי תגובה.", "להחזיק אחרי היעד.", "עבודה כמו רובוט לפי שם של מודל.", "כניסה באמצע טווח מתוך ניבוי."] }]),
  M("m9", "mid", B("שלושת התרחישים: מושלם, טוב, גרוע", "Three scenarios: perfect, good, bad"), "", "A side-by-side table of a perfect, a good and a bad setup. The data in the linked interactive page is synthetic.", [
    { p: "השוואה בין שלושה מצבים לאותו כלי. הדוגמה האינטראקטיבית של ברי בנויה על נתונים סינתטיים להמחשה בלבד." }],
    { head: ["כלי", "מושלם", "טוב", "גרוע"], rows: [
      ["ביסוס בזמן הגדול", "לקח ATH ונסגר ליד הנמוך (a)", "לקח, השאיר נמוכים צפופים (b)", "לא לקח, נסגר לבן (d)"],
      ["דיוק הסחיטה", "פתיל קטן", "פתיל גדול", "אין"],
      ["נזילות בצד השני", "פתוחה, מרווח בין נמוכים", "פתוחה אבל צפופה", "כבר נלקחה"],
      ["התנהגות הנר החדש", "עולה בלי לרדת, גופים מתכווצים", "עלייה ארוכה ומקרטעת", "יורד קודם ולוקח נזילות"],
      ["ML", "פתיל קטן מעל פנימית טובה", "פתיל גדול", "אין"],
      ["NQ מול ES", "SMT", "שניהם לקחו", "שניהם חזקים"],
      ["אישור", "15m ליד הנמוך", "15m באמצע", "בלי אישור"],
      ["R:R", "כ-1:3.3", "כ-1:2", "1:3 רק על הנייר"],
      ["מה ברי עושה", "נכנס", "נכנס, יעד צנוע, TP1 חשוב", "מחכה"]] }),
  M("m10", "adv", B("מקרים אמיתיים מהיומן של ברי", "Real cases from Bari's journal"), "", "Four documented cases: an NQ short, a choppy Friday, BTC in January 2026 and ES in 2025. Documentation of Bari's own trades, not a recommendation.", [
    { p: "תיעוד של מה שברי עשה וראה, לא המלצה לאף אחד." },
    { h: "שורט NQ, 8/10/2026" },
    { ul: ["השבועי לקח את ATH 31,397.75 (עד 31,616.50).", "נר 8h שחור (גבוה 31,350, נמוך 31,119.75).", "הנר הבא עלה בלי לרדת, כלומר חלש.", "ML לקח 31,350 עד כ-31,370 עם SMT מול ES.", "סגירת 15m שחורה ליד הנמוך.", "כניסה 31,298.25, סטופ 31,361.25, יעד 31,115.25 (כ-1:2.9).", "TP1 כ-31,190, TP2 כ-31,155. הסופי הושג.", "באמצע היה תיקון עד כ-31,300, כמעט לכניסה. שיעור על ניהול סטופ."] },
    { h: "שישי 9/10/2026" },
    { ul: ["דשדוש, פתילים לשני הכיוונים.", "ירידה חזקה תוך-יומית לפני לקיחת הגבוה של 8/10. זה עיקרון 9.", "בסגירה ES כן לקח את הגבוה של 8/10 ו-NQ לא (SMT קטן).", "השבוע: NQ לבן קטן וחלש (31,108.75), ES לבן מלא ליד הגבוה (7,859.75). הם מתחלפים בתפקידים.", "תוכנית לשבוע הבא: ירידה ש-NQ מוביל, לכיוון 30,792 ו-30,356.75."] },
    { h: "סקירה שבועית לדוגמה, 10/10/2026 (לשבוע 11–16/10)" },
    { ul: ["NQ לקח את ה-ATH (חיצונית-קיצונית) ונסגר שבועי לבן קטן וחלש.", "ES לקח רק פנימית-קיצונית ונסגר לבן מלא ליד הגבוה. הם מתחלפים בתפקידים.", "תרחיש: ES לוקח את הגבוה השבועי (7,897.50, ואולי את ה-ATH בכ-7,905), NQ נעצר עד הגבוה של שישי (31,266.50), SMT, וירידה ש-NQ מוביל.", "יעדי NQ: 30,792, אחר כך 30,529.25, אחר כך 30,356.75.", "מבטל: שניהם נסגרים ביומי מעל הגבוה השבועי."] },
    { h: "BTC, ינואר 2026" },
    { ul: ["6M שחור אחרי לקיחת 126,199.", "ינואר עולה בלי פתיל.", "לוקח גבוה חודשי (כ-94,700) ופנימית שבועית (כ-96,000) עד 97,924. זה ביסוס.", "נזילות פתוחה: כ-84,000, כ-80,600 וכ-74,500."] },
    { h: "ES, 2025" },
    { p: "לקח את הנמוך של 2024 ואז נסגר הרבה מעל הגבוה. דוגמה למומנטום חזק אחרי איסוף אנרגיה." }]),
  M("m11", "basic", B("מה עוד לא נכתב", "What is still missing"), "", "Open items in the method: risk management, sessions, weekly preparation, mandatory versus bonus in a setup, a full long example and losing trades.", [
    { p: "אלה הדברים שהשיטה עוד לא מתעדת. הם יתמלאו מהסשנים עם ברי, לא יושלמו על ידי ניחוש." },
    { ul: ["ניהול סיכון: אחוז סיכון לעסקה, הפסד יומי ושבועי מקסימלי, כמה עסקאות ביום.", "שעות וסשנים שבהם ברי סוחר, וימי חדשות.", "תהליך ההכנה השבועית, שלב אחרי שלב.", "מה חובה ומה בונוס בסטאפ, לעקביות הדירוג.", "דוגמת לונג מלאה, ועסקאות הפסד וטעויות טיפוסיות.", "פרמטרים בסיסיים לרדאר: אילו נכסים ומה נזילות המסחר המינימלית."] }])
];
D.lessons = D.methodLessons.concat(D.lessons);

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
