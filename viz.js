/* Sound indicator: a liquid black-and-white blob whose outline follows the frequency bands of the music, with springs for a fluid feel. It reads the real analyser of the player (audio.js). The generated pads are slow, so levels are auto-normalized to stay lively; this is a display, not a measurement. */
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
var P = 72, bp = [], bv = [], tg = [];
for (i = 0; i < P; i++) { bp.push(1); bv.push(0); tg.push(1); }
function drawBig(c, t, lvl) {
  var o = fit(c), x = o.x, w = o.w, h = o.h; if (!w) return; x.clearRect(0, 0, w, h);
  var cx = w / 2, cy = h * .5, r0 = Math.min(w, h) * .21, j, k, p;
  /* target shape: each angle gets the level of one frequency band (mirrored), plus a slow drift so it never sits still */
  for (j = 0; j < P; j++) { var u = j / P * 2; if (u > 1) u = 2 - u; var b = sm[Math.min(N - 1, Math.floor(u * 26))]; tg[j] = 1 + .34 * b + .05 * Math.sin(t * .9 + j * .28) + .035 * Math.sin(t * 1.7 - j * .55); }
  for (p = 0; p < 2; p++) { var cp = tg.slice(); for (j = 0; j < P; j++) tg[j] = (cp[(j + P - 1) % P] + cp[j] * 2 + cp[(j + 1) % P]) / 4; }
  var sc = 1 + .1 * lvl;
  for (j = 0; j < P; j++) { bv[j] += (tg[j] * sc - bp[j]) * .09; bv[j] *= .86; bp[j] += bv[j]; }
  /* thin grey rings, they breathe with the level */
  for (k = 1; k <= 2; k++) { x.beginPath(); x.lineWidth = 1; x.strokeStyle = "rgba(255,255,255," + (.16 - k * .045 + lvl * .06) + ")"; x.arc(cx, cy, r0 * (1.45 + k * .4) + lvl * 10 * k, 0, 6.283); x.stroke(); }
  /* the liquid body: a closed smooth curve through the points */
  var pts = bp.map(function (rad, q) { var an = q / P * 6.283 - 1.5708; return [cx + Math.cos(an) * r0 * rad, cy + Math.sin(an) * r0 * rad]; });
  x.beginPath(); var m0 = [(pts[P - 1][0] + pts[0][0]) / 2, (pts[P - 1][1] + pts[0][1]) / 2]; x.moveTo(m0[0], m0[1]);
  for (j = 0; j < P; j++) { var n = pts[(j + 1) % P], m = [(pts[j][0] + n[0]) / 2, (pts[j][1] + n[1]) / 2]; x.quadraticCurveTo(pts[j][0], pts[j][1], m[0], m[1]); }
  x.closePath();
  var g = x.createRadialGradient(cx - r0 * .35, cy - r0 * .45, r0 * .1, cx, cy, r0 * 1.5);
  g.addColorStop(0, "#FFFFFF"); g.addColorStop(.55, "#D9DEDC"); g.addColorStop(1, "#7E8A86");
  x.shadowColor = "rgba(255,255,255," + (.18 + lvl * .25) + ")"; x.shadowBlur = 30 + lvl * 30; x.fillStyle = g; x.fill(); x.shadowBlur = 0;
}
function drawMini(c, t, lvl) {
  var o = fit(c), x = o.x, w = o.w, h = o.h; if (!w) return; x.clearRect(0, 0, w, h);
  var col = getComputedStyle(c).color, cx = w / 2, cy = h / 2, r = Math.min(w, h) * (.24 + .14 * lvl);
  x.beginPath(); x.lineWidth = 1.5; x.globalAlpha = .4; x.strokeStyle = col; x.arc(cx, cy, Math.min(w, h) * (.42 + .06 * lvl), 0, 6.283); x.stroke(); x.globalAlpha = 1;
  x.beginPath(); x.fillStyle = col; x.arc(cx, cy, r, 0, 6.283); x.fill();
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
