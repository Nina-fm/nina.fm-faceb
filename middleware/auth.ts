import queryString from "query-string";
import { storeToRefs } from "pinia";

export default defineNuxtRouteMiddleware((to, from) => {
  // const user = useSupabaseUser();
  // console.log("middleware", { user: user.value });
  const allowedPaths = ["login", "set-password", "reset-password"];
  const hash = queryString.parse(to.hash);
  const { isLoggedIn } = storeToRefs(useAuthStore());
  const isPassLink =
    ["invite", "recovery"].includes(String(hash?.type)) && hash?.token;
  if (
    !isPassLink &&
    !isLoggedIn.value &&
    !allowedPaths.includes(String(to.name))
  ) {
    return navigateTo("/login");
  }
});
