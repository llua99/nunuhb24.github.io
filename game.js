/* =========================================================================
   Nunu - ein kleines 2D-Adventure
   -------------------------------------------------------------------------
   Alles, was man ohne Programmierkenntnisse anpassen moechte, steht im
   CFG-Block ganz oben: Lautstaerken, Laufgeschwindigkeit, Positionen und
   der Abspanntext.
   ========================================================================= */

const CFG = {
  // ---- Lautstaerken (0 = stumm, 1 = voll) ----------------------------------
  // Der Grundpegel der Musik steckt schon in den mp3-Dateien, damit auch dann
  // eine vernuenftige Mischung rauskommt, wenn das iPad die Feinregelung nicht
  // zulaesst. Diese Werte regeln nur noch obendrauf.
  vol: {
    musik: 1.0, // normale Hintergrundmusik
    musikGeduckt: 0.34, // Musik, waehrend jemand spricht
    stimme: 1.0, // Flaschengeist
    gedicht: 1.0, // Gedicht
    gedichtMusik: 1.0, // Musik unter dem Gedicht
    quizMusik: 1.0, // Musik waehrend des Timers
    sfx: 1.0, // Jingles, Bestaetigungston
  },

  // ---- Tempo ---------------------------------------------------------------
  laufTempo: 360, // Welt-Pixel pro Sekunde
  gedichtTempo: 95, // langsamer Spaziergang waehrend des Gedichts
  gedichtGehSek: 30, // wie lange sie waehrend des Gedichts geht
  animFps: 12,
  drehFps: 46, // Drehung ist bewusst schneller

  // ---- Groessen ------------------------------------------------------------
  nunuScale: 4.5,
  introScale: 8.2, // im weissen Intro ist sie gross, dann zoomt es raus
  geistScale: 3.5,
  geistSchwebe: -230, // wie weit der Flaschengeist ueber dem Boden schwebt
  eselScale: 4.5, // gleicher Pixelmassstab wie Nunu

  // ---- Orte in der Welt (Welt ist 9239 px breit) ---------------------------
  x: {
    wand: 300, // unsichtbare Wand links
    start: 1050,
    geist: 4250, // hier erscheint der Flaschengeist
    esel: 8200, // hier schlaeft der Esel
    mond: 12300, // hier geht der Mond auf
    ende: 12900,
  },

  // Figuren ein paar Sprite-Pixel tiefer setzen, damit sie satt auf dem
  // Regenbogen stehen statt darueber zu schweben
  bodenVersatz: 4, // gilt fuer alle Figuren
  nunuTiefer: 10, // Nunu zusaetzlich, in Bildschirmpixeln

  timer: { normal: 15, letzte: 10 },

  // ---- Abspann (Star-Wars-Text) - hier deinen eigenen Text eintragen -------
  abspannTitel: "Alles Gute",
  abspann: [
    "Ich hoffe, du hast den schönsten Tag, den ein Mensch nur haben kann <3.",
    "Du bist toll, schön, sexy, freundlich, herzlich, schlau, intelligent, emotional intelligent und du bist einfach einer der coolsten Personen, die ich auf diesem Planeten kennenlernen durfte.",
    "Ich muss gestehen, dass das Designen einer normalen Website vielleicht nicht so aufwendig war wie das hier. Ich hoffe, du bist nicht entgeistert (Schluck)",
    "Mir fällt auch erst jetzt auf, dass ich komplett auf Sound-Design vergessen habe (Schluck).",
    "Du bist supertoll und ich wünsche dir einen schönen Geburtstag.",
    "Liebe Grüße, dein Esel",
  ],

  abspannSek: 90,
};

const WORLD_W = 13000,
  WORLD_H = 1640;

/* Der Regenbogenboden wird im selben Pixelmassstab wie die Figuren gezeichnet.
   Er besteht aus waagerechten Streifen und wird deshalb als Rechteckflaeche
   gemalt statt gekachelt - so entstehen keine Fugen zwischen den Kacheln. */
const FLOOR_STREIFEN = [
  ["#000000", 1],
  ["#cd4343", 4],
  ["#d69254", 4],
  ["#d5cf76", 4],
  ["#7ad576", 4],
  ["#76cfd5", 4],
  ["#7694d5", 4],
  ["#b976d5", 4],
];
const FLOOR_PX = FLOOR_STREIFEN.reduce((a, b) => a + b[1], 0); // 29 Sprite-Pixel
const FLOOR_H = Math.round(FLOOR_PX * CFG.nunuScale); // Hoehe in der Welt
const GROUND = WORLD_H - FLOOR_H; // hier stehen die Figuren

/* ---- Insider-Bilder ------------------------------------------------------
   Sie stehen auf dem Regenbogenboden und sind gleichmaessig ueber die Karte
   verteilt - ausgespart bleiben der Quizabschnitt (3600-6200) und der
   Mondabschnitt ganz rechts.
   x = Position, s = Groesse, amp = Schwebe-Ausschlag, p = Parallaxfaktor    */
const OTHERS = [
  { file: "mogelbaum2.png", x: 1750, p: 1.0, s: 1.3, amp: 14 },
  { file: "luci2.png", x: 3200, p: 1.0, s: 0.85, amp: 18 },
  { file: "50cent2.png", x: 6900, p: 1.0, s: 1.1, amp: 12 },
  { file: "nunu1.png", x: 8800, p: 1.0, s: 1.0, amp: 16 },
];
const MELODY_POS = { x: 10100, p: 1.0, s: 2.2, amp: 20 };

/* ---- Quizfragen: welche Sprachdatei gehoert wozu ------------------------- */
/* ---- Quizfragen ----------------------------------------------------------
   Fragetext und Antworten stehen hier - einfach ändern, die Balken passen
   sich der Textlänge an. `richtig: true` markiert die Lösung,
   `stimme` ist die Sprachdatei, mit der der Geist die Antwort vorliest.    */
const FRAGEN = [
  {
    n: 1,
    text: "Was bist du?",
    antworten: {
      a: { text: "eine Babane", stimme: "Frage1a" },
      b: { text: "ein Hase", stimme: "Frage1b", richtig: true },
      c: { text: "eine Katze", stimme: "Frage1c" },
      d: { text: "albanischer Adler", stimme: "Frage1d" },
    },
    anmod: ["Frage1Anmoderation1"],
    frage: "Frage1Fragenstellung",
    win: "Frage1Richtig",
  },
  {
    n: 2,
    text: "Wer ist der bessere Lochi?",
    antworten: {
      a: { text: "Heiko", stimme: "Frage2a", richtig: true },
      b: { text: "Roman", stimme: "Frage2b", richtig: true },
    },
    anmod: ["Frage2Anmoderation"],
    frage: "Frage2Fragenstellung",
    win: "Frage2Richtig",
  },
  {
    n: 3,
    text: 'Wie hieß die gute Schwestester in "Bruder vor Luder"?',
    antworten: {
      a: { text: "Bella", stimme: "Frage3a", richtig: true },
      b: { text: "Rolli", stimme: "Frage3b" },
      c: { text: "Lisa", stimme: "Frage3c" },
      d: { text: "Elisa", stimme: "Frage3d" },
    },
    anmod: ["Frage3Anmoderation"],
    frage: "Frage3Fragestellung",
    win: null,
  },
  {
    n: 4,
    text: "Wer ist die schönste und tollste Frau?",
    antworten: {
      a: { text: "Nguyet-anh", stimme: "Frage4a", richtig: true },
      b: { text: "Big Mom", stimme: "Frage4b" },
      c: { text: "MacGonagall", stimme: "Frage4c" },
      d: { text: "Misty von Pokemon", stimme: "Frage4d" },
    },
    anmod: ["Frage4Anmoderation", "Frage4Anmoderation2"],
    frage: "Frage4Fragestellung",
    win: null,
  },
  {
    n: 5,
    text: "Was ist 40*50-7/30 * 25 + 50k + 7*7*7*7?",
    antworten: {
      a: { text: "54569" },
      b: { text: "54219" },
      c: { text: "52169" },
      d: { text: "54394" },
    },
    anmod: ["Frage5Anmoderation", "Frage5Anmoderation2"],
    frage: "Frage5Fragenstellung",
    win: null,
    keineAuswahl: true,
  },
];

/* ===================== Grundgeruest ====================================== */

const cv = document.getElementById("c");
const ctx = cv.getContext("2d", { alpha: false });
const $ = (id) => document.getElementById(id);

let SC = 1,
  VIEWW = 0,
  DPR = 1;
const cam = { x: 0, y: 0 };
let now = 0,
  dt = 0;

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth,
    h = window.innerHeight;
  cv.style.width = w + "px";
  cv.style.height = h + "px";
  cv.width = Math.round(w * DPR);
  cv.height = Math.round(h * DPR);
  SC = cv.height / WORLD_H;
  VIEWW = cv.width / SC;
  ctx.imageSmoothingEnabled = false;
}
window.addEventListener("resize", resize);
window.addEventListener("orientationchange", () => setTimeout(resize, 250));

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* ===================== Laden ============================================= */

