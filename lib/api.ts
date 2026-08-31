// Auth now lives in an httpOnly cookie the browser manages automatically -
// there is no token for JS to read or store, which is the whole point
// (an XSS bug can no longer just read a token out of localStorage). The
// CSRF cookie below is deliberately the *one* readable piece: the backend
// double-submit-checks it against a header we set ourselves, which a
// cross-site page cannot do because it can't read our cookies.
const CSRF_COOKIE = "nexus_csrf";
const CSRF_HEADER = "x-csrf-token";

function readCsrfCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith(`${CSRF_COOKIE}=`));
  return match ? decodeURIComponent(match.slice(CSRF_COOKIE.length + 1)) : null;
}

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
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  const method = (options.method || "GET").toUpperCase();
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    const csrfToken = readCsrfCookie();
    if (csrfToken) headers[CSRF_HEADER] = csrfToken;
  }

  let res: Response;
  try {
    // credentials: "include" is what actually attaches the httpOnly auth
    // cookie (and the CSRF cookie) to same-site requests — without this,
    // every authenticated call would silently 401.
    res = await fetch(`${API_BASE}${path}`, { ...options, headers, credentials: "include" });
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
