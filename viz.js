/* Sound visualizer: a pulsing orb with rings and radial bars, a mirrored bar row underneath, and drifting particles. It reads the real analyser of the player (audio.js). The generated pads are slow, so levels are auto-normalized to stay lively; this is a display, not a measurement. */
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
  var cx = w / 2, cy = h * .4, r0 = Math.min(w * .5, h * .78) * .26, r = r0 * (1 + .42 * lvl) + Math.sin(t * 1.4) * 2.5, j;
  /* drifting particles */
  parts.forEach(function (p) { p.y -= p.s * .0016 * (1 + lvl * 4); if (p.y < -.05) { p.y = 1.05; p.x = Math.random(); } var px = p.x * w + Math.sin(t + p.h * 9) * 10, py = p.y * h; x.beginPath(); x.fillStyle = "hsla(" + hue(0, p.h, t) + ",85%,70%," + (.25 + lvl * .5) + ")"; x.arc(px, py, p.r * (1 + lvl), 0, 6.283); x.fill(); });
  /* ripples */
  if (lvl > .35 && t - lastRip > .55 || t - lastRip > 2.2) { rip.push({ t0: t }); lastRip = t; if (rip.length > 7) rip.shift(); }
  rip.forEach(function (q) { var a = (t - q.t0) / 2.6; if (a > 1) return; x.beginPath(); x.lineWidth = 2.5 * (1 - a) + .5; x.strokeStyle = "hsla(" + hue(0, a, t) + ",85%,66%," + (.55 * (1 - a)) + ")"; x.arc(cx, cy, r + a * Math.min(w, h) * .42, 0, 6.283); x.stroke(); });
  /* radial bars */
  rot += .004 + lvl * .02; x.lineCap = "round";
  for (j = 0; j < N * 2; j++) {
    var idx = j < N ? j : 2 * N - 1 - j, v = sm[idx], ang = rot + j / (N * 2) * 6.283, len = 4 + v * r0 * 1.15, ra = r + 8;
    x.beginPath(); x.lineWidth = Math.max(2, r0 * .07); x.strokeStyle = "hsl(" + hue(0, idx / N, t) + ",88%," + (56 + v * 16) + "%)";
    x.moveTo(cx + Math.cos(ang) * ra, cy + Math.sin(ang) * ra); x.lineTo(cx + Math.cos(ang) * (ra + len), cy + Math.sin(ang) * (ra + len)); x.stroke();
  }
  /* the orb */
  var g = x.createRadialGradient(cx - r * .3, cy - r * .35, r * .1, cx, cy, r);
  g.addColorStop(0, "hsl(" + hue(0, .2, t) + ",95%,78%)"); g.addColorStop(.6, "hsl(" + hue(0, .55, t) + ",85%,58%)"); g.addColorStop(1, "hsl(" + hue(0, 1, t) + ",80%,36%)");
  x.shadowColor = "hsla(" + hue(0, .5, t) + ",90%,60%,.75)"; x.shadowBlur = 28 + lvl * 40; x.beginPath(); x.fillStyle = g; x.arc(cx, cy, r, 0, 6.283); x.fill(); x.shadowBlur = 0;
  x.beginPath(); x.strokeStyle = "rgba(255,255,255,.35)"; x.lineWidth = 2; x.arc(cx, cy, r * .72 + Math.sin(t * 2) * 2, 0.4, 2.6); x.stroke();
  /* bar row under the orb, with falling peak caps and a soft mirror */
  var by = h - 12, bh = h * .2, bw = (w - 24) / N, gap = Math.max(1.5, bw * .28);
  for (j = 0; j < N; j++) {
    var bx = 12 + j * bw, v2 = sm[j], hh = 3 + v2 * bh, col = "hsl(" + hue(0, j / N, t) + ",88%,62%)";
    x.fillStyle = col; rr(x, bx, by - hh, bw - gap, hh, (bw - gap) / 2);
    x.fillStyle = "hsla(" + hue(0, j / N, t) + ",88%,62%,.18)"; rr(x, bx, by + 2, bw - gap, Math.min(10, hh * .35), 2);
    x.fillStyle = "rgba(255,255,255,.85)"; x.fillRect(bx, by - 3 - peaks[j] * bh - 3, bw - gap, 2);
  }
}
function rr(x, a, b, w, h, r) { r = Math.min(r, w / 2, h / 2); x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); x.fill(); }
function drawMini(c, t) {
  var o = fit(c), x = o.x, w = o.w, h = o.h; if (!w) return; x.clearRect(0, 0, w, h);
  var n = 6, bw = w / n, j; for (j = 0; j < n; j++) { var v = (sm[j * 3] + sm[j * 3 + 1] + sm[j * 3 + 2]) / 3, hh = 3 + v * (h - 4); x.fillStyle = "hsl(" + hue(0, j / n, t) + ",85%,58%)"; rr(x, j * bw + 1, h - hh, bw - 3, hh, 2); }
}
function frame(ts) {
  raf = 0; var t = ts / 1000, big = document.getElementById("viz"), mini = document.getElementById("vizm"), on = window.AU && AU.playing;
  if (!big && !on) { if (mini) { read(t); drawMini(mini, t); } return; }
  if (reduced() && ts - last < 250) { raf = requestAnimationFrame(frame); return; }
  last = ts; var lvl = read(t); if (big) drawBig(big, t, reduced() ? lvl * .3 : lvl); if (mini) drawMini(mini, t);
  raf = requestAnimationFrame(frame);
}
BL.vizStart = function () { if (!raf) raf = requestAnimationFrame(frame); };
})();
