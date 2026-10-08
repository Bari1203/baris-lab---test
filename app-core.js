/* BARI'S LAB: state, shell, navigation, dialogs, music panel, tour. Views live in views-a.js and views-b.js. */
(function () {
"use strict";
var D = window.D, I = window.I18N, AU = window.AU;
var KEY = "bl_state_v2";

function def() {
  return {
    lang: "he", market: "both", styles: { invest: 1, swing: 1, day: 1 }, waiting: {}, theme: "light", reduce: false, role: "user",
    name: "", joined: false, tourDone: false, sectors: [],
    watch: {}, fav: { NVLX: 1 }, journal: null, notifs: null, rules: [], drafts: null,
    prefs: { freq: "instant", qs: "22:00", qe: "07:00", sound: false },
    done: {}, last: null, savedWeeks: {}, pub: [],
    audio: { track: 0, vol: 25, muted: false, eq: [0, 0, 0] },
    f: {}, jv: { view: "month", q: "", type: "", status: "" }
  };
}
var S = def();
try { var raw = localStorage.getItem(KEY); if (raw) S = Object.assign(def(), JSON.parse(raw)); } catch (e) {}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

function $(s, r) { return (r || document).querySelector(s); }
function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
function esc(x) { return String(x == null ? "" : x).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
function t(k, v) {
  var s = I[S.lang] && I[S.lang][k];
  if (s == null) s = I.he[k];
  if (s == null) s = k;
  if (v) for (var x in v) s = s.split("{" + x + "}").join(v[x]);
  return s;
}
function Lx(o) { return o == null ? "" : (typeof o === "string" ? o : (o[S.lang] || o.he || "")); }
function uid() { return "i" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

var ICONS = {
  home: "M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  radar: "M12 3a9 9 0 1 0 9 9M12 7.5a4.5 4.5 0 1 0 4.5 4.5M12 12l7-7",
  wait: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
  weekly: "M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7",
  chart: "M4 20V4M4 20h16M8 15l3-4 3 2 5-7",
  events: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  journal: "M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2zM9 8h6M9 12h6",
  bell: "M6 16v-5a6 6 0 1 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0",
  learn: "M3 9l9-5 9 5-9 5zM7 12v5c3 2 7 2 10 0v-5",
  help: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01",
  history: "M4 12a8 8 0 1 0 3-6.2M4 4v4h4M12 8v4l3 2",
  shield: "M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z",
  settings: "M4 7h10M18 7h2M4 17h2M10 17h10M14 5v4M8 15v4",
  admin: "M4 20h16M6 20V10l6-5 6 5v10M10 20v-5h4v5",
  music: "M9 18V6l10-2v12M9 18a3 3 0 1 1-3-3M19 16a3 3 0 1 1-3-3",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 3.5-6 8-6s8 2 8 6",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  x: "M6 6l12 12M18 6L6 18",
  play: "M8 5l11 7-11 7z",
  pause: "M8 5v14M16 5v14",
  next: "M6 5l9 7-9 7zM18 5v14",
  plus: "M12 5v14M5 12h14",
  expand: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"
};
function ic(n, sz) { return '<svg class="ic" width="' + (sz || 20) + '" height="' + (sz || 20) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (ICONS[n] || "") + '"/></svg>'; }
function logo() { return '<svg width="34" height="34" viewBox="0 0 40 40" fill="none" stroke-linecap="round" stroke-width="5" aria-hidden="true"><path d="M10 8v24" stroke="var(--ink)"/><path d="M10 9h12a6 6 0 0 1 0 12H10" stroke="var(--ink)"/><path d="M10 21h14a6 6 0 0 1 0 12H10" stroke="var(--coral)"/><circle cx="31" cy="9" r="3" fill="var(--mint)" stroke="none"/></svg>'; }

/* dates */
function pad(n) { return n < 10 ? "0" + n : "" + n; }
function ymd(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
function pd(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
function today() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function addDays(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
function loc() { return S.lang === "he" ? "he-IL" : "en-US"; }
function fmtD(d, o) { return new Intl.DateTimeFormat(loc(), o || { day: "numeric", month: "short", year: "numeric" }).format(d); }
function fmtT(ts) { return new Intl.DateTimeFormat(loc(), { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(ts)); }

/* registries */
var ACT = {}, IN = {}, CH = {}, FORM = {}, V = {};
var R = { view: "home", arg: null }, stack = [];

var BL = window.BL = { S: S, t: t, L: Lx, esc: esc, $: $, $$: $$, ic: ic, save: save, uid: uid, ymd: ymd, pd: pd, today: today, addDays: addDays, fmtD: fmtD, fmtT: fmtT, pad: pad, loc: loc,
  ACT: ACT, IN: IN, CH: CH, FORM: FORM, V: V, R: R };

/* settings and regions */
function il() { return S.lang === "he" && S.market !== "us"; }
BL.il = il;
function applySettings() {
  var h = document.documentElement;
  h.lang = S.lang; h.dir = S.lang === "he" ? "rtl" : "ltr";
  if (S.theme === "auto") h.removeAttribute("data-theme"); else h.setAttribute("data-theme", S.theme);
  h.classList.toggle("reduce", !!S.reduce);
}
function setLang(l) { S.lang = l; save(); render(false); }

/* seeds */
function seeds() {
  var d0 = today();
  if (!S.journal) {
    var tg = [t("sampleTag")];
    S.journal = [
      { id: uid(), title: t("seed.j1"), date: ymd(d0), time: "09:30", type: "research", ticker: "NVLX", note: t("seed.j1n"), scn: t("seed.j1s"), check: t("seed.j1c"), chg: t("seed.j1x"), rel: 3, rem: true, tags: tg.slice(), status: "open", exec: "" },
      { id: uid(), title: t("seed.j2"), date: ymd(addDays(d0, 1)), time: "18:00", type: "event", ticker: "", note: t("seed.j2n"), scn: "", check: "", chg: "", rel: 3, rem: true, tags: tg.slice(), status: "open", exec: "" },
      { id: uid(), title: t("seed.j3"), date: ymd(addDays(d0, -2)), time: "20:15", type: "review", ticker: "HLIX", note: t("seed.j3n"), scn: "", check: "", chg: "", rel: 2, rem: false, tags: tg.slice(), status: "closed", exec: "" },
      { id: uid(), title: t("seed.j4"), date: ymd(addDays(d0, 3)), time: "10:00", type: "watch", ticker: "AERN", note: t("seed.j4n"), scn: "", check: "", chg: t("seed.j4x"), rel: 1, rem: false, tags: tg.slice(), status: "open", exec: "" }
    ];
  }
  if (!S.notifs) {
    var n = Date.now();
    S.notifs = [
      { id: uid(), type: "near", ticker: "NVLX", ts: n - 3 * 3600e3, read: false, k: "seed.n1" },
      { id: uid(), type: "zone", ticker: "HLIX", ts: n - 26 * 3600e3, read: false, k: "seed.n2" },
      { id: uid(), type: "event", ticker: "", ts: n - 50 * 3600e3, read: true, k: "seed.n3" },
      { id: uid(), type: "weekly", ticker: "", ts: n - 74 * 3600e3, read: true, k: "seed.n4" }
    ];
  }
  if (!S.drafts) {
    var mk = function (k) { var x = D.scTpl[k]; return { status: "draft", seen: Lx(x.seen), wait: Lx(x.wait), plus: Lx(x.plus), minus: Lx(x.minus) }; };
    S.drafts = { NVLX: mk("liq"), AERN: mk("liq"), DFNX: mk("rng") };
  }
  save();
}

/* shared view helpers */
BL.hint = function (k) { return '<button type="button" class="hint" data-act="hint" aria-expanded="false" aria-label="' + esc(t("hint.what")) + '">?</button><span class="hinttext" hidden>' + t("hint." + k) + "</span>"; };
BL.sampleBadge = function () { return '<span class="sample">' + t("sample") + "</span>"; };
BL.chipSt = function (st) { return '<span class="chip s-' + st + '">' + t("st." + st) + "</span>"; };
BL.unread = function () { return S.notifs ? S.notifs.filter(function (x) { return !x.read; }).length : 0; };
BL.copy = function (text) {
  var p;
  try { p = navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(text) : Promise.reject(); } catch (e) { p = Promise.reject(); }
  p.then(function () { toast(t("copied")); }).catch(function () {
    openModal({ title: t("copy.manual"), body: '<textarea id="cp" rows="9" readonly>' + esc(text) + "</textarea>", mount: function (r) { var a = $("#cp", r); if (a) { a.focus(); a.select(); } } });
  });
};

/* markets: simulated from New York hours, no holidays */
BL.mkt = function () {
  var p = {};
  new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
  var mins = (+p.hour % 24) * 60 + (+p.minute), wk = !(p.weekday === "Sat" || p.weekday === "Sun"), k = "closed";
  if (wk) { if (mins >= 240 && mins < 570) k = "pre"; else if (mins >= 570 && mins < 960) k = "open"; else if (mins >= 960 && mins < 1200) k = "late"; }
  return k;
};

/* navigation */
var NAV = [
  { id: "home", ic: "home", g: "a" }, { id: "radar", ic: "radar", g: "a" }, { id: "wait", ic: "wait", g: "a" }, { id: "weekly", ic: "weekly", g: "a" },
  { id: "charts", ic: "chart", g: "b" }, { id: "events", ic: "events", g: "b", news: 1 },
  { id: "journal", ic: "journal", g: "c" }, { id: "alerts", ic: "bell", g: "c" },
  { id: "learn", ic: "learn", g: "d" }, { id: "help", ic: "help", g: "d" },
  { id: "history", ic: "history", g: "e" }, { id: "israel", ic: "shield", g: "e", il: 1 }, { id: "settings", ic: "settings", g: "e" }, { id: "admin", ic: "admin", g: "e", admin: 1 }
];
function styleOk(n) { return !n.st || n.st.some(function (k) { return BL.style(k); }); }
function newsOn() { return BL.style("day") && S.market !== "il"; }
BL.news = newsOn;
function visibleItems() { return NAV.filter(function (n) { return !(n.il && !il()) && !(n.news && !newsOn()) && !(n.admin && S.role !== "admin") && styleOk(n); }); }
/* modes: market (us / il / both) and style (invest / swing / day, any mix) */
BL.inMarket = function (x) { return S.market === "both" || (x.mkt || "us") === S.market; };
BL.inStyle = function (x) { return !x.sty || x.sty.some(function (k) { return BL.style(k); }); };
BL.vis = function (list) { return list.filter(function (x) { return BL.inMarket(x) && BL.inStyle(x); }); };
/* Israel mode is investing only for now: the stored style choice is kept but not applied */
BL.style = function (k) { return S.market === "il" ? k === "invest" : !!S.styles[k]; };
BL.tfsFor = function () {
  var keys = {};
  Object.keys(S.styles).forEach(function (k) { if (BL.style(k)) D.styleTfs[k].forEach(function (x) { keys[x] = 1; }); });
  var a = D.tfs.filter(function (x) { return keys[x.k]; });
  return a.length ? a : D.tfs;
};
BL.streak = function () {
  var have = {};
  (S.journal || []).forEach(function (e) { if (!(e.tags || []).some(function (g) { return g === "דוגמה" || g === "Sample"; })) have[e.date] = 1; });
  var d = today(), n = 0;
  if (!have[ymd(d)]) d = addDays(d, -1);
  while (have[ymd(d)]) { n++; d = addDays(d, -1); }
  return n;
};
function modesBody() {
  var mk = ["us", "both", "il"], sty = ["invest", "swing", "day"], il1 = S.market === "il", all = !il1 && sty.every(function (k) { return S.styles[k]; });
  return '<p class="muted">' + t("mode.intro") + '</p><h3>' + t("mode.market") + '</h3><div class="seg" role="group" aria-label="' + esc(t("mode.market")) + '">' + mk.map(function (k) { return '<button class="' + (S.market === k ? "on" : "") + '" data-act="setmkt" data-arg="' + k + '" aria-pressed="' + (S.market === k) + '"><b>' + t("mkt." + k) + '</b><span class="xs">' + t("mkt." + k + ".d") + "</span></button>"; }).join("") + "</div>" +
    '<h3>' + t("mode.style") + '</h3><div class="seg" role="group" aria-label="' + esc(t("mode.style")) + '">' + sty.map(function (k) { var on = BL.style(k); return '<button class="' + (on ? "on" : "") + '"' + (il1 && k !== "invest" ? " disabled" : "") + ' data-act="setsty" data-arg="' + k + '" aria-pressed="' + on + '"><b>' + t("sty." + k) + '</b><span class="xs">' + t("sty." + k + ".d") + "</span></button>"; }).join("") + '</div>' + (il1 ? '<p class="xs muted">' + t("mode.il.inv") + "</p>" : '<div class="rowf"><button class="btn sm' + (all ? " on" : "") + '" data-act="styall" aria-pressed="' + all + '">' + t("sty.all") + '</button><span class="xs muted">' + t("mode.multi") + "</span></div>") + '<p class="xs muted">' + t("mode.il.note") + '</p><div class="actions"><button class="btn pri" data-act="modesdone">' + t("mode.done") + "</button></div>";
}
function modesRefresh() { save(); render(false); var b = $("#mbody"); if (b && $("#layer").classList.contains("on")) b.innerHTML = modesBody(); }
BL.openModes = function () { openModal({ title: t("mode.title"), body: modesBody() }); };
BL.modeSummary = function () {
  var sty = ["invest", "swing", "day"].filter(function (k) { return BL.style(k); });
  return { m: t("mkt." + S.market), s: sty.length === 3 ? t("sty.all") : sty.map(function (k) { return t("sty." + k); }).join(" + ") };
};
function visibleView(id) { var n = NAV.filter(function (x) { return x.id === id; })[0]; if (!n) return id === "stock"; return visibleItems().indexOf(n) > -1; }
function navBtn(n, cls) {
  var cur = R.view === n.id || (R.view === "stock" && n.id === "radar");
  return '<button class="' + cls + '" data-act="nav" data-arg="' + n.id + '"' + (cur ? ' aria-current="page"' : "") + ">" + ic(n.ic) + "<span>" + t("nav." + n.id) + "</span></button>";
}
function go(view, arg) {
  stack.push({ view: R.view, arg: R.arg }); if (stack.length > 30) stack.shift();
  R.view = view; R.arg = arg || null; closeModal(); render(true);
}
BL.go = go;
BL.back = function () { var p = stack.pop(); if (p) { R.view = p.view; R.arg = p.arg; render(true); } else go("radar"); };

function renderShell() {
  var items = visibleItems(), groups = ["a", "b", "c", "d", "e"];
  $("#skip").textContent = t("skip");
  $("#side").innerHTML = '<button class="brand" data-act="nav" data-arg="home" aria-label="' + esc(t("nav.home")) + '">' + logo() + '<span class="bt">BARI\'S LAB<small>' + t("brand.sub") + "</small></span></button><nav aria-label=\"" + esc(t("nav.label")) + '">' +
    groups.map(function (g) { var it = items.filter(function (n) { return n.g === g; }); return it.length ? '<div class="ng"><h3>' + t("ng." + g) + "</h3>" + it.map(function (n) { return navBtn(n, "nl"); }).join("") + "</div>" : ""; }).join("") +
    '</nav><p class="rolebadge">' + t("role.now") + ": " + t("role." + S.role) + "</p>";
  var c = BL.unread();
  $("#top").innerHTML = '<button class="brand" data-act="nav" data-arg="home" aria-label="' + esc(t("nav.home")) + '">' + logo() + '<span class="bt">BARI\'S LAB</span></button>' +
    '<div class="gsearch"><span class="si">' + ic("search", 18) + '</span><input type="search" id="gs" data-in="gs" placeholder="' + esc(t("search.ph")) + '" aria-label="' + esc(t("search.ph")) + '" autocomplete="off"><div class="gsr" id="gsr" hidden></div></div><span class="spacer"></span>' +
    '<button class="langbtn" data-act="lang" aria-label="' + esc(t("lang.switch")) + '">' + (S.lang === "he" ? "EN" : "עב") + "</button>" +
    '<button class="iconbtn" data-act="music" aria-label="' + esc(t("music")) + '">' + ic("music") + "</button>" +
    '<button class="iconbtn" data-act="nav" data-arg="alerts" aria-label="' + esc(t("nav.alerts") + (c ? " (" + c + ")" : "")) + '">' + ic("bell") + (c ? '<span class="cnt">' + c + "</span>" : "") + "</button>" +
    '<button class="iconbtn" data-act="profile" aria-label="' + esc(t("profile")) + '">' + ic("user") + "</button>";
  $("#banner").innerHTML = "<span>" + t("banner") + "</span>";
  var main = ["home", "radar", "charts", "journal"].map(function (id) { return NAV.filter(function (n) { return n.id === id; })[0]; });
  var moreCur = main.every(function (n) { return n.id !== R.view && !(R.view === "stock" && n.id === "radar"); });
  $("#bottom").innerHTML = main.map(function (n) { return navBtn(n, ""); }).join("") +
    '<button data-act="more"' + (moreCur ? ' aria-current="page"' : "") + ">" + ic("more") + "<span>" + t("more") + "</span></button>";
  $("#bottom").setAttribute("aria-label", t("nav.label"));
  renderMini();
}
function renderMini() {
  var a = AU.cfg;
  $("#mini").setAttribute("role", "group"); $("#mini").setAttribute("aria-label", t("music"));
  $("#mini").innerHTML = '<button class="iconbtn" data-act="mplay" aria-label="' + esc(AU.playing ? t("mus.pause") : t("mus.play")) + '">' + ic(AU.playing ? "pause" : "play") + '</button><span class="mt">' + t("trk." + D.tracks[a.track]) + '</span><button class="iconbtn" data-act="mnext" aria-label="' + esc(t("mus.next")) + '">' + ic("next") + '</button><button class="iconbtn" data-act="music" aria-label="' + esc(t("mus.open")) + '">' + ic("expand", 18) + "</button>";
}

/* in-page section menu: each big screen gets a short list of its parts, so nothing is a screen inside a screen */
function kd(el) { return Array.prototype.slice.call(el.children); }
function hc(n, c) { return !!(n && n.classList && n.classList.contains(c)); }
function first(k, c) { return k.filter(function (n) { return hc(n, c); })[0]; }
var SUBG = {
  radar: function (k) {
    var i1 = -1, i2 = -1; k.forEach(function (n, i) { if (hc(n, "sectitle")) { if (hc(n, "tight")) { if (i1 < 0) i1 = i; } else if (i2 < 0) i2 = i; } });
    if (i1 < 0 || i2 < 0) return null; var end = k.length; if (k[end - 1].tagName === "P") end--;
    return [["idx", k.slice(i1, i2)], ["stocks", k.slice(i2, end)]];
  },
  wait: function (k) { var i = -1; k.forEach(function (n, j) { if (i < 0 && hc(n, "sectitle")) i = j; }); if (i < 3) return null; return [["mine", k.slice(2, i)], ["sug", k.slice(i)]]; },
  weekly: function (k) {
    var l = first(k, "layer"), g = first(k, "grid"), f = first(k, "folds"); if (!l || !g || !f) return null; var c = kd(f);
    return [["concl", [l]], ["market", [g.children[0]]], ["events", [g.children[1]]], ["radar", [c[0]]], ["wait", [c[1]]], ["new", [c[2]]], ["risks", [c[3], c[4]]]];
  },
  events: function (k) { return k.length > 3 ? [["daily", [k[1]]], ["evlist", k.slice(2)]] : null; },
  journal: function (k) { var g = k[k.length - 1]; return hc(g, "grid") && k.length > 4 ? [["diary", k.slice(2, k.length - 1)], ["summary", [g]]] : null; },
  history: function (k) { return k.length > 4 ? [["counts", [k[2]]], ["recs", [k[1], k[3]]], ["rules", [k[k.length - 1]]]] : null; },
  learn: function (k) { return hc(k[1], "tint") && k.length > 3 ? [["ex", [k[1]]], ["lessons", k.slice(2)]] : null; },
  help: function (k) { return k.length > 5 ? [["faq", [k[1]]], ["works", k.slice(2, 5)], ["gloss", [k[5]]]] : null; }
};
function applySub(el) {
  $$(".subs").forEach(function (n) { n.parentNode.removeChild(n); });
  var fn = SUBG[R.view], gs = null;
  try { gs = fn ? fn(kd(el)) : null; } catch (e) { gs = null; }
  if (!gs) return;
  gs = gs.map(function (g) { return [g[0], g[1].filter(Boolean)]; }).filter(function (g) { return g[1].length; });
  if (gs.length < 2) return;
  S.sub = S.sub || {};
  var cur = S.sub[R.view] || "all";
  if (cur !== "all" && !gs.some(function (g) { return g[0] === cur; })) cur = "all";
  if (cur !== "all") {
    gs.forEach(function (g) { if (g[0] !== cur) g[1].forEach(function (n) { n.hidden = true; }); });
    $$(".grid,.folds", el).forEach(function (c) { if (c.children.length && kd(c).every(function (x) { return x.hidden; })) c.hidden = true; });
  }
  function chips(cls) {
    return [["all", t("sub.all")]].concat(gs.map(function (g) { return [g[0], t("sub." + g[0])]; })).map(function (x, i) {
      return '<button class="' + cls + (x[0] === cur ? " on" : "") + '" style="--i:' + i + '" data-act="sub" data-arg="' + x[0] + '" aria-pressed="' + (x[0] === cur) + '">' + esc(x[1]) + "</button>";
    }).join("");
  }
  var anim = !!BL.subAnim;
  if (anim) { var k2 = 0; gs.forEach(function (g) { if (cur === "all" || g[0] === cur) g[1].forEach(function (n) { if (n.hidden) return; n.classList.add("subin"); n.style.setProperty("--d", (k2++ * 90) + "ms"); }); }); }
  var bar = document.createElement("div");
  bar.className = "subbar pillset scroll" + (anim ? " still" : ""); bar.setAttribute("role", "group"); bar.setAttribute("aria-label", t("sub.label"));
  bar.innerHTML = chips("btn");
  el.insertBefore(bar, el.children[1] || null);
  var cu = $('#side .nl[aria-current="page"]');
  if (cu) { var d = document.createElement("div"); d.className = "subs" + (anim ? " still" : ""); d.innerHTML = chips("sl"); cu.parentNode.insertBefore(d, cu.nextSibling); }
}
ACT.sub = function (id) { S.sub = S.sub || {}; S.sub[R.view] = id; save(); BL.subAnim = true; render(false); BL.subAnim = false; };

/* celebration: confetti and a check mark, like a delivery app after an order */
BL.cele = function (o) {
  o = o || {};
  var red = S.reduce || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  if (red) return;
  var big = !!o.big, root = document.createElement("div"); root.className = "cele" + (big ? " big" : ""); root.setAttribute("aria-hidden", "true");
  var x = window.innerWidth / 2, y = window.innerHeight * 0.42;
  if (!big && o.el && o.el.getBoundingClientRect) { var r = o.el.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; }
  function ring(d, size, dur) { var g = document.createElement("i"); g.className = "ring"; g.style.cssText = "left:" + x + "px;top:" + y + "px;--s:" + size + "px;animation-delay:" + d + "ms;animation-duration:" + dur + "ms"; root.appendChild(g); }
  function star(dx, dy, d, sz) {
    var g = document.createElement("i"); g.className = "spark"; g.style.cssText = "left:" + (x + dx) + "px;top:" + (y + dy) + "px;--z:" + sz + "px;animation-delay:" + d + "ms";
    g.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12z"/></svg>'; root.appendChild(g);
  }
  function burst(n, delay, power, life) {
    for (var i = 0; i < n; i++) {
      var p = document.createElement("i"); p.className = "cf c" + (i % 5) + (i % 3 === 0 ? " dot" : i % 7 === 0 ? " bar" : "");
      p.style.left = x + "px"; p.style.top = y + "px"; p.style.opacity = 0; root.appendChild(p);
      var a = Math.random() * Math.PI * 2, v = power * (0.45 + Math.random() * 0.75), dx = Math.cos(a) * v, dy = Math.sin(a) * v - power * 0.25, rot = Math.random() * 900 - 450, sway = (Math.random() - 0.5) * 70;
      if (p.animate) p.animate([
        { transform: "translate(-50%,-50%) scale(.3) rotate(0deg)", opacity: 0 },
        { transform: "translate(" + dx * 0.8 + "px," + dy * 0.8 + "px) rotate(" + rot * 0.4 + "deg) scale(1.1)", opacity: 1, offset: 0.35 },
        { transform: "translate(" + (dx + sway) + "px," + (dy + power * 0.55) + "px) rotate(" + rot * 0.8 + "deg) scale(1)", opacity: 1, offset: 0.75 },
        { transform: "translate(" + (dx + sway * 1.6) + "px," + (dy + power * 0.9) + "px) rotate(" + rot + "deg) scale(.85)", opacity: 0 }
      ], { duration: life * (0.8 + Math.random() * 0.5), delay: delay + Math.random() * 120, easing: "cubic-bezier(.15,.7,.3,1)", fill: "both" });
    }
  }
  if (big) {
    ring(0, 230, 1500); ring(260, 330, 1700); ring(520, 430, 1900);
    burst(34, 150, 230, 2300); burst(30, 650, 300, 2500); burst(22, 1200, 190, 2200);
    star(-86, -70, 500, 20); star(92, -58, 700, 26); star(-70, 74, 900, 16); star(80, 80, 1050, 22); star(2, -108, 1200, 18);
    var b = document.createElement("div"); b.className = "cbadge";
    b.innerHTML = '<svg viewBox="0 0 52 52" width="92" height="92"><circle class="cc" cx="26" cy="26" r="23"/><path class="ck" d="M15 27.5l7.5 7.5L38 18.5"/></svg>' + (o.cap ? '<span class="ccap">' + esc(o.cap) + "</span>" : "");
    root.appendChild(b);
    var tp = $("#top"); if (tp) { tp.classList.add("cheer"); setTimeout(function () { tp.classList.remove("cheer"); }, 1400); }
  } else {
    ring(0, 90, 800); ring(180, 140, 900);
    burst(22, 40, 90, 1500); star(-26, -22, 120, 14); star(30, -18, 220, 11);
  }
  document.body.appendChild(root);
  setTimeout(function () { if (root.parentNode) root.parentNode.removeChild(root); }, big ? 4600 : 2200);
};

function render(top) {
  applySettings();
  if (!visibleView(R.view)) { R.view = "home"; R.arg = null; }
  try { renderShell(); } catch (e) { console.error(e); }
  var v = V[R.view] || V.home, el = $("#view");
  try {
    el.innerHTML = v.html(R.arg);
    if (v.mount) v.mount(el, R.arg);
  } catch (e) {
    console.error(e);
    el.innerHTML = '<div class="notice">' + esc(t("err.view")) + "</div>";
  }
  try { applySub(el); } catch (e) { console.error(e); }
  el.classList.remove("pg");
  if (top) { void el.offsetWidth; el.classList.add("pg"); window.scrollTo(0, 0); }
  BL.fx(el, top);
}
BL.render = render;

/* small motion helpers: count-up numbers, star pop. Skipped for reduced motion. */
BL.fx = function (el, top) {
  var red = S.reduce || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  if (!red && top) {
    $$("[data-count]", el).forEach(function (n) {
      var to = +n.getAttribute("data-count"), dec = +n.getAttribute("data-dec") || 0, t0 = null;
      if (isNaN(to)) return;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / 700), e = 1 - Math.pow(1 - p, 3);
        n.textContent = (to * e).toFixed(dec);
        if (p < 1) requestAnimationFrame(step); else n.textContent = to.toFixed(dec);
      }
      requestAnimationFrame(step);
    });
  }
  if (BL.popTk) {
    var b = el.querySelector('[data-act="wtog"][data-arg="' + BL.popTk + '"]');
    if (b && !red) b.classList.add("pop");
    BL.popTk = null;
  }
};

/* dialogs */
var lastFocus = null;
function openModal(o) {
  lastFocus = document.activeElement;
  var L = $("#layer");
  L.innerHTML = '<div class="scrim" data-act="close"></div><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="mt"><div class="sh-head"><h2 id="mt">' + esc(o.title) + '</h2><button class="x" data-act="close" aria-label="' + esc(t("close")) + '">' + ic("x") + '</button></div><div class="sh-body" id="mbody">' + o.body + "</div></div>";
  L.classList.add("on"); document.body.classList.add("lock");
  var f = L.querySelector("[autofocus]") || L.querySelector("input,select,textarea") || L.querySelector(".x");
  if (f) f.focus();
  if (o.mount) o.mount(L);
}
function closeModal() {
  var L = $("#layer");
  if (!L.classList.contains("on")) return;
  L.classList.remove("on"); L.innerHTML = ""; document.body.classList.remove("lock");
  if (lastFocus && lastFocus.focus && document.contains(lastFocus)) { try { lastFocus.focus(); } catch (e) {} }
}
BL.openModal = openModal; BL.closeModal = closeModal;
var tt, toastFn = null;
function toast(msg, act) {
  var el = $("#toast");
  el.innerHTML = esc(msg) + (act ? ' <button class="tla" data-act="toastact">' + esc(act.label) + "</button>" : "");
  toastFn = act ? act.fn : null; el.classList.add("on");
  clearTimeout(tt); tt = setTimeout(function () { el.classList.remove("on"); }, act ? 6500 : 2400);
}
BL.toast = toast;

/* sign-up */
function signupBody() {
  return '<p class="muted">' + t("su.intro") + '</p><form data-form="signup" class="stack"><div class="fld"><label for="su-name">' + t("su.name") + '</label><input type="text" id="su-name" value="' + esc(S.name) + '" autocomplete="nickname" autofocus></div><div class="fld"><span class="lb">' + t("su.sectors") + "</span>" +
    D.sectors.map(function (s) { return '<label class="chk"><input type="checkbox" id="su-' + s + '"' + (S.sectors.indexOf(s) > -1 ? " checked" : "") + ">" + t("sec." + s) + "</label>"; }).join("") +
    '</div><p class="notice mint xs">' + t("su.note") + '</p><div class="actions"><button type="button" class="btn" data-act="close">' + t("later") + '</button><button class="btn acc" type="submit">' + t("su.go") + "</button></div></form>";
}
BL.signup = function () { openModal({ title: t("su.title"), body: signupBody() }); };
FORM.signup = function (f) {
  var nm = $("#su-name", f).value.trim();
  if (!nm) { toast(t("su.need")); return; }
  var first = !S.joined;
  S.name = nm; S.joined = true; S.sectors = D.sectors.filter(function (s) { return $("#su-" + s, f).checked; });
  save(); closeModal(); render(false); toast(t("su.ok", { n: nm }));
  if (first) setTimeout(function () { BL.openModes(); }, 450);
};

/* tour */
var TOURV = ["radar", "stock", "stock", "journal", "history"];
function tour(step) {
  openModal({
    title: t("tour.title"),
    body: '<div class="tourstep">' + t("tour.step", { n: step, m: 5 }) + "</div><h3>" + t("tour.t" + step) + "</h3><p>" + t("tour.b" + step) + '</p><div class="actions"><button class="btn ghost" data-act="tourskip">' + t("tour.skip") + '</button><button class="btn" data-act="tourgo" data-arg="' + step + '">' + t("tour.open") + '</button><button class="btn pri" data-act="tournext" data-arg="' + step + '">' + (step < 5 ? t("next") : t("tour.finish")) + "</button></div>"
  });
}
BL.tour = tour;

/* music panel */
function musicBody() {
  var a = AU.cfg, h = '<p class="muted xs">' + t("mus.note") + "</p>";
  if (!AU.supported) h += '<div class="notice">' + t("mus.unsupported") + "</div>";
  h += '<div class="rowf"><button class="btn pri" data-act="mplay">' + t(AU.playing ? "mus.pause" : "mus.play") + '</button><button class="btn" data-act="mprev">' + t("mus.prev") + '</button><button class="btn" data-act="mnext">' + t("mus.next") + "</button></div>";
  h += '<div class="stack">' + D.tracks.map(function (k, i) { return '<button class="tkbtn" data-act="mtrack" data-arg="' + i + '" aria-pressed="' + (a.track === i) + '"><span>' + t("trk." + k) + '</span><span class="xs">' + (a.track === i && AU.playing ? t("mus.now") : "") + "</span></button>"; }).join("") + "</div>";
  h += '<div class="eqrow"><label for="mv">' + t("mus.vol") + '</label><input type="range" id="mv" min="0" max="100" value="' + a.vol + '" data-in="vol"><output id="mvo">' + a.vol + '%</output></div><label class="chk"><input type="checkbox" id="mmute" data-ch="mute"' + (a.muted ? " checked" : "") + ">" + t("mus.mute") + "</label>";
  h += "<h3>" + t("mus.eq") + "</h3>" + ["low", "mid", "high"].map(function (b, i) { return '<div class="eqrow"><label for="eq' + i + '">' + t("mus.eq." + b) + '</label><input type="range" id="eq' + i + '" min="-9" max="9" step="1" value="' + a.eq[i] + '" data-in="eq" data-arg="' + i + '"><output id="eqo' + i + '" class="ltr">' + a.eq[i] + " dB</output></div>"; }).join("");
  h += '<div class="rowf">' + ["flat", "warm", "clear", "soft"].map(function (p) { return '<button class="btn sm" data-act="mpreset" data-arg="' + p + '">' + t("mus.p." + p) + "</button>"; }).join("") + "</div><p class=\"xs muted\">" + t("mus.eqnote") + "</p>";
  return h;
}
function paintMusic() { var b = $("#mbody"); if (b && $("#mv")) b.innerHTML = musicBody(); }
BL.openMusic = function () { openModal({ title: t("music"), body: musicBody() }); };
AU.onchange = function () { renderMini(); paintMusic(); };

/* actions */
ACT.close = function () { closeModal(); };
ACT.nav = function (id) { go(id); };
ACT.open = function (tk) { go("stock", tk); };
ACT.lang = function () { setLang(S.lang === "he" ? "en" : "he"); };
ACT.more = function () {
  openModal({ title: t("more"), body: '<div class="grid g2">' + visibleItems().map(function (n) { return '<button class="btn" data-act="nav" data-arg="' + n.id + '">' + ic(n.ic) + " " + t("nav." + n.id) + "</button>"; }).join("") + '</div><button class="btn" data-act="music">' + ic("music") + " " + t("music") + "</button>" });
};
ACT.profile = function () { if (S.joined) go("settings"); else BL.signup(); };
ACT.signup = function () { BL.signup(); };
ACT.hint = function (a, el) {
  var tx = el.nextElementSibling; if (!tx) return;
  var open = tx.hidden; tx.hidden = !open; el.setAttribute("aria-expanded", open ? "true" : "false");
};
ACT.toastact = function () { var f = toastFn; $("#toast").classList.remove("on"); if (f) f(); };
ACT.music = function () { closeModal(); BL.openMusic(); };
ACT.mplay = function () { if (!AU.toggle() && !AU.playing) toast(t("mus.unsupported")); S.audio = AU.cfg; save(); };
ACT.mnext = function () { AU.next(); save(); };
ACT.mprev = function () { AU.prev(); save(); };
ACT.mtrack = function (i) { AU.setTrack(+i); save(); };
ACT.mpreset = function (p) { AU.preset(p); save(); paintMusic(); };
ACT.tour = function () { tour(1); };
ACT.tourskip = function () { S.tourDone = true; save(); closeModal(); };
ACT.tournext = function (n) { n = +n; if (n < 5) tour(n + 1); else { S.tourDone = true; save(); closeModal(); toast(t("tour.fin")); } };
ACT.tourgo = function (n) { n = +n; S.tourDone = true; save(); go(TOURV[n - 1], n === 1 ? null : "NVLX"); };
ACT.confirm2 = function (fn, el) { /* placeholder replaced per use */ };

IN.vol = function (v) { AU.setVol(v); S.audio = AU.cfg; save(); var o = $("#mvo"); if (o) o.textContent = v + "%"; };
IN.eq = function (v, el, arg) { AU.setEq(+arg, +v); S.audio = AU.cfg; save(); var o = $("#eqo" + arg); if (o) o.textContent = AU.cfg.eq[+arg] + " dB"; };
CH.mute = function (v, el) { AU.setMute(el.checked); S.audio = AU.cfg; save(); };
IN.gs = function (v) {
  var box = $("#gsr"), q = v.trim().toLowerCase();
  if (!q) { box.hidden = true; box.innerHTML = ""; return; }
  var m = BL.vis(D.items).filter(function (s) { return (s.t + " " + Lx(s.n)).toLowerCase().indexOf(q) > -1; }).slice(0, 6);
  box.hidden = false;
  box.innerHTML = m.length ? m.map(function (s) { return '<button data-act="gopen" data-arg="' + s.t + '"><b class="ltr">' + s.t + "</b><span class=\"muted sm\">" + esc(Lx(s.n)) + "</span></button>"; }).join("") : '<div class="muted sm" style="padding:10px">' + t("search.none") + "</div>";
};
ACT.gopen = function (tk) { go("stock", tk); };
ACT.modes = function () { BL.openModes(); };
ACT.setmkt = function (k) { S.market = k; modesRefresh(); };
ACT.setsty = function (k) { S.styles[k] = S.styles[k] ? 0 : 1; if (!S.styles.invest && !S.styles.swing && !S.styles.day) S.styles = { invest: 1, swing: 1, day: 1 }; modesRefresh(); };
ACT.modesdone = function () { closeModal(); if (S.joined && !S.tourDone) setTimeout(function () { tour(1); }, 300); };
ACT.styall = function () { S.styles = { invest: 1, swing: 1, day: 1 }; modesRefresh(); };

/* two-step confirm helper for destructive buttons */
BL.confirmClick = function (el, fn) {
  if (el._arm) { el._arm = false; fn(); return; }
  el._arm = true; var old = el.textContent; el.textContent = t("confirm.again");
  setTimeout(function () { el._arm = false; if (document.contains(el)) el.textContent = old; }, 4000);
};

/* events */
document.addEventListener("click", function (e) {
  var gs = $("#gsr"); if (gs && !gs.hidden && !e.target.closest(".gsearch")) gs.hidden = true;
  var el = e.target.closest("[data-act]"); if (!el) return;
  var fn = ACT[el.getAttribute("data-act")]; if (!fn) return;
  if (el.tagName === "A") e.preventDefault();
  fn(el.getAttribute("data-arg"), el, e);
});
document.addEventListener("input", function (e) { var el = e.target.closest("[data-in]"); if (!el) return; var fn = IN[el.getAttribute("data-in")]; if (fn) fn(el.value, el, el.getAttribute("data-arg")); });
document.addEventListener("change", function (e) { var el = e.target.closest("[data-ch]"); if (!el) return; var fn = CH[el.getAttribute("data-ch")]; if (fn) fn(el.value, el, el.getAttribute("data-arg")); });
document.addEventListener("submit", function (e) { var f = e.target.closest("[data-form]"); if (!f) return; e.preventDefault(); var fn = FORM[f.getAttribute("data-form")]; if (fn) fn(f, e); });
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    if ($("#layer").classList.contains("on")) { closeModal(); return; }
    var ex = $(".chart.exp"); if (ex) { ex.classList.remove("exp"); BL.redrawChart && BL.redrawChart(); return; }
  }
  if (e.key === "Enter" && e.target.id === "gs") { var b = $("#gsr button"); if (b) b.click(); return; }
  if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches('[role="button"][data-act]')) { e.preventDefault(); e.target.click(); return; }
  if (e.key === "Tab" && $("#layer").classList.contains("on")) {
    var f = $$("#layer button,#layer input,#layer select,#layer textarea,#layer [tabindex]").filter(function (x) { return !x.disabled && x.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
var rz; window.addEventListener("resize", function () { clearTimeout(rz); rz = setTimeout(function () { if (BL.redrawChart) BL.redrawChart(); }, 150); });

BL.start = function () {
  AU.cfg = S.audio; if (!AU.cfg.eq) AU.cfg.eq = [0, 0, 0];
  applySettings(); seeds(); render(false);
};
})();
