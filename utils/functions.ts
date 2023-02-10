import { DateTime } from "luxon";

export const isEmpty = (obj: Object | null) => {
  if (obj === null || obj === undefined) return true;
  return JSON.stringify(obj) === JSON.stringify(Object.create(null));
};

export const formatDate = (date: string) =>
  useDateFormat(date, "DD/MM/YYYY", { locales: "fr-FR" }).value;

export const generateYears = (sinceYear: number = 1950) => {
  const years = [];
  let dateStart = DateTime.now();
  const dateEnd = DateTime.fromObject({
    ...dateStart.toObject(),
    year: sinceYear,
  });
  while (dateEnd.diff(dateStart, "years").years <= 0) {
    years.push(dateStart.toFormat("yyyy"));
    dateStart = dateStart.minus({ years: 1 });
  }
  return years;
};

export const findAuthorNames = (str: string) =>
  str
    .replaceAll(" & ", ", ")
    .replaceAll(" et ", ", ")
    .replaceAll(" and ", ", ")
    .replaceAll(" vs ", ", ")
    .replaceAll(" feat ", ", ")
    .replaceAll(" feat. ", ", ")
    .split(", ");
