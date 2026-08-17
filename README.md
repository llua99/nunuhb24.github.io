# Nunu

Ein 2D-Adventure als Webseite, gebaut für das iPad Air 5 im **Querformat**.

Die Welt besteht aus Sternenhimmel und Regenbogenboden — Regenbogen, Nunu und
der Esel laufen alle im selben Pixelmaßstab. Die Sterne nehmen aufgehellte
Regenbogenfarben an, über dem Boden liegt ein farbiger Schimmer, und alle
paar Sekunden fällt eine Sternschnuppe.

---

## Auf GitHub Pages bringen

1. Auf github.com ein neues Repository anlegen, z. B. `nunu`. Sichtbarkeit **Public**
   (Pages funktioniert bei privaten Repos nur mit bezahltem Konto).
2. Auf der leeren Repo-Seite auf **uploading an existing file** klicken.
3. Den **Inhalt** dieses Ordners hineinziehen — also `index.html`, `game.js`,
   `data.js`, `README.md` und den Ordner `assets`. Nicht den Ordner selbst,
   sondern das, was drin ist. `index.html` muss ganz oben liegen.
4. Warten, bis alle Dateien hochgeladen sind (es sind rund 190 Stück, das dauert
   ein paar Minuten), dann unten auf **Commit changes**.
5. **Settings → Pages →** unter *Branch* `main` und `/ (root)` wählen, **Save**.
6. Nach ein bis zwei Minuten läuft es unter
   `https://DEINNAME.github.io/nunu/`

### Auf dem iPad einrichten

Die Adresse in Safari öffnen, dann **Teilen → Zum Home-Bildschirm**. So startet
es ohne Safari-Leisten im Vollbild. Beim allerersten Start muss das iPad online
sein — die Pixelschrift kommt von Google Fonts und die Bilder und Töne
(rund 22 MB) werden geladen. Danach ist alles im Cache.

Vor dem Geburtstag einmal komplett durchspielen, damit alles im Cache liegt.

---

## Steuerung

- **Linke Bildschirmhälfte** antippen und halten → nach links
- **Rechte Bildschirmhälfte** antippen und halten → nach rechts
- Pfeiltasten links/rechts funktionieren auch (praktisch zum Testen am Rechner)
- Beim Richtungswechsel dreht sie sich komplett um
- Nach links kommt sie nur bis zu einer unsichtbaren Wand, die mit dem
  Fortschritt mitwandert

**Mute-Knopf** oben links.

**Testmenü:** dreimal kurz in die **linke untere Ecke** tippen. Dann kann man
direkt zu `intro`, `quiz`, `esel`, `mond` oder `abspann` springen, ohne alles
noch mal spielen zu müssen.

---

## Was du selbst ändern kannst

Alles Wichtige steht ganz oben in **`game.js`** im Block `CFG`. Datei mit einem
Texteditor öffnen, Zahl ändern, speichern, neu hochladen.

### Quizfragen

Fragen und Antworten stehen im Block `FRAGEN` in `game.js`:

```js
{
  n: 1, text: 'Was bist du?',
  antworten: {
    a: { text: 'eine Babane',       stimme: 'Frage1a' },
    b: { text: 'ein Hase',          stimme: 'Frage1b', richtig: true },
    …
  },
  anmod: ['Frage1Anmoderation1'], frage: 'Frage1Fragenstellung', win: 'Frage1Richtig',
}
```

Die Balken werden gezeichnet, nicht aus Bildern gebaut — Text ändern reicht,
die Schriftgröße passt sich automatisch an, sehr lange Fragen rutschen auf zwei
Zeilen. `richtig: true` markiert die Lösung (bei Frage 2 stehen beide auf
richtig), `stimme` ist die Datei, mit der der Geist die Antwort vorliest.
Lässt du `stimme` weg, erscheint die Antwort ohne Sprachausgabe.

### Abspanntext

```js
abspannTitel: 'Alles Gute',
abspann: [
  'Erster Absatz …',
  'Zweiter Absatz …',
],
abspannSek: 62,      // wie lange der Text durchs Bild läuft
```

Der Lorem-Ipsum-Text steht dort — einfach durch deinen ersetzen. Ein Eintrag pro
Absatz, in Anführungszeichen, mit Komma am Ende. Wenn dein Text deutlich länger
oder kürzer ist, `abspannSek` mit anpassen (Faustregel: rund 20 Sekunden pro
Absatz).

