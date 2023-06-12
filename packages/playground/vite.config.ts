import { URL, fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 1234,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "node-fetch": "cross-fetch",
      "@radekstepan/flare": fileURLToPath(
        new URL("../main/dist/index.js", import.meta.url)
      ),
      "@radekstepan/flare-utils": fileURLToPath(
        new URL("../utils/dist/browser/index.browser.js", import.meta.url)
      ),
    },
  },
  define: {
    global: "window",
  },
});
