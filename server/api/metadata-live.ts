import he from "he";

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
    const result: any = await $fetch(config.public.streamApiUrl, {
      mode: "no-cors",
      responseType: "json",
    });
    return {
      ...(result ?? {}),
      current: {
        ...(result?.current ?? {}),
        name: he.decode(result?.current?.name ?? ""),
      },
    };
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
    return {
      server_name: source?.server_name,
      listeners: source?.listeners,
      description: source?.server_description,
      title: he.decode(source?.title),
      url: source?.server_url,
    };
  };

  return new Promise(async (resolve, reject) => {
    try {
      console.log("METADATA LIVE API CALL");
      const liveInfo = await getLiveInfo();
      const flux = await getFlux();
      const infos = liveInfo?.current?.name ?? flux.title;
      const [authors, name] = infos.split(" - ");
      console.log("Query:", { authors, name });
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
