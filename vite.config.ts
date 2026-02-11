import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0", // 모든 네트워크 인터페이스에서 접근 허용
    port: 5173,
    allowedHosts: [
      "5ea9-112-144-94-183.ngrok-free.app", // ngrok 주소 추가
    ],
  },
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 🔥 Service Worker 파일이 빌드 시 dist에 복사되도록 보장
  publicDir: "public",
});
