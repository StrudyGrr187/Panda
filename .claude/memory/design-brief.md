# Design-Brief Redesign Pandas Wok (verbindlich)

## Aesthetic-Richtung
Ruhige, sachliche Restaurant-Website im Stil der Referenz worldofasia.restaurant: eine Schrift (Montserrat), normale Schreibung, große randlose Fotos, wenig Text, keine Effekte. Die Farben kommen aus dem echten Lokal: warmes Anthrazit der Halle, Kupfer der beleuchteten Buffetstraße (statt WOA-Gold), Signalrot der Fassadenbuchstaben nur für Aktionen und den Footer. Rhythmus: weiß, dunkel, weiß, dunkel mit Fotos, weiß, rot. Das Foto ist der Held, nicht die Typo.

## Design-Tokens

### Farben
--bg:             #FFFFFF   Seitenhintergrund (Nav, Hero, Preise, Familie, Drawer)
--sand:           #F5F2EE   Bild-Placeholder, Input-Hintergrund im Drawer
--ink:            #2E2B29   Text auf hellem Grund UND Hintergrund dunkler Sektionen + Preisboxen
--muted:          #6B6560   Sekundärtext auf Weiß (5,7:1)
--on-dark:        #F2EFEA   Text auf --ink
--on-dark-muted:  #B3ACA4   Sekundärtext auf --ink (6,3:1)
--line:           #E5E0DA   Trennlinien auf Weiß
--line-dark:      rgba(242,239,234,0.14)  Trennlinien auf --ink
--red:            #CC2419   Primärbutton, Footer-Hintergrund, Focus-Ring
--red-hover:      #A91D14
--copper:         #C9976B   Preise + Akzente auf dunklem Grund (5,5:1)
--copper-deep:    #9A6A43   Hero-Name + Akzente auf Weiß (4,7:1)
--open:           #2E7D4F   Status-Punkt "geöffnet"
--closed:         #B3ACA4   Status-Punkt "geschlossen"
meta theme-color: #FFFFFF

Rollen strikt: Rot = klickbare Hauptaktion + Footer. Kupfer = Preise, Hero-Name, "heute"-Markierung. Sonst nichts farbig.

### Typografie
Google Fonts: `Montserrat:wght@300;400;500;600` (display=swap). Archivo, Instrument Serif, Noto Serif SC komplett entfernen.
--f-sans: 'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif

| Ebene | Größe | Weight | Line-height | Sonstiges |
|---|---|---|---|---|
| Hero-Name (h1) | clamp(40px, 4.4vw, 64px) | 300 | 1.1 | --copper-deep, letter-spacing 0 |
| Hero-Ort ("Perchtoldsdorf") | 20px | 300 | 1.3 | --copper-deep |
| h2 Sektion | clamp(28px, 2.8vw, 40px) | 400 | 1.2 | letter-spacing -0.005em |
| h3 | 20px | 500 | 1.3 | |
| Lead | 18px | 400 | 1.6 | max 52ch |
| Body | 16px | 400 | 1.65 | max 60ch |
| Small / Labels | 14px | 500 (Label) / 400 | 1.5 | Labels normal geschrieben, KEIN Uppercase |
| Micro / Fineprint | 13px | 400 | 1.5 | |
| Preis groß (Erwachsene) | clamp(30px, 3vw, 36px) | 400 | 1 | --copper, tabular-nums |
| Preis klein (Kinder) | 18px | 500 | 1.3 | tabular-nums |
| Nav-Links | 14px | 500 | 1 | letter-spacing 0.02em |
| Buttons | 15px (klein: 14px) | 600 | 1 | letter-spacing 0.01em |

Nirgends `text-transform: uppercase`, nirgends `font-stretch`, keine kursiven Serifen-Einschübe.

### Spacing & Layout (baut auf bestehendem System auf)
--s-1..--s-8: bleibt (4/8/12/16/24/32/40/48px)
--section-y: clamp(72px, 9vw, 128px)   (reduziert, keine Riesen-Headlines mehr)
--block: clamp(48px, 6vw, 88px)        bleibt (Headline → Inhalt, Infostreifen-Padding)
--grid-gap: 24px / 16px mobil           bleibt
--card-pad: clamp(24px, 2.8vw, 40px)    bleibt (Preisboxen)
--wrap: 1200px                          (statt 1360)
--wrap-narrow: 960px                    (Preise)
--gutter: clamp(20px, 4vw, 48px)
--header-h: 72px / 60px mobil
--gallery-gap: 4px
Breakpoints: 1080px (Nav klappt ein), 760px (alles einspaltig)