const IMG = {};
let loadDone = 0,
  loadTotal = 0;

function img(name, url) {
  loadTotal++;
  return new Promise((res) => {
    const i = new Image();
    i.onload = i.onerror = () => {
      IMG[name] = i;
      loadDone++;
      progress();
      res(i);
    };
    i.src = url;
  });
}

function progress() {
  const p = loadTotal ? loadDone / loadTotal : 0;
  $("bar").firstElementChild.style.width = (p * 100).toFixed(0) + "%";
}

async function loadAll() {
  const jobs = [];
  jobs.push(img("floor", "assets/img/floor.png"));
  jobs.push(img("moon", "assets/img/moon.png"));
  for (const k in SHEETS) jobs.push(img(k, `assets/img/sheets/${k}.png`));
  for (const o of OTHERS) jobs.push(img(o.file, `assets/img/other/${o.file}`));
  jobs.push(img("melody.png", "assets/img/other/melody.png"));
  jobs.push(audioPreload());
  await Promise.all(jobs);
}

/* ===================== Ton =============================================== */

let actx = null;
const SND = {};
let voiceCount = 0,
  muted = false;

const AUDIO_LIST = {
  musik: ["soundtrack", "theme", "quizmusik", "gedichtmusik"],
  stimme: Object.keys(DUR)
    .filter((k) => /^(Frage|Ausnahme|Falsche|Outro|einleitung)/.test(k))
    .concat(["gedicht"]),
  sfx: ["confirm", "richtig", "falsch", "einloggen"],
};

function audioPreload() {
  loadTotal++;
  const all = [
    ...new Set([].concat(AUDIO_LIST.musik, AUDIO_LIST.stimme, AUDIO_LIST.sfx)),
  ];
  let left = all.length;
  return new Promise((res) => {
    const tick = () => {
      if (--left <= 0) {
        loadDone++;
        progress();
        res();
      }
    };
    for (const name of all) {
      const el = new Audio();
      el.preload = "auto";
      el.playsInline = true;
      el.setAttribute("playsinline", "");
      el.src = `assets/audio/${name}.mp3`;
      SND[name] = { el, node: null, gain: null, cat: cat(name) };
      let fired = false;
      const ok = () => {
        if (!fired) {
          fired = true;
          tick();
        }
      };
      el.addEventListener("canplaythrough", ok, { once: true });
      el.addEventListener("loadeddata", ok, { once: true });
      el.addEventListener("error", ok, { once: true });
      setTimeout(ok, 25000);
      el.load();
    }
  });
}

function cat(name) {
  if (AUDIO_LIST.musik.includes(name)) return "musik";
  if (AUDIO_LIST.sfx.includes(name)) return "sfx";
  return "stimme";
}

/**
 * Muss aus einer echten Fingerbewegung heraus aufgerufen werden.
 * Safari auf dem iPad gibt Ton erst frei, wenn jede Audiodatei einmal
 * innerhalb einer Beruehrung gestartet wurde. Klappt die Web-Audio-Kette
 * nicht, laufen die Dateien einfach direkt - der Grundpegel steckt ja
 * schon in den mp3s.
 */
/* Wird die Seite per Doppelklick direkt aus dem Ordner geoeffnet (file://),
   liefert Chrome ueber Web Audio nur Stille. Dann laufen die Dateien direkt -
   der Grundpegel steckt ja in den mp3s. */
const KEIN_WEBAUDIO = location.protocol === "file:";

function audioInit() {
  if (actx !== null) return;

  // 1) Jede Datei einmal antippen, damit iOS sie freigibt.
  //    Wichtig: das Anhalten danach darf nichts stoppen, was inzwischen
  //    absichtlich gestartet wurde.
  for (const name in SND) {
    const s = SND[name];
    const el = s.el;
    el.muted = true;
    const fertig = () => {
      el.muted = false;
      if (!s.aktiv && !s.spieltGerade) {
        try {
          el.pause();
          el.currentTime = 0;
        } catch (e) {}
      }
    };
    try {
      const pr = el.play();
      if (pr && pr.then) pr.then(fertig).catch(fertig);
      else fertig();
    } catch (e) {
      fertig();
    }
  }

  // 2) Web Audio aufbauen - wenn es scheitert, ohne weitermachen
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC || KEIN_WEBAUDIO) throw new Error("kein Web Audio");
    actx = new AC();
    const stumm = actx.createBuffer(1, 1, 22050);
    const q = actx.createBufferSource();
    q.buffer = stumm;
    q.connect(actx.destination);
    q.start(0);
    for (const name in SND) {
      const s = SND[name];
      s.node = actx.createMediaElementSource(s.el);
      s.gain = actx.createGain();
      s.gain.gain.value = 0;
      s.node.connect(s.gain).connect(actx.destination);
    }
  } catch (e) {
    actx = false; // false = kein Web Audio, aber schon versucht
    for (const name in SND) {
      SND[name].gain = null;
      SND[name].el.volume = 1;
    }
  }
}

const ctxLaeuft = () => actx && actx.state !== "closed";

async function ctxWecken() {
  if (!ctxLaeuft()) return;
  if (actx.state === "suspended") {
    try {
      await actx.resume();
    } catch (e) {}
  }
}

function gainOf(name) {
  const s = SND[name];
  if (s.cat === "musik")
    return name === "quizmusik"
      ? CFG.vol.quizMusik
      : name === "gedichtmusik"
        ? CFG.vol.gedichtMusik
        : CFG.vol.musik;
  if (s.cat === "sfx") return CFG.vol.sfx;
  return name === "gedicht" ? CFG.vol.gedicht : CFG.vol.stimme;
}

function ramp(name, to, sek = 0.4) {
  const s = SND[name];
  if (!s) return;
  const ziel = muted ? 0 : Math.max(to, 0.0001);
  if (!s.gain || !ctxLaeuft()) {
    try {
      s.el.volume = Math.min(1, ziel);
    } catch (e) {}
    return;
  }
  const t = actx.currentTime;
  s.gain.gain.cancelScheduledValues(t);
  s.gain.gain.setValueAtTime(Math.max(s.gain.gain.value, 0.0001), t);
  s.gain.gain.linearRampToValueAtTime(ziel, t + sek);
}

function setzeGain(name, wert) {
  const s = SND[name];
  const v = muted ? 0 : wert;
  if (s.gain && ctxLaeuft()) s.gain.gain.value = Math.max(v, 0.0001);
  else {
    try {
      s.el.volume = Math.min(1, Math.max(v, 0));
    } catch (e) {}
  }
}

/** Musik starten (loopt). Laeuft schon ein anderes Stueck, wird es
 *  ausgeblendet - so ueberlagern sich nie zwei Songs.
 *  vonVorne=false setzt dort fort, wo das Stueck zuletzt stand. */
function musik(name, fade = 1.2, vonVorne = true) {
  const s = SND[name];
  if (!s) return;
  for (const anderes of AUDIO_LIST.musik) {
    if (anderes !== name && SND[anderes] && SND[anderes].aktiv) {
      musikStop(anderes, Math.min(fade, 0.8));
    }
  }
  s.el.loop = true;
  s.el.muted = false;
  s.aktiv = true;
  if (vonVorne) {
    try {
      s.el.currentTime = 0;
    } catch (e) {}
  }
  s.el.play().catch(() => {});
  setzeGain(name, 0);
  ramp(name, gainOf(name) * (voiceCount ? duckFactor(name) : 1), fade);
}

function musikStop(name, fade = 1.0) {
  const s = SND[name];
  if (!s || !s.aktiv) return;
  s.aktiv = false;
  ramp(name, 0, fade);
  setTimeout(
    () => {
      try {
        s.el.pause();
      } catch (e) {}
    },
    fade * 1000 + 60,
  );
}

function duckFactor(name) {
  if (name === "gedichtmusik") return 1; // Gedichtmusik ist schon leise
  return CFG.vol.musikGeduckt / CFG.vol.musik;
}

function duck(on) {
  for (const name of AUDIO_LIST.musik) {
    const s = SND[name];
    if (s && s.aktiv)
      ramp(name, gainOf(name) * (on ? duckFactor(name) : 1), on ? 0.25 : 0.45);
  }
}

