export const log = (...params: any) => {
  const config = useRuntimeConfig();
  if (process.env.NODE_ENV === "development" && config.debug) {
    console.log(...params);
  }
};
