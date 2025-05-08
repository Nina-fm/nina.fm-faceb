export default defineEventHandler((event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  }
  setHeaders(event, headers)
})
