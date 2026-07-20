export const TOKEN_KEY = "inv_token";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// Empty string = relative URL, so Next.js rewrites can proxy to the backend
const API_BASE = "";

export class ApiError extends Error {
  status: number;
  code?: string;
  data?: Record<string, unknown>;

  constructor(message: string, status: number, data?: Record<string, unknown>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = typeof data?.code === "string" ? data.code : undefined;
    this.data = data;
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    // Network-level failure (backend not running, DNS, connection refused,
    // etc). Surface a clear message instead of letting the raw fetch
    // TypeError bubble up as an unhandled runtime error.
    throw new ApiError("Unable to reach the server. Is the backend running?", 0);
  }

  // Read the body once as text so we can safely handle both JSON and empty
  // bodies - res.json() throws a cryptic "Unexpected end of JSON input" on
  // an empty body (e.g. a failed dev-proxy passthrough), which previously
  // crashed the whole page instead of failing gracefully.
  const raw = await res.text();
  let data: any = {};
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      throw new ApiError(
        res.ok ? "Received an invalid response from the server." : (res.statusText || "Request failed"),
        res.status || 0
      );
    }
  }

  if (!res.ok) {
    const message = data.error || data.message || res.statusText || "Request failed";
    throw new ApiError(message, res.status, data);
  }
  return data as T;
}