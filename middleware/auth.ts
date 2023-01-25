import queryString from "query-string";
import { storeToRefs } from "pinia";

export default defineNuxtRouteMiddleware((to, from) => {
  // const user = useSupabaseUser();
  // console.log("middleware", { user: user.value });
  const allowedPaths = ["login", "set-password", "reset-password"];
  const params = queryString.parse(to.hash ?? to.query);
  const { isLoggedIn } = storeToRefs(useAuthStore());
  const isPassLink =
    ["invite", "recovery"].includes(String(params?.type)) && params?.token;
  // if (
  //   !isPassLink &&
  //   !isLoggedIn.value &&
  //   !allowedPaths.includes(String(to.name))
  // ) {
  //   return navigateTo("/login");
  // }
});
