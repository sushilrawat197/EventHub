import { useLayoutEffect } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "https://your-api-url.com/api/v1",
});

export function useAuthInterceptor(token: string | null) {
  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      if (token && !config.headers?.Authorization) {
        if (config.headers) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
      return config;
    });

    // Cleanup interceptor on unmount or token change
    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]);
}
