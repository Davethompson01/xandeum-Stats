// vite.config.js (or .ts)

import { defineConfig } from "vite";
// Import your framework plugin (e.g., React)
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(), 
  ],
});
