export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = String(query?.url)

  return new Promise((resolve) => {
    $fetch(url, {
      mode: "no-cors",
      responseType: "json",
    })
      .then((result) => {
        resolve(result)
      })
      .catch(() => {
        resolve(null)
      })
  })
})
