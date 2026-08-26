/**
 * API utility for communicating with the Express backend.
 * Base URL: import.meta.env.VITE_API_URL || "http://localhost:4000/api"
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function throwForResponse(response, label) {
  let message = `${label} failed: ${response.status} ${response.statusText}`;
  try {
    const data = await response.json();
    if (data?.message) message = data.message;
  } catch {
    // response body wasn't JSON — fall back to the status text above
  }
  throw new Error(message);
}

export async function apiGet(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`, { credentials: "include" });
  if (!response.ok) await throwForResponse(response, `GET ${endpoint}`);
  return response.json();
}

export async function apiPost(endpoint, body) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!response.ok) await throwForResponse(response, `POST ${endpoint}`);
  return response.json();
}

export async function apiPatch(endpoint, body) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!response.ok) await throwForResponse(response, `PATCH ${endpoint}`);
  return response.json();
}

export async function apiDelete(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) await throwForResponse(response, `DELETE ${endpoint}`);
}
