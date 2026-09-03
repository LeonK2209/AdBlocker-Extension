# AdBlocker – Chrome Extension (Manifest V3)

Eine einfache Werbeblocker-Extension, die zwei Ansätze kombiniert:

1. **Netzwerk-Ebene** (`declarativeNetRequest`): blockiert Requests an
   bekannte Werbe-/Tracking-Domains (siehe `rules/ad_domains.json`).
2. **Element-Ebene** (`content.js` + `hide-ads.css`): blendet
   Werbe-Container aus, die trotz geblockter Domain noch als leerer
   Platzhalter im Layout stehen bleiben würden, und beobachtet das DOM
   auf dynamisch nachgeladene Werbung.

## Projektstruktur

```
adblocker-extension/
├── manifest.json          # Extension-Konfiguration (Manifest V3)
├── background.js          # Service Worker: Badge-Zähler, An/Aus-Schalter
├── content.js             # Läuft auf jeder Seite, entfernt Ad-Elemente
├── hide-ads.css           # CSS-Regeln zum Ausblenden von Ad-Containern
├── popup.html / popup.js  # Toolbar-Popup mit Schalter + Zähler
├── rules/
│   └── ad_domains.json    # Liste blockierter Werbe-/Tracking-Domains
└── icons/                 # Hier fehlen noch icon16.png, icon48.png, icon128.png
```

## Icons ergänzen (wichtig!)

Ich kann keine echten PNG-Bilddateien generieren. Du brauchst noch:
- `icons/icon16.png`
- `icons/icon48.png`
- `icons/icon128.png`

Am schnellsten: ein einfaches Logo bei z.B. Canva, Figma oder sogar mit
einem KI-Bildtool erstellen und in den drei Größen als PNG exportieren.
Ohne diese Dateien lässt sich die Extension zwar laden, aber Chrome zeigt
dann ein Platzhalter-Icon.

## Installation zum Testen (Entwicklermodus)

1. Chrome öffnen und zu `chrome://extensions` navigieren
2. Oben rechts **"Entwicklermodus"** aktivieren
3. Auf **"Entpackte Erweiterung laden"** klicken
4. Den Ordner `adblocker-extension` auswählen
5. Die Extension erscheint in der Toolbar – fertig zum Testen

## Wie erweitere ich die Filterliste?

`rules/ad_domains.json` enthält aktuell ~15 der bekanntesten
Werbe-Domains als Startpunkt. Für einen echten Vergleich mit
etablierten Blockern (uBlock Origin etc.) müsstest du deutlich mehr
Domains ergänzen – z.B. Einträge aus öffentlichen Listen wie EasyList
in das `declarativeNetRequest`-Format konvertieren. Manifest V3 erlaubt
bis zu 30.000 statische Regeln pro Ruleset.

Neue Domain hinzufügen: einfach ein neues Objekt mit fortlaufender
`id` in `rules/ad_domains.json` einfügen, z.B.:

```json
{
  "id": 16,
  "priority": 1,
  "action": { "type": "block" },
  "condition": {
    "urlFilter": "||beispiel-werbenetzwerk.com^",
    "resourceTypes": ["script", "image", "xmlhttprequest", "sub_frame"]
  }
}
```

## Bekannte Grenzen

- Manche Seiten erkennen Adblocker und zeigen eine Aufforderung, ihn
  zu deaktivieren ("Adblock-Detector") – das ist hier noch nicht
  gegen umgangen.
- Sehr aggressive/neue Werbenetzwerke, die nicht in der Domainliste
  stehen, werden nicht automatisch erkannt.
- Manche generischen CSS-Selektoren könnten in Einzelfällen auch
  normale (nicht-werbliche) Elemente treffen, deren Klassen/IDs
  zufällig ähnlich benannt sind. Bei Bedarf Selektoren in
  `hide-ads.css` und `content.js` verfeinern.
