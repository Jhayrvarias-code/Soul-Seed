/** API host without trailing slash (no /api suffix). */
export function getApiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_REACT_APP_API_URL?.replace(/\/$/, "");

  if (typeof window !== "undefined") {
    // Wrong Vercel env (e.g. soul-seed-indr) pointing at another deployment → use same origin.
    if (fromEnv) {
      try {
        const envHost = new URL(fromEnv).host;
        if (envHost !== window.location.host) {
          if (import.meta.env.PROD) {
            return window.location.origin;
          }
        } else {
          return fromEnv;
        }
      } catch {
        // ignore invalid URL
      }
    }

    return window.location.origin;
  }

  return fromEnv || "http://localhost:3000";
}
