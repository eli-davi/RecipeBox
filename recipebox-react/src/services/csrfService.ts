
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5232";

let csrfToken: string | null = null;

export async function getCsrfToken(): Promise<string> {
  if (csrfToken) {
    return csrfToken;
  }

  const response = await fetch(`${API_BASE}/api/csrf-token`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("לא ניתן לקבל טוקן אבטחה");
  }

  const data: { token: string } = await response.json();
  csrfToken = data.token;

  return csrfToken;
}

export function clearCsrfToken() {
  csrfToken = null;
}
