// Backend-backed auth. Login/logout hit the Express API (Backend/src/routes/auth.routes.js),
// which sets an httpOnly session cookie — the cookie is the real auth used on every
// subsequent fetch (credentials: "include"). The public user returned on login is cached
// in localStorage purely so synchronous UI checks (ProtectedRoute, LogoutButton) can render
// without an extra round trip; it is not itself a credential.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export type Role =
  | "admin"
  | "library"
  | "main-accountant"
  | "non-teaching-accountant"
  | "student-accountant"
  | "student"
  | "teacher"
  | "teaching-accountant";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: Role;
  label: string;
  basePath: string;
}

const STORAGE_KEY = "amitSchoolAuthUser";

function withBasePath(user: Omit<AuthUser, "basePath">): AuthUser {
  return { ...user, basePath: `/${user.role}` };
}

async function parseJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function login(identifier: string, password: string): Promise<AuthUser | null> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ identifier, password }),
  });

  const data = await parseJson(response);
  if (!response.ok) {
    if (response.status === 401) return null;
    throw new Error(data?.message || "Login failed");
  }

  const user = withBasePath(data.data);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function getCurrentUser(): AuthUser | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

// Re-validates the cached user against the session cookie (e.g. on app load, since the
// cookie may have expired since the cache was written). Clears the cache when stale.
export async function verifySession(): Promise<AuthUser | null> {
  if (!getCurrentUser()) return null;
  try {
    const response = await fetch(`${BASE_URL}/auth/me`, { credentials: "include" });
    if (!response.ok) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    const data = await parseJson(response);
    const user = withBasePath(data.data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  } catch {
    return getCurrentUser();
  }
}

export async function logout(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY);
  try {
    await fetch(`${BASE_URL}/auth/logout`, { method: "POST", credentials: "include" });
  } catch {
    // Cookie will still expire server-side; local cache is already cleared.
  }
}
