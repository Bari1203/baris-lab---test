/* Views C: one column per market. Forex (price only, no targets), futures, crypto (own targets and correlation), shekel converter. None of these sit in the radar or the waiting room. */
(function () {
"use strict";
var BL = window.BL, D = window.D, S = BL.S, t = BL.t, Lx = BL.L, esc = BL.esc, ic = BL.ic, V = BL.V, ACT = BL.ACT, IN = BL.IN, CH = BL.CH;
var money = BL.money, chgChip = BL.chgChip;

function f(k, d) { return S.f[k] || (S.f[k] = d); }
function nf(n, dec) { return new Intl.NumberFormat("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n); }
function head(h, sub, extra) { return '<div class="ph"><div><h1>' + t(h) + "</h1><p>" + t(sub) + '</p></div><span class="sample">' + t("sample.all") + "</span></div>" + (extra || ""); }
function closes(s) { return D.series("sp|" + s.t, 32, 1.8, s.price).map(function (c) { return c.c; }); }
function rangeBar(s) {
  var c = closes(s), lo = Math.min.apply(null, c), hi = Math.max.apply(null, c), p = Math.max(0, Math.min(100, (s.price - lo) / ((hi - lo) || 1) * 100));
  return '<div class="mk-rng"><div class="lbl"><span>' + t("fx.range") + '</span></div><div class="trk"><i style="inset-inline-start:' + p.toFixed(1) + '%"></i></div><div class="vals num ltr"><span>' + money(lo, s.dec) + "</span><span>" + money(hi, s.dec) + "</span></div></div>";
}
function zoneBar(s, key) {
  var lo = Math.min(s.price, s.zone[0], s.zone[1]), hi = Math.max(s.price, s.zone[0], s.zone[1]), pad = (hi - lo) * .12 || 1; lo -= pad; hi += pad;
  var pos = function (v) { return ((v - lo) / (hi - lo) * 100).toFixed(1); }, d = D.dist(s);
  return '<div class="mk-zone"><div class="lbl"><span>' + t(key) + '</span><span class="num ltr">' + money(s.zone[0], s.dec) + " – " + money(s.zone[1], s.dec) + '</span></div><div class="trk"><b style="inset-inline-start:' + pos(s.zone[0]) + "%;width:" + (pos(s.zone[1]) - pos(s.zone[0])).toFixed(1) + '%"></b><i style="inset-inline-start:' + pos(s.price) + '%"></i></div><p class="xs muted">' + (d.inside ? t("dist.in") : t("dist." + d.side, { p: d.pct.toFixed(1) })) + "</p></div>";
}
function logBtn(s) { return '<button class="btn sm" data-act="jtrade" data-arg="day" data-tk="' + esc(s.t) + '">' + ic("plus", 16) + " " + t("fx.log") + "</button>"; }
function card(s, mid, btns) {
  var up = BL.chg(s) >= 0;
  return '<article class="mkc ' + (up ? "up" : "dn") + '"><header><span class="av">' + esc(s.ab || s.t.slice(0, 2)) + '</span><div class="tn"><b class="ltr">' + esc(Lx(s.n)) + '</b><span class="xs muted ltr">' + s.t + '</span></div>' + (s.role === "index" ? '<span class="chip kind">' + t("mk.index") + "</span>" : "") + '</header><div class="px"><b class="num ltr big">' + nf(s.price, s.dec) + "</b>" + chgChip(s) + '<span class="xs muted">' + t("mk.chg") + "</span></div>" + BL.spark(s, 300, 84) + (mid || "") + '<p class="twhy">' + esc(Lx(s.why)) + '</p><div class="rowf">' + (btns || "") + "</div></article>";
}

/* ---------- forex: price and movement only ---------- */
function sessions() {
  var n = new Date(), h = n.getUTCHours() + n.getUTCMinutes() / 60, d = n.getUTCDay();
  var closed = d === 6 || (d === 0 && h < 21) || (d === 5 && h >= 21);
  var S3 = [["tokyo", 0, 9], ["london", 7, 16], ["ny", 12, 21]];
  return '<section class="card mk-sess"><div class="rowf" style="justify-content:space-between"><h2>' + t("fx.sess") + '</h2><span class="xs muted">' + t("fx.sess.n") + "</span></div>" + (closed ? '<p class="notice warn xs">' + t("fx.closed") + "</p>" : "") +
    '<div class="mk-sg">' + S3.map(function (x) { var on = !closed && h >= x[1] && h < x[2]; return '<div class="mk-sp' + (on ? " on" : "") + '"><b>' + t("sess." + x[0]) + '</b><span>' + t(on ? "sess.on" : "sess.off") + '</span><i style="--a:' + (x[1] / 24 * 100) + "%;--w:" + ((x[2] - x[1]) / 24 * 100) + '%"></i></div>'; }).join("") + "</div></section>";
}
V.fx = {
  html: function () {
    var pairs = D.fx.filter(function (x) { return x.role === "pair"; }), dxy = D.fx.filter(function (x) { return x.role === "index"; })[0];
    var h = head("fx.h", "fx.sub") + sessions();
    h += '<div class="sectitle"><h2>' + t("fx.pairs") + '</h2></div><div class="mkg">' + pairs.map(function (s) { return card(s, rangeBar(s), logBtn(s)); }).join("") + "</div>";
    h += '<section class="card tint mk-dxy"><div class="rowf" style="justify-content:space-between"><h2>' + t("fx.dxy.h") + '</h2><span class="chip kind">' + t("mk.index") + '</span></div><div class="mk-dx"><div><div class="px"><b class="num ltr big">' + nf(dxy.price, dxy.dec) + "</b>" + chgChip(dxy) + '<span class="xs muted">' + t("mk.chg") + "</span></div><p class=\"sm\"><b>" + t("fx.dxy.n") + "</b></p><p class=\"sm muted\">" + t("fx.dxy.t") + "</p></div>" + BL.spark(dxy, 300, 84) + "</div></section>";
    return h + '<p class="xs muted" style="margin-top:16px">' + t("fx.foot") + "</p>";
  }
};

/* ---------- futures ---------- */
V.fut = {
  html: function () {
    var h = head("fut.h", "fut.sub") + '<div class="mkg">' + D.fut.map(function (s) { return card(s, zoneBar(s, "fut.zone"), '<button class="btn sm" data-act="open" data-arg="' + s.t + '">' + t("fut.open") + "</button>" + logBtn(s)); }).join("") + "</div>";
    h += '<div class="rowf" style="margin-top:14px"><button class="btn" data-act="nav" data-arg="weekly">' + ic("weekly", 18) + " " + t("fut.weekly") + "</button></div>";
    return h + '<p class="notice warn xs" style="margin-top:16px">' + t("fut.foot") + "</p>";
  }
};

/* ---------- crypto: BTC, ETH, XRP with their own targets and their correlation ---------- */
function corrCell(v) { var a = Math.abs(v), cls = v >= .8 ? "hi" : v >= .5 ? "mid" : "lo"; return '<td class="c ' + cls + '" style="--v:' + Math.round(a * 100) + '%"><b class="num ltr">' + v.toFixed(2) + "</b></td>"; }
function corrOf(a, b, w) { if (a === b) return 1; var p = D.corr.pairs.filter(function (x) { return (x[0] === a && x[1] === b) || (x[0] === b && x[1] === a); })[0]; return p ? p[2][w] : 0; }
function corrBlock() {
  var w = f("cryw", 30), ks = D.cry.map(function (x) { return x.t; });
  var h = '<section class="card mk-corr"><div class="rowf" style="justify-content:space-between"><div><h2>' + t("cry.corr.h") + '</h2><p class="xs muted">' + t("cry.corr.n") + '</p></div><div class="seg mini" role="group" aria-label="' + esc(t("cry.win")) + '">' + [7, 30, 90].map(function (x) { return '<button class="' + (w === x ? "on" : "") + '" data-act="cryw" data-arg="' + x + '" aria-pressed="' + (w === x) + '">' + t("cry.w" + x) + "</button>"; }).join("") + "</div></div>";
  h += '<div class="mk-cm"><table class="mk-ct"><thead><tr><th></th>' + ks.map(function (k) { return '<th class="ltr">' + k + "</th>"; }).join("") + "</tr></thead><tbody>" + ks.map(function (r) { return '<tr><th class="ltr">' + r + "</th>" + ks.map(function (c) { return corrCell(corrOf(r, c, w)); }).join("") + "</tr>"; }).join("") + "</tbody></table><div class=\"mk-cp\">" +
    D.corr.pairs.map(function (p) { var v = p[2][w]; return '<div class="mk-pr"><div class="rowf" style="justify-content:space-between"><b class="ltr">' + p[0] + " / " + p[1] + '</b><span class="num ltr">' + v.toFixed(2) + " · " + t(v >= .8 ? "cry.strong" : v >= .5 ? "cry.mid" : "cry.weak") + '</span></div><div class="bar"><i style="--p:' + Math.round(v * 100) + '%"></i></div></div>'; }).join("") + "</div></div>";
  return h + '<p class="xs muted">' + t("cry.corr.read") + '</p><p class="xs"><span class="sample">' + t("cry.corr.s") + "</span></p></section>";
}
V.cry = {
  html: function () {
    var h = head("cry.h", "cry.sub") + '<div class="notice mint" style="margin-bottom:14px">' + t("cry.n") + '</div><div class="mkg">' + D.cry.map(function (s) {
      return card(s, zoneBar(s, "cry.target") + '<div class="mk-sc"><div><span class="k">' + t("f.changed") + "</span><p>" + esc(Lx(s.ch)) + '</p></div><div><span class="k">' + t("wait.missing") + "</span><p>" + esc(Lx(s.miss)) + "</p></div></div>", '<button class="btn sm" data-act="open" data-arg="' + s.t + '">' + t("fut.open") + "</button>" + logBtn(s));
    }).join("") + "</div>" + corrBlock();
    return h + '<p class="notice warn xs" style="margin-top:16px">' + t("cry.foot") + "</p>";
  }
};
ACT.cryw = function (w) { S.f.cryw = +w; BL.save(); BL.render(false); };

/* ---------- shekel converter ---------- */
var CUR = ["ILS", "USD", "EUR", "GBP"], SYM = { ILS: "₪", USD: "$", EUR: "€", GBP: "£" };
function rate(c) { return c === "ILS" ? 1 : D.ilsRates[c]; }
function cv() { var v = f("ils", { amt: "1000", from: "USD", to: "ILS" }); return v; }
function ilsOut() {
  var v = cv(), a = parseFloat(String(v.amt).replace(/,/g, "")), ok = !isNaN(a) && a >= 0, r = rate(v.from) / rate(v.to);
  var one = nf(r, r < 0.1 ? 5 : 4);
  return '<div class="mk-res"><span class="xs muted">' + t("ils.res") + '</span><div class="big num ltr">' + (ok ? nf(a * r, 2) : "—") + ' <span class="u">' + SYM[v.to] + '</span></div><p class="num ltr xs muted">1 ' + SYM[v.from] + " = " + one + " " + SYM[v.to] + "</p></div>";
}
function curSel(id, ch, cur) { return '<select id="' + id + '" data-ch="' + ch + '" aria-label="' + esc(t("ils." + (id === "ils-f" ? "from" : "to"))) + '">' + CUR.map(function (c) { return '<option value="' + c + '"' + (cur === c ? " selected" : "") + ">" + SYM[c] + " " + t("cur." + c) + "</option>"; }).join("") + "</select>"; }
V.ils = {
  html: function () {
    var v = cv();
    var h = head("ils.h", "ils.sub");
    h += '<section class="card mk-conv"><div class="mk-cf"><div class="fld"><label for="ils-a">' + t("ils.amt") + '</label><input type="text" inputmode="decimal" id="ils-a" class="ltr" data-in="ilsamt" value="' + esc(v.amt) + '" autocomplete="off"></div><div class="fld"><label for="ils-f">' + t("ils.from") + "</label>" + curSel("ils-f", "ilsfrom", v.from) + '</div><button class="iconbtn mk-sw" data-act="ilsswap" aria-label="' + esc(t("ils.swap")) + '">' + ic("fx", 22) + '</button><div class="fld"><label for="ils-t">' + t("ils.to") + "</label>" + curSel("ils-t", "ilsto", v.to) + "</div></div>" +
      '<div class="rowf">' + ["100", "1000", "10000"].map(function (x) { return '<button class="btn sm" data-act="ilsamt" data-arg="' + x + '">' + nf(+x, 0) + "</button>"; }).join("") + '</div><div id="ils-out">' + ilsOut() + "</div></section>";
    h += '<section class="card" style="margin-top:14px"><h2>' + t("ils.rates") + '</h2><div class="mk-tw"><table class="mk-tb"><thead><tr><th>' + t("ils.cur") + '</th><th>' + t("ils.per") + '</th><th>' + t("ils.inv") + '</th><th>' + t("ils.mv") + "</th></tr></thead><tbody>" + ["USD", "EUR", "GBP"].map(function (c) {
      var r = rate(c), item = { t: c + "ILS", price: r, vol: 0.3 }, ch = BL.chg(item);
      return "<tr><td><b>" + SYM[c] + " " + t("cur." + c) + '</b> <span class="xs muted ltr">' + c + '/ILS</span></td><td class="ltr">' + nf(r, 4) + '</td><td class="ltr">' + nf(1 / r, 4) + '</td><td><span class="chg ' + (ch >= 0 ? "up" : "dn") + '">' + (ch >= 0 ? "▲ +" : "▼ ") + ch.toFixed(1) + "%</span></td></tr>";
    }).join("") + "</tbody></table></div><p class=\"xs muted\">" + t("ils.n") + '</p><p class="xs"><span class="sample">' + t("sample.all") + "</span></p></section>";
    return h;
  }
};
IN.ilsamt = function (v) { cv().amt = v; BL.save(); var o = document.getElementById("ils-out"); if (o) o.innerHTML = ilsOut(); };
CH.ilsfrom = function (v) { cv().from = v; BL.save(); var o = document.getElementById("ils-out"); if (o) o.innerHTML = ilsOut(); };
CH.ilsto = function (v) { cv().to = v; BL.save(); var o = document.getElementById("ils-out"); if (o) o.innerHTML = ilsOut(); };
ACT.ilsswap = function () { var v = cv(), x = v.from; v.from = v.to; v.to = x; BL.save(); BL.render(false); };
ACT.ilsamt = function (a) { cv().amt = a; BL.save(); BL.render(false); };
})();
