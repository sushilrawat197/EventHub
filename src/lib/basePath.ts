/**
 * Vite injects BASE_URL from `base` in vite.config (driven by VITE_APP_BASE).
 * Always ends with `/` when set (e.g. `/mytag/` or `/`).
 */

/** React Router basename: leading slash, no trailing slash (except root `/`). */
export function getRouterBasename(): string {
  const base = import.meta.env.BASE_URL || "/";
  if (base === "/") return "/";
  return base.replace(/\/$/, "");
}

/** Prefix a public/static path with the app base (e.g. `logo.jpeg` → `/mytag/logo.jpeg`). */
export function withBasePath(assetPath: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const clean = assetPath.replace(/^\//, "");
  return `${base}${clean}`;
}
