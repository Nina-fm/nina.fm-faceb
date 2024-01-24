export default defineNuxtRouteMiddleware(() => {
  const user = useSupabaseUser()

  setTimeout(() => {
    if (!user.value) {
      navigateTo("/login")
    }
  }, 1000)
})
