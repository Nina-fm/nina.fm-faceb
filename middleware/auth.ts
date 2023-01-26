import { storeToRefs } from "pinia";

export default defineNuxtRouteMiddleware((to, from) => {
  const allowedPaths = ["login", "set-password", "reset-password"];
  const { isLoggedIn } = storeToRefs(useAuthStore());

  // console.log("middleware isLoggedIn", isLoggedIn.value);
  // console.log(
  //   "middleware allowed path",
  //   to.name,
  //   allowedPaths.includes(String(to.name))
  // );

  if (!isLoggedIn.value && !allowedPaths.includes(String(to.name))) {
    return navigateTo("/login");
  }
});
