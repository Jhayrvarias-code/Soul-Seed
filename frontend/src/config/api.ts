export function getApiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_REACT_APP_API_URL?.replace(/\/$/, "");

  if (fromEnv) return fromEnv;

  return "http://localhost:3000";
}