### Radius, Schatten, Linien
--radius: 2px (Buttons, Inputs, Preisboxen). Logo rund (50%), sonst nichts rund.
Schatten: keine. Einzige Ausnahme: Drawer-Backdrop rgba(30,28,27,0.5).
Linien: 1px solid --line (hell) bzw. --line-dark (dunkel). Keine 2px-Linien, keine gepunkteten Linien.

### Motion
--ease: cubic-bezier(0.2, 0.7, 0.2, 1)
--dur: 0.2s (Farb-Hover)
Reveal: nur Fade, opacity 0→1 + translateY(12px)→0, 0.6s --ease, einmalig. Nur auf Sektions-Inhaltsblöcke (Headline-Block, Preisboxen-Paar, Liste, Familie-Text), NICHT auf jedes einzelne Element. Max. 80ms Versatz zwischen zwei Geschwistern.
Bilder: kein Reveal, kein Clip-Path, kein Scale, kein Parallax, kein Hover-Zoom.
Hero: keine Lade-Animation.
Drawer: translateX 0.3s --ease, Backdrop opacity 0.3s.
Hover: nur Farbwechsel (0.2s). Keine Icon-Verschiebungen, keine Underline-Wisch-Animation.
prefers-reduced-motion: alles aus.

## Layout & Komponenten (Reihenfolge)

### 1. Nav (sticky, weiß)
Desktop: Grid `1fr auto 1fr`, Höhe 72px, wrap 1200.
- Links: Logo 40px rund (ohne Rahmen) + "Pandas Wok" 16px/500 --ink.
- Mitte: Preise · Buffet · Familie & Feiern · Anfahrt (Abstand 32px), danach Instagram-Icon 20px (Outline, --ink, Hover --red).
- Rechts (justify-end, gap 20px): "0699 118 779 99" als tel-Link 14px/500; kleiner roter Button "Tisch reservieren" (40px hoch).
- Unter 1180px Tel-Nummer ausblenden.
- Unterkante: transparent, ab Scroll 1px --line (bestehende .is-scrolled-Logik).
- Status-Anzeige NICHT in der Nav (steht im Hero).
Mobil (≤1080): Höhe 60px, Logo + Name links, Hamburger rechts (bestehende Logik). Aufgeklapptes Menü: weißes Panel unter dem Header, Links 18px/500, Zeilenhöhe 52px, 1px --line dazwischen, darunter IG-Link und Telefonnummer als normale Zeilen. Kein Reservier-Button im Header (≤760) – macht die Mobile-Bar.

### 2. Hero (weiß, Split, Hero-Moment)
Desktop: volle Breite (nicht in .wrap), Grid 1fr 1fr, Höhe min(80vh, 720px), min 520px.
- Links: Inhalt vertikal + horizontal zentriert, text-align center, max-width 440px:
  Logo 120px → (s-5) h1 "Pandas Wok" → "Perchtoldsdorf" → (s-5) ein Satz 18px --ink: "Asiatisches Buffet bei der SCS – alle Getränke inklusive." → (s-4) Status 14px: Punkt 8px (--open/--closed, kein Glow-Ring) + Text (bestehendes data-status) → (s-6) roter Button "Tisch reservieren" (48px) + daneben Text-Link "Preise ansehen".
- Rechts: hall.jpg randlos bis zum rechten Viewport-Rand und bündig unter der Nav, object-fit cover, object-position center 75% (schneidet die unruhige verspiegelte Decke oben weg). Keine Caption.
Mobil (≤760): Text-Block zuerst (Logo 72px, padding-top s-7, padding-bottom s-7, Button volle Breite), darunter hall.jpg randlos, aspect-ratio 4/3, object-position center 75%.

### 3. Infostreifen (#anfahrt, dunkel --ink)
Padding --block oben/unten. wrap 1200, Grid 12 Spalten.
- Spalten 1–5: h2 (on-dark) "Du findest uns bei der SCS – beim großen Panda am Eingang." Darunter drei Blöcke mit je Label 14px/500 --on-dark-muted + Inhalt 16px --on-dark, Abstand s-6:
  Adresse: Brunnerfeldstraße 65, 2380 Perchtoldsdorf · Gratis-Parkplatz direkt vor der Tür · Text-Link "Route planen" (Hover --copper).
  Öffnungszeiten: Tabelle Mo–Fr 11:30–15:00 und 17:30–22:00 / Sa, So & Feiertag 12:00–22:00, Zeilen 1px --line-dark. Heute-Zeile: Text --on-dark 600, dahinter "heute" 13px --copper (keine Pille). Andere Zeilen --on-dark-muted.
  Kontakt: Telefon als Link 20px/500, darunter Instagram-Link.
- Spalten 7–12: Google-Map, aspect-ratio 4/3, ohne Rahmen, ohne Graustufen-Filter, align-self start.
Mobil: einspaltig, Map am Ende randlos (bis an die Ränder), aspect-ratio 4/3.

