const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function getFormattedDate(date: Date, prefomattedDate: boolean | string = false, hideYear = false) {
  const day = date.getDate()
  const month = MONTH_NAMES[date.getMonth()]
  const year = date.getFullYear()
  const hours = date.getHours()
  let minutes: string | number = date.getMinutes()

  if (minutes < 10) {
    // Adding leading zero to minutes
    minutes = `0${minutes}`
  }

  if (prefomattedDate) {
    // Today at 10:20
    // Yesterday at 10:20
    return `${prefomattedDate} at ${hours}:${minutes}`
  }

  if (hideYear) {
    // 10. January at 10:20
    return `${day}. ${month} at ${hours}:${minutes}`
  }

  // 10. January 2017. at 10:20
  return `${day}. ${month} ${year}. at ${hours}:${minutes}`
}

export function timeAgo(dateParam: string) {
  if (!dateParam) {
    return null
  }

  const date = new Date(dateParam)
  const DAY_IN_MS = 86400000 // 24 * 60 * 60 * 1000
  const today = new Date()
  const yesterday = new Date(today.getTime() - DAY_IN_MS)
  const seconds = Math.round((today.getTime() - date.getTime()) / 1000)
  const minutes = Math.round(seconds / 60)
  const isToday = today.toDateString() === date.toDateString()
  const isYesterday = yesterday.toDateString() === date.toDateString()
  const isThisYear = today.getFullYear() === date.getFullYear()

  if (seconds < 5) {
    return 'now'
  } else if (seconds < 60) {
    return `${seconds} seconds ago`
  } else if (seconds < 90) {
    return 'about a minute ago'
  } else if (minutes < 60) {
    return `${minutes} minutes ago`
  } else if (isToday) {
    return `${Math.trunc(minutes / 60)} hours ago`
  } else if (isYesterday) {
    return getFormattedDate(date, 'Yesterday') // Yesterday at 10:20
  } else if (isThisYear) {
    return getFormattedDate(date, false, true) // 10. January at 10:20
  }

  return getFormattedDate(date) // 10. January 2017. at 10:20
}

export function decodeHtml(str: string) {
  const txt = document.createElement('textarea')
  txt.innerHTML = str
  return txt.value
}

export const perf = {
  now: () => (performance?.now ? performance.now() : new Date().getTime()),
}

type ServerTimingType = {
  timings: {
    [key: string]: {
      start: number
      end?: number
      dur?: number
      desc?: string
    }
  }
  start: () => void
  measure: (name: string, desc?: string) => void
  setHeader: () => string
}

export const serverTiming: ServerTimingType = {
  timings: {
    total: {
      start: 0
    }
  },
  start: () => {
    serverTiming.timings = {
      total: {
        start: perf.now(),
      },
    }
  },
  measure: (name, desc) => {
    const now = perf.now()
    if (serverTiming.timings[name] && serverTiming.timings[name]?.start) {
      // @ts-expect-error object not undefined
      serverTiming.timings[name].end = now 
      // @ts-expect-error object not undefined
      serverTiming.timings[name].dur = now - serverTiming.timings[name].start
      // @ts-expect-error object not undefined
      if (desc) serverTiming.timings[name].desc = desc
    } else {
      serverTiming.timings[name] = { start: now }
      // @ts-expect-error object not undefined
      if (desc) serverTiming.timings[name].desc = desc
    }
  },
  setHeader: () => {
    serverTiming.measure('total')
    return Object.entries(serverTiming.timings)
      .map(([name, measurements]) => {
        return `${name};${
          measurements.desc ? `desc="${measurements.desc}";` : ''
        }dur=${measurements.dur}`
      })
      .join(',')
  },
}
