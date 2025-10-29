export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + HeroUI",
  description: "Make beautiful websites regardless of your design experience.",
};

export const pathNameConfig = {
  // auth
  login: { url: "/login" },
  register: { url: "/register" },

  // main
  videos: { url: "/videos" },
  profile: { url: "/profile" },
  wheels: { url: "/wheels" },
  points: { url: "/points" },
};