### 4. Preise (#preise, weiß)
wrap-narrow 960, zentriert. h2 "Preise" zentriert, darunter 16px --muted zentriert: "Pro Person. Buffet und alle Getränke inklusive." → --block → zwei GLEICHE Boxen nebeneinander (Grid 1fr 1fr, gap --grid-gap), keine hervorgehobene Box.
Box: bg --ink, Text --on-dark, padding --card-pad, radius 2px.
- Kopf: h3 "Mittag" bzw. "Abend & Wochenende" (20px/500 --on-dark), darunter 14px --on-dark-muted: "Mo–Fr, 11:30–15:00" bzw. "Mo–Fr 17:30–22:00 · Sa, So & Feiertag 12:00–22:00".
- Zeilen (Label links 16px, Preis rechts, baseline, padding s-4 vertikal, 1px --line-dark oben):
  Erwachsene → Preis groß --copper (22,90 € / 35,90 €)
  Kinder 8–11 Jahre → 15,00 € / 17,00 €
  Kinder 4–7 Jahre → 10,00 € / 12,00 €
  Kinder bis 3 Jahre → "gratis" in --copper
Unter den Boxen (s-7 Abstand) zentriert: 18px/500 --ink "Alle Getränke sind im Preis enthalten." + 16px --muted "Bier, Wein, Softdrinks, Säfte, Wasser, Kaffee und Tee." Darunter 13px --muted: "Teppanyaki und Meeresfrüchte gibt es abends und am Wochenende."
Preisrechner: entfällt komplett.
Mobil: Boxen untereinander, volle Breite.

### 5. Buffet (#buffet, dunkel --ink) + 6. Galerie (gleiche Sektion)
Padding-top --section-y. wrap 1200, Grid 12.
- Spalten 1–5: h2 "Was am Buffet steht" (--on-dark) + 1 Satz 16px --on-dark-muted ("Über 100 warme und kalte Gerichte, laufend frisch nachgelegt.").
- Spalten 7–12: schlichte Liste, 5 Einträge, je Zeile padding s-5 vertikal, 1px --line-dark oben (letzte auch unten). Pro Eintrag: Name 20px/500 --on-dark, rechts optional Hinweis 14px --copper, darunter eine Zeile 16px --on-dark-muted.
  Wok & Dim Sum · Sushi & Sashimi · Desserts · Teppanyaki (rechts: "Abend & Wochenende") · Meeresfrüchte (rechts: "Abend & Wochenende"). Keine Nummern, keine Pillen.
