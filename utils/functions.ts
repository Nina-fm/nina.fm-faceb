export const isEmpty = (obj: Object | null) => {
  if (obj === null || obj === undefined) return true;
  return JSON.stringify(obj) === JSON.stringify(Object.create(null));
};
