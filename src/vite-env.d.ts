/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  /** Optional app subpath, e.g. `/mytag`. Empty/unset → serve at `/`. */
  readonly VITE_APP_BASE?: string;
  /** Alias for VITE_APP_BASE. */
  readonly VITE_BASE_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
