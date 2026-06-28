const isProd = process.env.NODE_ENV === "production";

export const siteConfig = {
  name: "Finance Tracker",
  description: "Відстежуй доходи та витрати в одному місці",

  url: isProd
    ? "https://finance-tracker-eight-vert.vercel.app"
    : "http://localhost:3000",

  // Маршрути
  routes: {
    // Публічні (без логіну)
    home: "/",
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
    privacy: "/privacy",
    terms: "/terms",

    // Захищені (потрібен логін)
    dashboard: "/dashboard",
    profile: "/profile",
    settings: "/settings",
  },

  // Після логіну → сюди
  redirects: {
    afterLogin: "/dashboard",
    afterLogout: "/login",
    afterRegister: "/dashboard",
  },
} as const;

// Типи для автодоповнення
export type SiteRoute = typeof siteConfig.routes[keyof typeof siteConfig.routes];