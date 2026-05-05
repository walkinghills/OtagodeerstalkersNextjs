import { z } from 'zod'

const EntrySchema = z.object({
  isoDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(['open', 'closed']),
  reason: z.string().optional(),
})

const ClosedMonthSchema = z.object({
  month: z.string(),
  closedMonth: z.literal(true),
  closedReason: z.string(),
})

const RegularMonthSchema = z.object({
  month: z.string(),
  closedMonth: z.literal(false).optional(),
  entries: z.array(EntrySchema),
})

const MonthSchema = z.union([ClosedMonthSchema, RegularMonthSchema])

export const TimetableSchema = z.object({
  generated: z.string(),
  year: z.string(),
  months: z.array(MonthSchema),
})

export type Timetable = z.infer<typeof TimetableSchema>
export type TimetableMonth = z.infer<typeof MonthSchema>
export type ClosedMonth = z.infer<typeof ClosedMonthSchema>
export type RegularMonth = z.infer<typeof RegularMonthSchema>
export type TimetableEntry = z.infer<typeof EntrySchema>

export function isClosedMonth(m: TimetableMonth): m is ClosedMonth {
  return 'closedMonth' in m && m.closedMonth === true
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatDateLabel(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return `${DAY_NAMES[d.getDay()]} ${day} ${MONTH_NAMES[month - 1]}`
}

export function parseIsoDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day)
}