/** Sound einmalig abspielen; Promise loest, wenn er zu Ende ist */
function spiele(name, opt = {}) {
  const s = SND[name];
  if (!s) return Promise.resolve();
  const istStimme = s.cat === "stimme";
  if (istStimme) {
    voiceCount++;
    if (voiceCount === 1) duck(true);
  }
  s.el.loop = false;
  s.el.muted = false;
  s.spieltGerade = true;
  try {
    s.el.currentTime = 0;
  } catch (e) {}
  setzeGain(name, gainOf(name) * (opt.vol || 1));
  s.el.play().catch(() => {});
  return new Promise((res) => {
    const fertig = () => {
      s.spieltGerade = false;
      s.el.removeEventListener("ended", fertig);
      if (istStimme) {
        voiceCount = Math.max(0, voiceCount - 1);
        if (voiceCount === 0)
          setTimeout(() => {
            if (!voiceCount) duck(false);
          }, 220);
      }
      res();
    };
    s.el.addEventListener("ended", fertig);
    setTimeout(fertig, ((DUR[name] || 3) + 1.2) * 1000);
  });
}

function spieleOhneWarten(name) {
  spiele(name);
}

/* ===================== Animationssystem ================================== */

/* Segment: { k: SheetName, from, to, rev } - from/to optional */
function segs(spec) {
  const arr = typeof spec === "string" ? [{ k: spec }] : spec;
  return arr.map((s) => {
    const k = s.k || s;
    const m = SHEETS[k];
    const from = s.from ?? 0,
      to = s.to ?? m.n - 1;
    return { k, from, to, rev: !!s.rev, n: to - from + 1 };
  });
}

function setAnim(a, spec, o = {}) {
  const sg = segs(spec);
  const total = sg.reduce((x, s) => x + s.n, 0);
  const anim = {
    sg,
    total,
    fps: o.fps || CFG.animFps,
    loop: !!o.loop,
    t: 0,
    idx: 0,
    done: false,
  };
  a.anim = anim;
  if (o.loop) return Promise.resolve();
  return new Promise((res) => {
    anim.res = res;
  });
}

function setStill(a, key, frame) {
  a.anim = {
    sg: segs([{ k: key, from: frame, to: frame }]),
    total: 1,
    fps: 1,
    loop: true,
    t: 0,
    idx: 0,
    done: true,
  };
}

function animUpdate(a) {
  const an = a.anim;
  if (!an || (an.done && !an.loop)) return;
  an.t += dt;
  let i = Math.floor(an.t * an.fps);
  if (i >= an.total) {
    if (an.loop) {
      i %= an.total;
    } else {
      i = an.total - 1;
      if (!an.done) {
        an.done = true;
        if (an.res) an.res();
      }
    }
  }
  an.idx = i;
}

function curFrame(an) {
  let i = Math.min(an.idx, an.total - 1);
  for (const s of an.sg) {
    if (i < s.n) return { key: s.k, f: s.rev ? s.to - i : s.from + i };
    i -= s.n;
  }
  const l = an.sg[an.sg.length - 1];
  return { key: l.k, f: l.to };
}

const DIRI = {
  south: 0,
  "south-east": 1,
  east: 2,
  "north-east": 3,
  north: 4,
  "north-west": 5,
  west: 6,
  "south-west": 7,
};

/* Drehketten */
const rev = (s) =>
  segs(s)
    .slice()
    .reverse()
    .map((x) => ({ k: x.k, from: x.from, to: x.to, rev: !x.rev }));
const CH_E_S = [{ k: "nunu_spin_e_se" }, { k: "nunu_spin_se_s" }];
const CH_S_W = [{ k: "nunu_spin_s_sw" }, { k: "nunu_spin_sw_w" }];
const CH_E_W = CH_E_S.concat(CH_S_W);
function drehung(von, nach) {
  const key = von + nach;
  if (key === "es") return CH_E_S;
  if (key === "se") return rev(CH_E_S);
  if (key === "sw") return CH_S_W;
  if (key === "ws") return rev(CH_S_W);
  if (key === "ew") return CH_E_W;
  if (key === "we") return rev(CH_E_W);
  return null;
}

/* ===================== Figuren =========================================== */

function actor(scale) {
  return {
    x: 0,
    y: 0,
    scale,
    alpha: 1,
    sicht: false,
    face: "e",
    anim: null,
    bob: false,
  };
}

const nunu = actor(CFG.nunuScale);
const geist = actor(CFG.geistScale);
const esel = actor(CFG.eselScale);

function zeichneActor(a) {
  if (!a.sicht || a.alpha <= 0.01) return;
  const { key, f } = curFrame(a.anim);
  const m = SHEETS[key],
    sh = IMG[key];
  if (!sh) return;
  const s = a.scale;
  let dx = a.x - m.cx * s;
  let dy = GROUND - m.gy * s + (a.y || 0) + CFG.bodenVersatz * s;
  if (a === nunu) dy += CFG.nunuTiefer;
  if (a.bob) dy += (Math.floor(now / 900) % 2 ? -1 : 0) * s;
  if (a.schwebt) dy += Math.sin((now / 1000) * 0.9) * 9;
  ctx.save();
  if (a.alpha < 1) ctx.globalAlpha = a.alpha;
  ctx.drawImage(sh, f * m.w, 0, m.w, m.h, dx, dy, m.w * s, m.h * s);
  ctx.restore();
}

const nunuIdle = () =>
  ["nunu_idle1", "nunu_idle2", "nunu_idle3"][(Math.random() * 3) | 0];
let letzterWalk = "";
function nunuWalk(dir) {
  const p = dir === "e" ? "nunu_walk_e" : "nunu_walk_w";
  let k;
  do {
    k = p + (1 + ((Math.random() * 4) | 0));
  } while (k === letzterWalk);
  letzterWalk = k;
  return k;
}

/* ===================== Sterne ============================================ */

/* Die Sterne nehmen die Farben des Regenbogens auf, damit Himmel und Boden
   zusammengehoeren - aufgehellt, damit es nicht bunt flimmert. */
const STERNFARBEN = [
  "#ffe9e9",
  "#ffd9c2",
  "#fff2c8",
  "#d6f3cf",
  "#cdf0f4",
  "#cfdcf7",
  "#e8d2f7",
  "#ffffff",
];

