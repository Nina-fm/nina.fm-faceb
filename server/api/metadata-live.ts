export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const getLiveInfo = async (): Promise<any> => {
    console.log("getLiveInfo", config.public.streamApiUrl);
    return await $fetch(config.public.streamApiUrl, {
      mode: "no-cors",
      responseType: "json",
    });
  };

  return new Promise(async (resolve, reject) => {
    try {
      console.log("METADATA LIVE API CALL");
      const liveInfo = await getLiveInfo();
      console.log({ liveInfo });
      const [authors, name] = liveInfo.current.name.split(" - ");
      console.log({ authors, name });
      const metadata = await $fetch("/api/metadata", {
        query: {
          authors,
          name,
        },
      });
      resolve({ metadata, liveInfo });
    } catch (error) {
      reject(error);
    }
  });
});
