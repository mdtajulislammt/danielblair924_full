import axios from "axios";
import { AppConfig } from "../config/app.config";
import { CookieHelper } from "../helper/cookie.helper";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

type AdapterOption = "fetch" | "axios";

// Setup global response interceptor for axios to handle automatic token refresh & 401s
if (typeof window !== "undefined") {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        error?.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes("/auth/")
      ) {
        originalRequest._retry = true;
        const refreshToken = CookieHelper.get({ key: "refreshToken" });
        if (refreshToken) {
          try {
            const apiBase = AppConfig().app.apiUrl;
            const res = await axios.post(`${apiBase}/auth/refresh`, {
              refreshToken,
            });
            const data = res.data?.data;
            if (data?.accessToken) {
              CookieHelper.set({
                key: "token",
                value: data.accessToken,
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
              });
              if (data.refreshToken) {
                CookieHelper.set({
                  key: "refreshToken",
                  value: data.refreshToken,
                  httpOnly: false,
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "strict",
                });
              }
              originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
              return axios(originalRequest);
            }
          } catch (_) {
            // Refresh token expired or rejected
          }
        }

        // If not already on the login page, clear cookies and redirect
        if (!window.location.pathname.startsWith("/login")) {
          CookieHelper.destroy({ key: "token" });
          CookieHelper.destroy({ key: "accessToken" });
          CookieHelper.destroy({ key: "refreshToken" });
          window.location.href = "/login?expired=true";
        }
      }
      return Promise.reject(error);
    }
  );
}

/**
 * Custom fetch class
 */
export class Fetch {
  private static _baseUrl = `${AppConfig().app.apiUrl}`;
  private static _adapter: AdapterOption = "axios";

  /**
   * Helper to merge authorization bearer token from cookies
   */
  private static getHeaders(customHeaders?: any, isFormData = false) {
    const token =
      CookieHelper.get({ key: "token" }) ||
      CookieHelper.get({ key: "accessToken" });

    const baseHeaders = isFormData
      ? {}
      : { "Content-Type": "application/json" };

    const authHeaders: any = {
      ...baseHeaders,
      ...customHeaders,
    };

    if (token && !authHeaders["Authorization"]) {
      authHeaders["Authorization"] = `Bearer ${token}`;
    }
    return authHeaders;
  }

  /**
   * Set adapter.
   * e.g. `fetch` or `axios`
   * @param adapter
   */
  static setAdapter(adapter: AdapterOption) {
    this._adapter = adapter;
  }

  /**
   * get request
   * @param url
   * @param header
   * @returns
   */
  static async get(url: string, header?: any) {
    const config = {
      ...header,
      headers: this.getHeaders(header?.headers),
    };
    if (this._adapter == "axios") {
      return await axios.get(`${this._baseUrl}${url}`, config);
    } else {
      const res = await fetch(`${this._baseUrl}${url}`, config);
      return await res.json();
    }
  }

  /**
   * post request
   * @param url
   * @param data
   * @param header
   * @returns
   */
  static async post(url: string, data: any, header?: any) {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    const authHeaders = this.getHeaders(header?.headers, isFormData);

    const config = {
      ...header,
      headers: authHeaders,
    };

    if (this._adapter == "axios") {
      return await axios.post(`${this._baseUrl}${url}`, data, config);
    } else {
      const res = await fetch(`${this._baseUrl}${url}`, {
        ...config,
        method: "POST",
        body: isFormData ? data : JSON.stringify(data),
      });
      return await res.json();
    }
  }

  /**
   * put request
   * @param url
   * @param data
   * @param header
   * @returns
   */
  static async put(url: string, data: any, header?: any) {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    const config = {
      ...header,
      headers: this.getHeaders(header?.headers, isFormData),
    };
    if (this._adapter == "axios") {
      return await axios.put(`${this._baseUrl}${url}`, data, config);
    } else {
      const res = await fetch(`${this._baseUrl}${url}`, {
        ...config,
        method: "PUT",
        body: isFormData ? data : JSON.stringify(data),
      });
      return await res.json();
    }
  }

  /**
   * patch request
   * @param url
   * @param data
   * @param header
   * @returns
   */
  static async patch(url: string, data: any, header?: any) {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    const config = {
      ...header,
      headers: this.getHeaders(header?.headers, isFormData),
    };
    if (this._adapter == "axios") {
      return await axios.patch(`${this._baseUrl}${url}`, data, config);
    } else {
      const res = await fetch(`${this._baseUrl}${url}`, {
        ...config,
        method: "PATCH",
        body: isFormData ? data : JSON.stringify(data),
      });
      return await res.json();
    }
  }

  /**
   * delete request
   * @param url
   * @param header
   * @returns
   */
  static async delete(url: string, header?: any) {
    const config = {
      ...header,
      headers: this.getHeaders(header?.headers),
    };
    if (this._adapter == "axios") {
      return await axios.delete(`${this._baseUrl}${url}`, config);
    } else {
      const res = await fetch(`${this._baseUrl}${url}`, {
        ...config,
        method: "DELETE",
      });
      return await res.json();
    }
  }
}
