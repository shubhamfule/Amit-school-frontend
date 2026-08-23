/**
 * API utility for communicating with Express backend
 * Base URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiGet(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`GET ${endpoint} failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function apiPost(endpoint, body) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`POST ${endpoint} failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function apiPut(endpoint, body) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`PUT ${endpoint} failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function apiDelete(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error(`DELETE ${endpoint} failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function apiPatch(endpoint, body) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`PATCH ${endpoint} failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}