const STERNE = [];
(function () {
  let seed = 1337;
  const rnd = () =>
    (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  for (let i = 0; i < 1700; i++) {
    const y = -1560 + rnd() * 3000;
    STERNE.push({
      x: -200 + rnd() * (WORLD_W + 400),
      y,
      lay: rnd() < 0.45 ? 0 : 1,
      ph: rnd() * 6.3,
      sp: 0.5 + rnd() * 1.6,
      sz: rnd() < 0.16 ? 3 : rnd() < 0.5 ? 2 : 1,
      // je naeher am Boden, desto eher greift der Stern eine Regenbogenfarbe auf
      farbe: STERNFARBEN[rnd() < 0.55 - y / 4000 ? (rnd() * 7) | 0 : 7],
    });
  }
})();

/* Sternschnuppen: alle paar Sekunden eine, quer durch den oberen Himmel */
const SCHNUPPEN = [];
let naechsteSchnuppe = 4;
function schnuppenUpdate() {
  naechsteSchnuppe -= dt;
  if (naechsteSchnuppe <= 0) {
    naechsteSchnuppe = 7 + Math.random() * 11;
    SCHNUPPEN.push({
      x: cam.x + Math.random() * VIEWW,
      y: -300 + Math.random() * 700,
      vx: -420 - Math.random() * 260,
      vy: 190 + Math.random() * 120,
      t: 0,
      dauer: 1.1,
    });
  }
  for (let i = SCHNUPPEN.length - 1; i >= 0; i--) {
    const s = SCHNUPPEN[i];
    s.t += dt;
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    if (s.t > s.dauer) SCHNUPPEN.splice(i, 1);
  }
}

/* ===================== Zeichnen ========================================== */

let weissBlende = 1; // 1 = alles weiss (Spielstart)
let mond = null; // { y: Bildschirmanteil 0..1, a: Deckkraft }
let melodyT = 0;
let othersAlpha = 1; // Insiderbilder treten im Finale zurueck

/** Nachthimmel: senkrechter Verlauf, der ueber den Weg langsam dunkler und
 *  kuehler wird. Er ist jetzt der ganze Hintergrund, also darf er atmen. */
function zeichneHimmel() {
  const t = Math.min(1, Math.max(0, cam.x / (WORLD_W - 1200)));
  const oben = [14 - 8 * t, 12 - 6 * t, 46 - 22 * t];
  const unten = [34 - 20 * t, 26 - 14 * t, 92 - 46 * t];
  const g = ctx.createLinearGradient(0, 0, 0, cv.height);
  g.addColorStop(0, `rgb(${oben.map(Math.round).join(",")})`);
  g.addColorStop(
    0.62,
    `rgb(${oben.map((v, i) => Math.round((v + unten[i]) / 2)).join(",")})`,
  );
  g.addColorStop(1, `rgb(${unten.map(Math.round).join(",")})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, cv.width, cv.height);
}

function weltTransform(p = 1) {
  ctx.setTransform(SC, 0, 0, SC, -cam.x * p * SC, -cam.y * p * SC);
}

function render() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  zeichneHimmel();

  // Sterne (zwei Ebenen, leichter Parallax)
  for (let lay = 0; lay < 2; lay++) {
    const p = lay === 0 ? 0.72 : 0.88;
    weltTransform(p);
    for (const s of STERNE) {
      if (s.lay !== lay) continue;
      const sx = s.x - cam.x * p;
      if (sx < -40 || sx > VIEWW + 40) continue;
      const tw = Math.sin((now / 1000) * s.sp + s.ph);
      const a = tw > 0.55 ? 1 : tw > -0.2 ? 0.7 : 0.34;
      ctx.globalAlpha = a * (lay ? 1 : 0.78);
      ctx.fillStyle = s.farbe;
      ctx.fillRect(Math.round(s.x), Math.round(s.y), s.sz, s.sz);
    }
    ctx.globalAlpha = 1;
  }

  // Sternschnuppen
  if (SCHNUPPEN.length) {
    weltTransform(0.88);
    ctx.lineCap = "round";
    for (const q of SCHNUPPEN) {
      const f = 1 - q.t / q.dauer;
      ctx.globalAlpha = Math.min(1, f * 1.8) * 0.9;
      ctx.strokeStyle = "#fff4dd";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(q.x, q.y);
      ctx.lineTo(q.x - q.vx * 0.16, q.y - q.vy * 0.16);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // Insider-Bilder im Himmel
  if (othersAlpha > 0.01) {
    ctx.globalAlpha = othersAlpha;
    for (const o of OTHERS) {
      const im = IMG[o.file];
      if (!im) continue;
      weltTransform(o.p);
      const h = im.height * o.s,
        w = im.width * o.s;
      // Unterkante sitzt auf der Oberkante des Regenbogenbodens
      const yy = GROUND - h + Math.sin((now / 1000) * 0.5 + o.x) * o.amp;
      ctx.drawImage(im, o.x - w / 2, yy, w, h);
    }
    if (IMG["melody.png"]) {
      weltTransform(MELODY_POS.p);
      const fi = Math.floor(melodyT * 14) % MELODY.n;
      const w = MELODY.w * MELODY_POS.s,
        h = MELODY.h * MELODY_POS.s;
      const yy = GROUND - h + Math.sin((now / 1000) * 0.45) * MELODY_POS.amp;
      ctx.drawImage(
        IMG["melody.png"],
        fi * MELODY.w,
        0,
        MELODY.w,
        MELODY.h,
        MELODY_POS.x - w / 2,
        yy,
        w,
        h,
      );
    }
    ctx.globalAlpha = 1;
  }

  // Mond haengt fast fest am Bildschirm - er ist weit weg
  if (mond !== null) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const ms = (cv.height * 0.34) / IMG.moon.height;
    const mw = IMG.moon.width * ms,
      mh = IMG.moon.height * ms;
    ctx.globalAlpha = mond.a;
    ctx.drawImage(
      IMG.moon,
      (cv.width - mw) / 2,
      mond.y * cv.height - cam.y * SC * 0.25,
      mw,
      mh,
    );
    ctx.globalAlpha = 1;
  }

  weltTransform(1);
  // Der Regenbogen faerbt den Himmel ueber sich leicht ein - so haengen
  // Boden und Sternenhimmel farblich zusammen.
  {
    const x0 = cam.x - 4,
      br = VIEWW + 8;
    const hoehe = FLOOR_H * 3.4;
    const g = ctx.createLinearGradient(0, GROUND - hoehe, 0, GROUND);
    g.addColorStop(0, "rgba(150,120,220,0)");
    g.addColorStop(0.55, "rgba(140,110,210,0.07)");
    g.addColorStop(1, "rgba(190,150,220,0.20)");
    ctx.fillStyle = g;
    ctx.fillRect(x0, GROUND - hoehe, br, hoehe);
  }

  // Regenbogenboden - durchgehende Streifen, keine Kachelfugen
  {
    const x0 = cam.x - 4,
      br = VIEWW + 8;
    let y = GROUND;
    for (let i = 0; i < FLOOR_STREIFEN.length; i++) {
      const [farbe, px] = FLOOR_STREIFEN[i];
      const h =
        i === FLOOR_STREIFEN.length - 1
          ? WORLD_H - y
          : Math.round(px * CFG.nunuScale);
      ctx.fillStyle = farbe;
      ctx.fillRect(x0, y, br, h + 0.5);
      y += h;
    }
  }

  // Weisse Blende liegt HINTER den Figuren: am Anfang ist alles weiss,
  // Nunu ist aber schon zu sehen.
  if (weissBlende > 0.001) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = weissBlende;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.globalAlpha = 1;
    weltTransform(1);
  }

  // Figuren (hinten nach vorne)
  const alle = [esel, geist, nunu].filter((a) => a.sicht);
  for (const a of alle) zeichneActor(a);

  // Overlays im Bildschirmraum
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (quizUI.aktiv) zeichneQuiz();
  if (hinweis.text) zeichneHinweis();
  if (schwarz > 0.001) {
    ctx.globalAlpha = schwarz;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.globalAlpha = 1;
  }
}

let schwarz = 0;

/* ---- Hinweistext (Pixelschrift) ---- */
const hinweis = { text: "", blink: false };
let hinweisPfeil = false;

function zeichneHinweis() {
  const px = Math.max(11, Math.round(cv.height * 0.026));
  ctx.font = `${px}px 'Press Start 2P', monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const a = hinweis.blink ? 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(now / 260)) : 1;
  const y = cv.height * 0.24;
  ctx.globalAlpha = a;
  ctx.lineWidth = Math.max(3, px * 0.32);
  ctx.strokeStyle = "rgba(20,16,40,.55)";
  ctx.strokeText(hinweis.text, cv.width / 2, y);
  ctx.fillStyle = "#3b2a4d";
  ctx.fillText(hinweis.text, cv.width / 2, y);
  if (hinweisPfeil) {
    const ax = (nunu.x - cam.x) * SC,
      ay = y + px * 1.6 + Math.sin(now / 300) * px * 0.35;
    ctx.beginPath();
    ctx.moveTo(ax - px * 0.55, ay);
    ctx.lineTo(ax + px * 0.55, ay);
    ctx.lineTo(ax, ay + px * 0.8);
    ctx.closePath();
    ctx.fillStyle = "#3b2a4d";
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/* ===================== Quiz-Oberflaeche ==================================
   Die Balken werden gezeichnet, nicht aus Bildern zusammengesetzt. Dadurch
   schweben sie, passen sich langen Texten an und koennen ihre Farbe wechseln.
   ========================================================================= */

const QFARBEN = {
  normal: {
    o: "#060830",
    m: "#2f3dd0",
    u: "#080a38",
    kante: "#a8b5e6",
    text: "#fea322",
    schein: "rgba(90,120,255,.55)",
  },
  richtig: {
    o: "#062a10",
    m: "#2bbf46",
    u: "#07240f",
    kante: "#b6ffc4",
    text: "#eaffd8",
    schein: "rgba(90,255,130,.65)",
  },
  falsch: {
    o: "#2d0810",
    m: "#c02338",
    u: "#2a070e",
    kante: "#ffb3bd",
    text: "#ffe4e4",
    schein: "rgba(255,90,110,.6)",
  },
};

const quizUI = {
  aktiv: false,
  q: 1,
  zeigeFrage: false,
  sichtbar: {},
  status: {},
  auswahl: null,
  blink: false,
  timer: null,
  timerMax: 15,
  rects: {},
  klickbar: false,
  grau: false,
  zeit: {},
};

const aktuelleFrage = () => FRAGEN[quizUI.q - 1];

/** Wann wurde ein Element eingeblendet - fuer die kleine Einflug-Animation */
function einflug(key) {
  const t = quizUI.zeit[key];
  if (t === undefined) return 1;
  return Math.min(1, (now - t) / 320);
}

function quizGeometrie() {
  const tw = Math.round(cv.height * 0.125); // Timerspalte rechts
  const gapT = cv.width * 0.018;
  const ox = cv.width * 0.028;
  const W = cv.width * 0.972 - tw - gapT - ox;
  const oy = cv.height * 0.098;
  const hF = cv.height * 0.108; // Fragebalken
  const hA = cv.height * 0.082; // Antwortbalken
  const gapY = cv.height * 0.034;
  const gapX = cv.width * 0.024;
  const rowGap = cv.height * 0.019;
  const colW = (W - gapX) / 2;
  const zeile1 = oy + hF + gapY;
  const zeile2 = zeile1 + hA + rowGap;
  return {
    ox,
    oy,
    W,
    hF,
    hA,
    colW,
    gapX,
    zeile1,
    zeile2,
    tw,
    tx: ox + W + gapT,
  };
}

/** Positionen der vier Antwortbalken (bei zwei Antworten mittig) */
function antwortRects() {
  const g = quizGeometrie();
  const f = aktuelleFrage();
  const zwei = !f.antworten.c;
  const y1 = zwei ? (g.zeile1 + g.zeile2) / 2 : g.zeile1;
  const rechts = g.ox + g.colW + g.gapX;
  return {
    a: { x: g.ox, y: y1, w: g.colW, h: g.hA },
    b: { x: rechts, y: y1, w: g.colW, h: g.hA },
    c: { x: g.ox, y: g.zeile2, w: g.colW, h: g.hA },
    d: { x: rechts, y: g.zeile2, w: g.colW, h: g.hA },
  };
}

/** Schriftgroesse suchen, bei der der Text in die Breite passt */
function passSchrift(text, maxW, startPx, minPx) {
  let px = Math.round(startPx);
  for (; px > minPx; px--) {
    ctx.font = `${px}px 'Press Start 2P', monospace`;
    if (ctx.measureText(text).width <= maxW) break;
  }
  ctx.font = `${px}px 'Press Start 2P', monospace`;
  return px;
}

/** langen Text auf zwei Zeilen aufteilen */
function zweiZeilen(text) {
  const w = text.split(" ");
  if (w.length < 2) return [text];
  let best = 1,
    diff = 1e9;
  for (let i = 1; i < w.length; i++) {
    const d = Math.abs(
      w.slice(0, i).join(" ").length - w.slice(i).join(" ").length,
    );
    if (d < diff) {
      diff = d;
      best = i;
    }
  }
  return [w.slice(0, best).join(" "), w.slice(best).join(" ")];
}

function chevron(x, y, w, h, n) {
  ctx.beginPath();
  ctx.moveTo(x + n, y);
  ctx.lineTo(x + w - n, y);
  ctx.lineTo(x + w, y + h / 2);
  ctx.lineTo(x + w - n, y + h);
  ctx.lineTo(x + n, y + h);
  ctx.lineTo(x, y + h / 2);
  ctx.closePath();
}

/**
 * Ein schwebender Balken.
 * o = { text, letter, zustand, alpha, phase, schiene }
 */
function zeichneBalken(x, y, w, h, o) {
  const c = QFARBEN[o.zustand || "normal"];
  const n = h * 0.32;
  const schwebe = Math.sin((now / 1000) * 0.85 + (o.phase || 0)) * h * 0.045;
  y += schwebe;

  ctx.save();
  ctx.globalAlpha = o.alpha === undefined ? 1 : o.alpha;

  // dezente Schienen nach aussen, wie bei einer Quizshow
  if (o.schiene) {
    ctx.strokeStyle = c.kante;
    ctx.globalAlpha *= 0.55;
    ctx.lineWidth = Math.max(2, h * 0.045);
    ctx.beginPath();
    if (o.schiene === "links" || o.schiene === "beide") {
      ctx.moveTo(0, y + h / 2);
      ctx.lineTo(x - h * 0.06, y + h / 2);
    }
    if (o.schiene === "rechts" || o.schiene === "beide") {
      ctx.moveTo(x + w + h * 0.06, y + h / 2);
      ctx.lineTo(cv.width, y + h / 2);
    }
    ctx.stroke();
    ctx.globalAlpha = o.alpha === undefined ? 1 : o.alpha;
  }

  // Koerper mit weichem Schein
  ctx.shadowColor = c.schein;
  ctx.shadowBlur = h * 0.42;
  chevron(x, y, w, h, n);
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, c.o);
  g.addColorStop(0.42, c.m);
  g.addColorStop(0.56, c.u);
  g.addColorStop(1, c.o);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Glanzkante oben
  ctx.save();
  chevron(x, y, w, h, n);
  ctx.clip();
  ctx.fillStyle = "rgba(255,255,255,.16)";
  ctx.fillRect(x, y, w, Math.max(2, h * 0.09));
  ctx.restore();

  chevron(x, y, w, h, n);
  ctx.lineWidth = Math.max(2, h * 0.055);
  ctx.strokeStyle = c.kante;
  ctx.stroke();

  // Buchstabenplakette
  let textX = x + n + h * 0.28;
  const innenBreite = w - 2 * n - h * 0.56;
  if (o.letter) {
    const bh = h * 0.56,
      bw = bh * 1.15;
    const bx = x + n * 0.55,
      by = y + (h - bh) / 2;
    chevron(bx, by, bw, bh, bh * 0.3);
    ctx.fillStyle = "rgba(0,0,0,.32)";
    ctx.fill();
    ctx.lineWidth = Math.max(1.5, h * 0.03);
    ctx.strokeStyle = c.kante;
    ctx.stroke();
    const lp = Math.round(bh * 0.5);
    ctx.font = `${lp}px 'Press Start 2P', monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = c.text;
    ctx.fillText(o.letter, bx + bw / 2, by + bh / 2 + lp * 0.08);
    textX = bx + bw + h * 0.22;
  }

  // Text, notfalls auf zwei Zeilen
  const maxW = x + w - n - h * 0.25 - textX;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = c.text;
  const gross = h * (o.letter ? 0.4 : 0.42);
  let px = passSchrift(o.text, maxW, gross, 9);
  if (px < h * 0.24) {
    const zeilen = zweiZeilen(o.text);
    const p2 = Math.min(
      passSchrift(zeilen[0], maxW, gross * 0.85, 9),
      passSchrift(zeilen[1], maxW, gross * 0.85, 9),
    );
    ctx.font = `${p2}px 'Press Start 2P', monospace`;
    ctx.fillText(zeilen[0], textX, y + h / 2 - p2 * 0.75);
    ctx.fillText(zeilen[1], textX, y + h / 2 + p2 * 0.75);
  } else {
    ctx.fillText(o.text, textX, y + h / 2 + px * 0.06);
  }
  ctx.restore();
}

function zeichneQuiz() {
  const g = quizGeometrie();
  const f = aktuelleFrage();
  quizUI.rects = {};

  if (quizUI.zeigeFrage) {
    const p = einflug("frage");
    zeichneBalken(g.ox, g.oy, g.W, g.hF, {
      text: f.text,
      zustand: "normal",
      alpha: p,
      phase: 0,
      schiene: "beide",
    });
  }

  const rects = antwortRects();
  const phasen = { a: 1.1, b: 2.3, c: 3.4, d: 4.6 };
  for (const L of ["a", "b", "c", "d"]) {
    const ant = f.antworten[L];
    if (!ant || !quizUI.sichtbar[L]) continue;
    const r = rects[L];
    const p = einflug(L);
    let zustand = quizUI.status[L] || "normal";
    let alpha = p;
    if (quizUI.grau) alpha *= 0.5;
    if (quizUI.auswahl === L && quizUI.blink) {
      alpha *= 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(now / 110));
    }
    const dx = (1 - p) * (L === "b" || L === "d" ? 60 : -60);
    zeichneBalken(r.x + dx, r.y, r.w, r.h, {
      text: ant.text,
      letter: L.toUpperCase(),
      zustand,
      alpha,
      phase: phasen[L],
      schiene: L === "a" || L === "c" ? "links" : "rechts",
    });
    quizUI.rects[L] = r;
  }

  if (quizUI.timer !== null) zeichneTimer();
}

/** Timerplatte im selben Stil */
function zeichneTimer() {
  const rest = Math.max(0, Math.ceil(quizUI.timer));
  const g = quizGeometrie();
  const w = g.tw;
  const h = Math.round(w * 0.74);
  const x = Math.round(g.tx);
  const y = Math.round(g.oy + g.hF / 2 - h / 2);
  const n = h * 0.3;
  const knapp = rest <= 5;
  const schwebe = Math.sin((now / 1000) * 0.85) * h * 0.05;

  ctx.save();
  ctx.translate(0, schwebe);
  ctx.shadowColor = knapp ? "rgba(255,80,100,.6)" : "rgba(90,120,255,.5)";
  ctx.shadowBlur = h * 0.4;
  chevron(x, y, w, h, n);
  const gr = ctx.createLinearGradient(0, y, 0, y + h);
  gr.addColorStop(0, knapp ? "#2d0810" : "#060830");
  gr.addColorStop(0.42, knapp ? "#b81b31" : "#2f3dd0");
  gr.addColorStop(0.56, knapp ? "#8c1425" : "#1c2694");
  gr.addColorStop(1, knapp ? "#2d0810" : "#080a38");
  ctx.fillStyle = gr;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.save();
  chevron(x, y, w, h, n);
  ctx.clip();
  const p = quizUI.timer / quizUI.timerMax;
  ctx.fillStyle = "rgba(0,0,0,.45)";
  ctx.fillRect(x + w * p, y, w * (1 - p), h);
  ctx.fillStyle = "rgba(255,255,255,.16)";
  ctx.fillRect(x, y, w, Math.max(2, h * 0.085));
  ctx.restore();

  chevron(x, y, w, h, n);
  ctx.lineWidth = Math.max(2, h * 0.06);
  ctx.strokeStyle = knapp ? "#ffb3bd" : "#a8b5e6";
  ctx.stroke();

  const px = Math.round(h * 0.42);
  ctx.font = `${px}px 'Press Start 2P', monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(0,0,0,.5)";
  ctx.fillText(String(rest), x + w / 2, y + h / 2 + px * 0.16);
  ctx.fillStyle = knapp ? "#ffe0e4" : "#fea322";
  ctx.fillText(String(rest), x + w / 2, y + h / 2 + px * 0.06);
  ctx.restore();
}

/* ===================== Eingabe =========================================== */

const input = { dir: 0, tapX: null, tapY: null, tapNeu: false };
const zeiger = new Map();

function berechneDir() {
  let l = false,
    r = false;
  for (const p of zeiger.values()) {
    if (p.x < window.innerWidth / 2) l = true;
    else r = true;
  }
  if (tasten.left) l = true;
  if (tasten.right) r = true;
  input.dir = l && !r ? -1 : r && !l ? 1 : 0;
}

const tasten = { left: false, right: false };
addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") tasten.left = true;
  if (e.key === "ArrowRight") tasten.right = true;
  berechneDir();
});
addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") tasten.left = false;
  if (e.key === "ArrowRight") tasten.right = false;
  berechneDir();
});

