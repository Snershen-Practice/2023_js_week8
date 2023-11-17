import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: "/index.html",
        page1: "assets/admin.html",
        // Add more entries as needed
      },
    },
  },
});
