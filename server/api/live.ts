import { log } from "~~/utils/console"

export default defineEventHandler((event) => {
  //   const config = useRuntimeConfig()
  console.log("call /api/live")
  return new Promise((resolve) => {
    let timerId: NodeJS.Timer | undefined
    const body = new ReadableStream({
      start(controller) {
        timerId = setInterval(() => {
          const msg = new TextEncoder().encode(`data: hello at ${new Date().toUTCString()}\r\n\r\n`)
          controller.enqueue(msg)
        }, 1000)
      },
      cancel() {
        if (typeof timerId === "number") {
          clearInterval(timerId)
        }
      },
    })

    resolve(body)
    //   new Response(body, {
    //     headers: {
    //       "Content-Type": "text/event-stream",
    //     },
    //   })
  })
})
