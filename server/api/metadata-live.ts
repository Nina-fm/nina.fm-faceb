import { jsonp } from "vue-jsonp";

interface IceCastResponse {
  icestats: {
    source: Record<string, any>;
  };
  [key: string]: any;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const getLiveInfo = async (): Promise<any> => {
    console.log("getLiveInfo", config.public.streamApiUrl);
    return await $fetch(config.public.streamApiUrl, {
      mode: "no-cors",
      responseType: "json",
    });
  };

  const getFlux = async (): Promise<any> => {
    console.log("getFlux", config.public.streamApiUrlFallback);
    const res: IceCastResponse = await $fetch(
      config.public.streamApiUrlFallback,
      {
        mode: "no-cors",
        responseType: "json",
      }
    );
    const source = res.icestats.source;
    const [artist, title] = source?.title.split(" - ");
    return {
      server_name: source?.server_name,
      listeners: source?.listeners,
      description: source?.server_description,
      artist,
      title,
      bitrate: "",
      url: source?.server_url,
    };
  };

  return new Promise(async (resolve, reject) => {
    try {
      console.log("METADATA LIVE API CALL");
      const liveInfo = await getLiveInfo();
      console.log({ liveInfo });
      const flux = await getFlux();
      const [authors, name] = liveInfo.current.name.split(" - ");
      console.log({ authors, name });
      const metadata = await $fetch("/api/metadata", {
        query: {
          authors,
          name,
        },
      });
      resolve({ metadata, liveInfo, flux });
    } catch (error) {
      reject(error);
    }
  });
});
