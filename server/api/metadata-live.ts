/* eslint-disable @typescript-eslint/no-explicit-any */
import { decode } from "html-entities"
import { log } from "~~/utils/console"

interface IceCastResponse {
  icestats: {
    source: Record<string, any>
  }
  [key: string]: any
}

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  const getLiveInfo = async (): Promise<any> => {
    log("getLiveInfo", config.public.streamApiUrl)
    const result: any = await $fetch(config.public.streamApiUrl, {
      mode: "no-cors",
      responseType: "json",
    })
    return {
      ...(result ?? {}),
      current: {
        ...(result?.current ?? {}),
        name: result?.current?.name ? decode(result?.current?.name) : result?.current?.name,
      },
    }
  }

  const getFlux = async (): Promise<any> => {
    log("getFlux", config.public.streamApiUrlFallback)
    const res: IceCastResponse = await $fetch(config.public.streamApiUrlFallback, {
      mode: "no-cors",
      responseType: "json",
    })
    const source = res.icestats.source
    return {
      server_name: source?.server_name,
      listeners: source?.listeners,
      description: source?.server_description,
      title: decode(source?.title),
      url: source?.server_url,
    }
  }

  return new Promise(async (resolve, reject) => {
    try {
      log("METADATA LIVE API CALL")
      const liveInfo = await getLiveInfo()
      const flux = await getFlux()
      const infos = liveInfo?.current?.name ?? flux.title
      const [authors, name] = infos.split(" - ")
      log("Query:", { authors, name })
      const metadata = await $fetch("/api/metadata", {
        query: {
          authors,
          name,
        },
      })
      resolve({ metadata, liveInfo, flux })
    } catch (error) {
      reject(error)
    }
  })
})
