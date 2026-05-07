import { BoardState } from "./types";
import { clearToken, getToken } from "./auth";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`/api${path}`, { ...init, headers });
  if (res.status === 401) {
    clearToken();
    throw new Error("unauthorized");
  }
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export const api = {
  authConfig: () => request<{ required: boolean }>("/auth/config"),
  login: (password: string) =>
    request<{ token: string }>("/auth/login", { method: "POST", body: JSON.stringify({ password }) }),
  getState: () => request<BoardState>("/state"),
  setState: (state: Partial<BoardState>) =>
    request<BoardState>("/state", { method: "POST", body: JSON.stringify(state) }),
  listImages: () => request<string[]>("/images"),
  uploadImage: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return request<{ name: string }>("/images", { method: "POST", body: fd });
  },
  deleteImage: (name: string) =>
    request<{ ok: true }>(`/images/${encodeURIComponent(name)}`, { method: "DELETE" }),
  imageUrl: (name: string) => `/api/images/${encodeURIComponent(name)}`,
};