### Lautstärken

```js
vol: {
  musik:        1.00,   // normale Hintergrundmusik
  musikGeduckt: 0.34,   // Musik, während jemand spricht
  stimme:       1.00,   // Flaschengeist
  gedicht:      1.00,
  gedichtMusik: 1.00,   // Musik unter dem Gedicht
  quizMusik:    1.00,
  sfx:          1.00,
}
```

**Wichtig:** Der Grundpegel der Musik steckt inzwischen fest in den mp3-Dateien
(Musik rund 12 dB unter den Stimmen, die Gedichtmusik 17 dB). Grund: das iPad
lässt die Lautstärke eines Audio-Elements nicht immer per JavaScript verändern.
So klingt die Mischung auch dann richtig, wenn die Feinregelung nicht greift.

Diese Werte regeln nur noch obendrauf. Die Musik wird automatisch leiser, sobald
jemand spricht (`musikGeduckt`), und geht danach wieder hoch. Wenn dir die Musik
generell zu laut ist: `musik` auf z. B. `0.7`. Lauter als `1.0` geht nicht — dafür
müsste ich die Dateien neu kodieren, sag einfach Bescheid.

### Größen

```js
nunuScale:      4.5,
introScale:     8.2,   // so groß ist sie im weißen Intro
geistScale:     3.5,
geistSchwebe: -230,    // wie hoch der Flaschengeist über dem Boden schwebt
eselScale:      4.5,   // gleicher Pixelmaßstab wie Nunu
```

Zum Esel: 4,5 ist **exakt** derselbe Maßstab wie bei Nunu. Er wirkt trotzdem
klein, weil sein Sprite kleiner gezeichnet ist (49 statt 102 Pixel Inhaltshöhe).
Soll er ihr in der Höhe gleichkommen, ist der Wert **9,4** — dann sind seine
Pixel allerdings doppelt so grob wie ihre.

Nunu, der Esel und der Regenbogenboden laufen alle im selben Pixelmaßstab. Wenn
du `nunuScale` änderst, wächst der Regenbogenboden automatisch mit und die
Figuren stehen weiterhin genau oben auf ihm.

### Tempo und Orte

```js
laufTempo:      360,    // Welt-Pixel pro Sekunde
gedichtTempo:    85,    // Spaziergang während des Gedichts
gedichtGehSek:   20,    // wie lange sie geht, bevor sie sich zum Esel umdreht
```

```js
x: {
  wand:      300,   // unsichtbare Wand links
  start:    1050,   // hier schläft sie
  geist:    4250,   // hier erscheint der Flaschengeist
  esel:     8200,   // hier schläft der Esel
  mond:    12300,   // hier geht der Mond auf
  ende:    12900,
}
```

Die Welt ist 13000 Pixel breit (`WORLD_W` direkt unter dem CFG-Block) — das sind
gut fünf Bildschirmbreiten. Da es kein Hintergrundbild mehr gibt, kannst du die
Breite frei ändern; die Orte oben musst du dann mit anpassen.

```js
bodenVersatz: 4,    // gilt für alle Figuren, in Sprite-Pixeln
nunuTiefer:  10,    // nur Nunu, zusätzlich, in Bildschirmpixeln
```

Wie tief die Figuren unter der Oberkante des Regenbogens stehen.

### Insider-Bilder

```js
const OTHERS = [
  { file: 'mogelbaum2.png', x: 1750, p: 1.00, s: 1.30, amp: 14 },
  { file: 'luci2.png',      x: 3200, p: 1.00, s: 0.85, amp: 18 },
  { file: '50cent2.png',    x: 6900, p: 1.00, s: 1.10, amp: 12 },
  { file: 'nunu1.png',      x: 8800, p: 1.00, s: 1.00, amp: 16 },
];
const MELODY_POS = { x: 10100, p: 1.00, s: 2.20, amp: 20 };
```

Sie stehen mit der Unterkante auf dem Regenbogenboden und schweben leicht.
`x` = Position in der Welt, `s` = Größe, `amp` = wie stark sie schweben,
`p` = Parallax (1,0 = bewegt sich genau wie die Welt).

Zwei Abschnitte sind bewusst frei geblieben: **3600–6200** (dort steht das Quiz
im Bild) und alles ab **10600** (dort geht der Mond auf). Wenn du ein Bild dorthin
schiebst, ragt es ins Quiz oder in die Mondszene.

