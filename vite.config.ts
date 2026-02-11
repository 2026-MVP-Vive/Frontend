import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

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
    VitePWA({
      // 🔥 FCM 사용: Service Worker는 수동 관리, manifest만 자동 생성
      registerType: "autoUpdate",
      injectRegister: false, // main.tsx에서 firebase SW를 수동 등록
      workbox: {
        // Service Worker 자동 생성 비활성화
        globPatterns: [],
      },
      manifest: {
        name: "설스터디",
        short_name: "설스터디",
        description: "자체 콘텐츠 기반 수능 국영수 학습코칭",
        theme_color: "#2d3548",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait",
        icons: [
          {
            src: "/favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon",
          },
          {
            src: "/favicon-16x16.png",
            sizes: "16x16",
            type: "image/png",
          },
          {
            src: "/favicon-32x32.png",
            sizes: "32x32",
            type: "image/png",
          },
          {
            src: "/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: "module",
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
