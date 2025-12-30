// @ts-check
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },

    imageService: "cloudflare",
  }),

  experimental: {
    security: {
      csrfProtection: {
        origin: true,
      },
    },
  },

  security: {
    checkOrigin: true,
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