---

## Ablauf

| Szene | Was passiert |
|---|---|
| Intro | Weiß, Nunu blendet groß ein und schläft. Antippen weckt sie: aufwachen → auf die Knie → aufstehen. Dann zoomt es auf Spielgröße raus, erst danach verschwindet das Weiß und die Musik setzt ein. |
| Weg | Freies Gehen über den Regenbogen unter dem Sternenhimmel. Unterwegs stehen die Insider-Bilder herum. |
| Flaschengeist | Er erscheint mit Rotation, eigenes Musikthema, spricht die Einleitung. |
| Quiz | 5 Fragen. Anmoderation → Frage → Antworten einzeln, während er sie vorliest → 15-Sekunden-Timer. Auswahl → Bestätigungston → Einloggmusik 5 Sekunden → Auflösung. Bei falscher Antwort geht es trotzdem weiter. Frage 5 ohne Auswahl, 10 Sekunden, dann Outro. |
| Esel | Er schläft. Geht man an ihm vorbei, steht er auf und folgt. |
| Gedicht | Sie geht langsam, er hinterher. Nach 30 Sekunden dreht sie sich um, die beiden schauen sich an, bis das Gedicht zu Ende ist. Dann verschwindet er, sie dreht sich nach Osten und betet. |
| Mond | Weitergehen. Der Mond schiebt sich hinter dem Regenbogen hervor und steigt auf, sie dreht sich zum Betrachter und lacht. |
| Himmel | Die Kamera schwenkt nach oben. |
| Abspann | Text läuft wie bei Star Wars durchs Weltall. Danach „Nochmal". |

---

## Wenn kein Ton kommt

Der Ton wird beim Tippen auf **Start** freigeschaltet — das muss eine echte
Berührung sein, deshalb der Startknopf. Wenn trotzdem nichts kommt:

1. **Nicht per Doppelklick öffnen.** Wenn die Adresszeile mit `file://` beginnt,
   liefert Chrome über die Tonmischung nur Stille — ein bekannter Browser-Fall.
   Das Spiel erkennt das inzwischen und schaltet um, aber sicherer ist die
   GitHub-Adresse oder ein lokaler Server
   (`python3 -m http.server` im Ordner, dann `http://localhost:8000`).
2. **Lautlos-Schalter im Kontrollzentrum** ausschalten (von der rechten oberen
   Ecke nach unten wischen). Safari respektiert ihn auch bei Webseiten.
3. Lautstärke am iPad hochdrehen — die Regelung wirkt erst, wenn schon Ton läuft.
4. Seite einmal neu laden und wieder auf Start tippen.
5. Bluetooth-Kopfhörer prüfen, die kapern manchmal die Ausgabe.

Falls es dann immer noch still ist, sag mir bitte, ob es auf dem iPad oder am
Rechner war — dann kann ich gezielt nachbessern.

## Bekannte Kleinigkeiten

- **Schriftart braucht beim ersten Start Internet.** Ohne Netz sieht man eine
  normale Schreibmaschinenschrift statt der Pixelschrift. Wenn du eine
  `.ttf`-Datei besorgst, lässt sich das lokal einbinden.
- **Im Bild steht „eine Babane"** und **„die gute Schwestester"** — Tippfehler
  aus dem Photoshop-Original. Ich habe sie so gelassen, weil du sie vielleicht
  absichtlich drin hast.
- **Frage 3 und 4 haben keine eigene „Richtig"-Sprachdatei.** Wie du gesagt
  hast, steckt das in der Anmoderation der nächsten Frage — es kommt dort nur
  der Jingle, dann geht es weiter.
- **Frage 2:** Beide Antworten sind als richtig hinterlegt, C und D sind
  ausgeblendet.

---

## Ordner

```
index.html          Gerüst, Ladebildschirm, Abspann-Overlay
game.js             Spiellogik  ← hier stehen die Einstellungen
data.js             automatisch erzeugt, bitte nicht ändern
assets/img/sheets/  45 Spritesheets (alle Animationen)
assets/img/other/   die Insider-Bilder
assets/audio/       Musik, Sprache, Sounds
```

Die Originaldateien sind unverändert nicht mit dabei — die Bilder wurden zu
Spritesheets zusammengefasst und das Audio nach mp3 gewandelt und in der
Lautheit angeglichen. Aus 79 MB wurden so 22 MB.
