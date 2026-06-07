import axios from "axios";

export const SESSION_EXPIRED_EVENT = "scheduler:session-expired";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;
    const isAuthFailure =
      status === 401 && /jwt|token|not authorized|unauthorized/i.test(message || "");

    if (isAuthFailure) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];

      if (error.response.data) {
        error.response.data.message =
          "Your session expired. Please sign in again.";
      }

      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }

    return Promise.reject(error);
  },
);

export default api;
