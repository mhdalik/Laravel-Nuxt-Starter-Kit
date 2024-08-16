import axios from "axios";

export const register = (body) => {
  const config = useRuntimeConfig();
  const API_BASE_URL_V1_AUTH = config.public.API_BASE_URL_V1_AUTH;

  return new Promise((resolve, reject) => {
    axios
      .post(`${API_BASE_URL_V1_AUTH}/register`, body)
      .then((res) => {
        if (res.status == 200) {
          resolve({
            status: true,
            message: "Registration success, login to continue",
          });
        }
        reject({ status: false, message: "Login failed" });
      })
      .catch((error) => {
        // alert(error.response.data.message);
        // console.log(error.response.status);
        // reject(error);
        reject({ status: false, message: "Registration Failed" });
      });
  });
};

export const login = (email, password) => {
  const config = useRuntimeConfig();
  const API_BASE_URL_V1_AUTH = config.public.API_BASE_URL_V1_AUTH;

  return new Promise((resolve, reject) => {
    axios
      .post(`${API_BASE_URL_V1_AUTH}/login`, {
        email: email,
        password: password,
      })
      .then((res) => {
        // if (res.status == 200) {
        const token = useCookie("token", { maxAge: 86400 * 30 * 6 });
        const user = useCookie("user");
        token.value = res.data.token;
        user.value = res.data.user;
        resolve({ isLoggedIn: true, user: res.data.user });
      })
      .catch((error) => {
        // console.log(error.response.status);
        reject(error);
      });
  });
};

// this function is to call in one time in layouts.this function sending request to backend, if need to get cuth user ,
export const checkAndGetAuthUser = () => {
  const config = useRuntimeConfig();
  const API_BASE_URL_V1_AUTH = config.public.API_BASE_URL_V1_AUTH;
  const token = useCookie("token");
  const user = useCookie("user");

  return new Promise((resolve, reject) => {
    if (!token.value) {
      // console.log("User Unauthenticated");
      // reject("User Unauthenticated");
      return null;
    }

    axios
      .get(`${API_BASE_URL_V1_AUTH}/user`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          user.value = res.data;
          resolve({ isLoggedIn: true, user: res.data });
        } else if (res.status == 403) {
          alert("User not verified");
        } else if (res.status == 401) {
          token.value = null; // uncomment these after replacing axios.get by axiosGet composable
          user.value = null;
          resolve({ isLoggedIn: false, user: null });
        } else {
          token.value = null;
          user.value = null;
          reject(res);
        }
      })
      // handle 401 :unauthenticated statu code
      .catch((error) => {
        reject(error);
      });
  });
};

export const logout = () => {
  const config = useRuntimeConfig();
  const API_BASE_URL_V1_AUTH = config.public.API_BASE_URL_V1_AUTH;

  const token = useCookie("token");
  const user = useCookie("user");

  return new Promise((resolve, reject) => {
    // token.value = null;
    // user.value = null;
    // resolve(true);

    if (!token.value) {
      console.log("User Alredy Unauthenticated");
      // reject("User Unauthenticated");
      return true;
    }
    axios
      .post(`${API_BASE_URL_V1_AUTH}/logout`, null, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
      .then((res) => {
        token.value = null;
        user.value = null;
        window.location.reload();
        resolve(true);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getAuthUser = () => {
  const token = useCookie("token");
  const user = useCookie("user");

  if (token.value && user.value) {
    return user.value;
  }
  return null;
};
