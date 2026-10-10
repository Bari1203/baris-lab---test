/* Views B: events, journal, alerts, scenario history, learning, help, Israel, settings, admin. */
(function () {
"use strict";
var BL = window.BL, D = window.D, AU = window.AU, S = BL.S, t = BL.t, Lx = BL.L, esc = BL.esc, ic = BL.ic, V = BL.V, ACT = BL.ACT, IN = BL.IN, CH = BL.CH, FORM = BL.FORM;
var today = BL.today, addDays = BL.addDays, ymd = BL.ymd, pd = BL.pd;

function ltr(s) { return '<bdi class="ltr">' + esc(s) + "</bdi>"; }
function opt(v, label, cur) { return '<option value="' + esc(v) + '"' + (String(cur) === String(v) ? " selected" : "") + ">" + esc(label) + "</option>"; }
function impCls(i) { return i === "high" ? "hi" : i === "med" ? "med" : "low"; }
function kv(k, v) { return '<div class="kv"><span class="k">' + k + '</span><span class="v">' + v + "</span></div>"; }

/* ------------------------------------------------------------ events and daily trading */
function ef() { return S.f.ev || (S.f.ev = { imp: { high: 1 }, per: "week", cur: "", cc: "", tz: "local" }); }
function evList() {
  var f = ef(), now = new Date(), t0 = today().getTime();
  var a = D.events.filter(function (e) {
    var d = BL.evDate(e), day0 = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    if (!f.imp[e.imp]) return false;
    if (f.cur && e.cur !== f.cur) return false;
    if (f.cc && e.cc !== f.cc) return false;
    if (f.per === "day" && day0 !== t0) return false;
    return true;
  }).sort(function (x, y) { return BL.evDate(x) - BL.evDate(y); });
  if (!a.length) return '<div class="empty"><strong>' + t("ev.none") + '</strong><button class="btn sm" data-act="evall">' + t("ev.showall") + "</button></div>";
  var tz = f.tz === "ny" ? "America/New_York" : undefined;
  return a.map(function (e) {
    var past = BL.evDate(e) < now;
    return '<article class="evt"><div class="tm">' + new Intl.DateTimeFormat(BL.loc(), { hour: "2-digit", minute: "2-digit", timeZone: tz }).format(BL.evDate(e)) + '</div><div class="stack" style="gap:6px"><div class="rowf"><span class="chip ' + impCls(e.imp) + '">' + t("imp." + e.imp) + '</span><span class="chip">' + e.cc + " " + e.cur + '</span><b>' + esc(Lx(e.n)) + '</b></div><div class="xs muted">' + new Intl.DateTimeFormat(BL.loc(), { weekday: "long", day: "numeric", month: "short", timeZone: tz }).format(BL.evDate(e)) + '</div><div class="vals"><span>' + t("ev.prev") + ": <b class=\"ltr\">" + e.prev + "</b></span><span>" + t("ev.fc") + ": <b class=\"ltr\">" + e.fc + "</b></span><span>" + t("ev.act") + ": <b class=\"ltr\">" + (past && e.act ? e.act : "—") + "</b></span></div>" +
      '<div class="rowf"><span class="sample">' + t("sample") + '</span><span class="xs muted">' + t("ev.src") + '</span></div><div class="rowf"><button class="btn sm ghost" data-act="hint" aria-expanded="false">' + t("ev.why") + '</button><span class="hinttext" hidden>' + esc(Lx(e.why)) + '</span><button class="btn sm" data-act="evj" data-arg="' + e.id + '">' + t("ev.tojournal") + '</button><button class="btn sm" data-act="evrem" data-arg="' + e.id + '">' + t("ev.remind") + "</button></div></div></article>";
  }).join("");
}
function nyNow() {
  var p = {}; new Intl.DateTimeFormat("en-GB", { timeZone: "America/New_York", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
  return { h: +p.hour % 24, m: +p.minute };
}
function critHtml() {
  var n = nyNow(), mins = n.h * 60 + n.m;
  function until(h) { var d = h * 60 - mins; if (d <= 0) d += 1440; return Math.floor(d / 60) + ":" + BL.pad(d % 60); }
  return '<div class="crit"><div class="rowf" style="justify-content:space-between"><b>' + t("crit.h") + '</b><span class="chip">' + t("crit.now") + ' <span class="num ltr">' + BL.pad(n.h) + ":" + BL.pad(n.m) + '</span></span></div><div class="grid g2" style="margin-top:8px"><div class="kv"><span class="k"><span class="num ltr">17:00</span></span><span class="v">' + t("crit.17") + ' <span class="xs muted">· ' + t("crit.in") + " " + until(17) + '</span></span></div><div class="kv"><span class="k"><span class="num ltr">04:00</span></span><span class="v">' + t("crit.04") + ' <span class="xs muted">· ' + t("crit.in") + " " + until(4) + '</span></span></div></div><p class="xs muted" style="margin-top:6px">' + t("crit.n") + "</p></div>";
}
V.events = {
  html: function () {
    var f = ef();
    var h = '<div class="ph"><div><h1>' + t("ev.h") + "</h1><p>" + t("ev.sub") + '</p></div><span class="sample">' + t("sample.all") + "</span></div>";
    h += '<section class="card" style="margin-bottom:14px"><h2>' + t("ev.daily") + '</h2><p class="muted">' + t("ev.daily.t") + '</p>' + critHtml() + '<div class="rowf" style="margin-top:10px">' + Object.keys(S.fav).slice(0, 4).map(function (k) { return '<button class="btn sm" data-act="gochart" data-arg="' + k + '">' + ic("chart", 18) + " <b class=\"ltr\">" + k + "</b></button>"; }).join("") + '<button class="btn sm" disabled aria-disabled="true">' + t("ev.sessions") + '</button><button class="btn sm" data-act="nav" data-arg="learn">' + t("ev.adv") + "</button></div></section>";
    h += '<div class="toolbar"><div class="pillset" role="group" aria-label="' + esc(t("ev.impact")) + '">' + ["high", "med", "low"].map(function (k) { return '<button class="btn' + (f.imp[k] ? " on" : "") + '" data-act="evimp" data-arg="' + k + '" aria-pressed="' + (!!f.imp[k]) + '">' + t("imp." + k) + "</button>"; }).join("") + "</div>" +
      '<select data-ch="evf" data-arg="per" aria-label="' + esc(t("ev.period")) + '">' + opt("day", t("ev.day"), f.per) + opt("week", t("ev.week"), f.per) + "</select>" +
      '<select data-ch="evf" data-arg="cur" aria-label="' + esc(t("ev.cur")) + '">' + opt("", t("ev.allcur"), f.cur) + ["USD", "EUR", "GBP", "JPY"].map(function (c) { return opt(c, c, f.cur); }).join("") + "</select>" +
      '<select data-ch="evf" data-arg="cc" aria-label="' + esc(t("ev.cc")) + '">' + opt("", t("ev.allcc"), f.cc) + ["US", "EU", "UK", "JP", "DE"].map(function (c) { return opt(c, c, f.cc); }).join("") + "</select>" +
      '<select data-ch="evf" data-arg="tz" aria-label="' + esc(t("ev.tz")) + '">' + opt("local", t("ev.tz.local"), f.tz) + opt("ny", t("ev.tz.ny"), f.tz) + "</select></div>";
    h += '<p class="xs muted" style="margin-bottom:6px">' + t("ev.note") + '</p><section class="card" id="evlist" style="padding-block:4px">' + evList() + "</section>";
    return h;
  }
};
ACT.evimp = function (k) { var f = ef(); if (f.imp[k]) delete f.imp[k]; else f.imp[k] = 1; BL.save(); BL.render(false); };
ACT.evall = function () { ef().imp = { high: 1, med: 1, low: 1 }; ef().cur = ""; ef().cc = ""; ef().per = "week"; BL.save(); BL.render(false); };
CH.evf = function (v, el, k) { ef()[k] = v; BL.save(); BL.render(false); };
function evById(id) { return D.events.filter(function (e) { return e.id === id; })[0]; }
ACT.evj = function (id) { var e = evById(id), d = BL.evDate(e); BL.openEntry({ type: "event", title: Lx(e.n), date: ymd(d), time: BL.pad(d.getHours()) + ":" + BL.pad(d.getMinutes()) }); };
ACT.evrem = function (id) {
  var e = evById(id), d = BL.evDate(e);
  S.journal.push({ id: BL.uid(), title: Lx(e.n), date: ymd(d), time: BL.pad(d.getHours()) + ":" + BL.pad(d.getMinutes()), type: "reminder", ticker: "", note: "", scn: "", check: "", chg: "", rel: 3, rem: true, tags: [t("sampleTag")], status: "open", exec: "" });
  BL.save(); BL.toast(t("ev.reminded"));
};

/* ------------------------------------------------------------ journal */
var JT = ["research", "watch", "scenario", "reminder", "event", "note", "trade", "review", "exercise"];
function jv() { return S.jv; }
function jmatch(e) {
  var v = jv(), q = (v.q || "").toLowerCase();
  if (q && (e.title + " " + e.note + " " + e.ticker + " " + (e.tags || []).join(" ")).toLowerCase().indexOf(q) < 0) return false;
  if (v.type && e.type !== v.type) return false;
  if (v.status && e.status !== v.status) return false;
  return true;
}
function jday(date) { return S.journal.filter(function (e) { return e.date === date && jmatch(e); }).sort(function (a, b) { return a.time.localeCompare(b.time); }); }
function dayName(i, fmt) { return new Intl.DateTimeFormat(BL.loc(), { weekday: fmt || "short" }).format(new Date(2023, 0, 1 + i)); }
function entryCard(e) {
  var note = e.note ? esc(e.note.length > 170 ? e.note.slice(0, 170) + "…" : e.note) : "";
  return '<article class="entry' + (e.status !== "open" ? " done" : "") + '"><div class="rowf" style="justify-content:space-between;flex-wrap:nowrap;align-items:flex-start"><h3>' + esc(e.title) + '</h3><span class="chip">' + t("jt." + e.type) + '</span></div><div class="rowf xs muted"><span>' + BL.fmtD(pd(e.date), { weekday: "short", day: "numeric", month: "short" }) + " " + esc(e.time) + "</span>" + (e.ticker ? '<span class="chip">' + ltr(e.ticker) + "</span>" : "") + '<span class="chip">' + t("js." + e.status) + "</span>" + (e.rem ? "<span>" + t("je.rem.short") + "</span>" : "") + "<span>" + t("je.rel") + ": " + t("rel." + e.rel) + "</span></div>" + (note ? '<p class="sm">' + note + "</p>" : "") +
    (e.scn ? '<p class="sm"><b>' + t("je.scn") + ":</b> " + esc(e.scn) + "</p>" : "") + (e.chg ? '<p class="sm"><b>' + t("je.chg") + ":</b> " + esc(e.chg) + "</p>" : "") +
    (e.tr ? '<div class="rowf">' + [e.tr.acct && t("tr.acct." + e.tr.acct), e.tr.side && t("tr.side." + e.tr.side), e.tr.grade, e.tr.ctype && (t("tr.ctype") + " " + e.tr.ctype), e.tr.res && t("tr.res." + e.tr.res), e.tr.pnl && ("P&L " + e.tr.pnl)].filter(Boolean).map(function (x) { return '<span class="chip">' + esc(x) + "</span>"; }).join("") + (trRR(e.tr) ? '<span class="chip">R:R 1:' + trRR(e.tr).toFixed(1) + "</span>" : "") + (e.tr.book === "swing" ? swChips(e.tr) : "") + "</div>" : "") + ((e.tags || []).length ? '<div class="rowf">' + e.tags.map(function (g) { return '<span class="chip">' + esc(g) + "</span>"; }).join("") + "</div>" : "") +
    '<div class="rowf"><button class="btn sm" data-act="jedit" data-arg="' + e.id + '">' + t("edit") + '</button><button class="btn sm" data-act="jstat" data-arg="' + e.id + '">' + t(e.status === "open" ? "je.close" : "je.reopen") + '</button><button class="btn sm ghost" data-act="jdel" data-arg="' + e.id + '">' + t("delete") + "</button></div></article>";
}
function swChips(r) {
  var a = [r.sstat && t("tr.sstat." + r.sstat), r.sector, r.svs && (t("tr.svs") + ": " + t("tr.svs." + r.svs)), r.earn && (t("sw.earn") + " " + r.earn)].filter(Boolean), h = swHold(r), p = swPct(r);
  if (h != null) a.push(t("sw.hold") + " " + h); if (p != null) a.push("P&L " + (p > 0 ? "+" : "") + p.toFixed(1) + "%");
  return a.map(function (x) { return '<span class="chip">' + esc(x) + "</span>"; }).join("");
}
function jSummary() {
  var cut = ymd(addDays(today(), -30)), a = S.journal.filter(function (e) { return e.date >= cut; });
  var byType = {}; a.forEach(function (e) { byType[e.type] = (byType[e.type] || 0) + 1; });
  var noChg = S.journal.filter(function (e) { return e.status === "open" && (e.type === "scenario" || e.type === "research") && !e.chg; }).length;
  var tk = {}; S.journal.forEach(function (e) { if (e.ticker) tk[e.ticker] = (tk[e.ticker] || 0) + 1; });
  var top = Object.keys(tk).sort(function (x, y) { return tk[y] - tk[x]; })[0];
  var up = S.journal.filter(function (e) { return e.rem && e.status === "open" && e.date >= ymd(today()); }).length;
  return '<section class="card tint"><h2>' + t("js.sum") + '</h2><p class="xs">' + t("js.sum.n") + '</p><ul style="margin:10px 0 0;padding-inline-start:20px;display:grid;gap:4px"><li>' + t("js.sum.total", { n: a.length }) + "</li>" + Object.keys(byType).map(function (k) { return "<li>" + t("jt." + k) + ": " + byType[k] + "</li>"; }).join("") + "<li>" + t("js.sum.nochg", { n: noChg }) + "</li><li>" + t("js.sum.up", { n: up }) + "</li>" + (top ? "<li>" + t("js.sum.top", { t: top }) + "</li>" : "") + "</ul></section>";
}
function jLabel() {
  var v = jv(), c = pd(v.cur || ymd(today()));
  if (v.view === "month") return BL.fmtD(c, { month: "long", year: "numeric" });
  if (v.view === "week") { var s0 = addDays(c, -c.getDay()); return BL.fmtD(s0, { day: "numeric", month: "short" }) + " – " + BL.fmtD(addDays(s0, 6), { day: "numeric", month: "short", year: "numeric" }); }
  if (v.view === "day") return BL.fmtD(c, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return t("jv.list");
}
function jBody() {
  var v = jv(), c = pd(v.cur || ymd(today())), td = ymd(today()), sel = v.sel || td, h = "";
  if (v.view === "month") {
    var y = c.getFullYear(), m = c.getMonth(), first = new Date(y, m, 1), off = first.getDay(), dim = new Date(y, m + 1, 0).getDate(), rows = Math.ceil((off + dim) / 7);
    h += '<div class="jlayout m"><div><div class="cal" role="grid" aria-label="' + esc(jLabel()) + '">';
    for (var i = 0; i < 7; i++) h += '<div class="dh" role="columnheader">' + dayName(i) + "</div>";
    for (var k = 0; k < rows * 7; k++) {
      var d = addDays(first, k - off), ds = ymd(d), es = jday(ds), out = d.getMonth() !== m;
      h += '<button class="cell' + (out ? " out" : "") + (ds === td ? " today" : "") + (ds === sel ? " sel" : "") + '" data-act="jsel" data-arg="' + ds + '" aria-label="' + esc(BL.fmtD(d, { weekday: "long", day: "numeric", month: "long" }) + ", " + t("js.count", { n: es.length })) + '" aria-pressed="' + (ds === sel) + '"><span class="dn2">' + d.getDate() + "</span>" + es.slice(0, 2).map(function (e) { return '<span class="ce">' + esc(e.title) + "</span>"; }).join("") + (es.length > 2 ? '<span class="ce">+' + (es.length - 2) + "</span>" : "") + '<span class="cdots">' + es.slice(0, 5).map(function () { return "<i></i>"; }).join("") + "</span></button>";
    }
    h += '</div></div><div class="stack"><div class="rowf" style="justify-content:space-between"><h2 style="font-size:19px">' + BL.fmtD(pd(sel), { weekday: "long", day: "numeric", month: "long" }) + '</h2><button class="btn sm acc" data-act="jnew" data-arg="' + sel + '">' + ic("plus", 18) + " " + t("je.new") + "</button></div>" + dayList(sel) + "</div></div>";
  } else if (v.view === "week") {
    var s0 = addDays(c, -c.getDay());
    h += '<div class="wk7">' + [0, 1, 2, 3, 4, 5, 6].map(function (i) { var d = addDays(s0, i), ds = ymd(d); return '<div class="col1"><div class="rowf" style="justify-content:space-between"><b>' + dayName(i, "short") + " " + d.getDate() + '</b><button class="iconbtn" style="width:36px;height:36px" data-act="jnew" data-arg="' + ds + '" aria-label="' + esc(t("je.new")) + '">' + ic("plus", 18) + "</button></div>" + (jday(ds).map(entryCard).join("") || '<span class="xs muted">' + t("js.noday") + "</span>") + "</div>"; }).join("") + "</div>";
  } else if (v.view === "day") {
    var ds2 = ymd(c);
    h += '<div class="stack"><div class="rowf"><button class="btn sm acc" data-act="jnew" data-arg="' + ds2 + '">' + ic("plus", 18) + " " + t("je.new") + "</button></div>" + dayList(ds2) + "</div>";
  } else {
    var all = S.journal.filter(jmatch).sort(function (a, b) { return (b.date + b.time).localeCompare(a.date + a.time); });
    h += '<div class="stack">' + (all.length ? all.map(entryCard).join("") : emptyJ()) + "</div>";
  }
  return h;
}
function dayList(ds) { var es = jday(ds); return es.length ? '<div class="stack">' + es.map(entryCard).join("") + "</div>" : '<div class="empty"><span>' + t("js.noday") + '</span><button class="btn sm" data-act="jnew" data-arg="' + ds + '">' + t("je.new") + "</button></div>"; }
function emptyJ() { return '<div class="empty"><strong>' + t("js.empty") + '</strong><span>' + t("js.empty.t") + '</span><button class="btn acc" data-act="jnew">' + t("je.new") + "</button></div>"; }
V.journal = {
  html: function () {
    var v = jv();
    if (!v.cur) v.cur = ymd(today());
    var h = '<div class="ph"><div><h1>' + t("js.h") + "</h1><p>" + t("js.sub") + '</p></div><button class="btn acc" data-act="jnew">' + ic("plus", 18) + " " + t("je.new") + "</button></div>";
    h += '<div class="notice mint" style="margin-bottom:14px">' + t("js.priv") + "</div>";
    h += '<div class="toolbar"><div class="pillset" role="group" aria-label="' + esc(t("js.views")) + '">' + ["month", "week", "day", "list"].map(function (k) { return '<button class="btn' + (v.view === k ? " on" : "") + '" data-act="jview" data-arg="' + k + '" aria-pressed="' + (v.view === k) + '">' + t("jv." + k) + "</button>"; }).join("") + "</div>" +
      (v.view !== "list" ? '<div class="rowf"><button class="btn" data-act="jnav" data-arg="-1" aria-label="' + esc(t("prev")) + '">' + (S.lang === "he" ? "›" : "‹") + '</button><button class="btn" data-act="jtoday">' + t("js.today") + '</button><button class="btn" data-act="jnav" data-arg="1" aria-label="' + esc(t("next")) + '">' + (S.lang === "he" ? "‹" : "›") + "</button></div>" : "") + '<b id="jlabel" style="font-size:18px">' + esc(jLabel()) + "</b></div>";
    h += '<div class="toolbar"><div class="grow"><label class="vh" for="jq">' + t("js.search") + '</label><input type="search" id="jq" data-in="jq" placeholder="' + esc(t("js.search")) + '" value="' + esc(v.q || "") + '"></div><select data-ch="jf" data-arg="type" aria-label="' + esc(t("je.type")) + '">' + opt("", t("js.alltype"), v.type) + JT.map(function (k) { return opt(k, t("jt." + k), v.type); }).join("") + '</select><select data-ch="jf" data-arg="status" aria-label="' + esc(t("je.status")) + '">' + opt("", t("js.allstatus"), v.status) + ["open", "closed", "cancelled"].map(function (k) { return opt(k, t("js." + k), v.status); }).join("") + "</select></div>";
    h += '<div id="jbody">' + (S.journal.length ? jBody() : emptyJ()) + '</div>' + jStats() + '<div class="grid g2" style="margin-top:18px">' + jSummary() + '<section class="card"><h2>' + t("js.fut") + "</h2><p class=\"muted\">" + t("js.fut.t") + "</p></section></div>";
    return h;
  }
};
function jrefresh() { BL.save(); BL.render(false); }
ACT.jview = function (k) { jv().view = k; jrefresh(); };
ACT.jsel = function (ds) { jv().sel = ds; jv().cur = ds; jrefresh(); };
ACT.jtoday = function () { jv().cur = ymd(today()); jv().sel = ymd(today()); jrefresh(); };
ACT.jnav = function (d) {
  var v = jv(), c = pd(v.cur || ymd(today())); d = +d;
  if (v.view === "month") v.cur = ymd(new Date(c.getFullYear(), c.getMonth() + d, 1));
  else if (v.view === "week") v.cur = ymd(addDays(c, 7 * d));
  else v.cur = ymd(addDays(c, d));
  jrefresh();
};
IN.jq = function (v) { jv().q = v; BL.save(); document.getElementById("jbody").innerHTML = S.journal.length ? jBody() : emptyJ(); };
CH.jf = function (v, el, k) { jv()[k] = v; jrefresh(); };
ACT.jnew = function (ds) { BL.openEntry(ds ? { date: ds } : {}); };
ACT.jedit = function (id) { BL.openEntry({ id: id }); };
ACT.jstat = function (id) { var e = S.journal.filter(function (x) { return x.id === id; })[0]; if (e) { e.status = e.status === "open" ? "closed" : "open"; jrefresh(); BL.toast(t("saved")); } };
ACT.jdel = function (id) {
  var i = S.journal.map(function (x) { return x.id; }).indexOf(id); if (i < 0) return;
  var rm = S.journal.splice(i, 1)[0]; jrefresh();
  BL.toast(t("je.deleted"), { label: t("undo"), fn: function () { S.journal.splice(Math.min(i, S.journal.length), 0, rm); jrefresh(); } });
};
/* structured trade fields, taken from the columns of Bari's journal */
var TR = {
  acct: ["", "nostro", "personal"], side: ["", "long", "short"], grade: ["", "PERFECT", "GOOD", "BAD"], ctype: ["", "a", "b", "c", "d"],
  book: ["", "day", "swing"], sstat: ["", "watching", "open", "closed"], svs: ["", "yes", "both", "no"], smt: ["", "yes", "both", "no"], tp: ["", "none", "TP1", "TP2", "final"], res: ["", "open", "win", "loss", "be"]
};
function trSel(id, k, cur, lab) { return '<div class="fld"><label for="tr-' + id + '">' + t("tr." + id) + '</label><select id="tr-' + id + '">' + TR[k].map(function (v) { return opt(v, v ? (lab ? t("tr." + id + "." + v) : v) : "—", cur || ""); }).join("") + "</select></div>"; }
function trTxt(id, cur, ph) { return '<div class="fld"><label for="tr-' + id + '">' + t("tr." + id) + '</label><input type="text" id="tr-' + id + '" value="' + esc(cur || "") + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : "") + "></div>"; }
function trForm(r) {
  return '<fieldset class="trbox"><legend>' + t("tr.title") + '</legend><p class="xs muted">' + t("tr.note") + '</p><div class="fgrid">' +
    trSel("book", "book", r.book, 1).replace('id="tr-book"', 'id="tr-book" data-ch="trbook"') + trSel("acct", "acct", r.acct, 1) + trSel("side", "side", r.side, 1) + trSel("grade", "grade", r.grade) + trSel("ctype", "ctype", r.ctype) + trSel("smt", "smt", r.smt, 1) + trSel("tp", "tp", r.tp, 1) + trSel("res", "res", r.res, 1) +
    trTxt("bisus", r.bisus, "8h, D, W...") + trTxt("etf", r.etf, "15m") + trTxt("poi", r.poi) + trTxt("candle", r.candle) + trTxt("exit", r.exit) +
    trTxt("entry", r.entry) + trTxt("stop", r.stop) + trTxt("target", r.target) + trTxt("pnl", r.pnl, t("tr.pnl.ph")) + trTxt("link", r.link) + "</div>" +
    '<div id="tr-sw"' + (r.book === "swing" ? "" : " hidden") + '><h3 class="xs" style="margin:12px 0 4px">' + t("sw.h") + '</h3><p class="xs muted">' + t("sw.note") + '</p><div class="fgrid">' +
    trSel("sstat", "sstat", r.sstat, 1) + trTxt("sector", r.sector) + trSel("svs", "svs", r.svs, 1) + swDate("d1", r.d1) + swDate("d2", r.d2) + swDate("earn", r.earn) + trTxt("xprice", r.xprice) + "</div></div></fieldset>";
}
function swDate(id, cur) { return '<div class="fld"><label for="tr-' + id + '">' + t("sw." + id) + '</label><input type="date" id="tr-' + id + '" value="' + esc(cur || "") + '"></div>'; }
/* swing: holding days and P&L % are computed, never typed */
function swHold(r) { if (!r.d1 || !r.d2) return null; var n = Math.round((new Date(r.d2) - new Date(r.d1)) / 864e5); return n >= 0 ? n : null; }
function swPct(r) { var e = parseFloat(r.entry), x = parseFloat(r.xprice); if (isNaN(e) || isNaN(x) || !e) return null; return (x - e) / e * 100 * (r.side === "short" ? -1 : 1); }
BL.swHold = swHold; BL.swPct = swPct;
CH.trbook = function (v) { var b = document.getElementById("tr-sw"); if (b) b.hidden = v !== "swing"; };
function trRead(f) {
  var r = {}; ["book", "sstat", "sector", "svs", "d1", "d2", "earn", "xprice", "acct", "side", "grade", "ctype", "smt", "tp", "res", "bisus", "etf", "poi", "candle", "exit", "entry", "stop", "target", "pnl", "link"].forEach(function (k) { var el = f.querySelector("#tr-" + k); r[k] = el ? el.value.trim() : ""; });
  return r;
}
function trRR(r) { var e = parseFloat(r.entry), s2 = parseFloat(r.stop), tg = parseFloat(r.target); if (isNaN(e) || isNaN(s2) || isNaN(tg) || e === s2) return null; return Math.abs(tg - e) / Math.abs(e - s2); }
/* statistics: only real journal trades (not the sample ones), and a plain warning while the sample is small */
function realTrades() {
  return S.journal.filter(function (e) { return e.type === "trade" && e.tr && (e.tr.res === "win" || e.tr.res === "loss" || e.tr.res === "be") && !(e.tags || []).some(function (g) { return g === "דוגמה" || g === "Sample"; }); });
}
function statRow(label, a) {
  var w = a.filter(function (e) { return e.tr.res === "win"; }).length, n = a.length;
  return "<tr><th scope=\"row\">" + esc(label) + '</th><td class="num ltr">' + n + '</td><td class="num ltr">' + (n ? Math.round(w / n * 100) + "%" : "—") + "</td></tr>";
}
function jStats() {
  var a = realTrades(), n = a.length;
  var h = '<section class="card jstats"><h2>' + t("st.h") + '</h2><p class="xs muted">' + t("st.n") + "</p>";
  if (!n) return h + '<div class="empty" style="margin-top:10px"><strong>' + t("st.none") + "</strong><span>" + t("st.none.t") + "</span></div></section>";
  var w = a.filter(function (e) { return e.tr.res === "win"; }).length, l = a.filter(function (e) { return e.tr.res === "loss"; }).length;
  var rrs = a.map(function (e) { return trRR(e.tr); }).filter(function (x) { return x != null; }), avgRR = rrs.length ? (rrs.reduce(function (x, y) { return x + y; }, 0) / rrs.length) : null;
  h += '<div class="qas five" style="margin:10px 0"><div class="kv"><span class="k">' + t("st.trades") + '</span><span class="v num">' + n + '</span></div><div class="kv"><span class="k">' + t("st.winpct") + '</span><span class="v num ltr">' + Math.round(w / n * 100) + '%</span></div><div class="kv"><span class="k">' + t("st.wl") + '</span><span class="v num ltr">' + w + " / " + l + '</span></div><div class="kv"><span class="k">' + t("st.rr") + '</span><span class="v num ltr">' + (avgRR == null ? "—" : "1:" + avgRR.toFixed(1)) + "</span></div></div>";
  if (n < 30) h += '<p class="notice warn xs">' + t("st.small", { n: n }) + "</p>";
  function grp(title, key, vals, lab) {
    var rows = vals.map(function (v) { var sub = a.filter(function (e) { return e.tr[key] === v; }); return sub.length ? statRow(lab ? t("tr." + key + "." + v) : v, sub) : ""; }).join("");
    return rows ? '<h3 style="margin-top:12px">' + title + '</h3><div class="tblw"><table><thead><tr><th></th><th>' + t("st.trades") + "</th><th>" + t("st.winpct") + "</th></tr></thead><tbody>" + rows + "</tbody></table></div>" : "";
  }
  h += grp(t("tr.book"), "book", ["day", "swing"], 1) + grp(t("tr.acct"), "acct", ["nostro", "personal"], 1) + grp(t("tr.grade"), "grade", ["PERFECT", "GOOD", "BAD"]) + grp(t("tr.ctype"), "ctype", ["a", "b", "c", "d"]) + grp(t("tr.smt"), "smt", ["yes", "both", "no"], 1) + grp(t("tr.svs"), "svs", ["yes", "both", "no"], 1) + grp(t("tr.tp"), "tp", ["none", "TP1", "TP2", "final"], 1);
  return h + "</section>";
}
BL.openEntry = function (pre) {
  pre = pre || {};
  var ex = pre.id ? S.journal.filter(function (x) { return x.id === pre.id; })[0] : null;
  var d = ex || Object.assign({ title: "", date: jv().sel || ymd(today()), time: "09:00", type: "note", ticker: "", note: "", scn: "", check: "", chg: "", rel: 2, rem: false, tags: [], status: "open", exec: "" }, pre);
  var f = function (id, label, inner) { return '<div class="fld"><label for="' + id + '">' + label + "</label>" + inner + "</div>"; };
  var body = '<form data-form="jentry" class="stack" novalidate><input type="hidden" id="je-id" value="' + esc(ex ? ex.id : "") + '">' +
    f("je-title", t("je.title"), '<input type="text" id="je-title" value="' + esc(d.title) + '" autofocus><span class="err" id="je-err" role="alert"></span>') +
    '<div class="fgrid">' + f("je-date", t("je.date"), '<input type="date" id="je-date" value="' + esc(d.date) + '">') + f("je-time", t("je.time"), '<input type="time" id="je-time" value="' + esc(d.time) + '">') + f("je-type", t("je.type"), '<select id="je-type" data-ch="jtype">' + JT.map(function (k) { return opt(k, t("jt." + k), d.type); }).join("") + "</select>") + f("je-ticker", t("je.ticker"), '<input type="text" id="je-ticker" class="ltr" list="je-tk" value="' + esc(d.ticker) + '" autocapitalize="characters"><datalist id="je-tk">' + D.items.map(function (s) { return '<option value="' + s.t + '">'; }).join("") + "</datalist>") + "</div>" +
    f("je-note", t("je.note"), '<textarea id="je-note">' + esc(d.note) + "</textarea>") +
    '<div id="je-trw"' + (d.type === "trade" ? "" : " hidden") + ">" + trForm(d.tr || {}) + "</div>" +
    '<div id="je-exw"' + (d.type === "trade" ? "" : " hidden") + ">" + f("je-exec", t("je.exec"), '<textarea id="je-exec" rows="3">' + esc(d.exec) + '</textarea><span class="xs muted">' + t("je.exec.n") + "</span>") + "</div>" +
    f("je-scn", t("je.scn"), '<textarea id="je-scn" rows="3">' + esc(d.scn) + "</textarea>") + f("je-check", t("je.check"), '<input type="text" id="je-check" value="' + esc(d.check) + '">') + f("je-chg", t("je.chg"), '<input type="text" id="je-chg" value="' + esc(d.chg) + '">') +
    '<div class="fgrid">' + f("je-rel", t("je.rel"), '<select id="je-rel">' + [1, 2, 3].map(function (k) { return opt(k, t("rel." + k), d.rel); }).join("") + "</select>") + f("je-status", t("je.status"), '<select id="je-status">' + ["open", "closed", "cancelled"].map(function (k) { return opt(k, t("js." + k), d.status); }).join("") + "</select>") + f("je-tags", t("je.tags"), '<input type="text" id="je-tags" value="' + esc((d.tags || []).join(", ")) + '">') + "</div>" +
    '<label class="chk"><input type="checkbox" id="je-rem"' + (d.rem ? " checked" : "") + ">" + t("je.rem") + '</label><div class="actions"><button type="button" class="btn" data-act="close">' + t("cancel") + '</button><button class="btn acc" type="submit">' + t("save") + "</button></div></form>";
  BL.openModal({ title: t(ex ? "je.edit" : "je.new"), body: body });
};
CH.jtype = function (v) { ["je-exw", "je-trw"].forEach(function (id) { var w = document.getElementById(id); if (w) w.hidden = v !== "trade"; }); };
FORM.jentry = function (f) {
  var g = function (id) { return f.querySelector("#" + id); }, title = g("je-title").value.trim(), date = g("je-date").value;
  if (!title) { g("je-err").textContent = t("je.need.title"); g("je-title").focus(); return; }
  if (!date) { g("je-err").textContent = t("je.need.date"); g("je-date").focus(); return; }
  var rec = { title: title, date: date, time: g("je-time").value || "09:00", type: g("je-type").value, ticker: g("je-ticker").value.trim().toUpperCase(), note: g("je-note").value.trim(), scn: g("je-scn").value.trim(), check: g("je-check").value.trim(), chg: g("je-chg").value.trim(), rel: +g("je-rel").value, rem: g("je-rem").checked, status: g("je-status").value, exec: g("je-exec").value.trim(), tags: g("je-tags").value.split(",").map(function (x) { return x.trim(); }).filter(Boolean) };
  if (rec.type === "trade") rec.tr = trRead(f);
  var id = g("je-id").value, ex = id ? S.journal.filter(function (x) { return x.id === id; })[0] : null;
  if (ex) Object.assign(ex, rec); else { rec.id = BL.uid(); S.journal.push(rec); }
  jv().sel = date; jv().cur = date; BL.save(); BL.closeModal(); BL.render(false); BL.toast(t("saved")); BL.cele({ big: 1, cap: t(ex ? "cele.edit" : "cele.journal") });
};

/* ------------------------------------------------------------ alerts */
var RT = ["price_above", "price_below", "near", "zone", "scn", "cancel", "report", "analyst", "event", "journal", "weekly"];
function af() { return S.f.al || (S.f.al = { tab: "n", type: "" }); }
function ruleText(r) { return (r.ticker ? r.ticker + ": " : "") + t("rt." + r.type) + (r.level ? " " + r.level : "") + ", " + t("fq." + r.freq); }
function notifText(n) { return n.k ? t(n.k) : n.text; }
function alertsN() {
  var f = af(), a = S.notifs.filter(function (n) { return !f.type || n.type === f.type; }).sort(function (x, y) { return y.ts - x.ts; });
  var h = '<div class="toolbar"><select data-ch="alf" data-arg="type" aria-label="' + esc(t("al.filter")) + '">' + opt("", t("al.all"), f.type) + RT.map(function (k) { return opt(k.replace(/_.*/, ""), t("nt." + k.replace(/_.*/, "")), f.type); }).filter(function (x, i, arr) { return arr.indexOf(x) === i; }).join("") + '</select><button class="btn" data-act="alread">' + t("al.readall") + "</button></div>";
  if (!a.length) return h + '<div class="empty"><strong>' + t("al.none") + '</strong><span>' + t("al.none.t") + "</span></div>";
  return h + '<div class="stack">' + a.map(function (n) {
    return '<article class="entry' + (n.read ? " done" : "") + '"><div class="rowf" style="justify-content:space-between;flex-wrap:nowrap"><div class="rowf"><span class="chip">' + t("nt." + n.type) + "</span>" + (n.ticker ? '<span class="chip">' + ltr(n.ticker) + "</span>" : "") + (n.read ? "" : '<span class="chip s-zone">' + t("al.new") + "</span>") + '</div><span class="xs muted">' + BL.fmtT(n.ts) + "</span></div><p>" + esc(notifText(n)) + '</p><div class="rowf"><button class="btn sm" data-act="alopen" data-arg="' + n.id + '">' + t("al.open") + '</button><button class="btn sm" data-act="alr" data-arg="' + n.id + '">' + t(n.read ? "al.unread" : "al.markread") + '</button><button class="btn sm ghost" data-act="aldel" data-arg="' + n.id + '">' + t("delete") + "</button></div></article>";
  }).join("") + "</div>";
}
function alertsR() {
  var h = '<div class="rowf" style="justify-content:space-between;margin-bottom:12px"><p class="muted">' + t("al.rules.t") + '</p><button class="btn acc" data-act="rnew">' + ic("plus", 18) + " " + t("al.newrule") + "</button></div>";
  if (!S.rules.length) return h + '<div class="empty"><strong>' + t("al.norules") + '</strong><span>' + t("al.norules.t") + "</span></div>";
  return h + '<div class="stack">' + S.rules.map(function (r) {
    return '<article class="entry"><div class="rowf" style="justify-content:space-between"><b>' + esc(ruleText(r)) + '</b><label class="chk"><input type="checkbox" data-ch="rtog" data-arg="' + r.id + '"' + (r.active ? " checked" : "") + ">" + t("al.active") + '</label></div><div class="rowf"><button class="btn sm" data-act="rsim" data-arg="' + r.id + '">' + t("al.sim") + '</button><button class="btn sm ghost" data-act="rdel" data-arg="' + r.id + '">' + t("delete") + "</button></div></article>";
  }).join("") + '</div><p class="xs muted" style="margin-top:12px">' + t("al.sim.n") + "</p>";
}
function alertsP() {
  var p = S.prefs;
  return '<div class="grid g2"><section class="card stack"><h2>' + t("al.prefs") + '</h2><div class="fld"><label for="pf-fq">' + t("al.freq") + '</label><select id="pf-fq" data-ch="pf" data-arg="freq">' + ["instant", "daily", "weekly"].map(function (k) { return opt(k, t("fq." + k), p.freq); }).join("") + '</select></div><div class="fgrid"><div class="fld"><label for="pf-qs">' + t("al.qs") + '</label><input type="time" id="pf-qs" data-ch="pf" data-arg="qs" value="' + esc(p.qs) + '"></div><div class="fld"><label for="pf-qe">' + t("al.qe") + '</label><input type="time" id="pf-qe" data-ch="pf" data-arg="qe" value="' + esc(p.qe) + '"></div></div><label class="chk"><input type="checkbox" data-ch="pfsound"' + (p.sound ? " checked" : "") + ">" + t("al.sound") + '</label><div class="fld"><span class="lb">' + t("al.assets") + '</span><label class="chk"><input type="radio" name="pa" data-ch="pfassets" value="all"' + (p.assets !== "watch" ? " checked" : "") + ">" + t("al.assets.all") + '</label><label class="chk"><input type="radio" name="pa" data-ch="pfassets" value="watch"' + (p.assets === "watch" ? " checked" : "") + ">" + t("al.assets.watch") + '</label></div></section><section class="card stack"><h2>' + t("al.channels") + '</h2><p><b>' + t("al.ch.app") + "</b> " + t("al.ch.app.t") + '</p><div><button class="btn" data-act="pushtest">' + t("al.push") + '</button><p class="xs muted" style="margin-top:6px">' + t("al.push.n") + '</p></div><p class="muted">' + t("al.ch.other") + '</p><div class="notice">' + t("al.limits") + "</div></section></div>";
}
V.alerts = {
  html: function () {
    var f = af(), h = '<div class="ph"><div><h1>' + t("al.h") + "</h1><p>" + t("al.sub") + '</p></div><span class="sample">' + t("sample.all") + "</span></div>";
    h += '<div class="pillset" style="margin-bottom:14px" role="group">' + [["n", t("al.tab.n") + (BL.unread() ? " (" + BL.unread() + ")" : "")], ["r", t("al.tab.r")], ["p", t("al.tab.p")]].map(function (x) { return '<button class="btn' + (f.tab === x[0] ? " on" : "") + '" data-act="altab" data-arg="' + x[0] + '" aria-pressed="' + (f.tab === x[0]) + '">' + x[1] + "</button>"; }).join("") + "</div>";
    return h + (f.tab === "n" ? alertsN() : f.tab === "r" ? alertsR() : alertsP());
  }
};
ACT.altab = function (k) { af().tab = k; BL.save(); BL.render(false); };
CH.alf = function (v) { af().type = v; BL.save(); BL.render(false); };
ACT.alread = function () { S.notifs.forEach(function (n) { n.read = true; }); BL.save(); BL.render(false); };
ACT.alr = function (id) { var n = S.notifs.filter(function (x) { return x.id === id; })[0]; if (n) n.read = !n.read; BL.save(); BL.render(false); };
ACT.aldel = function (id) { S.notifs = S.notifs.filter(function (x) { return x.id !== id; }); BL.save(); BL.render(false); };
ACT.alopen = function (id) {
  var n = S.notifs.filter(function (x) { return x.id === id; })[0]; if (!n) return;
  n.read = true; BL.save();
  if (n.ticker) BL.go("stock", n.ticker); else if (n.type === "event") BL.go(BL.news() ? "events" : "radar"); else if (n.type === "weekly") BL.go("weekly"); else if (n.type === "journal") BL.go("journal"); else BL.go("alerts");
};
CH.pf = function (v, el, k) { S.prefs[k] = v; BL.save(); };
CH.pfsound = function (v, el) { S.prefs.sound = el.checked; BL.save(); if (el.checked) AU.beep(); };
CH.pfassets = function (v) { S.prefs.assets = v; BL.save(); };
ACT.pushtest = function () {
  try {
    if (!("Notification" in window)) { BL.toast(t("al.push.no")); return; }
    var p = Notification.requestPermission();
    Promise.resolve(p).then(function (r) { BL.toast(r === "granted" ? t("al.push.ok") : t("al.push.no")); }).catch(function () { BL.toast(t("al.push.no")); });
  } catch (e) { BL.toast(t("al.push.no")); }
};
BL.openRule = function (pre) {
  pre = pre || {};
  var body = '<form data-form="rule" class="stack"><div class="fgrid"><div class="fld"><label for="ra-tk">' + t("al.r.ticker") + '</label><select id="ra-tk">' + opt("", t("al.r.any"), pre.ticker || "") + D.items.map(function (s) { return opt(s.t, s.t + " " + Lx(s.n), pre.ticker || ""); }).join("") + '</select></div><div class="fld"><label for="ra-type">' + t("al.r.type") + '</label><select id="ra-type" data-ch="rtype">' + RT.map(function (k) { return opt(k, t("rt." + k), pre.type || "near"); }).join("") + '</select></div></div><div class="fld" id="ra-lw" hidden><label for="ra-lv">' + t("al.r.level") + '</label><input type="number" step="0.01" id="ra-lv" class="ltr"><span class="xs muted">' + t("al.r.level.n") + '</span></div><div class="fld"><label for="ra-fq">' + t("al.freq") + '</label><select id="ra-fq">' + ["instant", "daily", "weekly"].map(function (k) { return opt(k, t("fq." + k), S.prefs.freq); }).join("") + '</select></div><span class="err" id="ra-err" role="alert"></span><div class="actions"><button type="button" class="btn" data-act="close">' + t("cancel") + '</button><button class="btn acc" type="submit">' + t("save") + "</button></div></form>";
  BL.openModal({ title: t("al.newrule"), body: body, mount: function () { CH.rtype(document.getElementById("ra-type").value); } });
};
CH.rtype = function (v) { var w = document.getElementById("ra-lw"); if (w) w.hidden = v.indexOf("price") !== 0; };
ACT.rnew = function () { BL.openRule(); };
FORM.rule = function (f) {
  var type = f.querySelector("#ra-type").value, lv = f.querySelector("#ra-lv").value;
  if (type.indexOf("price") === 0 && !(+lv > 0)) { f.querySelector("#ra-err").textContent = t("al.r.need"); return; }
  S.rules.push({ id: BL.uid(), ticker: f.querySelector("#ra-tk").value, type: type, level: type.indexOf("price") === 0 ? lv : "", freq: f.querySelector("#ra-fq").value, active: true });
  af().tab = "r"; BL.save(); BL.closeModal(); BL.go("alerts"); BL.toast(t("saved")); BL.cele({ big: 1, cap: t("cele.rule") });
};
CH.rtog = function (v, el, id) { var r = S.rules.filter(function (x) { return x.id === id; })[0]; if (r) { r.active = el.checked; BL.save(); } };
ACT.rdel = function (id, el) { BL.confirmClick(el, function () { S.rules = S.rules.filter(function (x) { return x.id !== id; }); BL.save(); BL.render(false); }); };
ACT.rsim = function (id) {
  var r = S.rules.filter(function (x) { return x.id === id; })[0]; if (!r) return;
  if (!r.active) { BL.toast(t("al.off")); return; }
  var type = r.type.replace(/_.*/, "");
  if (S.prefs.assets === "watch" && r.ticker && !S.watch[r.ticker]) { BL.toast(t("al.prefblock")); return; }
  S.fired = S.fired || {}; var key = r.id + ymd(today());
  if (S.fired[key]) { BL.toast(t("al.dup")); return; }
  S.fired[key] = 1;
  S.notifs.unshift({ id: BL.uid(), type: type, ticker: r.ticker, ts: Date.now(), read: false, text: t("al.simtext", { r: ruleText(r) }) });
  var qs = S.prefs.qs, qe = S.prefs.qe, now = BL.pad(new Date().getHours()) + ":" + BL.pad(new Date().getMinutes()), quiet = qs > qe ? (now >= qs || now < qe) : (now >= qs && now < qe);
  if (S.prefs.sound && !quiet) AU.beep();
  BL.save(); BL.render(false); BL.toast(quiet ? t("al.quiet") : t("al.fired"));
};

/* ------------------------------------------------------------ scenario history */
function hf() { return S.f.hi || (S.f.hi = { per: "all", st: "", from: "", to: "" }); }
function hRecs() {
  var recs = D.history.map(function (r) { return { id: r.id, t: r.t, ts: addDays(today(), r.d).getTime(), st: r.st, tf: r.tf, zone: r.zone, txt: Lx(r.txt), res: Lx(r.res), rev: Lx(r.rev), sample: true, ver: 1 }; });
  S.pub.forEach(function (p, i) { var s = D.stock(p.t); recs.push({ id: "p" + i, t: p.t, ts: p.ts, st: "open", tf: s ? s.hz : "M3", zone: s ? s.zone[0].toFixed(2) + " - " + s.zone[1].toFixed(2) : "", txt: p.seen + " " + p.wait, res: t("hi.open"), rev: "", sample: false, ver: p.ver, plus: p.plus, minus: p.minus }); });
  return recs.sort(function (a, b) { return b.ts - a.ts; });
}
function hFilter(recs) {
  var f = hf(), days = { week: 7, month: 31, quarter: 92, half: 183, year: 366 }[f.per], now = Date.now();
  return recs.filter(function (r) {
    if (f.st && r.st !== f.st) return false;
    if (days && now - r.ts > days * 864e5) return false;
    if (f.per === "custom") { if (f.from && r.ts < pd(f.from).getTime()) return false; if (f.to && r.ts > pd(f.to).getTime() + 864e5) return false; }
    return true;
  });
}
var HST = ["open", "dev", "cancel", "notrig", "exp", "undec"];
V.history = {
  html: function () {
    var f = hf(), recs = hRecs(), a = hFilter(recs), counts = {}; HST.forEach(function (k) { counts[k] = 0; }); a.forEach(function (r) { counts[r.st]++; });
    var h = '<div class="ph"><div><h1>' + t("hi.h") + "</h1><p>" + t("hi.sub") + '</p></div><span class="sample">' + t("sample.all") + "</span></div>";
    h += '<div class="toolbar"><select data-ch="hif" data-arg="per" aria-label="' + esc(t("hi.period")) + '">' + ["all", "week", "month", "quarter", "half", "year", "custom"].map(function (k) { return opt(k, t("hp." + k), f.per); }).join("") + '</select><select data-ch="hif" data-arg="st" aria-label="' + esc(t("f.status")) + '">' + opt("", t("hi.allst"), f.st) + HST.map(function (k) { return opt(k, t("hs." + k), f.st); }).join("") + "</select>" + (f.per === "custom" ? '<input type="date" data-ch="hif" data-arg="from" value="' + esc(f.from) + '" aria-label="' + esc(t("hi.from")) + '" style="width:auto"><input type="date" data-ch="hif" data-arg="to" value="' + esc(f.to) + '" aria-label="' + esc(t("hi.to")) + '" style="width:auto">' : "") + '<span class="xs muted">' + t("hi.5y") + "</span></div>";
    h += '<section class="card tint" style="margin-bottom:14px"><h2>' + t("hi.counts") + '</h2><div class="rowf">' + HST.map(function (k) { return '<span class="chip">' + t("hs." + k) + ": " + counts[k] + "</span>"; }).join("") + '</div><p class="xs" style="margin-top:8px">' + t("hi.nostats") + "</p></section>";
    h += '<div class="stack">' + (a.length ? a.map(function (r) { return '<article class="entry"><div class="rowf" style="justify-content:space-between"><div class="rowf"><b class="ltr" style="font-size:18px">' + r.t + '</b><span class="chip">' + t("hs." + r.st) + '</span><span class="chip">' + t("hz." + r.tf) + "</span>" + (r.sample ? '<span class="sample">' + t("hi.sample") + "</span>" : '<span class="chip">' + t("hi.pubdemo", { v: r.ver }) + "</span>") + '</div><span class="xs muted">' + BL.fmtD(new Date(r.ts)) + '</span></div><p class="sm">' + esc(r.txt) + '</p><div class="rowf"><button class="btn sm" data-act="hdet" data-arg="' + r.id + '">' + t("hi.detail") + '</button><button class="btn sm ghost" data-act="open" data-arg="' + r.t + '">' + t("act.research") + "</button></div></article>"; }).join("") : '<div class="empty"><strong>' + t("hi.none") + '</strong><span>' + t("hi.none.t") + "</span></div>") + "</div>";
    h += '<section class="card" style="margin-top:14px"><h2>' + t("hi.rules") + "</h2><p class=\"muted\">" + t("hi.rules.t") + "</p></section>";
    return h;
  }
};
CH.hif = function (v, el, k) { hf()[k] = v; BL.save(); BL.render(false); };
ACT.hdet = function (id) {
  var r = hRecs().filter(function (x) { return x.id === id; })[0]; if (!r) return;
  BL.openModal({ title: r.t + " " + t("hi.detail"), body: '<div class="rowf"><span class="chip">' + t("hs." + r.st) + '</span><span class="chip">' + t("hz." + r.tf) + "</span>" + (r.sample ? '<span class="sample">' + t("hi.sample") + "</span>" : "") + "</div>" + kv(t("hi.date"), BL.fmtD(new Date(r.ts))) + kv(t("l3.zone"), ltr(r.zone)) + kv(t("hi.orig"), esc(r.txt)) + (r.plus ? kv(t("l3.plus"), esc(r.plus)) + kv(t("l3.minus"), esc(r.minus)) : "") + kv(t("hi.ver"), "v" + r.ver + " (" + t("hi.nochg") + ")") + kv(t("hi.res"), esc(r.res)) + kv(t("hi.rev"), esc(r.rev || t("hi.norev"))) + '<p class="xs muted">' + t("hi.immut") + "</p>" });
};

/* ------------------------------------------------------------ learning */
var EX = { step: 0, obs: "", scn: "", chg: "", con: "" }, EXN = 44;
function exData() { return D.series("exercise-1", 60, 1.6); }
function lvChip(l) { return '<span class="chip">' + t("lv." + l.lv) + "</span>"; }
function lessonList() {
  var lv = S.f.lv || "", done = Object.keys(S.done).filter(function (k) { return S.done[k]; }).length;
  var h = '<div class="ph"><div><h1>' + t("learn.h") + "</h1><p>" + t("learn.sub") + '</p></div><span class="sample">' + t("sample.all") + "</span></div>";
  h += '<section class="card tint" style="margin-bottom:14px"><div class="rowf" style="justify-content:space-between"><div><h2>' + t("ex.title") + '</h2><p>' + t("ex.intro") + '</p></div><button class="btn acc" data-act="exstart">' + t("ex.start") + '</button></div></section>';
  h += '<div class="rowf" style="justify-content:space-between;margin-bottom:12px"><div class="pillset">' + [["", t("lv.all")], ["basic", t("lv.basic")], ["mid", t("lv.mid")], ["adv", t("lv.adv")]].map(function (x) { return '<button class="btn' + (lv === x[0] ? " on" : "") + '" data-act="lvl" data-arg="' + x[0] + '" aria-pressed="' + (lv === x[0]) + '">' + x[1] + "</button>"; }).join("") + '</div><span class="sm muted">' + t("learn.prog", { a: done, b: D.lessons.length }) + '</span></div><div class="progress" style="margin-bottom:14px"><i style="width:' + Math.round(done / D.lessons.length * 100) + '%"></i></div>';
  function lcards(a) { return '<div class="grid g2">' + a.map(function (l) {
    return '<article class="card"><div class="rowf" style="justify-content:space-between"><h3 style="margin:0">' + esc(Lx(l.ti)) + "</h3>" + lvChip(l) + '</div><div class="rowf" style="margin-top:12px"><button class="btn sm" data-act="lesson" data-arg="' + l.id + '">' + t(l.id === S.last ? "learn.cont" : "learn.open") + "</button>" + (S.done[l.id] ? '<span class="chip up">' + t("learn.done") + "</span>" : "") + "</div></article>";
  }).join("") + "</div>"; }
  var fl = D.lessons.filter(function (l) { return !lv || l.lv === lv; }), me = fl.filter(function (l) { return l.track === "method"; }), ba = fl.filter(function (l) { return l.track !== "method"; });
  if (me.length) h += '<div class="sectitle"><h2>' + t("learn.method") + "</h2></div>" + lcards(me);
  if (ba.length) h += '<div class="sectitle"><h2>' + t("learn.base") + "</h2></div>" + lcards(ba);
  return h;
}
function lessonBody(l) {
  if (!l.blk) return '<p style="font-size:18px;line-height:1.75">' + esc(Lx(l.body)) + "</p>";
  if (S.lang !== "he") return '<p style="font-size:18px;line-height:1.75">' + esc(l.sum) + '</p><p class="notice mint xs">' + t("learn.heonly") + "</p>";
  var h = '<p class="notice mint xs">' + t("method.intu") + "</p>";
  l.blk.forEach(function (b) {
    if (b.h) h += '<h2 style="margin:18px 0 6px">' + esc(b.h) + "</h2>";
    if (b.p) h += '<p style="font-size:17px;line-height:1.75">' + esc(b.p) + "</p>";
    if (b.ul) h += '<ul class="mlist">' + b.ul.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
  });
  if (l.tbl) h += '<div class="tblw" style="margin-top:12px"><table><thead><tr>' + l.tbl.head.map(function (x) { return "<th>" + esc(x) + "</th>"; }).join("") + "</tr></thead><tbody>" + l.tbl.rows.map(function (r) { return "<tr>" + r.map(function (c, i) { return i ? "<td>" + esc(c) + "</td>" : "<th scope=\"row\">" + esc(c) + "</th>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>";
  if (l.id === "m9") h += '<p class="xs muted" style="margin-top:10px">' + t("m9.n") + "</p>";
  return h;
}
function lessonView(id) {
  var i = D.lessons.map(function (l) { return l.id; }).indexOf(id), l = D.lessons[i], nx = D.lessons[i + 1];
  return '<div class="rowf"><button class="btn sm" data-act="nav" data-arg="learn">' + (S.lang === "he" ? "→ " : "← ") + t("back") + '</button></div><article class="card" style="margin-top:14px;max-width:760px"><div class="rowf">' + lvChip(l) + "</div><h1 style=\"margin:10px 0\">" + esc(Lx(l.ti)) + '</h1>' + lessonBody(l) + '<p class="xs muted" style="margin-top:12px">' + t("learn.n") + '</p><div class="rowf" style="margin-top:16px"><button class="btn' + (S.done[l.id] ? " on" : "") + '" data-act="ldone" data-arg="' + l.id + '" aria-pressed="' + (!!S.done[l.id]) + '">' + t(S.done[l.id] ? "learn.done" : "learn.markdone") + '</button>' + (nx ? '<button class="btn pri" data-act="lesson" data-arg="' + nx.id + '">' + t("learn.next") + "</button>" : "") + '<button class="btn" data-act="exstart">' + t("ex.start") + "</button></div></article>";
}
function exHtml() {
  var s = EX.step, h = '<div class="rowf"><button class="btn sm" data-act="nav" data-arg="learn">' + (S.lang === "he" ? "→ " : "← ") + t("back") + '</button><span class="sample">' + t("ex.sample") + "</span></div>";
  h += '<h1 style="margin:12px 0 4px">' + t("ex.title") + '</h1><p class="muted" style="max-width:64ch">' + t("ex.s" + s) + '</p><div class="chart" style="margin:14px 0"><div id="exchart"></div><div class="tip" id="extip"></div></div>';
  h += '<section class="card stack" style="max-width:760px">';
  if (s === 0) h += '<div class="fld"><label for="ex-obs">' + t("ex.obs") + '</label><textarea id="ex-obs" data-in="exobs">' + esc(EX.obs) + '</textarea></div><div class="actions"><button class="btn pri" data-act="exnext">' + t("next") + "</button></div>";
  if (s === 1) h += '<div class="fld"><label for="ex-scn">' + t("ex.scn") + '</label><textarea id="ex-scn" data-in="exscn">' + esc(EX.scn) + '</textarea></div><div class="fld"><label for="ex-chg">' + t("ex.chg") + '</label><input type="text" id="ex-chg" data-in="exchg" value="' + esc(EX.chg) + '"></div><div class="actions"><button class="btn" data-act="exprev">' + t("prev") + '</button><button class="btn acc" data-act="exreveal">' + t("ex.reveal") + "</button></div>";
  if (s === 2) h += '<p class="muted">' + t("ex.revealing") + "</p>";
  if (s === 3) h += '<div class="grid g2"><div class="kv"><span class="k">' + t("ex.obs") + '</span><span class="v">' + esc(EX.obs || "—") + '</span></div><div class="kv"><span class="k">' + t("ex.scn") + '</span><span class="v">' + esc(EX.scn || "—") + '</span></div><div class="kv"><span class="k">' + t("ex.chg") + '</span><span class="v">' + esc(EX.chg || "—") + '</span></div></div><div class="notice mint">' + t("ex.bari") + '</div><div class="fld"><label for="ex-con">' + t("ex.con") + '</label><textarea id="ex-con" data-in="excon">' + esc(EX.con) + '</textarea></div><div class="actions"><button class="btn" data-act="exstart">' + t("ex.again") + '</button><button class="btn acc" data-act="exsave">' + t("ex.save") + "</button></div>";
  return h + "</section>";
}
function exDraw(upto) { var host = document.getElementById("exchart"); if (host) BL.drawChart(host, exData().slice(0, upto), null, { tip: "extip", label: t("ex.lbl"), h: 320 }); }
V.learn = {
  html: function (arg) {
    if (arg === "exercise") return exHtml();
    if (arg && D.lessons.filter(function (l) { return l.id === arg; })[0]) return lessonView(arg);
    return lessonList();
  },
  mount: function (el, arg) { if (arg === "exercise") exDraw(EX.step >= 3 ? 50 : EXN); }
};
ACT.exstart = function () { EX = { step: 0, obs: "", scn: "", chg: "", con: "" }; BL.go("learn", "exercise"); };
ACT.exnext = function () { EX.step = 1; BL.render(false); };
ACT.exprev = function () { EX.step = 0; BL.render(false); };
ACT.exreveal = function () {
  EX.step = 2; BL.render(false); var k = EXN, tm = setInterval(function () { k++; exDraw(k); if (k >= 50) { clearInterval(tm); EX.step = 3; BL.render(false); } }, S.reduce ? 60 : 380);
};
IN.exobs = function (v) { EX.obs = v; }; IN.exscn = function (v) { EX.scn = v; }; IN.exchg = function (v) { EX.chg = v; }; IN.excon = function (v) { EX.con = v; };
ACT.exsave = function () {
  BL.openEntry({ type: "exercise", title: t("ex.jtitle"), note: EX.obs, scn: EX.scn, chg: EX.chg, check: EX.con });
};
ACT.lvl = function (v) { S.f.lv = v; BL.save(); BL.render(false); };
ACT.lesson = function (id) { S.last = id; BL.save(); BL.go("learn", id); };
ACT.ldone = function (id) { S.done[id] = !S.done[id]; BL.save(); BL.render(false); };

/* ------------------------------------------------------------ help */
var MAT = [
  ["m.nav", "works"], ["m.radar", "works"], ["m.watch", "works"], ["m.journal", "works"], ["m.alerts", "works"], ["m.music", "works"], ["m.admin", "works"],
  ["m.prices", "sample"], ["m.scn", "sample"], ["m.hist", "sample"], ["m.charts", "sample"], ["m.events", "sample"],
  ["m.tv", "ready"], ["m.sources", "ready"], ["m.ai", "ready"],
  ["m.scan", "server"], ["m.wauto", "server"], ["m.notion", "server"], ["m.pine", "later"], ["m.push", "server"], ["m.auto", "server"], ["m.auth", "server"], ["m.pay", "server"]
];
V.help = {
  html: function () {
    var h = '<div class="ph"><div><h1>' + t("help.h") + "</h1><p>" + t("help.sub") + '</p></div><button class="btn" data-act="tour">' + t("help.tour") + "</button></div>";
    h += '<div class="stack" style="max-width:780px">' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (i) { return '<details class="faq"><summary>' + t("faq.q" + i) + "</summary><div>" + t("faq.a" + i) + "</div></details>"; }).join("") + "</div>";
    h += '<div class="sectitle"><h2>' + t("help.real") + '</h2></div><p class="muted" style="margin-bottom:12px;max-width:70ch">' + t("help.real.t") + '</p><div class="tblw"><table><thead><tr><th>' + t("help.feature") + "</th><th>" + t("help.status") + "</th></tr></thead><tbody>" + MAT.map(function (m) { return "<tr><td>" + t(m[0]) + '</td><td><span class="chip' + (m[1] === "works" ? " up" : m[1] === "server" ? " med" : "") + '">' + t("mat." + m[1]) + "</span></td></tr>"; }).join("") + "</tbody></table></div>";
    h += '<section class="card" style="margin-top:18px"><h2>' + t("help.gloss") + '</h2><div class="grid g2">' + ["g1", "g2", "g3", "g4"].map(function (k) { return '<div><h3>' + t(k + ".t") + "</h3><p class=\"muted\">" + t(k + ".b") + "</p></div>"; }).join("") + "</div></section>";
    return h;
  }
};

/* ------------------------------------------------------------ Israel (Hebrew edition) */
function ilSel() { return S.f.il || (S.f.il = { cat: "pension", pick: ["p1", "p2"] }); }
V.israel = {
  html: function () {
    var f = ilSel(), tr = D.il.tracks[f.cat], names = { pension: "פנסיה", gemel: "קופות גמל", study: "קרנות השתלמות" };
    var h = '<div class="ph"><div><h1>תכנון פיננסי</h1><p>מידע כללי להבנת מסלולי חיסכון בישראל. בלי התאמה אישית ובלי המלצה על מסלול.</p></div><span class="sample">נתוני דוגמה</span></div>';
    h += '<div class="grid g3">' + [["פנסיה", "חיסכון לפרישה. כדאי להבין מה הרכב החשיפה ומה דמי הניהול."], ["קופות גמל", "חיסכון גמיש יותר, עם מסלולים שונים לפי רמת החשיפה למניות."], ["קרנות השתלמות", "חיסכון לטווח בינוני. ההבדל בין מסלולים נובע בעיקר מחשיפה ומדמי ניהול."]].map(function (x) { return '<section class="card"><h2>' + x[0] + "</h2><p class=\"muted\">" + x[1] + "</p></section>"; }).join("") + "</div>";
    h += '<section class="card" style="margin-top:14px"><h2>השוואת מסלולים</h2><p class="muted" style="margin-bottom:10px">בוחרים סוג חיסכון ועד שלושה מסלולים. ההשוואה מתבצעת רק בתוך אותו סוג, כדי לא להשוות נתונים שאינם בני השוואה.</p><div class="pillset" role="group">' + D.il.cats.map(function (c) { return '<button class="btn' + (f.cat === c ? " on" : "") + '" data-act="ilcat" data-arg="' + c + '" aria-pressed="' + (f.cat === c) + '">' + names[c] + "</button>"; }).join("") + '</div><div class="stack" style="margin:12px 0">' + tr.map(function (x) { return '<label class="chk"><input type="checkbox" data-ch="ilpick" data-arg="' + x.id + '"' + (f.pick.indexOf(x.id) > -1 ? " checked" : "") + ">" + x.n + "</label>"; }).join("") + "</div>";
    var sel = tr.filter(function (x) { return f.pick.indexOf(x.id) > -1; });
    h += sel.length ? '<div class="tblw"><table><thead><tr><th>מסלול</th><th class="num">חשיפה למניות</th><th class="num">דמי ניהול שנתיים</th><th class="num">תשואה שנה</th><th class="num">תשואה 3 שנים</th><th class="num">תשואה 5 שנים</th></tr></thead><tbody>' + sel.map(function (x) { return "<tr><td>" + x.n + '</td><td class="num">' + x.eq + '%</td><td class="num">' + x.fee + '%</td><td class="num">' + x.r1 + '%</td><td class="num">' + x.r3 + '%</td><td class="num">' + x.r5 + "%</td></tr>"; }).join("") + '</tbody></table></div><p class="xs" style="margin-top:8px"><span class="sample">דוגמה</span> מקור: אין, נתוני דוגמה. מועד: אין. סוג התשואה: נומינלית ברוטו לדוגמה. אין להסיק מהמספרים כלום על מסלולים אמיתיים.</p>' : '<div class="empty"><span>בחרו לפחות מסלול אחד להשוואה.</span></div>';
    h += '</section><section class="card tint" style="margin-top:14px"><h2>תוכן מקצועי, בעתיד</h2><p>בעתיד אפשר שיופיע כאן תוכן של איש מקצוע מורשה. כרגע אין כאן המלצה של אף גורם, וארז לא מוצג כשותף רשמי או כנותן המלצות. התאמת מסלול אישית תהיה שירות נפרד, רק במסגרת מקצועית ומשפטית מתאימה.</p></section>';
    h += '<p class="xs muted" style="margin-top:14px">' + t("disc.short") + "</p>";
    return h;
  }
};
ACT.ilcat = function (c) { var f = ilSel(); f.cat = c; f.pick = D.il.tracks[c].slice(0, 2).map(function (x) { return x.id; }); BL.save(); BL.render(false); };
CH.ilpick = function (v, el, id) {
  var f = ilSel(), i = f.pick.indexOf(id);
  if (el.checked && i < 0) { if (f.pick.length >= 3) { el.checked = false; BL.toast("אפשר להשוות עד שלושה מסלולים"); return; } f.pick.push(id); }
  if (!el.checked && i > -1) f.pick.splice(i, 1);
  BL.save(); BL.render(false);
};

/* ------------------------------------------------------------ settings */
V.settings = {
  html: function () {
    var h = '<div class="ph"><div><h1>' + t("set.h") + "</h1><p>" + t("set.sub") + "</p></div></div><div class=\"grid g2\">";
    h += '<section class="card stack"><h2>' + t("set.profile") + '</h2>' + (S.joined ? "<p>" + t("set.hello", { n: esc(S.name) }) + '</p><button class="btn" data-act="signup">' + t("set.editprofile") + "</button>" : '<p class="muted">' + t("set.nojoin") + '</p><button class="btn acc" data-act="signup">' + t("su.title") + "</button>") + "</section>";
    var sm = BL.modeSummary();
    h += '<section class="card stack"><h2>' + t("set.lang") + '</h2><div class="fld"><label for="st-lang">' + t("set.langsel") + '</label><select id="st-lang" data-ch="stlang"><option value="he"' + (S.lang === "he" ? " selected" : "") + '>עברית</option><option value="en"' + (S.lang === "en" ? " selected" : "") + ">English</option></select></div></section>";
    h += '<section class="card stack"><h2>' + t("mode.title") + "</h2><p>" + t("mode.mine") + ": <b>" + sm.m + "</b> · <b>" + sm.s + '</b></p><button class="btn" data-act="modes">' + t("mode.change") + '</button><p class="xs muted">' + t("mode.il.note") + "</p></section>";
    h += '<section class="card stack"><h2>' + t("set.look") + '</h2><div class="fld"><label for="st-theme">' + t("set.theme") + '</label><select id="st-theme" data-ch="sttheme">' + opt("light", t("th.light"), S.theme) + opt("dark", t("th.dark"), S.theme) + opt("auto", t("th.auto"), S.theme) + '</select></div><label class="chk"><input type="checkbox" data-ch="stmotion"' + (S.reduce ? " checked" : "") + ">" + t("set.reduce") + "</label></section>";
    h += '<section class="card stack"><h2>' + t("set.music") + "</h2><p class=\"muted\">" + t("set.music.t") + '</p><button class="btn" data-act="music">' + ic("music", 18) + " " + t("music") + "</button></section>";
    h += '<section class="card stack"><h2>' + t("set.role") + '</h2><p class="muted">' + t("set.role.t") + '</p><div class="fld"><label for="st-role">' + t("role.now") + '</label><select id="st-role" data-ch="strole">' + ["guest", "user", "admin"].map(function (r) { return opt(r, t("role." + r), S.role); }).join("") + "</select></div></section>";
    h += '<section class="card stack"><h2>' + t("tm.set") + "</h2>" + (S.terms ? '<p class="muted">' + t("tm.signed", { n: esc(S.terms.name) + " (" + esc(S.terms.email || "") + ")", d: BL.fmtD(new Date(S.terms.ts), { day: "numeric", month: "long", year: "numeric" }), v: esc(S.terms.v) }) + '</p><img class="sigimg" alt="" src="' + S.terms.sig + '">' : "") + '<div class="rowf"><button class="btn" data-act="tmshow">' + t("tm.view") + '</button><button class="btn" data-act="intro">' + t("in.replay") + '</button><button class="btn ghost" data-act="tmrevoke">' + t("tm.revoke") + "</button></div></section>";
    h += '<section class="card stack"><h2>' + t("set.data") + '</h2><p class="muted">' + t("set.data.t") + '</p><div class="rowf"><button class="btn" data-act="bkcopy">' + t("set.backup") + '</button><button class="btn" data-act="bkopen">' + t("set.restore") + '</button></div><button class="btn" data-act="reset">' + t("set.reset") + "</button></section>";
    return h + "</div>";
  }
};
CH.stlang = function (v) { S.lang = v; BL.save(); BL.render(false); };
CH.sttheme = function (v) { S.theme = v; BL.save(); BL.render(false); };
CH.stmotion = function (v, el) { S.reduce = el.checked; BL.save(); BL.render(false); };
CH.strole = function (v) { S.role = v; BL.save(); BL.render(false); };
ACT.bkcopy = function () { BL.copy(JSON.stringify({ market: S.market, styles: S.styles, waiting: S.waiting, journal: S.journal, watch: S.watch, fav: S.fav, rules: S.rules, prefs: S.prefs, done: S.done, pub: S.pub, drafts: S.drafts, notifs: S.notifs })); };
ACT.bkopen = function () { BL.openModal({ title: t("set.restore"), body: '<p class="muted">' + t("set.restore.t") + '</p><textarea id="bk-in" rows="7" class="ltr"></textarea><span class="err" id="bk-err" role="alert"></span><div class="actions"><button class="btn" data-act="close">' + t("cancel") + '</button><button class="btn acc" data-act="bkgo">' + t("set.restore.go") + "</button></div>" }); };
ACT.bkgo = function () {
  try { var o = JSON.parse(document.getElementById("bk-in").value); ["market", "styles", "waiting", "journal", "watch", "fav", "rules", "prefs", "done", "pub", "drafts", "notifs"].forEach(function (k) { if (o[k] != null) S[k] = o[k]; }); BL.save(); BL.closeModal(); BL.render(false); BL.toast(t("set.restored")); }
  catch (e) { document.getElementById("bk-err").textContent = t("set.restore.bad"); }
};
ACT.reset = function (a, el) {
  BL.confirmClick(el, function () { try { localStorage.removeItem("bl_state_v2"); } catch (e) {} location.reload(); });
};

/* ------------------------------------------------------------ admin (Bari) */
function dr() { return S.drafts; }
function draftCard(tk) {
  var d = dr()[tk], s = D.stock(tk);
  return '<article class="card stack"><div class="rowf" style="justify-content:space-between"><div><b class="ltr" style="font-size:20px">' + tk + '</b> <span class="muted">' + esc(Lx(s.n)) + '</span></div><span class="chip' + (d.status === "published" ? " up" : d.status === "prepared" ? " s-near" : "") + '">' + t("ad.st." + d.status) + '</span></div>' + kv(t("l3.seen"), esc(d.seen || "—")) + kv(t("l3.wait"), esc(d.wait || "—")) + '<div class="rowf"><button class="btn sm" data-act="adedit" data-arg="' + tk + '">' + t("edit") + '</button>' + (d.status === "draft" || d.status === "published" ? '<button class="btn sm pri" data-act="adprep" data-arg="' + tk + '">' + t("ad.prep") + "</button>" : '<button class="btn sm" data-act="adprev" data-arg="' + tk + '">' + t("ad.preview") + '</button><button class="btn sm ghost" data-act="adback" data-arg="' + tk + '">' + t("ad.unprep") + "</button>") + "</div></article>";
}
V.admin = {
  html: function () {
    var h = '<div class="ph"><div><h1>' + t("ad.h") + "</h1><p>" + t("ad.sub") + '</p></div><span class="sample">' + t("sample.all") + "</span></div>";
    h += '<div class="notice" style="margin-bottom:14px">' + t("ad.note") + "</div>";
    h += '<div class="rowf" style="margin-bottom:14px">' + ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9", "g10"].slice(0, 0).join("") + "" + ["ad.f1", "ad.f2", "ad.f3", "ad.f4", "ad.f5"].map(function (k, i) { return '<span class="chip' + (i < 3 ? " s-near" : "") + '">' + t(k) + "</span>"; }).join("") + "</div>";
    h += '<div class="grid g2">' + Object.keys(dr()).map(draftCard).join("") + "</div>";
    var free = D.stocks.filter(function (s) { return !dr()[s.t]; });
    if (free.length) h += '<div class="toolbar" style="margin-top:14px"><select id="ad-add" aria-label="' + esc(t("ad.add")) + '">' + free.map(function (s) { return opt(s.t, s.t + " " + Lx(s.n), ""); }).join("") + '</select><button class="btn" data-act="adnew">' + t("ad.add") + "</button></div>";
    h += '<section class="card" style="margin-top:18px"><h2>' + t("ad.auto") + '</h2><p class="muted">' + t("ad.auto.t") + '</p><div class="stack" style="margin-top:10px">' + ["daily", "weekly", "approved"].map(function (k) { return '<label class="chk"><input type="checkbox" disabled>' + t("ad.auto." + k) + ' <span class="chip">' + t("ad.noconn") + "</span></label>"; }).join("") + '</div><p class="xs muted" style="margin-top:10px">' + t("ad.infra") + "</p></section>";
    return h;
  }
};
ACT.adedit = function (tk) {
  var d = dr()[tk], f = function (id, lb, v) { return '<div class="fld"><label for="' + id + '">' + lb + '</label><textarea id="' + id + '" rows="2">' + esc(v) + "</textarea></div>"; };
  BL.openModal({ title: tk + ": " + t("l3.title"), body: '<form data-form="draft" class="stack"><input type="hidden" id="dr-t" value="' + tk + '">' + f("dr-seen", t("l3.seen"), d.seen) + f("dr-wait", t("l3.wait"), d.wait) + f("dr-plus", t("l3.plus"), d.plus) + f("dr-minus", t("l3.minus"), d.minus) + '<div class="actions"><button type="button" class="btn" data-act="close">' + t("cancel") + '</button><button class="btn acc" type="submit">' + t("save") + "</button></div></form>" });
};
FORM.draft = function (f) {
  var d = dr()[f.querySelector("#dr-t").value]; d.seen = f.querySelector("#dr-seen").value.trim(); d.wait = f.querySelector("#dr-wait").value.trim(); d.plus = f.querySelector("#dr-plus").value.trim(); d.minus = f.querySelector("#dr-minus").value.trim();
  if (d.status !== "draft") d.status = "draft";
  BL.save(); BL.closeModal(); BL.render(false); BL.toast(t("saved"));
};
ACT.adnew = function () { var v = document.getElementById("ad-add").value; dr()[v] = { status: "draft", seen: "", wait: "", plus: "", minus: "" }; BL.save(); BL.render(false); };
function preview(tk) {
  var d = dr()[tk], s = D.stock(tk), ver = S.pub.filter(function (p) { return p.t === tk; }).length + 1;
  BL.openModal({ title: t("ad.preview.t"), body: '<div class="notice mint">' + t("ad.preview.n") + '</div><section class="layer l3"><div class="rowf"><b class="ltr" style="font-size:22px">' + tk + "</b><span>" + esc(Lx(s.n)) + '</span><span class="chip">v' + ver + "</span></div><h2>" + t("l3.title.pub") + '</h2><div class="fld3"><b>' + t("l3.zone") + "</b><span>" + ltr(s.zone[0].toFixed(2) + " – " + s.zone[1].toFixed(2)) + '</span></div><div class="fld3"><b>' + t("l3.seen") + "</b><span>" + esc(d.seen || "—") + '</span></div><div class="fld3"><b>' + t("l3.wait") + "</b><span>" + esc(d.wait || "—") + '</span></div><div class="fld3"><b>' + t("l3.plus") + "</b><span>" + esc(d.plus || "—") + '</span></div><div class="fld3"><b>' + t("l3.minus") + "</b><span>" + esc(d.minus || "—") + '</span></div></section><div class="actions"><button class="btn" data-act="close">' + t("ad.edit.back") + '</button><button class="btn acc" data-act="adpub" data-arg="' + tk + '">' + t("ad.publish") + "</button></div>" });
}
ACT.adprep = function (tk) { dr()[tk].status = "prepared"; BL.save(); BL.render(false); preview(tk); };
ACT.adprev = function (tk) { preview(tk); };
ACT.adback = function (tk) { dr()[tk].status = "draft"; BL.save(); BL.render(false); };
ACT.adpub = function (tk) {
  var d = dr()[tk], ver = S.pub.filter(function (p) { return p.t === tk; }).length + 1;
  S.pub.push({ t: tk, ver: ver, ts: Date.now(), seen: d.seen, wait: d.wait, plus: d.plus, minus: d.minus });
  d.status = "published";
  S.notifs.unshift({ id: BL.uid(), type: "scn", ticker: tk, ts: Date.now(), read: false, text: t("ad.pubnotif", { t: tk, v: ver }) });
  BL.save(); BL.closeModal(); BL.render(false); BL.toast(t("ad.published", { t: tk, v: ver }));
};

/* ------------------------------------------------------------ terms gate */
/* DRAFT text. Not reviewed by a lawyer. Placeholders in [brackets] must be filled and the whole text replaced or approved before any public release. */
var TERMS = [
  ["1. מהות האתר", ["BARI'S LAB (להלן: \"האתר\") הוא אתר לימוד ומחקר בתחום קריאת מחיר, שמשתף ידע, שיטת עבודה ותיעוד אישי של [שם המפעיל המלא] (להלן: \"המפעיל\"). האתר נועד ללמד ולשתף ידע בלבד.", "האתר אינו שירות פיננסי, אינו מתווך, אינו מחובר לחשבון מסחר ואינו מבצע פעולות בשמך."]],
  ["2. אין ייעוץ, שיווק או ניהול השקעות", ["המפעיל אינו בעל רישיון ייעוץ השקעות, שיווק השקעות או ניהול תיקי השקעות לפי חוק הסדרת העיסוק בייעוץ השקעות, בשיווק השקעות ובניהול תיקי השקעות, התשנ\"ה-1995, ואינו מתיימר לפעול כאחד מהם.", "שום דבר באתר אינו ייעוץ, שיווק או ניהול השקעות, ואינו מותאם לצרכים, למצב הפיננסי או לנסיבות שלך."]],
  ["3. אין המלצה לפעולה", ["הרדאר, הציונים, האזורים, חדר ההמתנה, התרחישים, הסקירות והדוגמאות הם כלי לימוד ומחקר. הם מתארים מה קרה למחיר ותרחישים אפשריים, ואינם הוראה, המלצה או הצעה לקנות, למכור, להחזיק או להמתין לנכס כלשהו.", "אזכור של נכס, מחיר, אזור, כניסה, סטופ או יעד באתר הוא להמחשה ולימוד בלבד."]],
  ["4. סיכון", ["מסחר בשוק ההון, בחוזים עתידיים, במט\"ח ובמטבעות דיגיטליים כרוך בסיכון גבוה, וכולל אפשרות להפסיד את מלוא ההשקעה ואף יותר (במכשירים ממונפים).", "ביצועי עבר, תיעוד של עסקאות קודמות ותוצאות של אחרים אינם מעידים על העתיד ואינם מבטיחים רווח."]],
  ["5. נתונים ותיעוד", ["הנתונים באתר, כולל מחירים, ציונים, גרפים וסטטיסטיקות, הם דוגמה להמחשה ואינם מחירי שוק. ייתכנו טעויות ואי דיוקים.", "תיעוד של עסקאות או תרחישים של המפעיל הוא תיאור של מה שהוא עשה או חשב, ואינו הצעה או הנחיה לחקות אותו. סטטיסטיקה על מדגם קטן אינה מלמדת על דבר."]],
  ["6. גילוי נאות וניגוד עניינים", ["המפעיל סוחר בעצמו, בין היתר בחוזים עתידיים, במניות ובמטבעות דיגיטליים, בחשבון אישי ובחשבון נוסטרו, ועשוי להחזיק או לבצע עסקאות בנכסים המוזכרים באתר, לפני הפרסום או אחריו.", "[יש להשלים: האם יש או יהיה תשלום, עמלה, שיתוף פעולה או תמורה כלשהי הקשורים לנכס, לברוקר או לשירות המוזכרים באתר.]"]],
  ["7. האחריות שלך", ["כל החלטה פיננסית וכל פעולה שתבצע היא על אחריותך הבלעדית. אתה מבין שהאתר לא ייתן לך הוראות פעולה, ושאתה מקבל החלטות בעצמך.", "מומלץ להתייעץ עם יועץ השקעות מורשה לפני כל החלטה. אתה מאשר שלא תסתמך על האתר כבסיס יחיד להחלטת השקעה.", "אתה מאשר שאתה בן 18 ומעלה."]],
  ["8. הגבלת אחריות", ["במידה המרבית המותרת לפי דין, המפעיל לא יישא באחריות לכל נזק או הפסד, ישיר או עקיף, שייגרמו מהשימוש באתר או מהסתמכות עליו. הגבלה זו אינה גורעת מזכויות שאינן ניתנות להגבלה לפי דין."]],
  ["9. קניין רוחני", ["התוכן, השיטה, הניסוחים, העיצוב והמיתוג באתר שייכים למפעיל. אין להעתיק, להפיץ, למכור או לפרסם אותם ללא אישור בכתב."]],
  ["10. פרטיות ושמירת נתונים", ["בגרסה הנוכחית הנתונים שאתה מזין (יומן, התראות, העדפות) נשמרים בדפדפן שלך בלבד ואינם נשלחים לשרת. בגרסה עתידית עם הרשמה וחשבונות, יפורטו אילו נתונים נאספים, למה, והיכן הם נשמרים, בהתאם לחוק הגנת הפרטיות. [יש להשלים בעת הקמת חשבונות.]"]],
  ["11. שינוי התנאים", ["התנאים עשויים להשתנות. כשיפורסם נוסח חדש, תתבקש לאשר אותו מחדש כדי להמשיך להשתמש באתר."]],
  ["12. דין וסמכות שיפוט", ["על התנאים יחול הדין הישראלי. סמכות השיפוט הבלעדית נתונה לבתי המשפט המוסמכים ב-[עיר]."]]
];
BL.termsText = function () { return TERMS; };
function termsFull() {
  return '<article class="legal">' + TERMS.map(function (x) {
    var m = x[0].match(/^(\d+)\.\s*(.*)$/);
    return '<section class="clause"><span class="cn" aria-hidden="true">' + (m ? m[1] : "") + '</span><div><h3>' + esc(m ? m[2] : x[0]) + "</h3>" + x[1].map(function (p, i) { return "<p><b class=\"ci\">" + (m ? m[1] : "") + "." + (i + 1) + "</b> " + esc(p) + "</p>"; }).join("") + "</div></section>";
  }).join("") + "</article>";
}
V.terms = {
  html: function () {
    var d = BL.fmtD(new Date(), { day: "numeric", month: "long", year: "numeric" });
    var h = '<div class="tmprog" id="tmprog"><i></i></div><div class="termswrap"><div class="rowf" style="justify-content:space-between"><div class="brand static">' + BL.logo() + '<span class="bt">BARI\'S LAB</span></div><button class="langbtn" data-act="lang">' + (S.lang === "he" ? "EN" : "עב") + "</button></div>";
    h += '<header class="dochead"><span class="eyebrow">' + t("tm.form") + "</span><h1>" + t("tm.h") + '</h1><dl class="docmeta"><div><dt>' + t("tm.doc") + "</dt><dd>" + t("tm.docname") + "</dd></div><div><dt>" + t("tm.ver") + '</dt><dd class="ltr">' + BL.TERMS_V + "</dd></div><div><dt>" + t("tm.date") + "</dt><dd>" + d + "</dd></div></dl></header>";
    h += '<p class="notice xs">' + t("tm.draft") + "</p>";
    if (S.lang !== "he") h += '<p class="notice mint xs">' + t("tm.heonly") + "</p>";
    h += '<section class="card tint"><h2>' + t("tm.short") + '</h2><ul class="mlist">' + [1, 2, 3, 4, 5].map(function (i) { return "<li>" + t("tm.s" + i) + "</li>"; }).join("") + "</ul></section>";
    h += '<h2 class="parth"><span>' + t("tm.partA") + "</span> " + t("tm.full") + "</h2>" + termsFull();
    h += '<h2 class="parth"><span>' + t("tm.partB") + "</span> " + t("tm.agree") + '</h2><section class="card stack sigcard">' +
      '<div class="fld"><label for="tm-name">' + t("tm.name") + '</label><input type="text" id="tm-name" autocomplete="name"></div>' +
      '<div class="fld"><label for="tm-mail">' + t("tm.mail") + '</label><input type="email" id="tm-mail" class="ltr" autocomplete="email" inputmode="email" placeholder="name@example.com"><span class="xs muted">' + t("tm.mail.h") + "</span></div>" +
      '<div class="checks">' + [1, 2, 3, 4].map(function (i) { return '<label class="chk"><input type="checkbox" id="tm-c' + i + '"> ' + t("tm.c" + i) + "</label>"; }).join("") + '<label class="chk soft"><input type="checkbox" id="tm-news"> ' + t("tm.news") + "</label></div>" +
      '<div class="fld"><label for="sigc">' + t("tm.sig") + '</label><div class="sigbox"><canvas id="sigc" width="640" height="200" aria-label="' + esc(t("tm.sig")) + '"></canvas></div><div class="rowf"><button type="button" class="btn sm" data-act="tmclear">' + t("tm.clear") + '</button><span class="xs muted">' + t("tm.sig.h") + '</span></div></div>' +
      '<span class="err" id="tm-err" role="alert"></span><button class="btn acc big" data-act="tmsign">' + t("tm.sign") + '</button><p class="xs muted">' + t("tm.local") + "</p></section></div>";
    return h;
  },
  mount: function (el) {
    var c = el.querySelector("#sigc"); if (!c) return;
    var x = c.getContext("2d"), dr = false, last = null;
    x.lineWidth = 3.2; x.lineCap = "round"; x.lineJoin = "round"; x.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#123C3A";
    BL.sigDirty = false;
    function pt(e) { var r = c.getBoundingClientRect(); return { x: (e.clientX - r.left) * c.width / r.width, y: (e.clientY - r.top) * c.height / r.height }; }
    c.addEventListener("pointerdown", function (e) { dr = true; last = pt(e); try { c.setPointerCapture(e.pointerId); } catch (er) {} x.beginPath(); x.moveTo(last.x, last.y); x.lineTo(last.x + 0.1, last.y + 0.1); x.stroke(); BL.sigDirty = true; e.preventDefault(); });
    c.addEventListener("pointermove", function (e) { if (!dr) return; var p = pt(e); x.beginPath(); x.moveTo(last.x, last.y); x.lineTo(p.x, p.y); x.stroke(); last = p; e.preventDefault(); });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (n) { c.addEventListener(n, function () { dr = false; }); });
    var bar = el.querySelector("#tmprog i");
    if (BL.tmScroll) window.removeEventListener("scroll", BL.tmScroll);
    BL.tmScroll = function () { var d = document.documentElement, m = d.scrollHeight - window.innerHeight; if (bar) bar.style.width = (m > 0 ? Math.min(100, Math.round(window.scrollY / m * 100)) : 0) + "%"; };
    window.addEventListener("scroll", BL.tmScroll, { passive: true }); BL.tmScroll();
  }
};
ACT.tmclear = function () { var c = document.getElementById("sigc"); if (c) { c.getContext("2d").clearRect(0, 0, c.width, c.height); BL.sigDirty = false; } };
ACT.tmsign = function () {
  var err = document.getElementById("tm-err"), c = document.getElementById("sigc"), name = (document.getElementById("tm-name").value || "").trim();
  var all = [1, 2, 3, 4].every(function (i) { return document.getElementById("tm-c" + i).checked; });
  var mail = (document.getElementById("tm-mail").value || "").trim();
  if (name.length < 2) { err.textContent = t("tm.e.name"); document.getElementById("tm-name").focus(); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) { err.textContent = t("tm.e.mail"); document.getElementById("tm-mail").focus(); return; }
  if (!all) { err.textContent = t("tm.e.checks"); return; }
  if (!BL.sigDirty) { err.textContent = t("tm.e.sig"); return; }
  S.terms = { v: BL.TERMS_V, name: name, email: mail, news: document.getElementById("tm-news").checked, ts: Date.now(), sig: c.toDataURL("image/png"), lang: S.lang };
  BL.save(); BL.go("home"); BL.intro(name, function () { BL.toast(t("tm.done")); BL.cele({ big: 1, cap: t("tm.cele") }); });
};
/* opening sequence after signing: logo, the range-sweep-target drawing, a preparing checklist, welcome. Skippable; short and static for reduced motion. */
BL.intro = function (name, done) {
  var old = document.getElementById("intro"); if (old) old.remove();
  var red = S.reduce || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var steps = ["in.s1", "in.s2", "in.s3", "in.s4"], el = document.createElement("div"), fin = false, timers = [];
  el.id = "intro"; el.className = "intro" + (red ? " still" : ""); el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", t("in.aria"));
  el.innerHTML = '<button class="intro-skip" type="button">' + t("in.skip") + '</button><div class="intro-in">' +
    '<div class="intro-logo">' + BL.logo() + '</div><h1 class="intro-name ltr" aria-label="BARI\'S LAB">' + "BARI'S LAB".split("").map(function (c, i) { return '<span style="--i:' + i + '">' + (c === " " ? "&nbsp;" : c) + "</span>"; }).join("") + "</h1>" +
    '<svg class="intro-chart ltr" viewBox="0 0 320 150" aria-hidden="true"><line class="rg r1" x1="10" y1="52" x2="310" y2="52"/><line class="rg r2" x1="10" y1="108" x2="310" y2="108"/>' +
    '<text class="lb lb1" x="12" y="45">RANGE</text><text class="lb lb2" x="150" y="138">LIQUIDITY</text><text class="lb lb3" x="238" y="15">TARGET</text>' +
    '<path class="px" pathLength="1" d="M10 82 L58 70 L98 96 L140 128 L172 102 L212 84 L254 40 L304 26"/><circle class="tg" cx="304" cy="26" r="6"/><circle class="tg2" cx="304" cy="26" r="6"/></svg>' +
    '<p class="intro-slogan ltr">DEFINE YOUR RANGE – IDENTIFY YOUR TARGET</p>' +
    '<ul class="intro-list">' + steps.map(function (k, i) { return '<li data-i="' + i + '"><span class="ck"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10.5l4 4 8-9"/></svg></span>' + t(k) + "</li>"; }).join("") + '</ul>' +
    '<div class="intro-bar" aria-hidden="true"><i></i></div>' +
    '<div class="intro-end"><h2>' + t("in.hi", { n: esc(name || "") }) + '</h2><p>' + t("in.sub") + '</p><button class="btn acc intro-go" type="button">' + t("in.go") + '</button><p class="xs">' + t("in.note") + "</p></div></div>";
  document.body.appendChild(el); document.body.classList.add("introing");
  function show() { el.classList.add("ready"); var b = el.querySelector(".intro-go"); if (b) b.focus(); }
  function leave(to) {
    if (fin) return; fin = true; timers.forEach(clearTimeout); el.classList.add("out");
    setTimeout(function () { el.remove(); document.body.classList.remove("introing"); BL.render(true); if (typeof to === "string") BL.go(to); if (done) done(); }, red ? 0 : 700);
  }
  var ob = null;
  el.querySelector(".intro-skip").addEventListener("click", function () {
    if (ob) { leave(); return; }
    timers.forEach(clearTimeout); el.querySelectorAll("li").forEach(function (l) { l.classList.add("on"); }); el.classList.add("full"); show();
  });
  el.querySelector(".intro-go").addEventListener("click", function () { ob = BL.onboard(el, leave); el.querySelector(".intro-skip").textContent = t("ob.skip"); el.querySelector(".intro-skip").style.display = "block"; });
  el.addEventListener("keydown", function (e) { if (e.key === "Escape" && ob) leave(); });
  if (red) { el.querySelectorAll("li").forEach(function (l) { l.classList.add("on"); }); el.classList.add("full"); show(); return; }
  steps.forEach(function (k, i) { timers.push(setTimeout(function () { var l = el.querySelector('li[data-i="' + i + '"]'); if (l) l.classList.add("on"); if (BL.fx && BL.fx.tick) BL.fx.tick(); }, 3600 + i * 650)); });
  timers.push(setTimeout(show, 3600 + steps.length * 650 + 500));
};
/* onboarding pages after the opening: purpose, what you get, how it works, your path, what to know, start */
BL.onboard = function (el, leave) {
  var ic = BL.ic, cur = 0, N = 6, box = document.createElement("div");
  var cn = 0;
  function card(i, t1, t2) { return '<div class="obc" style="--d:' + (0.25 + (cn++) * 0.09) + 's"><span class="obi">' + ic(i, 22) + "</span><div><b>" + t(t1) + "</b><p>" + t(t2) + "</p></div></div>"; }
  function step(n, k) { return '<div class="obs" style="--d:' + (0.3 + n * 0.14) + 's"><span class="obn">' + n + "</span><div><b>" + t("ob.h" + k) + "</b><p>" + t("ob.h" + k + "d") + "</p></div></div>"; }
  function chipsM() { return ["us", "il", "both"].map(function (k) { return '<button type="button" class="obch" data-m="' + k + '"><b>' + t("mkt." + k) + "</b><span>" + t("mkt." + k + ".d") + "</span></button>"; }).join(""); }
  function chipsS() { return ["invest", "swing", "day"].map(function (k) { return '<button type="button" class="obch" data-s="' + k + '"><b>' + t("sty." + k) + "</b><span>" + t("sty." + k + ".d") + "</span></button>"; }).join(""); }
  var slides = [
    '<div class="obv"><span class="obbig">' + ic("radar", 54) + '</span></div><h2>' + t("ob.1.h") + "</h2><p class=\"obl\">" + t("ob.1.p") + '</p><div class="obtri"><span>' + t("ob.1.a") + "</span><span>" + t("ob.1.b") + "</span><span>" + t("ob.1.c") + "</span></div>",
    "<h2>" + t("ob.2.h") + '</h2><div class="obgrid">' + card("radar", "ob.2.a", "ob.2.ad") + card("learn", "ob.2.b", "ob.2.bd") + card("weekly", "ob.2.c", "ob.2.cd") + card("journal", "ob.2.d", "ob.2.dd") + card("wait", "ob.2.e", "ob.2.ed") + card("events", "ob.2.f", "ob.2.fd") + "</div>",
    "<h2>" + t("ob.3.h") + '</h2><div class="obsteps">' + step(1, 1) + step(2, 2) + step(3, 3) + '</div><p class="notice-i">' + t("ob.3.n") + "</p>",
    "<h2>" + t("ob.4.h") + '</h2><p class="obl">' + t("ob.4.p") + '</p><h3>' + t("ob.4.m") + '</h3><div class="obch-g">' + chipsM() + '</div><h3>' + t("ob.4.s") + '</h3><div class="obch-g">' + chipsS() + '</div><p class="xs obx">' + t("ob.4.n") + "</p>",
    "<h2>" + t("ob.5.h") + '</h2><div class="obgrid one">' + card("shield", "ob.5.a", "ob.5.ad") + card("chart", "ob.5.b", "ob.5.bd") + card("help", "ob.5.c", "ob.5.cd") + card("settings", "ob.5.d", "ob.5.dd") + "</div>",
    '<div class="obv"><span class="obbig ok"><svg viewBox="0 0 20 20" width="46" height="46" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10.5l4 4 8-9"/></svg></span></div><h2>' + t("ob.6.h") + '</h2><div class="obsteps">' + step(1, 4) + step(2, 5) + step(3, 6) + '</div><div class="obend"><button class="btn acc intro-go2" type="button" data-to="home">' + t("ob.6.go") + '</button><button class="btn" type="button" data-to="learn">' + t("ob.6.learn") + "</button></div>"
  ];
  box.className = "ob"; box.innerHTML = '<div class="obtrack">' + slides.map(function (h, i) { return '<section class="obp" data-i="' + i + '" aria-label="' + (i + 1) + "/" + N + '">' + h + "</section>"; }).join("") + '</div><div class="obnav"><button type="button" class="btn ghost obprev" aria-label="' + esc(t("ob.prev")) + '">' + t("ob.prev") + '</button><div class="obdots" role="tablist">' + slides.map(function (h, i) { return '<button type="button" role="tab" data-d="' + i + '" aria-label="' + (i + 1) + '"></button>'; }).join("") + '</div><button type="button" class="btn acc obnext">' + t("ob.next") + "</button></div>";
  el.querySelector(".intro-in").style.display = "none"; el.classList.add("onb"); el.appendChild(box);
  function sync() {
    box.querySelectorAll("[data-m]").forEach(function (b) { b.classList.toggle("on", S.market === b.getAttribute("data-m")); b.setAttribute("aria-pressed", S.market === b.getAttribute("data-m")); });
    box.querySelectorAll("[data-s]").forEach(function (b) { var on = !!S.styles[b.getAttribute("data-s")]; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
  }
  function go(i) {
    cur = Math.max(0, Math.min(N - 1, i));
    box.querySelectorAll(".obp").forEach(function (p) { var on = +p.getAttribute("data-i") === cur; p.classList.toggle("on", on); p.hidden = !on; });
    box.querySelectorAll(".obdots button").forEach(function (b, k) { b.classList.toggle("on", k === cur); b.setAttribute("aria-selected", k === cur); });
    box.querySelector(".obprev").style.visibility = cur ? "visible" : "hidden";
    var nx = box.querySelector(".obnext"); nx.style.visibility = cur === N - 1 ? "hidden" : "visible";
    var sk = el.querySelector(".intro-skip"); if (sk) sk.style.display = cur === N - 1 ? "none" : "block";
    var p = box.querySelector('.obp[data-i="' + cur + '"]'); if (p) p.scrollTop = 0; sync();
  }
  box.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.classList.contains("obnext")) go(cur + 1); else if (b.classList.contains("obprev")) go(cur - 1);
    else if (b.hasAttribute("data-d")) go(+b.getAttribute("data-d"));
    else if (b.hasAttribute("data-m")) { S.market = b.getAttribute("data-m"); BL.save(); sync(); }
    else if (b.hasAttribute("data-s")) { var k = b.getAttribute("data-s"); S.styles[k] = S.styles[k] ? 0 : 1; if (!S.styles.invest && !S.styles.swing && !S.styles.day) S.styles = { invest: 1, swing: 1, day: 1 }; BL.save(); sync(); }
    else if (b.hasAttribute("data-to")) { BL.save(); leave(b.getAttribute("data-to")); }
  });
  var x0 = null;
  box.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", function (e) { if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 60) { var rtl = document.documentElement.dir === "rtl"; go(cur + ((dx < 0) !== rtl ? 1 : -1)); } }, { passive: true });
  el.addEventListener("keydown", function (e) { var rtl = document.documentElement.dir === "rtl"; if (e.key === "ArrowRight") go(cur + (rtl ? -1 : 1)); else if (e.key === "ArrowLeft") go(cur + (rtl ? 1 : -1)); });
  go(0); box.querySelector(".obnext").focus();
  return { go: go };
};
ACT.intro = function () { BL.intro(S.terms && S.terms.name, null); };
ACT.tmshow = function () { BL.openModal({ title: t("tm.h"), body: termsFull() }); };
ACT.tmrevoke = function (a, el) { BL.confirmClick(el, function () { S.terms = null; BL.save(); BL.render(true); }); };

BL.start();
})();
