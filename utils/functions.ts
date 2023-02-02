import { DateTime } from "luxon";

export const isEmpty = (obj: Object | null) => {
  if (obj === null || obj === undefined) return true;
  return JSON.stringify(obj) === JSON.stringify(Object.create(null));
};

export const generateYears = () => {
  const years = [];
  let dateStart = DateTime.now();
  const dateEnd = DateTime.fromObject({ ...dateStart.toObject(), year: 1980 });
  while (dateEnd.diff(dateStart, "years").years <= 0) {
    years.push(dateStart.toFormat("yyyy"));
    dateStart = dateStart.minus({ years: 1 });
  }
  return years;
};
