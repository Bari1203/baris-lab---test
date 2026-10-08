/* Views A: home, radar, stock research page, waiting room, weekly review, chart center. */
(function () {
"use strict";
var BL = window.BL, D = window.D, S = BL.S, t = BL.t, Lx = BL.L, esc = BL.esc, ic = BL.ic, V = BL.V, ACT = BL.ACT, IN = BL.IN, CH = BL.CH;
var today = BL.today, addDays = BL.addDays;

function ltr(s) { return '<bdi class="ltr">' + esc(s) + "</bdi>"; }
function money(n) { return (+n).toFixed(2); }
function zoneTxt(s) { return money(s.zone[0]) + " – " + money(s.zone[1]); }
function distTxt(s) { var d = D.dist(s); return d.inside ? t("dist.in") : t("dist." + d.side, { p: d.pct.toFixed(1) }); }
function updTxt(s) { return t("f.updated") + ": " + BL.fmtD(addDays(today(), -s.upd), { day: "numeric", month: "short" }); }
function kv(k, v, x) { return '<div class="kv"><span class="k">' + k + '</span><span class="v">' + v + "</span>" + (x ? '<span class="xs muted">' + x + "</span>" : "") + "</div>"; }
function dots(n) { var h = '<span class="dots" aria-hidden="true">'; for (var i = 1; i <= 3; i++) h += '<i class="' + (i <= n ? "on" : "") + '"></i>'; return h + "</span>"; }
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
function homeCard(title, body, act) { return '<section class="card"><div class="rowf" style="justify-content:space-between;margin-bottom:8px"><h2 style="margin:0">' + title + "</h2>" + (act || "") + "</div>" + body + "</section>"; }
function goBtn(view, label, arg) { return '<button class="btn sm ghost" data-act="nav" data-arg="' + view + '">' + label + "</button>"; }

V.home = {
  html: function () {
    var hr = new Date().getHours(), g = hr < 5 ? "night" : hr < 12 ? "morning" : hr < 17 ? "noon" : hr < 21 ? "evening" : "night";
    var mk = BL.mkt(), name = S.name ? ", " + esc(S.name) : "";
    var h = '<section class="hero"><div><div class="meta"><span>' + t("greet." + g) + name + "</span><span>" + BL.fmtD(new Date(), { weekday: "long", day: "numeric", month: "long" }) + '</span><span class="chip">' + t("mk." + mk) + '</span><span class="chip">' + t("mk.sim") + "</span></div>" +
      "<h1>" + t("tagline") + '</h1><p class="sub">' + t("hero.sub") + '</p><div class="cta"><button class="btn acc" data-act="exercise">' + t("hero.try") + "</button>" +
      (S.joined ? '<button class="btn" data-act="nav" data-arg="journal">' + t("hero.journal") + "</button>" : '<button class="btn" data-act="signup">' + t("hero.join") + "</button>") +
      '</div></div><div class="hchart">' + heroSvg() + '<p class="cap">' + t("hero.cap") + "</p></div></section>";
    var ch = D.stocks.filter(function (s) { return s.upd <= 2; }).slice(0, 4);
    var near = D.stocks.filter(function (s) { return s.st === "near" || s.st === "zone"; }).sort(function (a, b) { return D.dist(a).pct - D.dist(b).pct; });
    var wl = Object.keys(S.watch).filter(function (k) { return S.watch[k]; });
    var evs = BL.eventsNext(2);
    var nextJ = (S.journal || []).filter(function (e) { return e.rem && e.status === "open" && e.date >= BL.ymd(today()); }).sort(function (a, b) { return (a.date + a.time).localeCompare(b.date + b.time); })[0];
    var lesson = D.lessons.filter(function (l) { return l.id === S.last; })[0] || D.lessons[0];
    var done = Object.keys(S.done).filter(function (k) { return S.done[k]; }).length;
    var wkc = D.weeks[0];
    h += '<div class="sectitle"><h2>' + t("home.now") + '</h2></div><div class="grid g3">';
    h += homeCard(t("home.changed"), ch.length ? '<div class="stack">' + ch.map(function (s) { return '<div><button class="btn sm ghost" data-act="open" data-arg="' + s.t + '"><b class="ltr">' + s.t + "</b></button> " + esc(Lx(s.ch)) + "</div>"; }).join("") + "</div>" : '<p class="muted">' + t("home.nochange") + "</p>", goBtn("radar", t("nav.radar")));
    h += homeCard(t("home.near"), near.length ? '<div class="stack">' + near.slice(0, 4).map(function (s) { return '<div class="rowf" style="justify-content:space-between"><button class="btn sm ghost" data-act="open" data-arg="' + s.t + '"><b class="ltr">' + s.t + '</b></button><span class="sm muted">' + distTxt(s) + "</span></div>"; }).join("") + "</div><p class=\"xs muted\" style=\"margin-top:8px\">" + t("zone.note") + "</p>" : '<p class="muted">' + t("home.nochange") + "</p>", goBtn("wait", t("nav.wait")));
    h += homeCard(t("home.bari"), "<p>" + t("home.bari.t", { n: D.stocks.filter(function (s) { return s.sc; }).length }) + '</p><p class="xs muted" style="margin-top:6px">' + t("home.bari.n") + "</p>", goBtn("history", t("nav.history")));
    h += homeCard(t("home.weekly"), "<p>" + esc(Lx(wkc.concl)) + "</p>" + '<p class="xs muted" style="margin-top:6px">' + BL.sampleBadge() + "</p>", goBtn("weekly", t("nav.weekly")));
    h += homeCard(t("home.events"), evs.length ? '<div class="stack">' + evs.map(function (e) { return "<div><span class=\"chip " + (e.imp === "high" ? "hi" : e.imp === "med" ? "med" : "low") + '">' + t("imp." + e.imp) + "</span> " + esc(Lx(e.n)) + '<div class="xs muted">' + BL.fmtEv(e) + "</div></div>"; }).join("") + "</div>" : '<p class="muted">' + t("home.noev") + "</p>", goBtn("events", t("nav.events")));
    h += homeCard(t("home.watch"), wl.length ? '<div class="rowf">' + wl.map(function (k) { return '<button class="btn sm" data-act="open" data-arg="' + k + '"><b class="ltr">' + k + "</b></button>"; }).join("") + "</div>" : '<div class="empty"><span>' + t("home.watch.empty") + '</span><button class="btn sm" data-act="nav" data-arg="radar">' + t("nav.radar") + "</button></div>");
    h += homeCard(t("home.learn"), "<h3>" + esc(Lx(lesson.ti)) + '</h3><div class="progress" style="margin:8px 0"><i style="width:' + Math.round(done / D.lessons.length * 100) + '%"></i></div><p class="xs muted">' + t("learn.prog", { a: done, b: D.lessons.length }) + "</p>", '<button class="btn sm ghost" data-act="lesson" data-arg="' + lesson.id + '">' + t("learn.cont") + "</button>");
    h += homeCard(t("home.journal"), nextJ ? "<h3>" + esc(nextJ.title) + '</h3><p class="sm muted">' + BL.fmtD(BL.pd(nextJ.date)) + " " + esc(nextJ.time) + "</p>" : '<p class="muted">' + t("home.nojournal") + "</p>", goBtn("journal", t("nav.journal")));
    h += "</div>";
    return h;
  }
};
ACT.exercise = function () { BL.go("learn", "exercise"); };

/* ------------------------------------------------------------ radar */
function rf() { return S.f.radar || (S.f.radar = { q: "", sec: "", st: "", sp: "", flag: "all", sort: "score" }); }
function stockRow(s) {
  var sc = D.score(s), w = !!S.watch[s.t];
  return '<div class="srow" role="button" tabindex="0" data-act="open" data-arg="' + s.t + '" aria-label="' + esc(s.t + " " + Lx(s.n)) + '">' +
    '<div class="wide rowf" style="justify-content:space-between;align-items:flex-start;flex-wrap:nowrap"><div><div class="tkr ltr">' + s.t + '</div><div class="sm">' + esc(Lx(s.n)) + '</div><div class="xs muted">' + t("sec." + s.sec) + (s.isNew ? ' <span class="chip">' + t("flag.new") + "</span>" : "") + '</div></div><button class="iconbtn" data-act="wtog" data-arg="' + s.t + '" aria-pressed="' + w + '" aria-label="' + esc(t(w ? "watch.remove" : "watch.add") + " " + s.t) + '" style="' + (w ? "color:var(--coral-deep)" : "") + '"><svg class="ic" width="22" height="22" viewBox="0 0 24 24" fill="' + (w ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="' + "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" + '"/></svg></button></div>' +
    '<div class="kv"><span class="k">' + t("f.score") + '</span><span class="scorebox"><b>' + sc + '</b><span class="meter" style="flex:1"><i style="width:' + sc + '%"></i></span></span></div>' +
    '<div class="kv"><span class="k">' + t("f.status") + "</span><span>" + BL.chipSt(s.st) + '</span><span class="xs muted">' + t("sp." + s.sp) + "</span></div>" +
    kv(t("f.price"), ltr(money(s.price)) + " " + BL.sampleBadge(), updTxt(s)) +
    kv(t("f.zone"), ltr(zoneTxt(s)), distTxt(s)) +
    '<div class="why"><b>' + t("f.why") + ":</b> " + esc(Lx(s.why)) + '<br><span class="muted"><b>' + t("f.changed") + ":</b> " + esc(Lx(s.ch)) + "</span></div></div>";
}
function radarList() {
  var f = rf(), q = f.q.trim().toLowerCase();
  var a = D.stocks.filter(function (s) {
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
  return a.length ? a.map(stockRow).join("") : '<div class="empty"><strong>' + t("radar.none") + '</strong><button class="btn sm" data-act="rreset">' + t("radar.clear") + "</button></div>";
}
function opt(v, label, cur) { return '<option value="' + v + '"' + (cur === v ? " selected" : "") + ">" + esc(label) + "</option>"; }
V.radar = {
  html: function () {
    var f = rf();
    var h = '<div class="ph"><div><h1>' + t("radar.h") + "</h1><p>" + t("radar.sub") + " " + BL.hint("score") + '</p></div><span class="sample">' + t("sample.all") + "</span></div>";
    h += '<div class="toolbar"><div class="grow"><label class="vh" for="rq">' + t("radar.search") + '</label><input type="search" id="rq" data-in="rq" placeholder="' + esc(t("radar.search")) + '" value="' + esc(f.q) + '"></div>' +
      '<select id="rsec" data-ch="rf" data-arg="sec" aria-label="' + esc(t("f.sector")) + '">' + opt("", t("all.sec"), f.sec) + D.sectors.map(function (s) { return opt(s, t("sec." + s), f.sec); }).join("") + "</select>" +
      '<select id="rst" data-ch="rf" data-arg="st" aria-label="' + esc(t("f.status")) + '">' + opt("", t("all.st"), f.st) + D.statuses.map(function (s) { return opt(s, t("st." + s), f.st); }).join("") + "</select>" +
      '<select id="rsp" data-ch="rf" data-arg="sp" aria-label="' + esc(t("f.spec")) + '">' + opt("", t("all.sp"), f.sp) + ["low", "mid", "high"].map(function (s) { return opt(s, t("sp." + s), f.sp); }).join("") + "</select>" +
      '<select id="rso" data-ch="rf" data-arg="sort" aria-label="' + esc(t("f.sort")) + '">' + opt("score", t("sort.score"), f.sort) + opt("dist", t("sort.dist"), f.sort) + opt("ticker", t("sort.ticker"), f.sort) + "</select></div>";
    h += '<div class="pillset" style="margin-bottom:14px" role="group" aria-label="' + esc(t("f.flags")) + '">' + ["all", "new", "upd", "near", "watch"].map(function (k) { return '<button class="btn' + (f.flag === k ? " on" : "") + '" data-act="rflag" data-arg="' + k + '" aria-pressed="' + (f.flag === k) + '">' + t("flag." + k) + "</button>"; }).join("") + "</div>";
    h += '<div class="grid" id="rlist">' + radarList() + "</div>";
    h += '<p class="xs muted" style="margin-top:16px">' + t("radar.foot") + "</p>";
    return h;
  }
};
IN.rq = function (v) { rf().q = v; BL.save(); document.getElementById("rlist").innerHTML = radarList(); };
CH.rf = function (v, el, key) { rf()[key] = v; BL.save(); document.getElementById("rlist").innerHTML = radarList(); };
ACT.rflag = function (k) { rf().flag = k; BL.save(); BL.render(false); };
ACT.rreset = function () { S.f.radar = { q: "", sec: "", st: "", sp: "", flag: "all", sort: "score" }; BL.save(); BL.render(false); };
ACT.wtog = function (tk, el, ev) {
  if (ev) ev.stopPropagation();
  if (S.watch[tk]) { delete S.watch[tk]; BL.toast(t("watch.removed", { t: tk })); } else { S.watch[tk] = 1; BL.toast(t("watch.added", { t: tk })); }
  BL.save(); BL.render(false);
};

/* ------------------------------------------------------------ stock page */
function newsItems(s) {
  var d = today();
  return [
    { k: "report", ev: addDays(d, s.ev), pub: addDays(d, -s.upd - 2), title: t("news.report", { n: Lx(s.n) }), mean: t("news.report.m") },
    { k: "news", ev: addDays(d, -s.upd - 1), pub: addDays(d, -s.upd), title: t("news.pr", { n: Lx(s.n) }), mean: t("news.pr.m") },
    { k: "cat", ev: addDays(d, s.ev + 40), pub: addDays(d, -s.upd - 5), title: t("news.cat"), mean: t("news.cat.m") }
  ];
}
function layer1(s) {
  var h = '<section class="layer l1"><div><h2>' + t("l1.title") + "</h2><p class=\"xs muted\">" + t("l1.sub") + "</p></div><p>" + esc(Lx(s.biz)) + "</p>";
  h += '<div class="stack">' + ["rev", "margin", "cash", "dil", "val", "risk"].map(function (k) { return '<div class="kv"><span class="k">' + t("l1." + k) + '</span><span class="v">' + t("l1.ph") + "</span></div>"; }).join("") + "</div>";
  h += '<p class="xs">' + BL.sampleBadge() + " " + t("l1.note") + "</p></section>";
  return h;
}
function layer2(s) {
  var hh = BL.hash || D.hash(s.t), b = 3 + hh % 5, ho = 2 + (hh >> 3) % 4, se = hh % 3;
  var h = '<section class="layer l2"><div><h2>' + t("l2.title") + "</h2><p class=\"xs\">" + t("l2.sub") + "</p></div>";
  h += "<div><h3>" + t("l2.analysts") + '</h3><div class="rowf"><span class="chip up">' + t("an.buy") + " " + b + '</span><span class="chip">' + t("an.hold") + " " + ho + '</span><span class="chip dn">' + t("an.sell") + " " + se + '</span></div><p class="xs" style="margin-top:6px">' + BL.sampleBadge() + " " + t("an.note", { d: BL.fmtD(addDays(today(), -s.upd)) }) + "</p></div>";
  h += "<div><h3>" + t("l2.sent") + '</h3><p class="sm">' + t("l2.sent.t") + '</p><p class="xs">' + BL.sampleBadge() + " " + t("l2.sent.n") + "</p></div>";
  h += '<div class="kv"><span class="k">' + t("l2.rel") + '</span><span class="v">' + t("l1.ph") + "</span></div></section>";
  return h;
}
function layer3(s) {
  var pb = pubFor(s.t), h = '<section class="layer l3"><div><h2>' + t("l3.title") + " " + BL.hint("scn") + '</h2><p class="xs muted">' + t("l3.sub") + "</p></div>";
  if (!s.sc && !pb) return h + '<p>' + t("l3.empty") + '</p><p class="xs muted">' + t("l3.empty.n") + "</p></section>";
  var tp = s.sc ? D.scTpl[s.sc] : null, src = pb ? { seen: pb.seen, wait: pb.wait, plus: pb.plus, minus: pb.minus } : { seen: Lx(tp.seen), wait: Lx(tp.wait), plus: Lx(tp.plus), minus: Lx(tp.minus) };
  h += '<div class="rowf">' + (pb ? '<span class="chip">' + t("l3.pubdemo", { v: pb.ver }) + "</span>" : '<span class="sample">' + t("l3.sample") + "</span>") + '<span class="chip">' + t("hz." + s.hz) + '</span>' + BL.chipSt(s.st) + "</div>";
  h += '<div class="fld3"><b>' + t("l3.written") + "</b><span>" + BL.fmtD(pb ? new Date(pb.ts) : addDays(today(), -s.upd - 3)) + "</span></div>";
  h += '<div class="fld3"><b>' + t("l3.zone") + "</b><span>" + ltr(zoneTxt(s)) + " " + (pb ? "" : BL.sampleBadge()) + "</span></div>";
  h += '<div class="fld3"><b>' + t("l3.seen") + "</b><span>" + esc(src.seen) + "</span></div>";
  h += '<div class="fld3"><b>' + t("l3.wait") + "</b><span>" + esc(src.wait) + "</span></div>";
  h += '<div class="fld3"><b>' + t("l3.plus") + "</b><span>" + esc(src.plus) + "</span></div>";
  h += '<div class="fld3"><b>' + t("l3.minus") + "</b><span>" + esc(src.minus) + "</span></div>";
  h += '<div class="fld3"><b>' + t("l3.hist") + '</b><span class="xs">' + t("l3.hist.t") + "</span></div></section>";
  return h;
}
V.stock = {
  html: function (tk) {
    var s = D.stock(tk);
    if (!s) return '<div class="empty"><strong>' + t("stock.nf") + '</strong><button class="btn" data-act="nav" data-arg="radar">' + t("nav.radar") + "</button></div>";
    var sc = D.score(s), w = !!S.watch[s.t], h = '<div class="shead"><div class="rowf"><button class="btn sm" data-act="back">' + (S.lang === "he" ? "→ " : "← ") + t("back") + "</button></div>";
    h += '<div><h1><span class="ltr">' + s.t + '</span> <span class="muted" style="font-weight:600">' + esc(Lx(s.n)) + '</span></h1><div class="rowf" style="margin-top:10px"><span class="chip">' + t("sec." + s.sec) + "</span>" + BL.chipSt(s.st) + '<span class="chip">' + t("sp." + s.sp) + "</span>" + BL.hint("status") + "</div></div>";
    h += '<div class="rowf" style="gap:18px 28px">' + kv(t("f.price"), ltr(money(s.price)) + " " + BL.sampleBadge(), updTxt(s) + ", " + t("src.sample")) + kv(t("f.score"), sc + " / 100", t("model.v")) + kv(t("f.zone"), ltr(zoneTxt(s)) + " " + BL.hint("zone"), distTxt(s)) + "</div>";
    h += '<div class="rowf"><button class="btn' + (w ? " on" : "") + '" data-act="wtog" data-arg="' + s.t + '" aria-pressed="' + w + '">' + t(w ? "watch.on" : "watch.add") + '</button><button class="btn" data-act="addalert" data-arg="' + s.t + '">' + t("act.alert") + '</button><button class="btn" data-act="addj" data-arg="' + s.t + '">' + t("act.journal") + '</button><button class="btn" data-act="gochart" data-arg="' + s.t + '">' + t("act.chart") + '</button><button class="btn" disabled aria-disabled="true">' + t("act.tv") + "</button></div>";
    h += '<p class="xs muted">' + t("act.tv.n") + "</p></div>";
    h += '<section class="card" style="margin-top:18px"><h2>' + t("bd.title") + '</h2><p class="xs muted" style="margin-bottom:12px">' + t("bd.sub") + '</p><div class="bars">' + D.comps.map(function (c, i) { var pc = s.p[i] / D.weights[i] * 100; return '<div class="bar"><span>' + t("comp." + c) + '</span><span class="meter" role="img" aria-label="' + s.p[i] + "/" + D.weights[i] + '"><i style="width:' + pc + '%"></i></span><span class="num ltr">' + s.p[i] + " / " + D.weights[i] + "</span></div>"; }).join("") + "</div></section>";
    h += '<div class="layers" style="margin-top:14px">' + layer1(s) + layer2(s) + layer3(s) + "</div>";
    h += '<div class="grid g2" style="margin-top:14px"><section class="card"><h2>' + t("news.title") + "</h2>" + newsItems(s).map(function (n) { return '<div class="newsli"><div><span class="chip">' + t("news.k." + n.k) + "</span> <b>" + esc(n.title) + '</b></div><div class="xs muted">' + t("news.ev") + ": " + BL.fmtD(n.ev) + ", " + t("news.pub") + ": " + BL.fmtD(n.pub) + '</div><div class="sm">' + esc(n.mean) + '</div><div class="xs">' + BL.sampleBadge() + " " + t("news.src") + "</div></div>"; }).join("") + "</section>";
    h += '<section class="card"><h2>' + t("tl.title") + '</h2><ul class="tl"><li><span class="dot c"></span><div><b>' + t("tl.enter") + '</b><div class="xs muted">' + BL.fmtD(addDays(today(), -s.upd - 20)) + '</div></div></li><li><span class="dot"></span><div><b>' + t("tl.upd") + '</b><div class="xs muted">' + BL.fmtD(addDays(today(), -s.upd)) + "</div><div class=\"sm\">" + esc(Lx(s.ch)) + '</div></div></li></ul><p class="xs" style="margin-top:10px">' + BL.sampleBadge() + " " + t("tl.note") + "</p></section></div>";
    return h;
  }
};
ACT.back = function () { BL.back(); };
ACT.addalert = function (tk) { BL.openRule({ ticker: tk }); };
ACT.addj = function (tk) { BL.openEntry({ ticker: tk, type: "research" }); };
ACT.gochart = function (tk) { BL.go("charts", tk); };

/* ------------------------------------------------------------ waiting room */
V.wait = {
  html: function () {
    var a = D.stocks.filter(function (s) { return s.st === "wait" || s.st === "near" || s.st === "watch"; }).sort(function (x, y) { return D.dist(x).pct - D.dist(y).pct; });
    var h = '<div class="ph"><div><h1>' + t("wait.h") + "</h1><p>" + t("wait.sub") + '</p></div><span class="sample">' + t("sample.all") + "</span></div>";
    h += '<div class="notice mint" style="margin-bottom:14px">' + t("wait.rule") + "</div>";
    h += '<div class="grid g2">' + a.map(function (s) {
      var w = !!S.watch[s.t];
      return '<article class="card"><div class="rowf" style="justify-content:space-between"><div><div class="tkr ltr" style="font-size:22px;font-weight:800">' + s.t + '</div><div class="sm muted">' + esc(Lx(s.n)) + "</div></div>" + BL.chipSt(s.st) + '</div><div class="grid g2" style="margin:12px 0">' + kv(t("f.price"), ltr(money(s.price)) + " " + BL.sampleBadge(), updTxt(s)) + kv(t("f.zone"), ltr(zoneTxt(s)), distTxt(s)) + kv(t("f.horizon"), t("hz." + s.hz)) + kv(t("f.event"), BL.fmtD(addDays(today(), s.ev), { day: "numeric", month: "short" }), t("news.report.s")) + "</div>" +
        '<div class="kv"><span class="k">' + t("wait.missing") + '</span><span class="v">' + esc(Lx(s.miss)) + '</span></div><div class="rowf" style="margin-top:12px"><button class="btn sm' + (w ? " on" : "") + '" data-act="wtog" data-arg="' + s.t + '" aria-pressed="' + w + '">' + t(w ? "watch.on" : "watch.add") + '</button><button class="btn sm" data-act="addalert" data-arg="' + s.t + '">' + t("act.alert") + '</button><button class="btn sm ghost" data-act="open" data-arg="' + s.t + '">' + t("act.research") + "</button></div></article>";
    }).join("") + "</div>";
    return h;
  }
};

/* ------------------------------------------------------------ weekly review */
function weekRange(w) { var d = today(), mon = addDays(d, -((d.getDay() + 6) % 7) + w.off); return { a: mon, b: addDays(mon, 6) }; }
function weekText(i) {
  var w = D.weeks[i], r = weekRange(w);
  return t("weekly.h") + " " + BL.fmtD(r.a) + " – " + BL.fmtD(r.b) + "\n" + t("sample.all") + "\n\n" + t("wk.market") + ": " + Lx(w.mkt) + "\n\n" + t("wk.concl") + ": " + Lx(w.concl) + "\n\n" + t("wk.risks") + ": " + Lx(w.risks) + "\n\n" + t("disc.short");
}
V.weekly = {
  html: function () {
    var i = S.f.wk || 0, w = D.weeks[i], r = weekRange(w), sv = !!S.savedWeeks[i];
    var h = '<div class="ph"><div><h1>' + t("weekly.h") + "</h1><p>" + t("weekly.sub") + '</p></div><span class="sample">' + t("sample.all") + "</span></div>";
    h += '<div class="pillset" style="margin-bottom:14px" role="group" aria-label="' + esc(t("wk.pick")) + '">' + D.weeks.map(function (x, k) { var rr = weekRange(x); return '<button class="btn' + (k === i ? " on" : "") + '" data-act="wkpick" data-arg="' + k + '" aria-pressed="' + (k === i) + '">' + BL.fmtD(rr.a, { day: "numeric", month: "short" }) + "</button>"; }).join("") + "</div>";
    h += '<div class="card" style="margin-bottom:14px"><div class="grid g3">' + kv(t("wk.cover"), BL.fmtD(r.a) + " – " + BL.fmtD(r.b)) + kv(t("wk.published"), t("wk.nopub")) + kv(t("wk.data"), t("wk.nodata")) + "</div></div>";
    var evs = i === 0 ? BL.eventsNext(3) : [];
    h += '<div class="grid g2"><section class="card"><h2>' + t("wk.market") + '</h2><p>' + esc(Lx(w.mkt)) + '</p><p class="xs" style="margin-top:8px">' + t("wk.ai") + "</p></section>";
    h += '<section class="card"><h2>' + t("wk.events") + "</h2>" + (evs.length ? '<div class="stack">' + evs.map(function (e) { return "<div><span class=\"chip " + (e.imp === "high" ? "hi" : e.imp === "med" ? "med" : "low") + '">' + t("imp." + e.imp) + "</span> " + esc(Lx(e.n)) + '<div class="xs muted">' + BL.fmtEv(e) + "</div></div>"; }).join("") + "</div>" : '<p class="muted">' + t("wk.noev") + "</p>") + "</section>";
    h += '<section class="card"><h2>' + t("wk.radar") + '</h2><div class="stack">' + D.stocks.filter(function (s) { return s.upd <= 2; }).map(function (s) { return '<div><button class="btn sm ghost" data-act="open" data-arg="' + s.t + '"><b class="ltr">' + s.t + "</b></button> " + esc(Lx(s.ch)) + "</div>"; }).join("") + "</div></section>";
    h += '<section class="card"><h2>' + t("wk.new") + "</h2>" + (D.stocks.filter(function (s) { return s.isNew; }).map(function (s) { return '<div><button class="btn sm ghost" data-act="open" data-arg="' + s.t + '"><b class="ltr">' + s.t + "</b></button> " + esc(Lx(s.why)) + "</div>"; }).join("") || '<p class="muted">' + t("wk.nonew") + "</p>") + '<h3 style="margin-top:14px">' + t("wk.scn") + '</h3><p class="sm">' + t("wk.scn.t") + "</p></section>";
    h += '<section class="card"><h2>' + t("wk.wait") + '</h2><div class="stack">' + D.stocks.filter(function (s) { return s.st === "wait"; }).map(function (s) { return '<div><b class="ltr">' + s.t + "</b> " + esc(Lx(s.miss)) + "</div>"; }).join("") + "</div></section>";
    h += '<section class="card"><h2>' + t("wk.risks") + "</h2><p>" + esc(Lx(w.risks)) + '</p><h3 style="margin-top:14px">' + t("wk.sources") + '</h3><p class="sm muted">' + t("wk.sources.t") + "</p></section></div>";
    h += '<section class="layer l3" style="margin-top:14px"><h2>' + t("wk.concl") + '</h2><p>' + esc(Lx(w.concl)) + '</p><p class="xs muted">' + BL.sampleBadge() + " " + t("wk.concl.n") + "</p></section>";
    h += '<div class="rowf" style="margin-top:14px"><button class="btn' + (sv ? " on" : "") + '" data-act="wksave" data-arg="' + i + '" aria-pressed="' + sv + '">' + t(sv ? "wk.saved" : "wk.save") + '</button><button class="btn" data-act="wkcopy" data-arg="' + i + '">' + t("wk.copy") + '</button><button class="btn" data-act="wkj" data-arg="' + i + '">' + t("wk.tojournal") + '</button><button class="btn" data-act="nav" data-arg="charts">' + t("nav.charts") + "</button></div>";
    h += '<p class="xs muted" style="margin-top:14px">' + t("disc.short") + "</p>";
    return h;
  }
};
ACT.wkpick = function (i) { S.f.wk = +i; BL.save(); BL.render(false); };
ACT.wksave = function (i) { S.savedWeeks[i] = !S.savedWeeks[i]; BL.save(); BL.toast(t(S.savedWeeks[i] ? "wk.saved.t" : "wk.unsaved.t")); BL.render(false); };
ACT.wkcopy = function (i) { BL.copy(weekText(+i)); };
ACT.wkj = function (i) { var r = weekRange(D.weeks[+i]); BL.openEntry({ type: "review", title: t("weekly.h") + " " + BL.fmtD(r.a, { day: "numeric", month: "short" }) }); };

/* ------------------------------------------------------------ chart center */
var CHS = { t: "NVLX", tf: "D1", q: "", tab: "all" };
function chartData() { var s = D.stock(CHS.t), tf = D.tfs.filter(function (x) { return x.k === CHS.tf; })[0]; return D.series(CHS.t + "|" + CHS.tf, 60, tf.vol, s.price); }
function drawChart(host, data, zone, opt) {
  opt = opt || {};
  var W = Math.max(280, host.clientWidth || 600), H = opt.h || (W < 520 ? 300 : 400), m = { l: 8, r: 54, t: 12, b: 28 };
  var hi = Math.max.apply(null, data.map(function (c) { return c.h; })), lo = Math.min.apply(null, data.map(function (c) { return c.l; }));
  if (zone) { hi = Math.max(hi, zone[1]); lo = Math.min(lo, zone[0]); }
  var padv = (hi - lo) * 0.06; hi += padv; lo -= padv;
  var y = function (v) { return m.t + (hi - v) / (hi - lo) * (H - m.t - m.b); };
  var n = data.length, step = (W - m.l - m.r) / n, bw = Math.max(2, step * 0.6);
  var s = '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(opt.label || t("ch.lbl")) + '" style="direction:ltr">';
  for (var i = 0; i < 5; i++) { var v = lo + (hi - lo) * i / 4; s += '<line class="gl" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(v) + '" y2="' + y(v) + '"/><text class="ax" x="' + (W - m.r + 6) + '" y="' + (y(v) + 4) + '">' + v.toFixed(2) + "</text>"; }
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
    tip.innerHTML = '<span class="chip ' + (up ? "up" : "dn") + '">' + t(up ? "ch.up" : "ch.down") + "</span><span>" + t("ch.o") + " <b class=\"ltr\">" + c.o.toFixed(2) + "</b></span><span>" + t("ch.h") + " <b class=\"ltr\">" + c.h.toFixed(2) + "</b></span><span>" + t("ch.l") + " <b class=\"ltr\">" + c.l.toFixed(2) + "</b></span><span>" + t("ch.c") + " <b class=\"ltr\">" + c.c.toFixed(2) + "</b></span>";
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
BL.redrawChart = function () { var host = document.getElementById("chart"); if (host && V.charts && BL.R.view === "charts") drawChart(host, chartData(), D.stock(CHS.t).zone); };

function chList() {
  var q = CHS.q.trim().toLowerCase();
  var a = D.stocks.filter(function (s) { return (!q || (s.t + " " + Lx(s.n)).toLowerCase().indexOf(q) > -1) && (CHS.tab === "all" || S.fav[s.t]); });
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
    var s = D.stock(CHS.t);
    var h = '<div class="ph"><div><h1>' + t("ch.title") + "</h1><p>" + t("ch.sub") + '</p></div><span class="sample">' + t("sample.all") + "</span></div>";
    h += '<div class="chlayout"><aside class="card"><div class="fld"><label class="vh" for="chq">' + t("ch.search") + '</label><input type="search" id="chq" data-in="chq" placeholder="' + esc(t("ch.search")) + '" value="' + esc(CHS.q) + '"></div><div class="pillset" style="margin:10px 0" role="group">' + ["all", "fav"].map(function (k) { return '<button class="btn sm' + (CHS.tab === k ? " on" : "") + '" data-act="chtab" data-arg="' + k + '" aria-pressed="' + (CHS.tab === k) + '">' + t("ch.tab." + k) + "</button>"; }).join("") + '</div><div class="alist" id="alist">' + chList() + "</div></aside>";
    h += '<div class="stack" style="min-width:0"><section class="stack"><div class="rowf" style="justify-content:space-between"><div><h2 style="font-size:24px"><span class="ltr" id="chtk">' + s.t + '</span> <span class="muted" style="font-weight:600;font-size:17px">' + esc(Lx(s.n)) + '</span></h2><div class="sm muted">' + t("f.price") + ": " + ltr(money(s.price)) + " " + BL.sampleBadge() + '</div></div><div class="rowf"><button class="btn sm" data-act="chexp">' + ic("expand", 18) + " " + t("ch.full") + '</button><button class="btn sm" disabled aria-disabled="true">' + t("act.tv") + "</button></div></div>";
    h += '<div class="pillset" role="group" aria-label="' + esc(t("ch.tf")) + '">' + D.tfs.map(function (x) { return '<button class="btn sm' + (CHS.tf === x.k ? " on" : "") + '" data-act="chtf" data-arg="' + x.k + '" aria-pressed="' + (CHS.tf === x.k) + '">' + t("tf." + x.k) + "</button>"; }).join("") + "</div>";
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
