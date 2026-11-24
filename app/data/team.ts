/**
 * TEAM-DATEN
 * ----------
 * Hier pflegt ihr Spieler, Werte und Verletzungen.
 * - Fotos: Datei nach /public/players/ legen und `photo: '/players/name.jpg'` setzen
 *   (Hochformat 4:5, ca. 1080×1350 px, JPG ~200–400 KB).
 *   `photoPosition` legt fest, welcher Bildteil im breiteren Desktop-Kartenformat sichtbar bleibt.
 *   Ohne Foto wird ein Platzhalter gezeigt.
 * - Werte: 0–100
 * - Verletzung: `injury` setzen, bei Genesung einfach entfernen (oder `until` in der Vergangenheit).
 */

export type Hand = "rechts" | "links";
export type Side = "Drive" | "Revés" | "Flexibel";

export interface PlayerStats {
  power: number;
  ausdauer: number;
  spielintelligenz: number;
  spritzigkeit: number;
  technik: number;
}

export interface Injury {
  /** z. B. "Zerrung Wade" */
  type: string;
  /** ISO-Datum, seit wann */
  since: string;
  /** ISO-Datum, voraussichtliches Comeback */
  until: string;
}

export interface Player {
  id: string;
  number: number;
  firstName: string;
  lastName: string;
  nickname: string;
  photo?: string;
  /** Bildausschnitt (CSS object-position), z. B. "50% 20%" – damit das Gesicht im Kartenformat sichtbar bleibt */
  photoPosition?: string;
  hand: Hand;
  side: Side;
  signatureShot: string;
  since: number;
  stats: PlayerStats;
  injury?: Injury;
}

export const statLabels: Record<keyof PlayerStats, string> = {
  power: "Power",
  ausdauer: "Ausdauer",
  spielintelligenz: "Spielintelligenz",
  spritzigkeit: "Spritzigkeit",
  technik: "Technik",
};

export const team: Player[] = [
  {
    id: "roman",
    photo: "/players/roman.jpg",
    photoPosition: "50% 0%",
    number: 1,
    firstName: "Roman",
    lastName: "Kämpfer",
    nickname: "The Wall",
    hand: "rechts",
    side: "Revés",
    signatureShot: "Bandeja",
    since: 2025,
    stats: {
      power: 78,
      ausdauer: 88,
      spielintelligenz: 91,
      spritzigkeit: 74,
      technik: 84,
    },
  },
  {
    id: "matthias",
    photo: "/players/matthias.jpg",
    photoPosition: "50% 22%",
    number: 2,
    firstName: "Matthias",
    lastName: "Hofer",
    nickname: "Smash Machine",
    hand: "rechts",
    side: "Drive",
    signatureShot: "Por Tres",
    since: 2025,
    stats: {
      power: 94,
      ausdauer: 72,
      spielintelligenz: 76,
      spritzigkeit: 81,
      technik: 79,
    },
  },
  {
    id: "miša",
    photo: "/players/misa.jpg",
    photoPosition: "50% 15%",
    number: 5,
    firstName: "Miša",
    lastName: "Kaspar",
    nickname: "Mozart",
    hand: "rechts",
    side: "Revés",
    signatureShot: "Víbora",
    since: 2025,
    stats: {
      power: 82,
      ausdauer: 79,
      spielintelligenz: 85,
      spritzigkeit: 77,
      technik: 88,
    },
    injury: {
      type: "Riss Achillessehne",
      since: "2026-09-20",
      until: "2027-03-31",
    },
  },
  {
    id: "claude",
    photo: "/players/claude.jpg",
    photoPosition: "70% 0%",
    number: 3,
    firstName: "Claude",
    lastName: "Meyer",
    nickname: "Speedy",
    hand: "rechts",
    side: "Drive",
    signatureShot: "Chiquita",
    since: 2025,
    stats: {
      power: 68,
      ausdauer: 93,
      spielintelligenz: 80,
      spritzigkeit: 95,
      technik: 76,
    },
  },
  {
    id: "patrick",
    photo: "/players/patrick.jpg",
    photoPosition: "50% 14%",
    number: 4,
    firstName: "Patrick",
    lastName: "Belser",
    nickname: "Tower",
    hand: "rechts",
    side: "Flexibel",
    signatureShot: "Globo",
    since: 2025,
    stats: {
      power: 71,
      ausdauer: 77,
      spielintelligenz: 95,
      spritzigkeit: 70,
      technik: 90,
    },
  },
];

export const overall = (s: PlayerStats) =>
  Math.round(
    (s.power + s.ausdauer + s.spielintelligenz + s.spritzigkeit + s.technik) /
      5,
  );

export const isInjured = (p: Player, now: number) =>
  !!p.injury && new Date(`${p.injury.until}T23:59:59`).getTime() > now;

/** Fitte Spieler zuerst, verletzte ans Ende (Reihenfolge innerhalb der Gruppen bleibt erhalten). */
export const sortFitFirst = (players: Player[], now: number) =>
  [...players].sort(
    (a, b) => Number(isInjured(a, now)) - Number(isInjured(b, now)),
  );
