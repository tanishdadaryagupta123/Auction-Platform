import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
 
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: ['.js', '.jsx', '.json']
  },
  server: {
    host: true,
    middlewareMode: true
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
})

