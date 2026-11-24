import { cancellations, training, venue } from '~/data/schedule'

export interface Session {
  key: string
  start: Date
  end: Date
  cancelled?: string
}

const pad = (n: number) => String(n).padStart(2, '0')
export const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export function sessionFor(day: Date): Session {
  const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), training.start.h, training.start.m)
  const end = new Date(day.getFullYear(), day.getMonth(), day.getDate(), training.end.h, training.end.m)
  const key = isoDate(start)
  return { key, start, end, cancelled: cancellations.find((c) => c.date === key)?.reason }
}

export const isTrainingDay = (d: Date) => d.getDay() === training.weekday

/** Nächste n Termine ab `now` (laufender Termin zählt mit). */
export function upcomingSessions(now: number, n = 6): Session[] {
  const out: Session[] = []
  const d = new Date(now)
  d.setHours(0, 0, 0, 0)
  while (!isTrainingDay(d)) d.setDate(d.getDate() + 1)
  while (out.length < n) {
    const s = sessionFor(d)
    if (s.end.getTime() > now) out.push(s)
    d.setDate(d.getDate() + 7)
  }
  return out
}

export function nextActiveSession(now: number): Session {
  return upcomingSessions(now, 12).find((s) => !s.cancelled)!
}

/** Gemeinsame "Jetzt"-Zeit: SSR-Wert wird übernommen, danach tickt die Uhr im Browser. */
export function useNow(interval = 1000) {
  const now = useState('now', () => Date.now())
  let timer: ReturnType<typeof setInterval> | undefined
  onMounted(() => {
    now.value = Date.now()
    timer = setInterval(() => (now.value = Date.now()), interval)
  })
  onBeforeUnmount(() => clearInterval(timer))
  return now
}

export const fmtDay = (d: Date) => d.toLocaleDateString('de-CH', { weekday: 'short', day: '2-digit', month: '2-digit' })
export const fmtLong = (d: Date) =>
  d.toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
export const fmtTime = (d: Date) => d.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })

/* ---------- Kalender-Export ---------- */

const icsStamp = (d: Date) =>
  `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`

export function buildIcs(): string {
  const first = new Date(training.firstDate)
  while (!isTrainingDay(first)) first.setDate(first.getDate() + 1)
  const s = sessionFor(first)
  const now = new Date()
  const utc = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const exdates = cancellations.map((c) => `EXDATE;TZID=Europe/Zurich:${icsStamp(sessionFor(new Date(c.date)).start)}`)
  const loc = venue.full.replace(/,/g, '\\,')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Padel Boys//Training//DE',
    'CALSCALE:GREGORIAN',
    'BEGIN:VTIMEZONE',
    'TZID:Europe/Zurich',
    'BEGIN:DAYLIGHT',
    'TZOFFSETFROM:+0100',
    'TZOFFSETTO:+0200',
    'TZNAME:CEST',
    'DTSTART:19700329T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
    'END:DAYLIGHT',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0200',
    'TZOFFSETTO:+0100',
    'TZNAME:CET',
    'DTSTART:19701025T030000',
    'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    'UID:padel-boys-weekly-training',
    `DTSTAMP:${utc}`,
    `DTSTART;TZID=Europe/Zurich:${icsStamp(s.start)}`,
    `DTEND;TZID=Europe/Zurich:${icsStamp(s.end)}`,
    'RRULE:FREQ=WEEKLY;BYDAY=TU',
    ...exdates,
    'SUMMARY:Padel Boys – Dienstagsspiel',
    `LOCATION:${loc}`,
    'DESCRIPTION:Vamos! Jeden Dienstag 18:30–20:00.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function downloadIcs() {
  const blob = new Blob([buildIcs()], { type: 'text/calendar;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'padel-boys-dienstag.ics'
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

export function googleCalendarUrl(now: number) {
  const s = nextActiveSession(now)
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Padel Boys – Dienstagsspiel',
    dates: `${icsStamp(s.start)}/${icsStamp(s.end)}`,
    ctz: 'Europe/Zurich',
    location: venue.full,
    recur: 'RRULE:FREQ=WEEKLY;BYDAY=TU',
  })
  return `https://calendar.google.com/calendar/render?${p.toString()}`
}
