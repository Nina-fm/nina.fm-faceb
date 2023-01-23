import queryString from "query-string";
import { storeToRefs } from "pinia";

export default defineNuxtRouteMiddleware((to, from) => {
  const allowedPaths = ["login", "set-password"];
  const hash = queryString.parse(to.hash);
  const { isLoggedIn } = storeToRefs(useAuthStore());
  const isPassLink =
    ["invite", "recovery"].includes(String(hash?.type)) &&
    (hash?.token || hash?.access_token);

  if (
    !isPassLink &&
    !isLoggedIn.value &&
    !allowedPaths.includes(String(to.name))
  ) {
    return navigateTo("/login");
  }
});