function pointerDown(e) {
  for (const t of e.changedTouches || [e]) {
    zeiger.set(t.identifier ?? "m", { x: t.clientX, y: t.clientY });
    input.tapX = t.clientX;
    input.tapY = t.clientY;
    input.tapNeu = true;
  }
  berechneDir();
}
function pointerUp(e) {
  for (const t of e.changedTouches || [e]) zeiger.delete(t.identifier ?? "m");
  berechneDir();
}
cv.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    pointerDown(e);
  },
  { passive: false },
);
cv.addEventListener(
  "touchend",
  (e) => {
    e.preventDefault();
    pointerUp(e);
  },
  { passive: false },
);
cv.addEventListener("touchcancel", pointerUp);
cv.addEventListener("mousedown", pointerDown);
addEventListener("mouseup", pointerUp);

/** wartet auf einen Tap; treffer(cssX,cssY) darf ihn ablehnen */
function warteTap(treffer) {
  return new Promise((res) => {
    const h = (e) => {
      const t = e.changedTouches ? e.changedTouches[0] : e;
      if (!treffer || treffer(t.clientX, t.clientY)) {
        cv.removeEventListener("touchstart", h);
        cv.removeEventListener("mousedown", h);
        res();
      }
    };
    cv.addEventListener("touchstart", h);
    cv.addEventListener("mousedown", h);
  });
}

