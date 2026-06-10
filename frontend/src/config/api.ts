/** API host without trailing slash (no /api suffix). */
export function getApiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_REACT_APP_API_URL?.replace(/\/$/, "");

  if (fromEnv) {
    try {
      const envHost = new URL(fromEnv).host;
      // In production, if the configured API host differs from the current host,
      // prefer same-origin to avoid cross-deployment calls.
      if (
        import.meta.env.PROD &&
        typeof window !== "undefined" &&
        envHost !== window.location.host
      ) {
        return window.location.origin;
      }
      // Otherwise, use the configured API URL (useful in development).
      return fromEnv;
    } catch {
      // ignore invalid URL and fall back to other options
    }
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return fromEnv || "http://localhost:3000";
}
