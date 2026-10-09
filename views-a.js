/* Views A: home, radar, stock research page, waiting room, weekly review, chart center. */
(function () {
"use strict";
var BL = window.BL, D = window.D, S = BL.S, t = BL.t, Lx = BL.L, esc = BL.esc, ic = BL.ic, V = BL.V, ACT = BL.ACT, IN = BL.IN, CH = BL.CH, FORM = BL.FORM;
var today = BL.today, addDays = BL.addDays;

function ltr(s) { return '<bdi class="ltr">' + esc(s) + "</bdi>"; }
function money(n, dec) { return (+n).toFixed(dec == null ? 2 : dec); }
function ab(s) { return s.ab || s.t.slice(0, 2); }
function zoneTxt(s) { return money(s.zone[0], s.dec) + " – " + money(s.zone[1], s.dec); }
function distTxt(s) { var d = D.dist(s); return d.inside ? t("dist.in") : t("dist." + d.side, { p: d.pct.toFixed(1) }); }
function updTxt(s) { return t("f.updated") + ": " + BL.fmtD(addDays(today(), -s.upd), { day: "numeric", month: "short" }); }
function kv(k, v, x) { return '<div class="kv"><span class="k">' + k + '</span><span class="v">' + v + "</span>" + (x ? '<span class="xs muted">' + x + "</span>" : "") + "</div>"; }
function dots(n) { var h = '<span class="dots" aria-hidden="true">'; for (var i = 1; i <= 3; i++) h += '<i class="' + (i <= n ? "on" : "") + '"></i>'; return h + "</span>"; }
function chg(s) { var d = D.series("sp|" + s.t, 32, 1.8, s.price), a = d[0].c, b = d[d.length - 1].c; return (b - a) / a * 100; }
function chgChip(s) { var c = chg(s), up = c >= 0; return '<span class="chg ' + (up ? "up" : "dn") + '">' + (up ? "▲ +" : "▼ ") + c.toFixed(1) + "%</span>"; }
BL.spark = function (s, W, H) {
  W = W || 120; H = H || 40;
  var d = D.series("sp|" + s.t, 32, 1.8, s.price).map(function (c) { return c.c; }), mn = Math.min.apply(null, d), mx = Math.max.apply(null, d);
  var pts = d.map(function (v, i) { return [(i * W / (d.length - 1)), 4 + (mx - v) / ((mx - mn) || 1) * (H - 8)]; });
  var line = pts.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" "), lp = pts[pts.length - 1];
  return '<svg class="spk ' + (d[d.length - 1] >= d[0] ? "up" : "dn") + '" viewBox="0 0 ' + W + " " + H + '" aria-hidden="true"><path class="sa" d="' + line + " L" + W + " " + H + " L0 " + H + ' Z"/><path class="sl" pathLength="1" d="' + line + '"/><circle class="sd" cx="' + lp[0].toFixed(1) + '" cy="' + lp[1].toFixed(1) + '" r="3.2"/></svg>';
};
function starSvg(on, sz) { return '<svg class="ic" width="' + sz + '" height="' + sz + '" viewBox="0 0 24 24" fill="' + (on ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>'; }
function tile(s) {
  var sc = D.score(s), w = !!S.watch[s.t], st = s.kind === "stock";
  return '<article class="tile st-' + s.st + '" role="button" tabindex="0" data-act="open" data-arg="' + s.t + '" aria-label="' + esc(s.t + " " + Lx(s.n)) + '">' +
    '<div class="th"><span class="av">' + esc(ab(s)) + '</span><div class="tn"><b class="ltr">' + s.t + '</b><span class="xs muted">' + esc(Lx(s.n)) + '</span></div><button class="iconbtn starb' + (w ? " on" : "") + '" data-act="wtog" data-arg="' + s.t + '" aria-pressed="' + w + '" aria-label="' + esc(t(w ? "watch.remove" : "watch.add") + " " + s.t) + '">' + starSvg(w, 22) + "</button></div>" +
    '<div class="tp"><div class="px"><b class="num ltr">' + money(s.price, s.dec) + "</b>" + chgChip(s) + "</div>" + BL.spark(s) + "</div>" +
    '<div class="tf">' + BL.chipSt(s.st) + '<span class="xs muted">' + distTxt(s) + "</span>" + (st ? '<span class="sring" style="--v:' + sc + '" role="img" aria-label="' + esc(t("f.score") + " " + sc) + '"><b>' + sc + "</b></span>" : '<span class="chip kind">' + t("sec." + s.sec) + "</span>") + "</div>" +
    '<p class="twhy">' + esc(Lx(s.why)) + "</p></article>";
}
function spot(s) {
  var w = !!S.watch[s.t];
  return '<article class="spot st-' + s.st + '" role="button" tabindex="0" data-act="open" data-arg="' + s.t + '" aria-label="' + esc(Lx(s.n) + " " + s.t) + '">' +
    '<div class="th"><span class="av">' + esc(ab(s)) + '</span><div class="tn"><b>' + esc(Lx(s.n)) + '</b><span class="xs muted ltr">' + s.t + '</span></div><button class="iconbtn starb' + (w ? " on" : "") + '" data-act="wtog" data-arg="' + s.t + '" aria-pressed="' + w + '" aria-label="' + esc(t(w ? "watch.remove" : "watch.add") + " " + s.t) + '">' + starSvg(w, 22) + "</button></div>" +
    '<div class="px"><b class="num ltr" data-count="' + s.price + '" data-dec="' + (s.dec == null ? 2 : s.dec) + '">' + money(s.price, s.dec) + "</b>" + chgChip(s) + "</div>" + BL.spark(s, 240, 64) +
    '<div class="tf">' + BL.chipSt(s.st) + '<span class="xs muted">' + distTxt(s) + "</span></div></article>";
}
function spots(list) { return '<div class="spots">' + list.map(spot).join("") + "</div>"; }
function stories() {
  var a = BL.vis(D.items).sort(function (x, y) { return (S.watch[y.t] ? 1 : 0) - (S.watch[x.t] ? 1 : 0); });
  return '<div class="stories">' + a.map(function (s) {
    var rg = s.st === "zone" ? "zone" : s.st === "near" ? "near" : S.watch[s.t] ? "watch" : "none";
    return '<button class="story rg-' + rg + '" data-act="open" data-arg="' + s.t + '" aria-label="' + esc(s.t + ", " + t("st." + s.st)) + '"><span class="ring"><span class="av">' + esc(ab(s)) + '</span></span><span class="xs ltr">' + s.t + "</span></button>";
  }).join("") + "</div>";
}
function tape() {
  var one = BL.vis(D.items).map(function (s) { var c = chg(s), up = c >= 0; return '<button class="tk" data-act="open" data-arg="' + s.t + '"><b class="ltr">' + s.t + '</b><span class="num ltr">' + money(s.price, s.dec) + '</span><span class="chg ' + (up ? "up" : "dn") + '">' + (up ? "▲ +" : "▼ ") + c.toFixed(1) + "%</span></button>"; }).join("");
  return '<div class="tape" role="region" aria-label="' + esc(t("tape.l")) + '"><div class="tape-in">' + one + '<span class="dup" aria-hidden="true">' + one.replace(/<button /g, '<button tabindex="-1" ') + "</span></div></div>";
}

function pubFor(tk) { var a = S.pub.filter(function (p) { return p.t === tk; }); return a.length ? a[a.length - 1] : null; }
BL.evDate = function (e) { var d = new Date(); return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate() + e.d, e.h, e.m)); };
BL.fmtEv = function (e, tz) { return new Intl.DateTimeFormat(BL.loc(), { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: tz || undefined }).format(BL.evDate(e)); };
BL.eventsNext = function (n) { var now = Date.now(); return D.events.filter(function (e) { return BL.evDate(e).getTime() >= now; }).sort(function (a, b) { return (a.imp === "high" ? 0 : 1) - (b.imp === "high" ? 0 : 1) || BL.evDate(a) - BL.evDate(b); }).slice(0, n); };

/* ------------------------------------------------------------ home */
function heroSvg() {
  var data = D.series("hero-bari", 26, 2.6), W = 560, H = 320, pad = 14, n = data.length + 1;
  var mn = Math.min.apply(null, data.map(function (x) { return x.l; })), mx = Math.max.apply(null, data.map(function (x) { return x.h; }));
  var ph = H - 2 * pad - 24, y = function (v) { return pad + (mx - v) / (mx - mn) * ph; };
  var step = (W - 2 * pad) / n, bw = step * 0.56, out = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(t("hero.lbl")) + '" style="direction:ltr">';
  for (var i = 0; i < 4; i++) out += '<line x1="' + pad + '" x2="' + (W - pad) + '" y1="' + (pad + i * ph / 3) + '" y2="' + (pad + i * ph / 3) + '" stroke="rgba(245,241,232,.12)"/>';
  var last = data[data.length - 1].c;
  out += '<rect x="' + (W * 0.55) + '" y="' + y(last * 1.04) + '" width="' + (W * 0.45 - pad) + '" height="' + (y(last * 0.96) - y(last * 1.04)) + '" fill="rgba(200,226,216,.12)"/><text x="' + (W - pad - 6) + '" y="' + (y(last * 1.04) + 16) + '" text-anchor="end" font-size="12" fill="rgba(245,241,232,.7)">' + esc(t("hero.zone")) + "</text>";
  data.forEach(function (c, i) {
    var x = pad + step * (i + 0.5), up = c.c >= c.o, col = up ? "#C8E2D8" : "#F17462", top = y(Math.max(c.o, c.c)), hh = Math.max(2, Math.abs(y(c.o) - y(c.c)));
    out += '<g class="cd" style="--i:' + i + '"><line x1="' + x + '" x2="' + x + '" y1="' + y(c.h) + '" y2="' + y(c.l) + '" stroke="' + col + '" stroke-width="2" stroke-linecap="round"/><rect x="' + (x - bw / 2) + '" y="' + top + '" width="' + bw + '" height="' + hh + '" rx="2" fill="' + col + '"/></g>';
  });
  var nx = pad + step * (n - 0.5);
  out += '<g class="cn"><rect x="' + (nx - bw / 2 - 2) + '" y="' + (pad + 30) + '" width="' + (bw + 4) + '" height="' + (ph - 40) + '" rx="6" fill="none" stroke="#F5F1E8" stroke-width="1.5" stroke-dasharray="5 5" opacity=".75"/><text x="' + nx + '" y="' + (pad + 30 + (ph - 40) / 2 + 8) + '" text-anchor="middle" font-size="22" font-weight="700" fill="#F5F1E8">?</text></g></svg>';
  return out;
}
function homeCard(title, body, act, icon) { return '<section class="card hc"><div class="rowf" style="justify-content:space-between;margin-bottom:10px;flex-wrap:nowrap"><div class="rowf" style="flex-wrap:nowrap;gap:10px">' + (icon ? '<span class="hci">' + ic(icon, 20) + "</span>" : "") + '<h2 style="margin:0;font-size:18px">' + title + "</h2></div>" + (act || "") + "</div>" + body + "</section>"; }
function goBtn(view, label) { return '<button class="btn sm ghost" data-act="nav" data-arg="' + view + '">' + label + "</button>"; }

V.home = {
  html: function () {
    var hr = new Date().getHours(), g = hr < 5 ? "night" : hr < 12 ? "morning" : hr < 17 ? "noon" : hr < 21 ? "evening" : "night";
    var mk = BL.mkt(), name = S.name ? ", " + esc(S.name) : "", sm = BL.modeSummary(), sk = BL.streak(), items = BL.vis(D.items);
    var h = tape();
    h += '<section class="hero"><div><div class="meta"><span>' + t("greet." + g) + name + "</span><span>" + BL.fmtD(new Date(), { weekday: "long", day: "numeric", month: "long" }) + '</span><span class="chip">' + t("mk." + mk) + "</span>" +
      (sk ? '<span class="chip streak">' + t("streak.n", { n: sk }) + "</span>" : '<button class="chip streak" data-act="jnew">' + t("streak.start") + "</button>") + "</div>" +
      "<h1>" + t("tagline") + '</h1><p class="slogan ltr">DEFINE YOUR RANGE – IDENTIFY YOUR TARGET</p><p class="sub">' + t("hero.sub") + '</p><div class="cta"><button class="btn acc" data-act="exercise">' + t("hero.try") + "</button>" +
      (S.joined ? '<button class="btn" data-act="nav" data-arg="journal">' + t("hero.journal") + "</button>" : '<button class="btn" data-act="signup">' + t("hero.join") + "</button>") +
      '</div></div><div class="hchart">' + heroSvg() + '<p class="cap">' + t("hero.cap") + "</p></div></section>";
    h += '<button class="modebar" data-act="modes" aria-label="' + esc(t("mode.title")) + '"><span class="mb-l">' + t("mode.mine") + '</span><span class="mp">' + sm.m + '</span><span class="mp">' + sm.s + '</span><span class="mb-r">' + t("mode.change") + "</span></button>";
    var idx = items.filter(function (s) { return s.kind === "index"; });
    if (idx.length) h += '<div class="sectitle tight"><h2>' + t("home.indices") + '</h2><span class="sample">' + t("sample") + "</span></div>" + spots(idx);
    h += '<div class="sectitle tight"><h2>' + t("home.stories") + "</h2></div>" + stories();
    h += '<div class="qas">' +
      '<button class="qa c1" data-act="jnew"><span class="qi">' + ic("plus", 22) + "</span>" + t("qa.journal") + "</button>" +
      '<button class="qa c2" data-act="rnew"><span class="qi">' + ic("bell", 22) + "</span>" + t("qa.alert") + "</button>" +
      '<button class="qa c3" data-act="exercise"><span class="qi">' + ic("learn", 22) + "</span>" + t("qa.ex") + "</button>" +
      '<button class="qa c4" data-act="nav" data-arg="wait"><span class="qi">' + ic("wait", 22) + "</span>" + t("qa.wait") + "</button></div>";
    var near = items.filter(function (s) { return (s.st === "near" || s.st === "zone") && s.kind !== "index"; }).sort(function (a, b) { return D.dist(a).pct - D.dist(b).pct; });
    if (near.length) h += '<div class="sectitle"><h2>' + t("home.near") + '</h2><button class="btn sm ghost" data-act="nav" data-arg="radar">' + t("nav.radar") + '</button></div><div class="rail">' + near.slice(0, 6).map(tile).join("") + "</div>";
    var ch = items.filter(function (s) { return s.upd <= 2; }).slice(0, 4);
    var wl = Object.keys(S.watch).filter(function (k) { return S.watch[k] && D.stock(k) && BL.inMarket(D.stock(k)); });
    var evs = BL.eventsNext(2);
    var nextJ = (S.journal || []).filter(function (e) { return e.rem && e.status === "open" && e.date >= BL.ymd(today()); }).sort(function (a, b) { return (a.date + a.time).localeCompare(b.date + b.time); })[0];
    var lesson = D.lessons.filter(function (l) { return l.id === S.last; })[0] || D.lessons[0];
    var done = Object.keys(S.done).filter(function (k) { return S.done[k]; }).length;
    var wkc = D.weeks[0];
    h += '<div class="sectitle"><h2>' + t("home.now") + '</h2></div><div class="grid g3 hgrid">';
    h += homeCard(t("home.changed"), ch.length ? '<div class="stack">' + ch.map(function (s) { return '<div><button class="btn sm ghost" data-act="open" data-arg="' + s.t + '"><b class="ltr">' + s.t + "</b></button> " + esc(Lx(s.ch)) + "</div>"; }).join("") + "</div>" : '<p class="muted">' + t("home.nochange") + "</p>", goBtn("radar", t("nav.radar")), "radar");
    if (BL.news()) h += homeCard(t("home.events"), evs.length ? '<div class="stack">' + evs.map(function (e) { return "<div><span class=\"chip " + (e.imp === "high" ? "hi" : e.imp === "med" ? "med" : "low") + '">' + t("imp." + e.imp) + "</span> " + esc(Lx(e.n)) + '<div class="xs muted">' + BL.fmtEv(e) + "</div></div>"; }).join("") + "</div>" : '<p class="muted">' + t("home.noev") + "</p>", goBtn("events", t("nav.events")), "events");
    if (BL.style("invest") || BL.style("swing")) h += homeCard(t("home.weekly"), "<p>" + esc(Lx(wkc.concl)) + "</p>" + '<p class="xs muted" style="margin-top:6px">' + BL.sampleBadge() + "</p>", goBtn("weekly", t("nav.weekly")), "weekly");
    h += homeCard(t("home.watch"), wl.length ? '<div class="rowf">' + wl.map(function (k) { return '<button class="btn sm" data-act="open" data-arg="' + k + '"><b class="ltr">' + k + "</b></button>"; }).join("") + "</div>" : '<div class="empty"><span>' + t("home.watch.empty") + '</span><button class="btn sm" data-act="nav" data-arg="radar">' + t("nav.radar") + "</button></div>", "", "star");
    var wn = Object.keys(S.waiting).filter(function (k) { return D.stock(k) && BL.inMarket(D.stock(k)); });
    h += homeCard(t("nav.wait"), wn.length ? '<div class="stack">' + wn.slice(0, 3).map(function (k) { return '<div><button class="btn sm ghost" data-act="open" data-arg="' + k + '"><b class="ltr">' + k + "</b></button> " + esc(S.waiting[k].note) + "</div>"; }).join("") + "</div>" : '<p class="muted">' + t("wait.empty.short") + "</p>", goBtn("wait", t("nav.wait")), "wait");
    h += homeCard(t("home.learn"), "<h3>" + esc(Lx(lesson.ti)) + '</h3><div class="progress" style="margin:8px 0"><i style="width:' + Math.round(done / D.lessons.length * 100) + '%"></i></div><p class="xs muted">' + t("learn.prog", { a: done, b: D.lessons.length }) + "</p>", '<button class="btn sm ghost" data-act="lesson" data-arg="' + lesson.id + '">' + t("learn.cont") + "</button>", "learn");
    h += homeCard(t("home.journal"), nextJ ? "<h3>" + esc(nextJ.title) + '</h3><p class="sm muted">' + BL.fmtD(BL.pd(nextJ.date)) + " " + esc(nextJ.time) + "</p>" : '<p class="muted">' + t("home.nojournal") + "</p>", goBtn("journal", t("nav.journal")), "journal");
    h += homeCard(t("home.bari"), "<p>" + t("home.bari.t", { n: D.stocks.filter(function (s) { return s.sc; }).length }) + '</p><p class="xs muted" style="margin-top:6px">' + t("home.bari.n") + "</p>", goBtn("history", t("nav.history")), "history");
    h += "</div>";
    return h;
  }
};
ACT.exercise = function () { BL.go("learn", "exercise"); };

/* ------------------------------------------------------------ radar */
function rf() { var f = S.f.radar || (S.f.radar = { q: "", sec: "", st: "", sp: "", flag: "all", sort: "score" }); if (!f.asset) f.asset = "eq"; if (!f.view) f.view = "all"; return f; }
var stockRow = tile;
function radarList() {
  var f = rf(), q = f.q.trim().toLowerCase();
  var a = BL.vis(D.stocks).filter(function (s) {
    if (f.view === "mine" && !S.watch[s.t]) return false;
    if (q && (s.t + " " + Lx(s.n)).toLowerCase().indexOf(q) < 0) return false;
    if (f.sec && s.sec !== f.sec) return false;
    if (f.st && s.st !== f.st) return false;
    if (f.sp && s.sp !== f.sp) return false;
    if (f.flag === "new" && !s.isNew) return false;
    if (f.flag === "upd" && s.upd > 2) return false;
    if (f.flag === "near" && !(s.st === "near" || s.st === "zone")) return false;
    if (f.flag === "watch" && !S.watch[s.t]) return false;
    return true;
  });
  a.sort(function (x, y) { return f.sort === "ticker" ? x.t.localeCompare(y.t) : f.sort === "dist" ? D.dist(x).pct - D.dist(y).pct : D.score(y) - D.score(x); });
  if (a.length) return a.map(tile).join("");
  if (f.view === "mine" && !Object.keys(S.watch).length) return '<div class="empty" style="grid-column:1/-1"><strong>' + t("radar.mine.empty") + '</strong><span>' + t("radar.mine.empty.t") + '</span><button class="btn sm" data-act="rview" data-arg="all">' + t("radar.all") + "</button></div>";
  return '<div class="empty" style="grid-column:1/-1"><strong>' + t("radar.none") + '</strong><button class="btn sm" data-act="rreset">' + t("radar.clear") + "</button></div>";
}
function opt(v, label, cur) { return '<option value="' + v + '"' + (cur === v ? " selected" : "") + ">" + esc(label) + "</option>"; }
V.radar = {
  html: function () {
    var f = rf(), assets = BL.vis(D.assets), kinds = {};
    assets.forEach(function (a) { kinds[a.kind === "index" ? "eq" : a.kind] = 1; });
    if (BL.vis(D.stocks).length) kinds.eq = 1;
    var order = ["eq", "futures", "crypto", "fx"].filter(function (k) { return kinds[k]; });
    if (!kinds[f.asset]) f.asset = order[0] || "eq";
    var h = '<div class="ph"><div><h1>' + t("radar.h") + "</h1><p>" + t("radar.sub") + '</p></div><span class="sample">' + t("sample.all") + "</span></div>";
    if (order.length > 1) h += '<div class="seg tabs" role="tablist" aria-label="' + esc(t("radar.assets")) + '">' + order.map(function (k) { return '<button role="tab" class="' + (f.asset === k ? "on" : "") + '" aria-selected="' + (f.asset === k) + '" data-act="rasset" data-arg="' + k + '">' + (k === "eq" && !assets.some(function (x) { return x.kind === "index"; }) ? t("as.stocks") : t("as." + k)) + "</button>"; }).join("") + "</div>";
    if (f.asset === "eq") {
      var idx = assets.filter(function (a) { return a.kind === "index"; });
      if (idx.length) h += '<div class="sectitle tight"><h2>' + t("radar.indices") + '</h2></div>' + spots(idx);
      var stocks = BL.vis(D.stocks);
      if (!stocks.length) {
        h += '<div class="empty" style="margin-top:18px"><strong>' + t("radar.il.empty") + '</strong><span>' + t("radar.il.empty.t") + '</span><button class="btn sm" data-act="setmkt" data-arg="both">' + t("radar.il.go") + "</button></div>";
        return h;
      }
      h += '<div class="sectitle"><h2>' + t("radar.stocks") + '</h2><div class="seg mini" role="group"><button class="' + (f.view === "all" ? "on" : "") + '" data-act="rview" data-arg="all" aria-pressed="' + (f.view === "all") + '">' + t("radar.all") + '</button><button class="' + (f.view === "mine" ? "on" : "") + '" data-act="rview" data-arg="mine" aria-pressed="' + (f.view === "mine") + '">' + t("radar.mine") + " (" + Object.keys(S.watch).filter(function (k) { return S.watch[k] && D.stock(k) && D.stock(k).kind === "stock"; }).length + ")</button></div></div>";
      h += '<div class="toolbar"><div class="grow"><label class="vh" for="rq">' + t("radar.search") + '</label><input type="search" id="rq" class="bigsearch" data-in="rq" placeholder="' + esc(t("radar.search")) + '" value="' + esc(f.q) + '"></div></div>';
      h += '<div class="pillset scroll" style="margin-bottom:12px" role="group" aria-label="' + esc(t("f.flags")) + '">' + ["all", "new", "upd", "near", "watch"].map(function (k) { return '<button class="btn' + (f.flag === k ? " on" : "") + '" data-act="rflag" data-arg="' + k + '" aria-pressed="' + (f.flag === k) + '">' + t("flag." + k) + "</button>"; }).join("") + "</div>";
      h += '<details class="filt"><summary>' + t("radar.more") + '</summary><div class="fgrid">' +
        '<select id="rsec" data-ch="rf" data-arg="sec" aria-label="' + esc(t("f.sector")) + '">' + opt("", t("all.sec"), f.sec) + D.sectors.map(function (s) { return opt(s, t("sec." + s), f.sec); }).join("") + "</select>" +
        '<select id="rst" data-ch="rf" data-arg="st" aria-label="' + esc(t("f.status")) + '">' + opt("", t("all.st"), f.st) + D.statuses.map(function (s) { return opt(s, t("st." + s), f.st); }).join("") + "</select>" +
        '<select id="rsp" data-ch="rf" data-arg="sp" aria-label="' + esc(t("f.spec")) + '">' + opt("", t("all.sp"), f.sp) + ["low", "mid", "high"].map(function (s) { return opt(s, t("sp." + s), f.sp); }).join("") + "</select>" +
        '<select id="rso" data-ch="rf" data-arg="sort" aria-label="' + esc(t("f.sort")) + '">' + opt("score", t("sort.score"), f.sort) + opt("dist", t("sort.dist"), f.sort) + opt("ticker", t("sort.ticker"), f.sort) + "</select></div></details>";
      h += '<div class="tiles" id="rlist">' + radarList() + "</div>";
      h += '<p class="xs muted" style="margin-top:16px">' + t("radar.foot") + "</p>";
    } else {
      var list = assets.filter(function (a) { return a.kind === f.asset; });
      h += '<div class="notice mint" style="margin:6px 0 14px">' + t("as." + f.asset + ".n") + "</div>" + spots(list);
      h += '<p class="xs muted" style="margin-top:16px">' + t("radar.foot2") + "</p>";
    }
    return h;
  }
};
IN.rq = function (v) { rf().q = v; BL.save(); document.getElementById("rlist").innerHTML = radarList(); };
CH.rf = function (v, el, key) { rf()[key] = v; BL.save(); document.getElementById("rlist").innerHTML = radarList(); };
ACT.rflag = function (k) { rf().flag = k; BL.save(); BL.render(false); };
ACT.rasset = function (k) { rf().asset = k; BL.save(); BL.render(false); };
ACT.rview = function (k) { rf().view = k; BL.save(); BL.render(false); };
ACT.rreset = function () { S.f.radar = { q: "", sec: "", st: "", sp: "", flag: "all", sort: "score", asset: rf().asset, view: rf().view }; BL.save(); BL.render(false); };
ACT.wtog = function (tk, el, ev) {
  if (ev) ev.stopPropagation();
  if (S.watch[tk]) { delete S.watch[tk]; BL.toast(t("watch.removed", { t: tk })); } else { S.watch[tk] = 1; BL.toast(t("watch.added", { t: tk })); BL.cele({ el: el }); }
  BL.popTk = tk; BL.save(); BL.render(false);
};

/* ------------------------------------------------------------ stock page */
function newsItems(s) {
  var d = today();
  if (s.kind !== "stock") return [{ k: "cat", ev: addDays(d, s.ev + 10), pub: addDays(d, -s.upd - 5), title: t("news.cat"), mean: t("news.cat.m") }];
  return [
    { k: "report", ev: addDays(d, s.ev), pub: addDays(d, -s.upd - 2), title: t("news.report", { n: Lx(s.n) }), mean: t("news.report.m") },
    { k: "news", ev: addDays(d, -s.upd - 1), pub: addDays(d, -s.upd), title: t("news.pr", { n: Lx(s.n) }), mean: t("news.pr.m") },
    { k: "cat", ev: addDays(d, s.ev + 40), pub: addDays(d, -s.upd - 5), title: t("news.cat"), mean: t("news.cat.m") }
  ];
}
function fold(title, inner, open) {
  return '<details class="fold"' + (open ? " open" : "") + "><summary>" + title + '</summary><div class="foldb">' + inner + "</div></details>";
}
function layer1(s) {
  if (s.kind !== "stock") return '<section class="layer l1"><p class="xs muted">' + t("l1.sub") + "</p><p>" + esc(Lx(s.biz)) + '</p><div class="stack">' + kv(t("f.spec"), t("sp." + s.sp)) + '</div><p class="xs">' + BL.sampleBadge() + " " + t("l1.asset") + "</p></section>";
  var h = '<section class="layer l1"><p class="xs muted">' + t("l1.sub") + "</p><p>" + esc(Lx(s.biz)) + "</p>";
  h += '<div class="stack">' + kv(t("f.spec"), t("sp." + s.sp)) + ["rev", "margin", "cash", "dil", "val", "risk"].map(function (k) { return '<div class="kv"><span class="k">' + t("l1." + k) + '</span><span class="v">' + t("l1.ph") + "</span></div>"; }).join("") + "</div>";
  h += '<p class="xs">' + BL.sampleBadge() + " " + t("l1.note") + '</p><div><button class="btn sm" disabled aria-disabled="true">' + t("act.tv") + '</button><p class="xs muted" style="margin-top:6px">' + t("act.tv.n") + "</p></div></section>";
  return h;
}
function layer2(s) {
  if (s.kind !== "stock") return '<section class="layer l2"><p class="xs">' + t("l2.sub") + "</p><div><h3>" + t("l2.sent") + '</h3><p class="sm">' + t("l2.sent.t") + '</p></div><p class="xs">' + BL.sampleBadge() + " " + t("l2.asset") + "</p></section>";
  var hh = BL.hash || D.hash(s.t), b = 3 + hh % 5, ho = 2 + (hh >> 3) % 4, se = hh % 3;
  var h = '<section class="layer l2"><p class="xs">' + t("l2.sub") + "</p>";
  h += "<div><h3>" + t("l2.analysts") + '</h3><div class="rowf"><span class="chip up">' + t("an.buy") + " " + b + '</span><span class="chip">' + t("an.hold") + " " + ho + '</span><span class="chip dn">' + t("an.sell") + " " + se + '</span></div><p class="xs" style="margin-top:6px">' + BL.sampleBadge() + " " + t("an.note", { d: BL.fmtD(addDays(today(), -s.upd)) }) + "</p></div>";
  h += "<div><h3>" + t("l2.sent") + '</h3><p class="sm">' + t("l2.sent.t") + '</p><p class="xs">' + BL.sampleBadge() + " " + t("l2.sent.n") + "</p></div>";
  h += '<div class="kv"><span class="k">' + t("l2.rel") + '</span><span class="v">' + t("l1.ph") + "</span></div></section>";
  return h;
}
function layer3(s) {
  var pb = pubFor(s.t), h = '<section class="layer l3"><div><h2>' + t("l3.title") + " " + BL.hint("scn") + '</h2><p class="xs muted">' + t("l3.sub") + "</p></div>";
  if (!s.sc && !pb) return h + '<p>' + t("l3.empty") + '</p><p class="xs muted">' + t("l3.empty.n") + "</p></section>";
  var tp = s.sc ? D.scTpl[s.sc] : null, src = pb ? { seen: pb.seen, wait: pb.wait, plus: pb.plus, minus: pb.minus } : { seen: Lx(tp.seen), wait: Lx(tp.wait), plus: Lx(tp.plus), minus: Lx(tp.minus) };
  h += '<div class="rowf">' + (pb ? '<span class="chip">' + t("l3.pubdemo", { v: pb.ver }) + "</span>" : '<span class="sample">' + t("l3.sample") + "</span>") + '<span class="chip">' + t("hz." + s.hz) + "</span></div>";
  h += '<div class="fld3"><b>' + t("l3.seen") + "</b><span>" + esc(src.seen) + "</span></div>";
  h += '<div class="fld3"><b>' + t("l3.wait") + "</b><span>" + esc(src.wait) + "</span></div>";
  h += '<details class="fold3"><summary>' + t("stock.more3") + '</summary><div class="stack">';
  h += '<div class="fld3"><b>' + t("l3.written") + "</b><span>" + BL.fmtD(pb ? new Date(pb.ts) : addDays(today(), -s.upd - 3)) + "</span></div>";
  h += '<div class="fld3"><b>' + t("l3.zone") + "</b><span>" + ltr(zoneTxt(s)) + " " + (pb ? "" : BL.sampleBadge()) + "</span></div>";
  h += '<div class="fld3"><b>' + t("l3.plus") + "</b><span>" + esc(src.plus) + "</span></div>";
  h += '<div class="fld3"><b>' + t("l3.minus") + "</b><span>" + esc(src.minus) + "</span></div>";
  h += '<div class="fld3"><b>' + t("l3.hist") + '</b><span class="xs">' + t("l3.hist.t") + "</span></div></div></details></section>";
  return h;
}
function stkTf() { var l = BL.tfsFor().map(function (x) { return x.k; }), k = S.f.stk; if (l.indexOf(k) > -1) return k; return l.indexOf("M3") > -1 ? "M3" : l[0]; }
V.stock = {
  html: function (tk) {
    var s = D.stock(tk);
    if (!s) return '<div class="empty"><strong>' + t("stock.nf") + '</strong><button class="btn" data-act="nav" data-arg="radar">' + t("nav.radar") + "</button></div>";
    var sc = D.score(s), w = !!S.watch[s.t], tfl = BL.tfsFor(), tf = stkTf(), isS = s.kind === "stock", inW = !!S.waiting[s.t];
    var h = '<div class="shead2"><div class="rowf" style="justify-content:space-between"><button class="btn sm" data-act="back">' + (S.lang === "he" ? "→ " : "← ") + t("back") + '</button><span class="sample">' + t("sample.all") + "</span></div>";
    h += '<div class="sid"><span class="av big">' + ab(s) + '</span><div><h1 class="ltr">' + s.t + '</h1><div class="sm muted">' + esc(Lx(s.n)) + "</div></div></div>";
    h += '<div class="bigp"><b class="num ltr" data-count="' + s.price + '" data-dec="' + (s.dec == null ? 2 : s.dec) + '">' + money(s.price, s.dec) + "</b>" + chgChip(s) + '</div><p class="xs muted">' + updTxt(s) + ", " + t("src.sample") + '</p><div class="rowf"><span class="chip">' + t("sec." + s.sec) + "</span>" + BL.chipSt(s.st) + '<span class="chip">' + t("sp." + s.sp) + "</span></div></div>";
    h += '<section class="chart chartcard rv"><div class="pillset tfs" role="group" aria-label="' + esc(t("ch.tf")) + '">' + tfl.map(function (x) { var k = x.k; return '<button class="btn sm' + (tf === k ? " on" : "") + '" data-act="stf" data-arg="' + k + '" aria-pressed="' + (tf === k) + '">' + t("tf." + k) + "</button>"; }).join("") + '</div><div id="sch"></div><div class="tip" id="tip"></div></section>';
    h += '<div class="qas five"><button class="qa c1' + (w ? " on" : "") + '" data-act="wtog" data-arg="' + s.t + '" aria-pressed="' + w + '"><span class="qi">' + starSvg(w, 22) + "</span>" + t(w ? "watch.on" : "watch.add") + '</button><button class="qa c3" data-act="addj" data-arg="' + s.t + '"><span class="qi">' + ic("journal", 22) + "</span>" + t("act.journal") + '</button><button class="qa c2" data-act="addalert" data-arg="' + s.t + '"><span class="qi">' + ic("bell", 22) + "</span>" + t("act.alert") + '</button><button class="qa c4" data-act="gochart" data-arg="' + s.t + '"><span class="qi">' + ic("chart", 22) + "</span>" + t("act.chart") + '</button><button class="qa c1' + (inW ? " on" : "") + '" data-act="wadd" data-arg="' + s.t + '" aria-pressed="' + inW + '"><span class="qi">' + ic("wait", 22) + "</span>" + t(inW ? "act.inwait" : "act.wait") + "</button></div>";
    h += '<div class="callout ' + s.st + '">' + (isS ? '<div class="sring big" style="--v:' + sc + '" role="img" aria-label="' + esc(t("f.score") + " " + sc) + '"><b data-count="' + sc + '">' + sc + "</b></div>" : "") + '<div><p class="plain">' + (D.dist(s).inside ? t("stock.plain.in", { st: t("st." + s.st) }) : t("stock.plain", { st: t("st." + s.st), d: distTxt(s) })) + " " + BL.hint("status") + '</p><p class="xs muted" style="margin-top:4px">' + t("f.zone") + ": " + ltr(zoneTxt(s)) + " " + BL.hint("zone") + "</p>" + (isS ? '<p class="xs muted">' + t("f.score") + " " + ltr(sc + " / 100") + " · " + '<span class="chip tier ' + D.tier(sc) + '">' + t("tier." + D.tier(sc)) + "</span> · " + t("model.v") + " " + BL.hint("score") + "</p>" : "") + "</div></div>";
    h += '<div style="margin-top:18px">' + layer3(s) + "</div>";
    h += '<h2 class="foldh">' + t("stock.folds") + "</h2>";
    h += '<div class="folds">';
    h += fold(t("l1.title"), layer1(s)) + fold(t("l2.title"), layer2(s));
    if (isS) h += fold(t("bd.title"), '<p class="xs muted" style="margin-bottom:12px">' + t("bd.sub") + '</p><p class="notice mint xs" style="margin-bottom:12px">' + t("bd.intu") + '</p><div class="bars">' + D.comps.map(function (c, i) { var pc = s.p[i] / D.weights[i] * 100; return '<div class="bar"><span>' + t("comp." + c) + '</span><span class="meter" role="img" aria-label="' + s.p[i] + "/" + D.weights[i] + '"><i style="width:' + pc + '%"></i></span><span class="num ltr">' + s.p[i] + " / " + D.weights[i] + "</span></div>"; }).join("") + "</div>");
    h += fold(t("news.title"), newsItems(s).map(function (n) { return '<div class="newsli"><div><span class="chip">' + t("news.k." + n.k) + "</span> <b>" + esc(n.title) + '</b></div><div class="xs muted">' + t("news.ev") + ": " + BL.fmtD(n.ev) + ", " + t("news.pub") + ": " + BL.fmtD(n.pub) + '</div><div class="sm">' + esc(n.mean) + '</div><div class="xs">' + BL.sampleBadge() + " " + t("news.src") + "</div></div>"; }).join(""));
    h += fold(t("tl.title"), '<ul class="tl"><li><span class="dot c"></span><div><b>' + t("tl.enter") + '</b><div class="xs muted">' + BL.fmtD(addDays(today(), -s.upd - 20)) + '</div></div></li><li><span class="dot"></span><div><b>' + t("tl.upd") + '</b><div class="xs muted">' + BL.fmtD(addDays(today(), -s.upd)) + "</div><div class=\"sm\">" + esc(Lx(s.ch)) + '</div></div></li></ul><p class="xs" style="margin-top:10px">' + BL.sampleBadge() + " " + t("tl.note") + "</p>");
    h += "</div>";
    return h;
  },
  mount: function (el, tk) {
    var s = D.stock(tk), host = document.getElementById("sch");
    if (!s || !host) return;
    var k = stkTf(), x = D.tfs.filter(function (y) { return y.k === k; })[0] || D.tfs[2];
    drawChart(host, D.series(tk + "|" + k, 60, x.vol, s.price), s.zone, { label: t("ch.lbl") + " " + s.t, h: host.clientWidth < 520 ? 260 : 340, dec: s.dec });
  }
};
ACT.stf = function (k) { S.f.stk = k; BL.save(); BL.render(false); };
ACT.back = function () { BL.back(); };
ACT.addalert = function (tk) { BL.openRule({ ticker: tk }); };
ACT.addj = function (tk) { BL.openEntry({ ticker: tk, type: "research" }); };
ACT.gochart = function (tk) { BL.go("charts", tk); };

/* ------------------------------------------------------------ waiting room */
function waitKeys() { return Object.keys(S.waiting).filter(function (k) { var s = D.stock(k); return s && BL.inMarket(s); }); }
V.wait = {
  html: function () {
    var keys = waitKeys();
    var h = '<div class="ph"><div><h1>' + t("wait.h") + "</h1><p>" + t("wait.sub") + '</p></div><button class="btn acc" data-act="wnew">' + ic("plus", 18) + " " + t("wait.add") + "</button></div>";
    h += '<div class="notice mint" style="margin-bottom:14px">' + t("wait.rule") + "</div>";
    if (!keys.length) h += '<div class="empty"><strong>' + t("wait.empty") + "</strong><span>" + t("wait.empty.t") + '</span><button class="btn acc" data-act="wnew">' + t("wait.add") + "</button></div>";
    else h += '<div class="grid g2">' + keys.map(function (k) {
      var s = D.stock(k), e = S.waiting[k];
      return '<article class="card wcard"><div class="th"><span class="av">' + esc(ab(s)) + '</span><div class="tn"><b class="ltr" style="font-size:19px">' + s.t + '</b><span class="xs muted">' + esc(Lx(s.n)) + "</span></div>" + BL.chipSt(s.st) + '</div><div class="waitnote"><span class="xs">' + t("wait.waiting") + "</span><p>" + esc(e.note || t("wait.nonote")) + '</p></div><div class="tp"><div class="px"><b class="num ltr">' + money(s.price, s.dec) + "</b>" + chgChip(s) + "</div>" + BL.spark(s) + '</div><div class="kv"><span class="k">' + t("f.zone") + '</span><span class="v">' + ltr(zoneTxt(s)) + '</span><span class="xs muted">' + distTxt(s) + '</span></div><div class="rowf"><button class="btn sm" data-act="wedit" data-arg="' + s.t + '">' + t("edit") + '</button><button class="btn sm" data-act="addalert" data-arg="' + s.t + '">' + t("act.alert") + '</button><button class="btn sm ghost" data-act="open" data-arg="' + s.t + '">' + t("act.research") + '</button><button class="btn sm ghost" data-act="wrem" data-arg="' + s.t + '">' + t("wait.remove") + "</button></div></article>";
    }).join("") + "</div>";
    var sug = BL.vis(D.items).filter(function (s) { return (s.st === "wait" || s.st === "near") && !S.waiting[s.t]; }).slice(0, 6);
    if (sug.length) h += '<div class="sectitle"><h2>' + t("wait.sug") + '</h2><span class="sample">' + t("sample") + '</span></div><p class="xs muted" style="margin:-4px 0 10px">' + t("wait.sug.t") + '</p><div class="grid g3">' + sug.map(function (s) {
      return '<article class="card"><div class="th"><span class="av">' + esc(ab(s)) + '</span><div class="tn"><b class="ltr">' + s.t + '</b><span class="xs muted">' + distTxt(s) + "</span></div></div><p class=\"sm\" style=\"margin:10px 0\">" + esc(Lx(s.miss)) + '</p><button class="btn sm" data-act="wsug" data-arg="' + s.t + '">' + t("wait.add") + "</button></article>";
    }).join("") + "</div>";
    return h;
  }
};
BL.openWait = function (tk) {
  var all = BL.vis(D.items), e = tk && S.waiting[tk];
  var body = '<form data-form="wait" class="stack"><div class="fld"><label for="wa-tk">' + t("wait.which") + '</label><select id="wa-tk"' + (e ? " disabled" : "") + ">" + all.map(function (s) { return '<option value="' + s.t + '"' + (s.t === tk ? " selected" : "") + ">" + s.t + " · " + esc(Lx(s.n)) + "</option>"; }).join("") + '</select></div><div class="fld"><label for="wa-note">' + t("wait.what") + '</label><textarea id="wa-note" autofocus>' + esc(e ? e.note : tk && D.stock(tk) ? Lx(D.stock(tk).miss) : "") + '</textarea><span class="xs muted">' + t("wait.what.n") + '</span></div><div class="actions"><button type="button" class="btn" data-act="close">' + t("cancel") + '</button><button class="btn acc" type="submit">' + t("save") + "</button></div></form>";
  BL.openModal({ title: t("wait.add"), body: body });
};
FORM.wait = function (f) {
  var tk = f.querySelector("#wa-tk").value, note = f.querySelector("#wa-note").value.trim();
  S.waiting[tk] = { note: note, ts: (S.waiting[tk] && S.waiting[tk].ts) || Date.now() };
  BL.save(); BL.closeModal(); BL.render(false); BL.toast(t("wait.saved", { t: tk })); BL.cele({ big: 1, cap: t("cele.wait", { t: tk }) });
};
ACT.wnew = function () { BL.openWait(); };
ACT.wadd = function (tk) { BL.openWait(tk); };
ACT.wedit = function (tk) { BL.openWait(tk); };
ACT.wsug = function (tk) { S.waiting[tk] = { note: Lx(D.stock(tk).miss), ts: Date.now() }; BL.save(); BL.render(false); BL.toast(t("wait.saved", { t: tk })); BL.cele({ big: 1, cap: t("cele.wait", { t: tk }) }); };
ACT.wrem = function (tk) {
  var old = S.waiting[tk]; delete S.waiting[tk]; BL.save(); BL.render(false);
  BL.toast(t("wait.removed", { t: tk }), { label: t("undo"), fn: function () { S.waiting[tk] = old; BL.save(); BL.render(false); } });
};

/* ------------------------------------------------------------ weekly review */
function weekRange(w) { var d = today(), mon = addDays(d, -((d.getDay() + 6) % 7) + w.off); return { a: mon, b: addDays(mon, 6) }; }
function weekText(i) {
  var w = D.weeks[i], r = weekRange(w);
  return t("weekly.h") + " " + BL.fmtD(r.a) + " – " + BL.fmtD(r.b) + "\n" + t("sample.all") + "\n\n" + t("wk.market") + ": " + Lx(w.mkt) + "\n\n" + t("wk.concl") + ": " + Lx(w.concl) + "\n\n" + t("wk.risks") + ": " + Lx(w.risks) + "\n\n" + t("disc.short");
}
function nqesBody(i) {
  var none = '<span class="muted">' + t("wk.nq.none") + "</span>", b = i === 0;
  return '<p class="xs muted" style="margin-bottom:10px">' + t("wk.nq.sub") + "</p>" + kv(t("wk.nq.asset"), "NQ / ES") + kv(t("wk.nq.bias"), b ? t("wk.nq.down") : none) + kv(t("wk.nq.range"), none) + kv(t("wk.nq.target"), b ? '<span class="num ltr">30,792 · 30,356</span>' : none) + kv(t("wk.nq.cancel"), none) +
    (b ? '<p class="xs" style="margin-top:10px"><span class="chip">' + t("wk.nq.bari") + "</span> " + t("wk.nq.src") + "</p>" : "");
}
V.weekly = {
  html: function () {
    var i = S.f.wk || 0, w = D.weeks[i], r = weekRange(w), sv = !!S.savedWeeks[i], items = BL.vis(D.items);
    var h = '<div class="ph"><div><h1>' + t("weekly.h") + "</h1><p>" + t("weekly.sub") + '</p></div><span class="sample">' + t("sample.all") + "</span></div>";
    h += '<div class="pillset scroll" style="margin-bottom:14px" role="group" aria-label="' + esc(t("wk.pick")) + '">' + D.weeks.map(function (x, k) { var rr = weekRange(x); return '<button class="btn' + (k === i ? " on" : "") + '" data-act="wkpick" data-arg="' + k + '" aria-pressed="' + (k === i) + '">' + BL.fmtD(rr.a, { day: "numeric", month: "short" }) + " – " + BL.fmtD(rr.b, { day: "numeric", month: "short" }) + "</button>"; }).join("") + "</div>";
    h += '<section class="layer l3"><h2>' + t("wk.concl") + "</h2><p style=\"font-size:18px\">" + esc(Lx(w.concl)) + '</p><p class="xs muted">' + BL.sampleBadge() + " " + t("wk.concl.n") + "</p></section>";
    var evs = i === 0 ? BL.eventsNext(3) : [];
    h += '<div class="grid g2" style="margin-top:14px"><section class="card"><h2>' + t("wk.market") + '</h2><p>' + esc(Lx(w.mkt)) + '</p><p class="xs muted" style="margin-top:8px">' + t("wk.ai") + "</p></section>";
    if (BL.news()) h += '<section class="card"><h2>' + t("wk.events") + "</h2>" + (evs.length ? '<div class="stack">' + evs.map(function (e) { return "<div><span class=\"chip " + (e.imp === "high" ? "hi" : e.imp === "med" ? "med" : "low") + '">' + t("imp." + e.imp) + "</span> " + esc(Lx(e.n)) + '<div class="xs muted">' + BL.fmtEv(e) + "</div></div>"; }).join("") + "</div>" : '<p class="muted">' + t("wk.noev") + "</p>") + "</section>";
    h += "</div>";
    h += '<div class="folds" style="margin-top:14px">';
    h += fold(t("wk.nqes"), nqesBody(i));
    h += fold(t("wk.radar"), '<div class="stack">' + (items.filter(function (s) { return s.upd <= 2; }).map(function (s) { return '<div><button class="btn sm ghost" data-act="open" data-arg="' + s.t + '"><b class="ltr">' + s.t + "</b></button> " + esc(Lx(s.ch)) + "</div>"; }).join("") || '<p class="muted">' + t("home.nochange") + "</p>") + "</div>", true);
    var wk = waitKeys();
    h += fold(t("wk.wait"), '<div class="stack">' + (wk.length ? wk.map(function (k) { return '<div><button class="btn sm ghost" data-act="open" data-arg="' + k + '"><b class="ltr">' + k + "</b></button> " + esc(S.waiting[k].note) + "</div>"; }).join("") : '<p class="muted">' + t("wait.empty.short") + "</p>") + "</div>");
    h += fold(t("wk.new"), (D.stocks.filter(function (s) { return s.isNew && BL.inMarket(s); }).map(function (s) { return '<div><button class="btn sm ghost" data-act="open" data-arg="' + s.t + '"><b class="ltr">' + s.t + "</b></button> " + esc(Lx(s.why)) + "</div>"; }).join("") || '<p class="muted">' + t("wk.nonew") + "</p>") + '<h3 style="margin-top:14px">' + t("wk.scn") + '</h3><p class="sm muted">' + t("wk.scn.t") + "</p>");
    h += fold(t("wk.risks"), "<p>" + esc(Lx(w.risks)) + '</p><h3 style="margin-top:14px">' + t("wk.sources") + '</h3><p class="sm muted">' + t("wk.sources.t") + "</p>");
    h += fold(t("wk.cover"), kv(t("wk.cover"), BL.fmtD(r.a) + " – " + BL.fmtD(r.b)) + kv(t("wk.published"), t("wk.nopub")) + kv(t("wk.data"), t("wk.nodata")));
    h += "</div>";
    h += '<div class="rowf" style="margin-top:14px"><button class="btn' + (sv ? " on" : "") + '" data-act="wksave" data-arg="' + i + '" aria-pressed="' + sv + '">' + t(sv ? "wk.saved" : "wk.save") + '</button><button class="btn" data-act="wkcopy" data-arg="' + i + '">' + t("wk.copy") + '</button><button class="btn" data-act="wkj" data-arg="' + i + '">' + t("wk.tojournal") + "</button></div>";
    h += '<p class="xs muted" style="margin-top:14px">' + t("disc.short") + "</p>";
    return h;
  }
};
ACT.wkpick = function (i) { S.f.wk = +i; BL.save(); BL.render(false); };
ACT.wksave = function (i) { S.savedWeeks[i] = !S.savedWeeks[i]; BL.save(); BL.toast(t(S.savedWeeks[i] ? "wk.saved.t" : "wk.unsaved.t")); BL.render(false); if (S.savedWeeks[i]) BL.cele({ big: 1, cap: t("cele.week") }); };
ACT.wkcopy = function (i) { BL.copy(weekText(+i)); };
ACT.wkj = function (i) { var r = weekRange(D.weeks[+i]); BL.openEntry({ type: "review", title: t("weekly.h") + " " + BL.fmtD(r.a, { day: "numeric", month: "short" }) }); };

/* ------------------------------------------------------------ chart center */
var CHS = { t: "NVLX", tf: "D1", q: "", tab: "all" };
function chartData() { var s = D.stock(CHS.t), tf = D.tfs.filter(function (x) { return x.k === CHS.tf; })[0]; return D.series(CHS.t + "|" + CHS.tf, 60, tf.vol, s.price); }
function drawChart(host, data, zone, opt) {
  opt = opt || {};
  var dc = opt.dec == null ? 2 : opt.dec;
  var W = Math.max(280, host.clientWidth || 600), H = opt.h || (W < 520 ? 300 : 400), m = { l: 8, r: 54, t: 12, b: 28 };
  var hi = Math.max.apply(null, data.map(function (c) { return c.h; })), lo = Math.min.apply(null, data.map(function (c) { return c.l; }));
  if (zone) { hi = Math.max(hi, zone[1]); lo = Math.min(lo, zone[0]); }
  var padv = (hi - lo) * 0.06; hi += padv; lo -= padv;
  var y = function (v) { return m.t + (hi - v) / (hi - lo) * (H - m.t - m.b); };
  var n = data.length, step = (W - m.l - m.r) / n, bw = Math.max(2, step * 0.6);
  var s = '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(opt.label || t("ch.lbl")) + '" style="direction:ltr">';
  for (var i = 0; i < 5; i++) { var v = lo + (hi - lo) * i / 4; s += '<line class="gl" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(v) + '" y2="' + y(v) + '"/><text class="ax" x="' + (W - m.r + 6) + '" y="' + (y(v) + 4) + '">' + v.toFixed(dc) + "</text>"; }
  if (zone) {
    s += '<rect class="zone" x="' + m.l + '" y="' + y(zone[1]) + '" width="' + (W - m.l - m.r) + '" height="' + (y(zone[0]) - y(zone[1])) + '"/><line class="zl" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(zone[1]) + '" y2="' + y(zone[1]) + '"/><line class="zl" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(zone[0]) + '" y2="' + y(zone[0]) + '"/><text class="ax" x="' + (m.l + 6) + '" y="' + (y(zone[1]) - 5) + '" style="fill:var(--coral-deep)">' + esc(t("ch.zone")) + "</text>";
  }
  data.forEach(function (c, k) {
    var x = m.l + step * (k + 0.5), up = c.c >= c.o, cls = up ? "up" : "dn", top = y(Math.max(c.o, c.c)), hh = Math.max(1.5, Math.abs(y(c.o) - y(c.c)));
    s += '<g class="' + cls + '"><line class="wk ' + cls + '" x1="' + x + '" x2="' + x + '" y1="' + y(c.h) + '" y2="' + y(c.l) + '" stroke-width="1.5"/><rect x="' + (x - bw / 2) + '" y="' + top + '" width="' + bw + '" height="' + hh + '" rx="1" stroke-width="0"/></g>';
  });
  [0, 15, 30, 45, 59].forEach(function (k) { if (k < n) s += '<text class="ax" x="' + (m.l + step * (k + 0.5)) + '" y="' + (H - 8) + '" text-anchor="middle">' + (k - (n - 1)) + "</text>"; });
  s += '<line class="cross" id="xh" x1="0" x2="0" y1="' + m.t + '" y2="' + (H - m.b) + '" style="display:none"/>';
  s += '<rect id="hit" x="' + m.l + '" y="0" width="' + (W - m.l - m.r) + '" height="' + H + '" fill="transparent"/></svg>';
  host.innerHTML = s;
  var tip = document.getElementById(opt.tip || "tip"), svg = host.querySelector("svg"), xh = host.querySelector("#xh");
  function info(c, k) {
    if (!tip) return;
    var up = c.c >= c.o;
    tip.innerHTML = '<span class="chip ' + (up ? "up" : "dn") + '">' + t(up ? "ch.up" : "ch.down") + "</span><span>" + t("ch.o") + " <b class=\"ltr\">" + c.o.toFixed(dc) + "</b></span><span>" + t("ch.h") + " <b class=\"ltr\">" + c.h.toFixed(dc) + "</b></span><span>" + t("ch.l") + " <b class=\"ltr\">" + c.l.toFixed(dc) + "</b></span><span>" + t("ch.c") + " <b class=\"ltr\">" + c.c.toFixed(dc) + "</b></span>";
  }
  info(data[n - 1], n - 1);
  function mv(e) {
    var r = svg.getBoundingClientRect(), x = e.clientX - r.left, k = Math.max(0, Math.min(n - 1, Math.floor((x - m.l) / step)));
    xh.style.display = ""; var cx = m.l + step * (k + 0.5); xh.setAttribute("x1", cx); xh.setAttribute("x2", cx); info(data[k], k);
  }
  var hit = host.querySelector("#hit");
  hit.addEventListener("pointermove", mv); hit.addEventListener("pointerdown", mv);
  hit.addEventListener("pointerleave", function () { xh.style.display = "none"; info(data[n - 1], n - 1); });
}
BL.drawChart = drawChart;
BL.redrawChart = function () { var host = document.getElementById("chart"); if (host && V.charts && BL.R.view === "charts") drawChart(host, chartData(), D.stock(CHS.t).zone, { dec: D.stock(CHS.t).dec }); };

function chList() {
  var q = CHS.q.trim().toLowerCase();
  var a = BL.vis(D.items).filter(function (s) { return (!q || (s.t + " " + Lx(s.n)).toLowerCase().indexOf(q) > -1) && (CHS.tab === "all" || S.fav[s.t]); });
  return a.length ? a.map(function (s) {
    var f = !!S.fav[s.t];
    return '<div class="rowf" style="flex-wrap:nowrap;gap:2px"><button style="flex:1" data-act="chpick" data-arg="' + s.t + '" aria-pressed="' + (CHS.t === s.t) + '"><span><b class="ltr">' + s.t + '</b> <span class="xs">' + esc(Lx(s.n)) + '</span></span></button><button class="iconbtn" data-act="chfav" data-arg="' + s.t + '" aria-pressed="' + f + '" aria-label="' + esc(t(f ? "fav.remove" : "fav.add") + " " + s.t) + '" style="' + (f ? "color:var(--coral-deep)" : "") + '"><svg class="ic" width="20" height="20" viewBox="0 0 24 24" fill="' + (f ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg></button></div>';
  }).join("") : '<p class="muted sm" style="padding:8px">' + t("ch.nolist") + "</p>";
}
function chSide(s) {
  var pb = pubFor(s.t), tp = s.sc ? D.scTpl[s.sc] : null;
  return '<section class="card"><h2>' + t("ch.scn") + '</h2><div class="rowf">' + BL.chipSt(s.st) + '<span class="chip">' + t("hz." + s.hz) + "</span></div>" +
    '<div class="grid" style="margin-top:12px;gap:8px">' + kv(t("l3.zone"), ltr(zoneTxt(s)) + " " + BL.sampleBadge(), t("ch.zone.n")) + kv(t("l3.written"), BL.fmtD(addDays(today(), -s.upd - 3)), t("model.v")) + "</div>" +
    (pb ? "<p class=\"sm\" style=\"margin-top:10px\">" + esc(pb.seen) + "</p>" : tp ? '<p class="sm" style="margin-top:10px">' + esc(Lx(tp.seen)) + '</p><p class="xs">' + BL.sampleBadge() + " " + t("l3.sample") + "</p>" : '<p class="sm muted" style="margin-top:10px">' + t("l3.empty") + "</p>") +
    '<div class="rowf" style="margin-top:12px"><button class="btn sm" data-act="open" data-arg="' + s.t + '">' + t("act.research") + '</button><button class="btn sm" data-act="addalert" data-arg="' + s.t + '">' + t("act.alert") + '</button><button class="btn sm" data-act="addj" data-arg="' + s.t + '">' + t("act.journal") + "</button></div></section>";
}
V.charts = {
  html: function (arg) {
    if (arg && D.stock(arg)) CHS.t = arg;
    if (!D.stock(CHS.t) || !BL.inMarket(D.stock(CHS.t))) CHS.t = BL.vis(D.items)[0].t;
    var tfl = BL.tfsFor(); if (!tfl.some(function (x) { return x.k === CHS.tf; })) CHS.tf = tfl[0].k;
    var s = D.stock(CHS.t);
    var h = '<div class="ph"><div><h1>' + t("ch.title") + "</h1><p>" + t("ch.sub") + '</p></div><span class="sample">' + t("sample.all") + "</span></div>";
    h += '<div class="chlayout"><aside class="card"><div class="fld"><label class="vh" for="chq">' + t("ch.search") + '</label><input type="search" id="chq" data-in="chq" placeholder="' + esc(t("ch.search")) + '" value="' + esc(CHS.q) + '"></div><div class="pillset" style="margin:10px 0" role="group">' + ["all", "fav"].map(function (k) { return '<button class="btn sm' + (CHS.tab === k ? " on" : "") + '" data-act="chtab" data-arg="' + k + '" aria-pressed="' + (CHS.tab === k) + '">' + t("ch.tab." + k) + "</button>"; }).join("") + '</div><div class="alist" id="alist">' + chList() + "</div></aside>";
    h += '<div class="stack" style="min-width:0"><section class="stack"><div class="rowf" style="justify-content:space-between"><div><h2 style="font-size:24px"><span class="ltr" id="chtk">' + s.t + '</span> <span class="muted" style="font-weight:600;font-size:17px">' + esc(Lx(s.n)) + '</span></h2><div class="sm muted">' + t("f.price") + ": " + ltr(money(s.price, s.dec)) + " " + BL.sampleBadge() + '</div></div><div class="rowf"><button class="btn sm" data-act="chexp">' + ic("expand", 18) + " " + t("ch.full") + '</button><button class="btn sm" disabled aria-disabled="true">' + t("act.tv") + "</button></div></div>";
    h += '<div class="pillset" role="group" aria-label="' + esc(t("ch.tf")) + '">' + tfl.map(function (x) { return '<button class="btn sm' + (CHS.tf === x.k ? " on" : "") + '" data-act="chtf" data-arg="' + x.k + '" aria-pressed="' + (CHS.tf === x.k) + '">' + t("tf." + x.k) + "</button>"; }).join("") + "</div>";
    h += '<div class="chart" id="chbox"><div id="chart"></div><div class="tip" id="tip" aria-live="off"></div><div class="rowf xs"><span class="chip up">' + t("ch.legend.up") + '</span><span class="chip dn">' + t("ch.legend.dn") + '</span><span class="muted">' + t("ch.xaxis") + "</span></div></div>";
    h += '<p class="xs muted">' + t("ch.tfnote") + '</p></section><div id="chside">' + chSide(s) + "</div></div></div>";
    return h;
  },
  mount: function () { BL.redrawChart(); }
};
IN.chq = function (v) { CHS.q = v; document.getElementById("alist").innerHTML = chList(); };
ACT.chtab = function (k) { CHS.tab = k; BL.render(false); };
ACT.chpick = function (tk) { CHS.t = tk; BL.render(false); };
ACT.chfav = function (tk) { if (S.fav[tk]) delete S.fav[tk]; else S.fav[tk] = 1; BL.save(); document.getElementById("alist").innerHTML = chList(); };
ACT.chtf = function (k) { CHS.tf = k; BL.render(false); };
ACT.chexp = function () { var b = document.getElementById("chbox"); b.classList.toggle("exp"); BL.redrawChart(); };
})();
