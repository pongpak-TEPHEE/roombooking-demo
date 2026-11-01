// The app can be served from a sub-path (e.g. GitHub Pages: /roombooking-demo/).
// Vite sets import.meta.env.BASE_URL from the `base` option ("/" by default).
export const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");

// "/login" -> "/roombooking-demo/login" (for window.location and static files)
export const appUrl = (path = "/") => `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;

// Current route without the base path, e.g. "/login"
export const currentPath = () => {
  const p = window.location.pathname;
  const stripped = BASE_PATH && p.startsWith(BASE_PATH) ? p.slice(BASE_PATH.length) : p;
  return stripped || "/";
};

export const isDemo = import.meta.env.VITE_DEMO_MODE === "true";
