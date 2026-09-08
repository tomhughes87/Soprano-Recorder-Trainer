import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { handleScoreApi } from "./scoreServer.mjs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "local-score-api",
      configureServer(server) {
        server.middlewares.use(async (request, response, next) => {
          if (!(await handleScoreApi(request, response))) next();
        });
      },
    },
  ],
});
