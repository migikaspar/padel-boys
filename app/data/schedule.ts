/**
 * TRAINING / SPIELPLAN
 * --------------------
 * Fester Termin jeden Dienstag 18:30–20:00 bei Padel Frenkendorf.
 * Ausfälle (Ferien, Feiertage …) unter `cancellations` eintragen.
 */

export const venue = {
  name: 'Padel Frenkendorf',
  street: 'Schützenstrasse 2',
  zip: '4402',
  city: 'Frenkendorf',
  get full() {
    return `${this.name}, ${this.street}, ${this.zip} ${this.city}`
  },
}

export const training = {
  /** 0 = Sonntag, 1 = Montag, 2 = Dienstag … */
  weekday: 2,
  start: { h: 18, m: 30 },
  end: { h: 20, m: 0 },
  firstDate: '2026-01-06',
}

export interface Cancellation {
  date: string // ISO, YYYY-MM-DD
  reason: string
}

export const cancellations: Cancellation[] = [
  { date: '2026-12-29', reason: 'Festtage-Pause' },
]
