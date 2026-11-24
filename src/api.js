import { auth } from "./firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Sends a request to the backend with the current user's Firebase ID token attached.
async function request(path, options = {}) {
  const token = await auth.currentUser?.getIdToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

export const todoApi = {
  list: () => request("/todos"),
  create: (title) => request("/todos", { method: "POST", body: JSON.stringify({ title }) }),
  update: (id, updates) => request(`/todos/${id}`, { method: "PUT", body: JSON.stringify(updates) }),
  remove: (id) => request(`/todos/${id}`, { method: "DELETE" }),
};
