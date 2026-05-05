'use client'

import { useState, useEffect } from 'react'
import type { Timetable, TimetableMonth } from '@/lib/timetable'
import { isClosedMonth, formatDateLabel, parseIsoDate } from '@/lib/timetable'

export default function RangeTimetable({ timetable }: { timetable: Timetable }) {
  const [today, setToday] = useState<Date | null>(null)

  useEffect(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    setToday(d)
  }, [])

  let nextOpenLabel: string | null = null
  if (today) {
    outer: for (const month of timetable.months) {
      if (isClosedMonth(month)) continue
      for (const entry of month.entries) {
        if (entry.status !== 'open') continue
        if (parseIsoDate(entry.isoDate) >= today) {
          nextOpenLabel = formatDateLabel(entry.isoDate)
          break outer
        }
      }
    }
  }

  function getMonthClass(month: TimetableMonth): string {
    if (isClosedMonth(month)) return 'timetable-month closed-month'
    if (!today) return 'timetable-month'
    const { entries } = month
    if (!entries.length) return 'timetable-month'
    const lastDate = parseIsoDate(entries[entries.length - 1].isoDate)
    if (lastDate < today) return 'timetable-month past-month'
    const firstDate = parseIsoDate(entries[0].isoDate)
    if (firstDate > today) return 'timetable-month'
    return 'timetable-month current-month'
  }

  function getEntryClass(isoDate: string, status: string): string {
    let cls = `timetable-entry ${status}`
    if (today && parseIsoDate(isoDate) < today) cls += ' past-entry'
    return cls
  }

  return (
    <div>
      <div className="timetable-next-open">
        <span className="tno-label">Next open date</span>
        <span className="tno-date">{nextOpenLabel ?? '—'}</span>
        <span className="tno-note">
          Always check the{' '}
          <a href="https://www.facebook.com/groups/1195200207197835/" target="_blank" rel="noopener">
            Facebook group
          </a>{' '}
          for weather closures
        </span>
      </div>
      <div className="range-timetable" data-year={timetable.year}>
        {timetable.months.map((month) => {
          if (isClosedMonth(month)) {
            return (
              <div key={month.month} className={getMonthClass(month)}>
                <h4 className="timetable-month-heading">{month.month}</h4>
                <p className="timetable-closed-note">{month.closedReason}</p>
              </div>
            )
          }
          return (
            <div key={month.month} className={getMonthClass(month)}>
              <h4 className="timetable-month-heading">{month.month}</h4>
              <div className="timetable-entries">
                {month.entries.map((entry) => (
                  <div key={entry.isoDate} className={getEntryClass(entry.isoDate, entry.status)}>
                    <span className="te-date">{formatDateLabel(entry.isoDate)}</span>
                    <span className="te-status">{entry.status === 'open' ? 'Open' : 'Closed'}</span>
                    {entry.reason && <span className="te-reason">{entry.reason}</span>}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
