import pkg from "~/package.json"

export default defineNuxtPlugin(() => {
  const key = "faceb-app-version"
  const current = pkg.version
  const cookie = useCookie(key, {watch: true})
  const isNew = !cookie.value || current !== cookie.value

  if (isNew) {
    cookie.value = current
  }

  return {
    provide: {
      version: {
        current,
        previous: cookie.value,
        isNew,
      },
    },
  }
})