const w2css = (wx) => ((wx - cam.x) * SC) / DPR;

/* ===================== Spielablauf ======================================= */

let modus = "boot";
let camLock = false;
let freiZiel = null,
  freiRes = null,
  freiWandL = CFG.x.wand,
  freiWandR = WORLD_W;
let dreht = false;

function frei(bedingung, wandL, wandR) {
  modus = "play";
  freiWandL = wandL ?? freiWandL;
  freiWandR = wandR ?? WORLD_W;
  return new Promise((res) => {
    freiZiel = bedingung;
    freiRes = res;
  });
}

function stehIdle() {
  if (nunu.face === "s") setAnim(nunu, nunuIdle(), { loop: true });
  else {
    setStill(nunu, "nunu_rot", nunu.face === "e" ? DIRI.east : DIRI.west);
    nunu.bob = true;
  }
}

async function dreheZu(ziel) {
  if (nunu.face === ziel || dreht) return;
  const ch = drehung(nunu.face, ziel);
  dreht = true;
  nunu.bob = false;
  if (ch) await setAnim(nunu, ch, { fps: CFG.drehFps });
  nunu.face = ziel;
  dreht = false;
}

function updatePlay() {
  if (dreht) return;
  const d = input.dir;
  if (d !== 0) {
    const ziel = d > 0 ? "e" : "w";
    if (nunu.face !== ziel) {
      dreheZu(ziel);
      return;
    }
    nunu.bob = false;
    if (
      !nunu.anim ||
      nunu.anim.done ||
      !nunu.anim.sg[0].k.startsWith("nunu_walk")
    ) {
      setAnim(nunu, nunuWalk(ziel), { fps: laufAnimFps(CFG.laufTempo) });
    }
    nunu.x = Math.max(
      freiWandL,
      Math.min(freiWandR, nunu.x + d * CFG.laufTempo * dt),
    );
  } else {
    if (!nunu.anim || nunu.anim.sg[0].k.startsWith("nunu_walk")) stehIdle();
  }
}

const laufAnimFps = (tempo) => Math.max(4, Math.min(20, (tempo / 260) * 16));

function kameraFolgt(sofort) {
  let ziel = nunu.x - VIEWW * 0.42;
  ziel = Math.max(0, Math.min(WORLD_W - VIEWW, ziel));
  if (VIEWW >= WORLD_W) ziel = (WORLD_W - VIEWW) / 2;
  cam.x = sofort ? ziel : cam.x + (ziel - cam.x) * Math.min(1, dt * 3.4);
}

/* ---------------- Szene: Aufwachen --------------------------------------- */

async function szeneIntro() {
  modus = "intro";
  nunu.x = CFG.x.start;
  nunu.face = "s";
  nunu.sicht = true;
  nunu.alpha = 0;
  nunu.scale = CFG.introScale; // im Weiss ist sie gross
  setAnim(nunu, "nunu_sleep_idle", { loop: true });
  cam.x = Math.max(0, nunu.x - VIEWW * 0.5);
  weissBlende = 1;

  await tween(1.2, (t) => {
    nunu.alpha = t;
  });
  await wait(500);
  hinweis.text = "Tippe auf sie um sie aufzuwecken";
  hinweis.blink = true;

  hinweisPfeil = true;
  await warteTap((x, y) => {
    const m = SHEETS.nunu_sleep_idle,
      s = nunu.scale;
    const bx = w2css(nunu.x - m.cx * s) - 40,
      bw = (m.w * s * SC) / DPR + 80;
    const by = ((GROUND - m.gy * s) * SC) / DPR - 40,
      bh = (m.gy * s * SC) / DPR + 80;
    return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
  });

  audioInit();
  await ctxWecken();
  hinweis.text = "";
  hinweisPfeil = false;
  $("mute").style.display = "flex";

  // Aufwachen passiert noch gross
  await setAnim(nunu, "nunu_wakeup", { fps: 11 });
  await setAnim(nunu, "nunu_goonknees", { fps: 12 });
  await setAnim(nunu, "nunu_standup", { fps: 12 });
  setAnim(nunu, nunuIdle(), { loop: true });
  await wait(450);

  // ... dann zoomt es auf die Spielgroesse raus ...
  const von = CFG.introScale,
    bis = CFG.nunuScale;
  await tween(1.8, (t) => {
    const e = t * t * (3 - 2 * t);
    nunu.scale = von + (bis - von) * e;
  });
  nunu.scale = bis;
  await wait(250);

  // ... und erst danach verschwindet das Weiss
  await tween(1.6, (t) => {
    weissBlende = 1 - t;
  });
  await wait(400);
  musik("soundtrack", 2.0);
  await wait(900);
}

/* ---------------- Szene: Flaschengeist + Quiz ---------------------------- */

async function szeneGeist() {
  modus = "cut";
  input.dir = 0;
  await geheZu(CFG.x.geist);
  await dreheZu("e");
  setStill(nunu, "nunu_rot", DIRI.east);

  // Kamera festsetzen: Nunu links, Geist rechts
  const camZiel = Math.max(0, Math.min(WORLD_W - VIEWW, nunu.x - VIEWW * 0.2));
  const camVon = cam.x;
  camLock = true;
  await tween(0.9, (t) => {
    cam.x = camVon + (camZiel - camVon) * (t * t * (3 - 2 * t));
  });
  cam.x = camZiel;
  geist.x = camZiel + VIEWW * 0.76;
  geist.y = CFG.geistSchwebe; // er schwebt, statt auf dem Boden zu stehen
  geist.schwebt = true;
  imQuiz = true;

  // Erscheinen: rotiert 2,5 Umdrehungen aus und blendet ein
  geist.sicht = true;
  geist.alpha = 0;
  const rotFrames = SHEETS.spirit_rot.n;
  await tween(1.4, (t) => {
    const e = 1 - Math.pow(1 - t, 3);
    geist.alpha = Math.min(1, t * 1.5);
    setStill(geist, "spirit_rot", Math.floor(e * rotFrames * 2.5) % rotFrames);
  });
  geist.alpha = 1;
  setAnim(geist, "spirit_idle", { loop: true });
  musik("theme", 1.4); // loest den Soundtrack ab
  nunuHoertZu(false);
  await wait(600);

  await rede("einleitung");
  await wait(300);

  for (const f of FRAGEN) await frageDurchlaufen(f);

  quizUI.aktiv = false;
  musik("theme", 0.6, false); // fuers Outro laeuft nur noch sein Theme
  await rede("Outro");
  await wait(400);

  // Geist verschwindet wieder
  imQuiz = false;
  musikStop("theme", 1.6);
  await tween(1.2, (t) => {
    const e = t * t;
    geist.alpha = 1 - t;
    setStill(geist, "spirit_rot", Math.floor(e * rotFrames * 2.5) % rotFrames);
  });
  geist.sicht = false;
  nunu.bob = false;
  setAnim(nunu, nunuIdle(), { loop: true });
  nunu.face = "s";
  camLock = false;
  await wait(400);
  musik("soundtrack", 1.8);
  await wait(500);
}

