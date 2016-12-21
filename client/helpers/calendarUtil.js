import moment from 'moment'

import { chunk } from './util'

export const getColor = (id) => {
  const colors = [
    '#B0E4FD ',
    '#FDC5C0',
    '#E1BBE8 ',
    '#C7E7C8 ',
    '#FFFAC0 ',
    '#FFDFAE ',
    '#D6CBC6 ',
    '#E1E1E1 ',
    '#CED7DC',
  ]
  return (id) ? colors[id % colors.length] : colors[0]
}

export const getNumDaysInView = (view) => {
  switch (view) {
    case '4_DAY':
      return 4
    case 'WEEK':
      return 7
    case '2_WEEK':
      return 14
    case 'MONTH':
    default:
      return 35
  }
}

export const isThisMonth = (refDate, otherDate) => {
  const ref = moment(refDate)
  const day = moment(otherDate)
  return ref.month() === day.month() && ref.year() === day.year()
}

const defaultNumDays = 35

export function getDays(refDate, numDays = defaultNumDays) {
  if (numDays <= 4) return [...Array(numDays).keys()].map(offset => moment(refDate).add(offset, 'd').format())
  if (numDays <= 10) return [...Array(numDays).keys()].map(offset => moment(refDate).day(offset).format())
  const numWeeks = Math.ceil(numDays / 7)
  const correctedNumDays = numWeeks * 7

  // chunks days into week arrays of day arrays
  return [...Array(correctedNumDays).keys()].map(i => i - moment(refDate).date())
                                   .map(offset => moment(refDate).day(offset).format())
}

export function getChunkedDays(refDate, numDays = defaultNumDays) {
  // if numDays < 10, create a week view with dayOfTheWeek offset
  const days = getDays(refDate, numDays)
  if (numDays <= 10) return [days]
  // chunks days into week arrays of day arrays
  return chunk(days, 7)
}

export function getOrderedMonthArray(date) {
  return [...Array(12).keys()].map((month, index) => moment(date).add(index, 'M'))
}
