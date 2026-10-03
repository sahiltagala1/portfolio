/** Set NEXT_PUBLIC_SITE_URL to the real address when deploying (see .env.example). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
/** Search engines are only invited in once a real address has been configured. */
export const IS_PRODUCTION_URL = Boolean(process.env.NEXT_PUBLIC_SITE_URL);
