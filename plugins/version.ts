import pkg from "~~/package.json"

export default defineNuxtPlugin(() => {
  const key = "faceb-app-version"
  const current = pkg.version
  const previous = localStorage.getItem(key)
  const isNew = !previous || current !== previous

  if (isNew) {
    localStorage.setItem(key, current)
  }

  return {
    provide: {
      version: {
        current,
        previous,
        isNew,
      },
    },
  }
})