/** Sprachzeile mit Redeanimation */
let imQuiz = false;

/** Waehrend der ganzen Quizszene schaut Nunu nach Nordost zum Geist hoch. */
function nunuHoertZu(an) {
  nunu.bob = false;
  if (an || imQuiz) {
    setAnim(nunu, "nunu_idle_ne", { loop: true });
  } else {
    setStill(nunu, "nunu_rot", DIRI.east);
    nunu.bob = true;
  }
}

async function rede(name) {
  setAnim(geist, "spirit_talk", { loop: true, fps: 10 });
  nunuHoertZu(true);
  await spiele(name);
  setAnim(geist, Math.random() < 0.5 ? "spirit_idle" : "spirit_idle2", {
    loop: true,
  });
  nunuHoertZu(false);
}

async function frageDurchlaufen(f) {
  quizUI.aktiv = true;
  quizUI.q = f.n;
  quizUI.zeigeFrage = false;
  quizUI.sichtbar = {};
  quizUI.status = {};
  quizUI.auswahl = null;
  quizUI.blink = false;
  quizUI.timer = null;
  quizUI.grau = false;
  quizUI.zeit = {};

  // 1) Anmoderation (mehrere Dateien nacheinander, 0,1 s Pause)
  for (let i = 0; i < f.anmod.length; i++) {
    await rede(f.anmod[i]);
    if (i < f.anmod.length - 1) await wait(100);
  }
  await wait(150);

  // 2) Fragestellung - Text erscheint im selben Moment
  quizUI.zeigeFrage = true;
  quizUI.zeit.frage = now;
  await rede(f.frage);
  await wait(100);

  // 3) Antwortmoeglichkeiten einblenden, waehrend er sie vorliest
  const buchstaben = ["a", "b", "c", "d"].filter((L) => f.antworten[L]);
  for (const L of buchstaben) {
    quizUI.sichtbar[L] = true;
    quizUI.zeit[L] = now;
    const st = f.antworten[L].stimme;
    if (st) {
      await rede(st);
      await wait(100);
    } else await wait(220);
  }

  // 4) Timer + Quizmusik
  const zeit = f.keineAuswahl ? CFG.timer.letzte : CFG.timer.normal;
  quizUI.timerMax = zeit;
  quizUI.timer = zeit;
  quizUI.grau = !!f.keineAuswahl;
  quizUI.klickbar = !f.keineAuswahl;
  musik("quizmusik", 0.5); // blendet das Geist-Theme automatisch aus

  const gewaehlt = await timerLauf(zeit, buchstaben);
  musik("theme", 0.6, false); // Theme laeuft weiter, wo es aufgehoert hat
  quizUI.timer = null;
  quizUI.klickbar = false;

  if (f.keineAuswahl) {
    quizUI.aktiv = false;
    return;
  }

  // 5) Bestaetigung + Einloggmusik
  if (gewaehlt) {
    quizUI.auswahl = gewaehlt;
    await spiele("confirm");
  }
  quizUI.blink = true;
  spieleOhneWarten("einloggen");
  await wait(5000);
  quizUI.blink = false;

  // 6) Aufloesung
  const richtig = gewaehlt && !!f.antworten[gewaehlt].richtig;
  for (const L of buchstaben) {
    if (f.antworten[L].richtig) quizUI.status[L] = "richtig";
    else if (L === gewaehlt) quizUI.status[L] = "falsch";
  }
  nunu.bob = false;
  setAnim(nunu, "nunu_quizreact", { fps: 12 });
  setAnim(geist, richtig ? "spirit_pos" : "spirit_neg", { loop: true, fps: 9 });
  spieleOhneWarten(richtig ? "richtig" : "falsch");
  await wait(900);
  nunuHoertZu(false);

  if (richtig) {
    if (f.win) await rede(f.win);
    else await wait(700);
  } else {
    await rede("FalscheAntwort1");
    await wait(150);
    await rede("AusnahmeMachen");
  }
  setAnim(geist, "spirit_idle", { loop: true });
  await wait(500);
  quizUI.aktiv = false;
  await wait(250);
}

/** laesst den Timer laufen; liefert den getippten Buchstaben oder null */
function timerLauf(sek, buchstaben) {
  return new Promise((res) => {
    let fertig = false;
    const ende = (val) => {
      if (fertig) return;
      fertig = true;
      cleanup();
      res(val);
    };
    const onTap = (e) => {
      if (!quizUI.klickbar) return;
      const t = e.changedTouches ? e.changedTouches[0] : e;
      const x = t.clientX * DPR,
        y = t.clientY * DPR;
      for (const L of buchstaben) {
        const r = quizUI.rects[L];
        if (
          r &&
          x >= r.x &&
          x <= r.x + r.w &&
          y >= r.y - 8 * DPR &&
          y <= r.y + r.h + 8 * DPR
        ) {
          ende(L);
          return;
        }
      }
    };
    const cleanup = () => {
      cv.removeEventListener("touchstart", onTap);
      cv.removeEventListener("mousedown", onTap);
      quizTick = null;
    };
    cv.addEventListener("touchstart", onTap);
    cv.addEventListener("mousedown", onTap);
    quizTick = () => {
      quizUI.timer -= dt;
      if (quizUI.timer <= 0) {
        quizUI.timer = 0;
        ende(null);
      }
    };
  });
}
let quizTick = null;

/* ---------------- Szene: Esel + Gedicht ---------------------------------- */

async function szeneEsel() {
  modus = "cut";
  input.dir = 0;

  // Esel wacht auf (er liegt schon die ganze Zeit da)
  esel.sicht = true;
  esel.x = CFG.x.esel;
  await setAnim(esel, "esel_standup", { fps: 12 });
  setAnim(esel, "esel_idle", { loop: true });
  await wait(400);

  // Gedicht startet
  musikStop("soundtrack", 1.2);
  musik("gedichtmusik", 1.6);
  await wait(400);
  spieleOhneWarten("gedicht");

  await dreheZu("e");
  const tempo = CFG.gedichtTempo;
  const fps = laufAnimFps(tempo);
  setAnim(nunu, nunuWalk("e"), { fps });
  setAnim(esel, "esel_walk1", { fps });

  const gehSek = CFG.gedichtGehSek;
  let t0 = 0;
  await tween(gehSek, (t, sek) => {
    const d = (sek - t0) * tempo;
    t0 = sek;
    nunu.x = Math.min(WORLD_W - 260, nunu.x + d);
    esel.x += (nunu.x - 420 - esel.x) * Math.min(1, dt * 2.2);
    if (nunu.anim.done) setAnim(nunu, nunuWalk("e"), { fps });
    if (esel.anim.done)
      setAnim(esel, "esel_walk" + (1 + ((Math.random() * 4) | 0)), { fps });
  });

  // sie dreht sich um, die beiden schauen sich an
  setAnim(esel, "esel_idle", { loop: true });
  await dreheZu("w");
  setStill(nunu, "nunu_rot", DIRI.west);
  nunu.bob = true;

  // bis das Gedicht zu Ende ist
  const restMs = Math.max(0, (DUR.gedicht - gehSek - 2.2) * 1000);
  await wait(restMs);

  // Esel verschwindet
  nunu.bob = false;
  await setAnim(esel, "esel_dis1", { fps: 12 });
  await setAnim(esel, "esel_dis2", { fps: 12 });
  esel.sicht = false;
  await wait(600);

  // zurueck nach Osten und beten
  await dreheZu("e");
  const beten = [{ k: "nunu_pray", from: 0, to: 2 }];
  for (let i = 0; i < 3; i++) beten.push({ k: "nunu_pray", from: 2, to: 12 });
  beten.push({ k: "nunu_pray", from: 12, to: 15 });
  await setAnim(nunu, beten, { fps: 12 });
  setStill(nunu, "nunu_rot", DIRI.east);
  nunu.bob = true;

  musikStop("gedichtmusik", 2.4);
  musik("soundtrack", 2.4);
  await wait(700);
}

