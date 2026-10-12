# Team-Learnings (nur der CEO schreibt hier, nur anhängen)

## 2026-10-11 — PandaWok Redesign gegen "AI-Look" (Ref. worldofasia.restaurant/woa)

**Entscheidung:** ✅ Ship it (Staging/Vorschau für den Kunden). Go-Live erst nach den Pflichtpunkten unten.

**Was gut lief:**
- Visionär-Kernidee war richtig: strenge Fotoauswahl, ehrliche Kurztexte und nüchterne Preistabellen wirken stärker gegen "AI-Look" als Layout-Tricks. Das gilt als Standard für Restaurant- und Lokalseiten.
- Head of Design hat Farben und Details aus der echten Location abgeleitet (Anthrazit, Kupfer, Fassadenrot, Panda am Eingang), nicht aus Template-Gold. Das hat ein Brief mit klaren Verboten gesichert (keine Uppercase, keine Schatten, nur Fade).
- Der Brief nannte den bekannten app.js-Bug (calcReserve null) vorab. Dadurch gab es keinen Rechner-Folgefehler. Senior Dev hat Null-Checks in alle init*-Funktionen gesetzt.
- Der Reviewer fand echte Bugs, die QA nicht fand (Scroll-Lock, Datumsvalidierung, 320px). Der Fix-Loop mit 1 Runde reichte.

**Was beim nächsten Mal anders laufen soll:**
- QA-Tester: Das PASS war zu optimistisch. Mindestbreite 320px testen, nicht 375px. Bei Formularen mit `novalidate` immer Grenzfälle prüfen (leeres, ungültiges, vergangenes Datum). Bei Drawer/Modal prüfen, ob der Body wirklich nicht scrollt (echter Scroll-Versuch, nicht nur CSS lesen).
- Senior Dev: `overflow-x: clip` auf html verhindert, dass body-overflow zum Viewport durchgereicht wird. Scroll-Lock deshalb auf `html` setzen. Nie `overflow:hidden` auf body setzen, wenn ein sticky Header existiert (body wird sonst zum Scrollcontainer). Bei `novalidate` Datum und Pflichtfelder selbst in JS validieren. Mobile-Bars mit `nowrap` nicht in 1fr-Grids ohne 320px-Check bauen.
- Senior Dev: Die `.js`-Klasse nicht inline setzen, wenn Inhalte ohne JS auf opacity 0 stehen bleiben. Reveal braucht einen No-JS- oder Fehler-Fallback.
- Senior Dev/Visionär: Keine Erfolgsmeldungen ("bei uns angekommen"), solange kein Backend existiert. Ehrliche Formulierung wählen, z. B. Mailto oder "Anfrage vorbereitet".
- Visionär/Design: Bei Restaurant-Projekten in AT/DE von Anfang an DSGVO einplanen. Fonts selbst hosten, Karte per Klick-zum-Laden, Impressum und Datenschutz nicht als Platzhalter ausliefern. Das gehört in den Brief und nicht erst ins Review.
- Texte: Werbetexter-Pointen und Wiederholungen ("laufend frisch" doppelt) vermeiden. Konkrete Angaben (Austern, Königsgarnelen, Schokobrunnen) als "vom Kunden zu bestätigen" markieren, statt sie zu behaupten.
- Orchestrator: Anrede (Du/Sie) vor dem Visionär-Lauf aus dem Auftrag festlegen, damit er sie nicht vorschlägt und dann korrigiert werden muss. Eine Kundenkritik nach einem Spacing-Umbau ("AI-Look") ist ein Signal für frühe Stilfragen: Look-Referenz und Verbotsliste vor dem ersten Umbau klären, sonst wird doppelt gebaut.

**Technische Notizen für später:**
- Spacing-System: --s-1..--s-8, --section-y, --block, --grid-gap, --card-pad. Doppelte Paddings zwischen gleichfarbigen Sektionen werden kollabiert. Wrap 1200, Radius 2px.
- Typografie: Montserrat 300–600, keine Uppercase, `text-wrap: balance`.
- Kontrast: Footer-Unterzeile auf Rot braucht opacity ≥ 0.88 für AA.
- `env(safe-area-inset-*)` wirkt nur mit `viewport-fit=cover`. og:image braucht eine absolute URL.
- Offene Punkte vor Go-Live: Impressum/Datenschutz, Form-Backend, Google Fonts selbst hosten, Map-Consent, hochauflösende Fotos (hall.jpg 1242px wird ab ~1440px hochskaliert), ungenutzte verbotene Assets (Reel-Screenshots, lounge, ceiling) aus assets löschen, Fokus-Reihenfolge im Mobile-Menü (Menü schließt nicht beim Öffnen des Drawers), Feiertage im Datum nicht erkannt.
- Fix-Loops: A = 0, B = 1 (plus 1 Mini-Fix durch den Orchestrator). Ein Reviewer-Reject nach QA-PASS bedeutet, dass die QA-Checkliste um 320px, Scroll-Lock und Formular-Grenzfälle erweitert werden muss.
