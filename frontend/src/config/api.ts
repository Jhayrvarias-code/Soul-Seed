/** API host without trailing slash (no /api suffix). */
export function getApiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_REACT_APP_API_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "http://localhost:3000";
}