/* ---------------- Szene: Mond, Himmel, Abspann --------------------------- */

async function szeneMond() {
  modus = "cut";
  input.dir = 0;
  await dreheZu("e");
  setStill(nunu, "nunu_rot", DIRI.east);
  nunu.bob = true;

  // Er startet komplett hinter dem Regenbogenboden und steigt von dort auf -
  // keine Einblendung, er schiebt sich einfach ueber den Horizont.
  const yStart = 0.99;
  mond = { y: yStart, a: 1 };
  await tween(9.0, (t) => {
    const e = 1 - Math.pow(1 - t, 2.4);
    mond.y = yStart + e * (0.05 - yStart);
    othersAlpha = 1 - e * 0.75; // die Insiderbilder treten hinter den Mond zurueck
  });
  await wait(500);

  nunu.bob = false;
  await dreheZu("s");
  await setAnim(nunu, "nunu_laugh", { fps: 12 });
  setAnim(nunu, nunuIdle(), { loop: true });
  await wait(900);
}

async function szeneHimmel() {
  modus = "cut";
  camLock = true;
  await tween(5.5, (t) => {
    const e = t * t * (3 - 2 * t);
    cam.y = -e * 1350;
    othersAlpha = 0.16 * (1 - e);
  });
  othersAlpha = 0;
  await wait(600);
}

async function szeneAbspann() {
  const wrap = $("crawlwrap"),
    el = $("crawl");
  el.innerHTML =
    `<h2>${CFG.abspannTitel}</h2>` +
    CFG.abspann.map((p) => `<p>${p}</p>`).join("");
  wrap.style.display = "block";
  el.style.bottom = "0";
  musik("gedichtmusik", 3.0);

  // Starthoehe erst messen, dann von unten nach oben in die Ferne schieben
  await new Promise((r) => requestAnimationFrame(r));
  const blockH = el.offsetHeight;
  const von = wrap.offsetHeight * 1.05;
  const bis = -(blockH + wrap.offsetHeight * 0.15);

  const dauer = CFG.abspannSek * 1000;
  const start = performance.now();
  await new Promise((res) => {
    const step = () => {
      const t = Math.min(1, (performance.now() - start) / dauer);
      const y = von + (bis - von) * t;
      el.style.transform = `translateX(-50%) rotateX(36deg) translateY(${y}px)`;
      if (t < 1) requestAnimationFrame(step);
      else res();
    };
    step();
  });
  wrap.style.display = "none";
  $("again").style.display = "block";
}

/* ---------------- Hilfsfunktionen ---------------------------------------- */

function tween(sek, fn) {
  return new Promise((res) => {
    const start = performance.now();
    const step = () => {
      const s = (performance.now() - start) / 1000;
      const t = Math.min(1, s / sek);
      fn(t, s);
      if (t < 1) requestAnimationFrame(step);
      else res();
    };
    step();
  });
}

/** laesst Nunu automatisch zu einer Position laufen */
async function geheZu(ziel, tol = 90) {
  // Steht sie praktisch schon da, nicht erst umdrehen und zurueckstapfen
  if (Math.abs(nunu.x - ziel) < tol) {
    const von = nunu.x;
    await tween(0.3, (t) => {
      nunu.x = von + (ziel - von) * t;
    });
    nunu.x = ziel;
    stehIdle();
    return;
  }
  const dir = ziel > nunu.x ? "e" : "w";
  await dreheZu(dir);
  const fps = laufAnimFps(CFG.laufTempo);
  setAnim(nunu, nunuWalk(dir), { fps });
  await new Promise((res) => {
    autoGeh = () => {
      const d = (dir === "e" ? 1 : -1) * CFG.laufTempo * dt;
      nunu.x += d;
      if (nunu.anim.done) setAnim(nunu, nunuWalk(dir), { fps });
      if ((dir === "e" && nunu.x >= ziel) || (dir === "w" && nunu.x <= ziel)) {
        nunu.x = ziel;
        autoGeh = null;
        res();
      }
    };
  });
  stehIdle();
}
let autoGeh = null;

/* ===================== Hauptschleife ===================================== */

function loop(ts) {
  requestAnimationFrame(loop);
  dt = Math.min(0.05, (ts - now) / 1000 || 0);
  now = ts;
  melodyT += dt;

  schnuppenUpdate();
  if (autoGeh) autoGeh();
  if (quizTick) quizTick();
  if (modus === "play") {
    updatePlay();
    if (freiZiel && freiZiel(nunu.x)) {
      const r = freiRes;
      freiZiel = null;
      freiRes = null;
      modus = "cut";
      r();
    }
  }
  animUpdate(nunu);
  animUpdate(geist);
  animUpdate(esel);
  if (!camLock) kameraFolgt(false);

  render();
}

/* ===================== Ablauf ============================================ */

const SZENEN = ["intro", "quiz", "esel", "mond", "abspann"];

async function spiel(ab = "intro") {
  const i = SZENEN.indexOf(ab);

  // Der Esel liegt von Anfang an schlafend an seinem Platz
  esel.x = CFG.x.esel;
  esel.sicht = true;
  setAnim(esel, "esel_sleep_idle", { loop: true });

  if (i <= 0) {
    await szeneIntro();
  } else {
    // Direkteinstieg fuer Tests
    weissBlende = 0;
    audioInit();
    await ctxWecken();
    $("mute").style.display = "flex";
    nunu.sicht = true;
    nunu.alpha = 1;
    nunu.face = "e";
    setStill(nunu, "nunu_rot", DIRI.east);
    nunu.x = {
      quiz: CFG.x.geist - 700,
      esel: CFG.x.esel - 500,
      mond: CFG.x.mond - 500,
      abspann: CFG.x.ende,
    }[ab];
    cam.x = Math.max(0, Math.min(WORLD_W - VIEWW, nunu.x - VIEWW * 0.42));
    if (ab !== "abspann") musik("soundtrack", 0.6);
  }

  if (i <= 1) {
    await frei((x) => x >= CFG.x.geist, CFG.x.wand, CFG.x.geist);
    await szeneGeist();
  }
  if (i <= 2) {
    await frei(
      (x) => x >= CFG.x.esel + 240,
      CFG.x.geist - 900,
      CFG.x.esel + 260,
    );
    await szeneEsel();
  }
  if (i <= 3) {
    await frei((x) => x >= CFG.x.mond, CFG.x.esel, CFG.x.mond);
    await szeneMond();
  }
  await szeneHimmel();
  await szeneAbspann();
}

/* ===================== Start, Mute, Debug ================================ */

$("mute").addEventListener("click", () => {
  muted = !muted;
  $("mute").textContent = muted ? "×" : "♪";
  for (const n in SND) {
    const s = SND[n];
    if (muted) setzeGain(n, 0);
    else if (s.aktiv)
      ramp(n, gainOf(n) * (voiceCount ? duckFactor(n) : 1), 0.2);
  }
});

$("again").addEventListener("click", () => {
  location.hash = "";
  location.reload();
});

// Debugmenue: dreimal kurz in die linke untere Ecke tippen
let ecke = 0,
  eckeT = 0;
$("hotcorner").addEventListener("click", () => {
  const t = performance.now();
  if (t - eckeT > 900) ecke = 0;
  eckeT = t;
  if (++ecke >= 3) {
    ecke = 0;
    $("dbg").style.display = "grid";
  }
});
(function baueDbg() {
  const d = $("dbg");
  for (const s of SZENEN) {
    const b = document.createElement("button");
    b.textContent = s;
    b.onclick = () => {
      location.hash = s;
      location.reload();
    };
    d.appendChild(b);
  }
  const c = document.createElement("button");
  c.textContent = "schliessen";
  c.onclick = () => {
    d.style.display = "none";
  };
  d.appendChild(c);
})();

(async function main() {
  resize();
  try {
    await document.fonts.ready;
  } catch (e) {}
  $("bootmsg").textContent = "Lädt Bilder und Ton …";
  await loadAll();
  $("bootmsg").textContent = "Kopfhörer oder Lautsprecher an";
  $("startbtn").style.display = "block";
  // audioInit MUSS direkt im Klick laufen - sonst gibt iOS den Ton nicht frei
  await new Promise((r) =>
    $("startbtn").addEventListener(
      "click",
      () => {
        audioInit();
        r();
      },
      { once: true },
    ),
  );
  await ctxWecken();
  $("boot").style.opacity = "0";
  setTimeout(() => {
    $("boot").style.display = "none";
  }, 520);
  requestAnimationFrame(loop);
  const start = (location.hash || "").replace("#", "") || "intro";
  spiel(SZENEN.includes(start) ? start : "intro");
})();
