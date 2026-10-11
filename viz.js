/* Sound indicator: one calm orb with thin rings that follow the level, in the site palette. It reads the real analyser of the player (audio.js). The generated pads are slow, so levels are auto-normalized to stay lively; this is a display, not a measurement. */
(function () {
"use strict";
var N = 48, sm = [], pk = 90, peaks = [], rip = [], parts = [], raf = 0, last = 0, rot = 0, lastRip = 0, i;
for (i = 0; i < N; i++) { sm.push(0); peaks.push(0); }
for (i = 0; i < 28; i++) parts.push({ x: Math.random(), y: Math.random(), s: .2 + Math.random() * .8, r: 1 + Math.random() * 2.2, h: Math.random() });
var HUES = [[6, 48], [160, 205], [262, 335], [150, 195]];
function reduced() { return document.documentElement.classList.contains("reduce") || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches); }
function hue(k, f, t) { var p = HUES[(window.AU && AU.cfg.track) || 0] || HUES[0]; return (p[0] + (p[1] - p[0]) * f + t * 14) % 360; }
function read(t) {
  var f = AU.freq(), j, k;
  for (j = 0; j < N; j++) {
    var raw = 0;
    if (f) { var a = Math.floor(1 + Math.pow(j / N, 1.6) * 30), b = Math.max(a + 1, Math.floor(1 + Math.pow((j + 1) / N, 1.6) * 30)); for (k = a; k < b; k++) raw = Math.max(raw, f[k] || 0); }
    pk = Math.max(pk * .9992, raw, 60);
    var v = raw / pk; v = v * (.86 + .14 * Math.sin(t * 3.1 + j * .8));
    if (!f) v = .04 + .03 * Math.sin(t * 1.6 + j * .5);
    sm[j] += (v - sm[j]) * (v > sm[j] ? .5 : .12);
    peaks[j] = Math.max(sm[j], peaks[j] - .012);
  }
  var lo = 0; for (j = 0; j < 8; j++) lo += sm[j]; return lo / 8;
}
function fit(c) { var d = Math.min(2, window.devicePixelRatio || 1), w = c.clientWidth, h = c.clientHeight; if (c.width !== Math.round(w * d) || c.height !== Math.round(h * d)) { c.width = Math.round(w * d); c.height = Math.round(h * d); } var x = c.getContext("2d"); x.setTransform(d, 0, 0, d, 0, 0); return { x: x, w: w, h: h }; }
function drawBig(c, t, lvl) {
  var o = fit(c), x = o.x, w = o.w, h = o.h; if (!w) return; x.clearRect(0, 0, w, h);
  var cx = w / 2, cy = h * .52, r0 = Math.min(w, h) * .2, r = r0 * (1 + .16 * lvl) + Math.sin(t * 1.2) * 1.2, k;
  /* quiet rings that follow the level */
  for (k = 3; k >= 1; k--) { x.beginPath(); x.lineWidth = 1.5; x.strokeStyle = "rgba(200,226,216," + (.34 - k * .08) + ")"; x.arc(cx, cy, r + k * (14 + lvl * 16), 0, 6.283); x.stroke(); }
  x.beginPath(); x.lineWidth = 2; x.strokeStyle = "rgba(241,116,98," + (.55 + lvl * .35) + ")"; x.arc(cx, cy, r + 8 + lvl * 6, 0, 6.283); x.stroke();
  /* the core */
  var g = x.createRadialGradient(cx - r * .3, cy - r * .35, r * .1, cx, cy, r);
  g.addColorStop(0, "#E4F1EB"); g.addColorStop(1, "#C8E2D8");
  x.beginPath(); x.fillStyle = g; x.arc(cx, cy, r, 0, 6.283); x.fill();
}
function rr(x, a, b, w, h, r) { r = Math.min(r, w / 2, h / 2); x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); x.fill(); }
function drawMini(c, t, lvl) {
  var o = fit(c), x = o.x, w = o.w, h = o.h; if (!w) return; x.clearRect(0, 0, w, h);
  var cx = w / 2, cy = h / 2, r = Math.min(w, h) * (.26 + .12 * lvl);
  x.beginPath(); x.lineWidth = 1.5; x.strokeStyle = "rgba(241,116,98,.45)"; x.arc(cx, cy, Math.min(w, h) * (.42 + .06 * lvl), 0, 6.283); x.stroke();
  x.beginPath(); x.fillStyle = "#F17462"; x.arc(cx, cy, r, 0, 6.283); x.fill();
}
function frame(ts) {
  raf = 0; var t = ts / 1000, big = document.getElementById("viz"), mini = document.getElementById("vizm"), on = window.AU && AU.playing;
  if (!big && !on) { if (mini) { drawMini(mini, t, 0); } return; }
  if (reduced() && ts - last < 250) { raf = requestAnimationFrame(frame); return; }
  last = ts; var lvl = read(t); if (big) drawBig(big, t, reduced() ? lvl * .3 : lvl); if (mini) drawMini(mini, t, reduced() ? 0 : lvl);
  raf = requestAnimationFrame(frame);
}
BL.vizStart = function () { if (!raf) raf = requestAnimationFrame(frame); };
})();
