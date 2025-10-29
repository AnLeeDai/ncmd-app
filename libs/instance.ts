import { addToast } from "@heroui/toast";
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
  },
  withCredentials: true,
});

axios.interceptors.response.use(
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
