import { storeToRefs } from "pinia";

export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn } = storeToRefs(useAuthStore());

  if (!isLoggedIn.value && to.name !== "login") {
    console.log("redirect to login");
    return navigateTo("/login");
  }
});
