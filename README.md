# Padel Boys – Website

Onepager mit Nuxt 4, Tailwind CSS 4 und GSAP (ScrollTrigger, ScrollSmoother, SplitText).

## Starten

```bash
npm install
npm run dev        # http://localhost:3000
npm run generate   # statische Seite → .output/public (lokal) bzw. dist (auf Netlify)
```

**Netlify:** Konfiguration steht in `netlify.toml` (Build `npm run generate`, Publish `dist`) und hat Vorrang vor den Einstellungen in der Netlify-Oberfläche.

## Inhalte pflegen

| Was | Wo |
| --- | --- |
| Spieler, Werte, Hand, Seite, Verletzungen | `app/data/team.ts` |
| Trainingszeit, Ort, Ausfälle (Ferien etc.) | `app/data/schedule.ts` |
| Spielerfotos | `public/players/` + `photo: '/players/name.jpg'` in `team.ts` (Hochformat 4:5) |

**Verletzung eintragen:** beim Spieler `injury: { type: 'Zerrung Wade', since: '2026-11-10', until: '2027-01-12' }` setzen.
Ist das `until`-Datum vorbei, gilt der Spieler automatisch wieder als fit. Die Verfügbarkeit im Kalender passt sich mit an.

**Ausfall eintragen:** in `cancellations` z. B. `{ date: '2026-12-29', reason: 'Festtage-Pause' }` – erscheint im Kalender,
in der Terminliste und als Ausnahme im `.ics`-Export.

> Die aktuellen Spielernamen und Werte sind Platzhalter.

## Schrift: Futura PT Condensed (Adobe Fonts)

Eingebunden über das Adobe-Fonts-Web-Projekt `jhk5uiw` (in `nuxt.config.ts`, überschreibbar per `NUXT_PUBLIC_TYPEKIT_ID` in `.env`).
Verwendet werden die Schnitte 400, 500, 700 und 800. Neue Schnitte im Adobe-Projekt hinzufügen – kein Code-Update nötig.
Damit die Schrift auf eurer Domain lädt, muss die Domain im Adobe-Web-Projekt eingetragen sein.

Fallback: **Barlow Condensed**, selbst gehostet über `@fontsource/barlow-condensed` (keine Verbindung zu Google).

## Farben

| Name | Hex |
| --- | --- |
| Pure White | `#FFFFFF` |
| Chinese Black | `#101010` |
| Navy Blue | `#002340` |
| Yellow-Green | `#DAFF02` |

Definiert als Tailwind-Tokens (`pb-white`, `pb-black`, `pb-navy`, `pb-lime`) in `app/assets/css/main.css`.
