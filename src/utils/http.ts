// src/utils/http.ts
import Constants from "expo-constants";
import { getAccessToken } from "./storage";

const BASE_URL =
  (Constants.expoConfig?.extra?.apiUrl ?? "http://192.168.1.102:8000").replace(
    /\/$/,
    "",
  ) + "/";
async function getHeaders(auth = false): Promise<HeadersInit> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (auth) {
    const token = await getAccessToken();
    if (token) headers["Authorization"] = token;
  }
  return headers;
}

export const http = {
  get: async <T>(path: string, auth = true): Promise<T> => {
    const res = await fetch(`http://${BASE_URL}${path}`, {
      method: "GET",
      headers: await getHeaders(auth),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail);
    }
    return res.json();
  },

  post: async <T>(body: unknown, path: string, auth = false): Promise<T> => {
    const res = await fetch(`http://${BASE_URL}${path}`, {
      method: "POST",
      headers: await getHeaders(auth),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail);
    }
    return res.json();
  },

  patch: async <T>(body: unknown, path: string, auth = true): Promise<T> => {
    const res = await fetch(`http://${BASE_URL}${path}`, {
      method: "PATCH",
      headers: await getHeaders(auth),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail);
    }
    return res.json();
  },

  delete: async (path: string, auth = true): Promise<void> => {
    const res = await fetch(`http://${BASE_URL}${path}`, {
      method: "DELETE",
      headers: await getHeaders(auth),
    });
    if (!res.ok) throw new Error("Delete failed");
  },

  postForm: async <T>(
    body: Record<string, string>,
    path: string,
    auth = false,
  ): Promise<T> => {
    const formBody = new URLSearchParams();
    Object.entries(body).forEach(([key, value]) => formBody.append(key, value));

    const res = await fetch(`http:${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody.toString(),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail);
    }
    return res.json();
  },
};