Danach --block Abstand, dann Galerie (id #fotos) RANDLOS über volle Viewport-Breite, gap 4px (Fugenfarbe = --ink):
  Desktop: eine Reihe, Grid-Spalten 1.15fr 1fr 0.85fr = buffet.jpg | sushi.jpg | panda.jpg, Höhe clamp(280px, 32vw, 520px), object-fit cover. Keine Captions.
  Mobil: buffet.jpg volle Breite aspect 4/3, darunter sushi.jpg + panda.jpg nebeneinander aspect 4/5.
Unter der Galerie: zentrierte Zeile (padding s-6 oben, --block unten) IG-Icon + "Mehr Fotos auf Instagram: @pandas_wok_perchtoldsdorf" 15px --on-dark-muted, Hover --on-dark.

### 7. Familie & Feiern (#familie, weiß) – Spiegel zum Hero
Desktop: volle Breite, Grid 1fr 1fr. Links building.jpg randlos bis zum linken Viewport-Rand, object-fit cover, object-position center 35%, min-height 560px. Rechts Text, padding --block, max-width 520px, vertikal zentriert, linksbündig:
h2 "Für Familien und Feiern" → 1–2 Sätze Lead → Liste (3 Zeilen, je 1px --line oben, padding s-4): Label 16px/600 + Text 16px --muted:
  Kinderspielbereich – eigener Bereich zum Spielen. Kinder bis 3 Jahre essen gratis.
  VIP-Räume – separate Räume für Geburtstage, Jubiläen und Firmenfeiern.
  500 Plätze – auch für große Gruppen. Ab 10 Personen ruf am besten kurz an.
→ s-6 → roter Button "Tisch reservieren" + Outline-Button "0699 118 779 99" (tel).
Mobil: Foto zuerst randlos aspect 4/3, dann Text mit --section-y unten.

### 8. Footer (rot --red, Text weiß)
padding-top --block, unten s-7 (mobil + Höhe der Mobile-Bar). wrap 1200. Grid 4 Spalten, gap --grid-gap:
  Pandas Wok (Logo 48px + Adresse) · Öffnungszeiten · Kontakt (Tel, Instagram) · Rechtliches (Impressum, Datenschutz).
Spaltenlabel 14px/600 weiß, Inhalt 15px/400 rgba(255,255,255,0.88), Links unterstrichen (1px, offset 4px), Hover voll weiß.
Unterzeile: 1px rgba(255,255,255,0.25) oben, margin-top --block, 13px rgba(255,255,255,0.75): "© Jahr Pandas Wok Perchtoldsdorf" links, "Allergeninformationen an allen Buffetstationen" rechts.
Kein Riesen-Schriftzug, kein Siegel. Fokus-Ring im Footer: weiß.
Mobil: 1 Spalte, s-6 zwischen Blöcken.

### Buttons
.btn: min-height 48px, padding 0 24px, 15px/600, radius 2px, 1px Border, keine Pfeil-Icons (Arrow-Icons überall entfernen; nur Telefon-/IG-Icons bleiben).
- Primär: bg --red, Text #fff → Hover bg --red-hover.
- Outline hell: Border --ink, Text --ink → Hover bg --ink, Text #fff.
- Outline dunkel: Border rgba(242,239,234,0.5), Text --on-dark → Hover bg --on-dark, Text --ink.
- Klein (Nav): min-height 40px, padding 0 18px, 14px.
Text-Link: underline 1px, offset 4px, 500; Hover --red (hell) bzw. --copper (dunkel).
Focus-visible: 2px solid --red, offset 3px (auf Rot/Dunkel: --on-dark).

### Reservierungs-Drawer (Funktion unverändert)
Panel weiß, width min(480px, 100%), padding s-6. Kopf: h2 "Tisch reservieren" 24px/500 normal geschrieben, 1px --line darunter, Close-Button 44px rund mit 1px --line.
Labels 14px/500. Inputs: min-height 48px, bg --sand, Border 1px #D6D1CA, radius 2px; Focus Border --ink + 0 0 0 3px rgba(204,36,25,0.15). Fehler: Border + Text --red, 13px.
Submit: Primär-Button volle Breite. Erfolg: Logo 64px statt Siegel, h3 24px/500 "Danke, Name.", Text 16px, Button Outline hell "Fertig".

### Mobile-Bar (≤760, Funktion unverändert)
bg --bg, 1px --line oben, Grid 1fr 1.4fr, gap s-2, padding s-2 s-4 + safe-area. Links Outline hell mit Telefon-Icon "Anrufen", rechts Primär "Tisch reservieren", beide 48px.

## Bildzuordnung
- hall.jpg → Hero rechts (object-position center 75%)
- buffet.jpg, sushi.jpg, panda.jpg → Galerie (in dieser Reihenfolge)
- building.jpg → Familie & Feiern (alt: "Das Team von Pandas Wok vor dem Restaurant")
- logo.png → Nav 40px, Hero 120px/72px, Footer 48px, Drawer-Erfolg 64px, Favicon
- NICHT verwenden: lounge.jpg, ceiling.jpg (zu niedrig aufgelöst), assets/reel_*.jpg, cyber_panda_statue.jpg, vip_lounge_cocktails.jpg, futuristic_ceiling.jpg, entrance_team.jpg, assets/_orig/*
- Keine Figcaptions, keine Nummerierung.

## Texte
Du-Form beibehalten. Fakten statt Pointen, keine Ausrufezeichen, keine rhetorischen Fragen, kein "Hunger?". Pro Sektion max. 2 Sätze Fließtext. Überschriften schlicht ("Preise", "Was am Buffet steht", "Für Familien und Feiern").

## No-Gos
1. Keine Display-Typo-Show: kein Uppercase, keine condensed Fonts, keine Serifen-Kursiv-Einschübe, nichts über 64px, keine Kicker mit roten Quadraten, keine nummerierten Captions/Listen.
2. Keine Deko-Elemente und Effekte: kein Paper-Grain, keine Siegel, keine Rotationen, keine Schatten, keine Punktlinien-Menükarte, keine Fact-Leiste, keine Clip-Path-/Slide-Reveals, keine Hover-Verschiebungen, kein Graustufen-Map-Trick, kein Closing-Riesenwort, kein Footer-Riesenwort.
3. Keine Card-Grids und keine "hervorgehobene" Variante: die zwei Preisboxen sind identisch, alles andere sind Listen mit Haarlinien, keine Boxen.

## Technischer Hinweis
Preisrechner fällt weg: In app.js den Calculator-Teil (segmented/stepper/calcReserve/calcTotal) entfernen – `document.getElementById('calcReserve').addEventListener` läuft sonst ungeschützt auf null und bricht das restliche Script (Drawer, Status, Reveal). Klassen .seal, .facts, .menu-card, .closing, .footer-word, .hero-title-Zeilenanimation, figcaption-Styles und die Fonts Archivo/Instrument Serif/Noto Serif SC ersatzlos löschen.
