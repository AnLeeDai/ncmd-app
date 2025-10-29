import { addToast } from "@heroui/toast";
import axios from "axios";

const defaultBase =
  process.env.NODE_ENV === "development"
    ? "/api/forward"
    : (process.env.NEXT_PUBLIC_API_URL ?? "/api");

const instance = axios.create({
  baseURL: defaultBase,
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response) {
      addToast({
        title: "Server Error:",
        description: error.response.data.message,
      });
    } else if (error.request) {
      addToast({
        title: "No Response:",
        description: "No response received from server.",
      });
    } else {
      addToast({
        title: "Error:",
        description: error.message,
      });
    }

    return Promise.reject(error);
  },
);

export default instance;
