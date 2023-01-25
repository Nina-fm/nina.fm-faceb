import { storeToRefs } from "pinia";

export default defineNuxtRouteMiddleware((to, from) => {
  const allowedPaths = ["login", "set-password", "reset-password"];
  const { isLoggedIn } = storeToRefs(useAuthStore());

  if (!isLoggedIn.value && !allowedPaths.includes(String(to.name))) {
    return navigateTo("/login");
  }
});
