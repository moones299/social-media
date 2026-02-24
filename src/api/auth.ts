import type { User } from "../context/AuthContext";

const STORAGE_KEY = "socially_user";

const BASE_URL = (import.meta.env.VITE_API_URL ?? "https://qbc11-front-next.liara.run").replace(
  /\/$/,
  ""
);

function getStoredToken(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as { token?: string };
    return data?.token ?? null;
  } catch {
    return null;
  }
}

type RequestOptions = {
  body?: object;
  token?: string | null;
} & Omit<RequestInit, "body">;

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, token, ...rest } = options;
  const url = `${BASE_URL}${path}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...rest.headers,
  };
  const storedToken = token !== undefined ? token : getStoredToken();
  if (storedToken) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${storedToken}`;
  }
  const res = await fetch(url, {
    ...rest,
    headers,
    body: body ? JSON.stringify(body) : null,
    credentials: "include",
  });

  if (!res.ok) {
    let message = "Request failed";
    try {
      const data = await res.json().catch(() => ({}));
      message =
        (data as { message?: string }).message ??
        (data as { error?: string }).error ??
        res.statusText ??
        message;
    } catch {
      message = res.statusText || message;
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

type SessionResponse = { user: User } | User;
type LoginResponse = { user?: User; token?: string; accessToken?: string } | User;
type RegisterResponse = { user?: User; token?: string; accessToken?: string } | User;

function toUser(
  data: LoginResponse | RegisterResponse | null | undefined,
  fallbackEmail?: string
): User {
  if (!data || typeof data !== "object") {
    if (fallbackEmail) return { email: fallbackEmail };
    throw new Error("Invalid login response");
  }
  // Direct user object: { id, email, name, token }
  if ("email" in data && typeof (data as User).email === "string") {
    const u = data as User;
    const tokenVal = u.token ?? (data as { token?: string }).token ?? (data as { accessToken?: string }).accessToken;
    const user: User = { email: u.email };
    if (u.id != null) user.id = u.id;
    if (u.name != null) user.name = u.name;
    if (tokenVal) user.token = tokenVal;
    return user;
  }
  // Nested: { user: {...}, token?: "..." } or { data: { user, token } }
  const inner = (data as { user?: User }).user ?? (data as { data?: { user?: User } }).data?.user;
  const token =
    (data as { token?: string }).token ??
    (data as { accessToken?: string }).accessToken ??
    inner?.token;
  const payload = inner ?? data;
  const email =
    typeof (payload as User).email === "string"
      ? (payload as User).email
      : fallbackEmail;
  if (!email) throw new Error("Invalid login response");
  const user: User = { email };
  const pid = (payload as User).id;
  const pname = (payload as User).name;
  if (pid != null) user.id = pid;
  if (pname != null) user.name = pname;
  if (token) user.token = token;
  return user;
}

/**
 * Returns current session user from API, or null if not authenticated (e.g. 401).
 * Throws on network/other errors so caller can keep localStorage user on refresh.
 */
export async function getSession(): Promise<User | null> {
  const url = `${BASE_URL}/api/authentication/session`;
  const token = getStoredToken();
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(url, { method: "GET", headers, credentials: "include" });
  if (res.status === 401 || res.status === 403) return null;
  if (!res.ok) {
    let message = "Request failed";
    try {
      const data = await res.json().catch(() => ({}));
      message =
        (data as { message?: string }).message ??
        (data as { error?: string }).error ??
        res.statusText ??
        message;
    } catch {
      message = res.statusText || message;
    }
    throw new Error(message);
  }
  const data = await res.json().catch(() => null);
  if (!data) return null;
  const user = (data as { user?: User }).user ?? (data as User);
  if (!user || typeof (user as User).email !== "string") return null;
  return user as User;
}

export async function login(email: string, password: string): Promise<User> {
  const data = await request<LoginResponse>("/api/authentication/login", {
    method: "POST",
    body: { email, password },
  });
  return toUser(data, email);
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<User> {
  const data = await request<RegisterResponse>("/api/authentication/register", {
    method: "POST",
    body: { name, email, password },
  });
  return toUser(data, email);
}

export async function logout(): Promise<void> {
  try {
    await request("/api/authentication/logout", { method: "POST" });
  } catch {
    // ignore network errors on logout
  }
}
