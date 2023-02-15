import { AnyFn } from "~~/types/supatypes";
import { DateTime } from "luxon";

export const getPercent = (count: number, total: number): number =>
  Math.ceil((count * 100) / total);

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

export const isValidImageUrl = (url: string): boolean => {
  const regex = /https?:\/\/.*\.(png|gif|webp|jpeg|jpg|bmp|svg)/gi;
  return regex.test(url);
};

export const getFileStringFromBuffer = (file: any) => {
  const reader = new FileReader();
  const result: { data?: string | null; filename?: string | null } = {
    data: null,
    filename: null,
  };
  reader.onload = (e: ProgressEvent<FileReader>) => {
    if (!(e.target?.result instanceof ArrayBuffer)) {
      result.data = e.target?.result;
    }
  };
  reader.readAsDataURL(file);
  result.filename = file.name;
  return result;
};

export const fileToBase64 = (file: File | Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.readAsDataURL(file);
    reader.onerror = reject;
  });

export const getDataFromUrl = async (url: string): Promise<string | null> => {
  return await $fetch(`/api/base64Image?url=${url}`);
};

export const sequentialAsync = (values: any[], callback: AnyFn) =>
  values.reduce(
    async (acc, value) => {
      const resultsObject = await acc;
      try {
        const result = await callback(value);
        return {
          ...resultsObject,
          results: [...resultsObject.results, result],
        };
      } catch (error) {
        return {
          ...resultsObject,
          errors: [...resultsObject.errors, error],
        };
      }
    },
    Promise.resolve({
      results: [],
      errors: [],
    })
  );
