/* Generative ambient audio with a real 3-band EQ. Starts only after a click. */
(function () {
"use strict";
var AU = window.AU = {
  playing: false,
  supported: !!(window.AudioContext || window.webkitAudioContext),
  cfg: { track: 0, vol: 25, muted: false, eq: [0, 0, 0] },
  onchange: null
};
var ctx, master, comp, bands = [], bus, timer = null, live = [], noiseBuf = null;

var TRACKS = [
  { chords: [[0, 7, 12, 16, 19], [-3, 4, 9, 12, 16], [-5, 2, 7, 11, 14]], base: 130.81, lp: 1100, step: 9 },
  { chords: [[-3, 4, 9, 12], [-7, 0, 5, 9, 12], [-5, 2, 7, 10, 14]], base: 130.81, lp: 800, step: 11 },
  { chords: [[2, 9, 14, 17], [-2, 5, 10, 14, 17], [0, 7, 12, 16]], base: 110, lp: 650, step: 12 },
  { noise: true }
];

function changed() { if (typeof AU.onchange === "function") AU.onchange(); }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

function build() {
  var AC = window.AudioContext || window.webkitAudioContext;
  ctx = new AC();
  master = ctx.createGain();
  comp = ctx.createDynamicsCompressor();
  bus = ctx.createGain();
  var types = ["lowshelf", "peaking", "highshelf"], freqs = [120, 1000, 4000];
  bands = types.map(function (ty, i) {
    var f = ctx.createBiquadFilter();
    f.type = ty; f.frequency.value = freqs[i]; f.Q.value = 0.9; f.gain.value = AU.cfg.eq[i] || 0;
    return f;
  });
  bus.connect(bands[0]); bands[0].connect(bands[1]); bands[1].connect(bands[2]);
  bands[2].connect(comp); comp.connect(master); master.connect(ctx.destination);
  applyVol();
}
function applyVol() {
  if (!master) return;
  var v = AU.cfg.muted ? 0 : clamp(AU.cfg.vol, 0, 100) / 100 * 0.45;
  master.gain.setTargetAtTime(v, ctx.currentTime, 0.05);
}
function note(base, semis) { return base * Math.pow(2, semis / 12); }

function playChord(tr, idx) {
  var now = ctx.currentTime, dur = tr.step, chord = tr.chords[idx % tr.chords.length];
  var g = ctx.createGain(), lp = ctx.createBiquadFilter();
  lp.type = "lowpass"; lp.frequency.value = tr.lp; lp.Q.value = 0.4;
  g.gain.setValueAtTime(0.0001, now);
  g.gain.linearRampToValueAtTime(0.5, now + 3.5);
  g.gain.setValueAtTime(0.5, now + dur - 0.5);
  g.gain.linearRampToValueAtTime(0.0001, now + dur + 4);
  lp.connect(g); g.connect(bus);
  var oscs = [];
  chord.forEach(function (s) {
    [-5, 5].forEach(function (det) {
      var o = ctx.createOscillator();
      o.type = "sine"; o.frequency.value = note(tr.base, s); o.detune.value = det;
      var og = ctx.createGain(); og.gain.value = 0.9 / (chord.length * 2);
      o.connect(og); og.connect(lp); o.start(now); o.stop(now + dur + 4.2);
      oscs.push(o);
    });
  });
  live.push({ g: g, oscs: oscs, end: now + dur + 4.3 });
}

function noiseTrack() {
  if (!noiseBuf) {
    var len = ctx.sampleRate * 3;
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = noiseBuf.getChannelData(0), last = 0;
    for (var i = 0; i < len; i++) { var w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.2; }
  }
  var src = ctx.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
  var f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 900;
  var g = ctx.createGain(); g.gain.setValueAtTime(0.0001, ctx.currentTime); g.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 2);
  var lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 0.08; lg.gain.value = 250;
  lfo.connect(lg); lg.connect(f.frequency); lfo.start();
  src.connect(f); f.connect(g); g.connect(bus); src.start();
  live.push({ g: g, oscs: [src, lfo], end: Infinity });
}

function startGen() {
  stopGen(false);
  var tr = TRACKS[AU.cfg.track] || TRACKS[0];
  if (tr.noise) { noiseTrack(); return; }
  var i = 0;
  playChord(tr, i++);
  timer = setInterval(function () { playChord(tr, i++); }, tr.step * 1000);
}
function stopGen(fade) {
  if (timer) { clearInterval(timer); timer = null; }
  if (!ctx) return;
  var now = ctx.currentTime;
  live.forEach(function (l) {
    try {
      l.g.gain.cancelScheduledValues(now);
      l.g.gain.setValueAtTime(Math.max(l.g.gain.value, 0.0001), now);
      l.g.gain.linearRampToValueAtTime(0.0001, now + (fade ? 0.6 : 0.4));
      l.oscs.forEach(function (o) { try { o.stop(now + 0.7); } catch (e) {} });
    } catch (e) {}
  });
  live = [];
}

AU.play = function () {
  if (!AU.supported) return false;
  try {
    if (!ctx) build();
    var p = ctx.resume && ctx.resume();
    if (p && p.catch) p.catch(function () {});
    startGen(); AU.playing = true; changed(); return true;
  } catch (e) { AU.playing = false; changed(); return false; }
};
AU.pause = function () { stopGen(true); AU.playing = false; changed(); };
AU.toggle = function () { return AU.playing ? (AU.pause(), true) : AU.play(); };
AU.setTrack = function (i) {
  AU.cfg.track = (i + TRACKS.length) % TRACKS.length;
  if (AU.playing) startGen();
  changed();
};
AU.next = function () { AU.setTrack(AU.cfg.track + 1); };
AU.prev = function () { AU.setTrack(AU.cfg.track - 1); };
AU.setVol = function (v) { AU.cfg.vol = clamp(+v || 0, 0, 100); applyVol(); };
AU.setMute = function (m) { AU.cfg.muted = !!m; applyVol(); changed(); };
AU.setEq = function (i, db) {
  AU.cfg.eq[i] = clamp(+db || 0, -9, 9);
  if (bands[i]) bands[i].gain.setTargetAtTime(AU.cfg.eq[i], ctx.currentTime, 0.03);
};
AU.presets = {
  flat: [0, 0, 0], warm: [4, 1, -3], clear: [-2, 2, 4], soft: [2, -1, -5]
};
AU.preset = function (k) {
  var p = AU.presets[k] || [0, 0, 0];
  for (var i = 0; i < 3; i++) AU.setEq(i, p[i]);
  changed();
};
AU.beep = function () {
  if (!AU.supported) return;
  try {
    if (!ctx) build();
    var o = ctx.createOscillator(), g = ctx.createGain(), n = ctx.currentTime;
    o.frequency.value = 660; g.gain.setValueAtTime(0.0001, n);
    g.gain.linearRampToValueAtTime(0.25, n + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, n + 0.4);
    o.connect(g); g.connect(bus); o.start(n); o.stop(n + 0.45);
  } catch (e) {}
};
})();
