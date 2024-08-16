export default defineNuxtRouteMiddleware(async (to, from) => {
  try {
    const { isLoggedIn, user } = await checkAndGetAuthUser();
    if (isLoggedIn && user && user.role == "customer") {
      return;
    } else {
      return navigateTo("/");
      return abortNavigation();
    }
  } catch (error) {
    return abortNavigation();
  }
});
