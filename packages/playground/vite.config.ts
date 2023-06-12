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
      // TODO the node types still come back
      "@radekstepan/flare-utils": fileURLToPath(
        new URL("../utils/dist/browser/index.browser.js", import.meta.url)
      ),
    },
  },
  define: {
    global: "window",
  },
});
