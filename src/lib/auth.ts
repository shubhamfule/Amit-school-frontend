// Mock / localStorage based auth for demo purposes.
// Replace this with a real backend-backed auth flow when the API is ready.

export type Role =
  | "admin"
  | "library"
  | "main-accountant"
  | "non-teaching-accountant"
  | "student-accountant"
  | "student"
  | "teacher"
  | "teaching-accountant";

export interface DemoUser {
  username: string;
  password: string;
  role: Role;
  label: string;
  basePath: string;
}

export const DEMO_USERS: DemoUser[] = [
  { username: "admin", password: "admin123", role: "admin", label: "Admin", basePath: "/admin" },
  { username: "library", password: "library123", role: "library", label: "Library Staff", basePath: "/library" },
  { username: "mainaccountant", password: "acc123", role: "main-accountant", label: "Main Accountant", basePath: "/main-accountant" },
  { username: "nonteachingaccountant", password: "acc123", role: "non-teaching-accountant", label: "Non-Teaching Accountant", basePath: "/non-teaching-accountant" },
  { username: "studentaccountant", password: "acc123", role: "student-accountant", label: "Student Accountant", basePath: "/student-accountant" },
  { username: "student", password: "student123", role: "student", label: "Student", basePath: "/student" },
  { username: "teacher", password: "teacher123", role: "teacher", label: "Teacher", basePath: "/teacher" },
  { username: "teachingaccountant", password: "acc123", role: "teaching-accountant", label: "Teaching Accountant", basePath: "/teaching-accountant" },
];

const STORAGE_KEY = "amitSchoolAuthUser";

export function login(username: string, password: string): DemoUser | null {
  const normalizedUsername = username.trim().toLowerCase();
  const match = DEMO_USERS.find(
    (u) =>
      (u.username.toLowerCase() === normalizedUsername ||
        `${u.username.toLowerCase()}@amitschool.edu` === normalizedUsername) &&
      u.password === password
  );
  if (match) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(match));
    return match;
  }
  return null;
}

export function getCurrentUser(): DemoUser | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DemoUser;
  } catch {
    return null;
  }
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}
