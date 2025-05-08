import { DateTime } from 'luxon'
import type { AnyFn, Obj } from '~/types/supatypes'

export const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))

export const uniqid = (): string => {
  const dateStr = Date.now().toString(36) // convert num to base 36 and stringify

  const randomStr = Math.random().toString(36).substring(2, 8) // start at index 2 to skip decimal point

  return `${dateStr}-${randomStr}`
}

export const getPercent = (count: number, total: number): number => Math.ceil((count * 100) / total)

export const isEmpty = (obj: Obj | null) => {
  if (obj === null || obj === undefined) return true
  return JSON.stringify(obj) === JSON.stringify(Object.create(null))
}

export const formatDate = (date: string) => useDateFormat(date, 'DD/MM/YYYY', { locales: 'fr-FR' }).value

export const generateYearsSince = (sinceYear = 1950) => {
  const years = []
  let dateStart = DateTime.now()
  const dateEnd = DateTime.fromObject({
    ...dateStart.toObject(),
    year: sinceYear,
  })
  while (dateEnd.diff(dateStart, 'years').years <= 0) {
    years.push(dateStart.toFormat('yyyy'))
    dateStart = dateStart.minus({ years: 1 })
  }
  return years
}

export const findAuthorNames = (str: string) =>
  str
    .replaceAll(' & ', ', ')
    .replaceAll(' et ', ', ')
    .replaceAll(' and ', ', ')
    .replaceAll(' vs ', ', ')
    .replaceAll(' feat ', ', ')
    .replaceAll(' feat. ', ', ')
    .replaceAll(' ft ', ', ')
    .replaceAll(' ft. ', ', ')
    .split(', ')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sequentialAsync = (values: any[], callback: AnyFn) =>
  values.reduce(
    async (acc, value) => {
      const resultsObject = await acc
      try {
        const result = await callback(value)
        return {
          ...resultsObject,
          results: [...resultsObject.results, result],
        }
      } catch (error) {
        return {
          ...resultsObject,
          errors: [...resultsObject.errors, error],
        }
      }
    },
    Promise.resolve({
      results: [],
      errors: [],
    }),
  )
