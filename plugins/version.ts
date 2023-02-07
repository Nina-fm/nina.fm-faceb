import pkg from "~~/package.json";
import { useStorage } from "@vueuse/core";

export default defineNuxtPlugin((nuxtApp) => {
  const current = pkg.version;
  const versionStored = useStorage("faceb-nina-version", current);

  const version = {
    current,
    previous: versionStored.value,
    isNew: current !== versionStored.value,
  };

  console.log({ version });

  return {
    provide: {
      version,
    },
  };
});
