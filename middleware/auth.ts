import queryString from "query-string";
import { storeToRefs } from "pinia";

export default defineNuxtRouteMiddleware((to, from) => {
  const allowedPaths = ["login", "set-password", "reset-password"];
  const params = queryString.parse(to.hash ?? to.query);
  const { isLoggedIn } = storeToRefs(useAuthStore());
  const isPassLink =
    ["invite", "recovery"].includes(String(params?.type)) && params?.token;

  console.log("middleware params", { params });
  console.log("middleware isLoggedIn", { isLoggedIn });
  console.log("middleware isPassLink", { isPassLink });
  console.log("middleware isPassLink", { isPassLink });

  if (
    !isPassLink &&
    !isLoggedIn.value &&
    !allowedPaths.includes(String(to.name))
  ) {
    return navigateTo("/login");
  }
});
