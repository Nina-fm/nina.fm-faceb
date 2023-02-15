export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const url = String(query?.url);

  return new Promise((resolve, reject) => {
    $fetch(url, {
      mode: "no-cors",
      responseType: "json",
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(null);
      });
  });
});
