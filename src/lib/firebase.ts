import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import type { Messaging } from "firebase/messaging";

// Firebase 설정 (백엔드 가이드에서 제공받은 설정)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: "575403466517",
  appId: "1:575403466517:web:16b88022e2ea608e61531c",
};

console.log("🔥 Firebase 초기화 중...", {
  apiKey: firebaseConfig.apiKey ? "✅ 있음" : "❌ 없음",
  projectId: firebaseConfig.projectId ? "✅ 있음" : "❌ 없음",
  window: typeof window !== "undefined" ? "✅" : "❌",
  serviceWorker: typeof navigator !== "undefined" && "serviceWorker" in navigator ? "✅" : "❌",
});

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Messaging 인스턴스 생성
let messaging: Messaging | null = null;

// 브라우저 환경에서만 messaging 초기화
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  try {
    console.log("📱 getMessaging 호출 시도...");
    messaging = getMessaging(app);
    console.log("✅ Messaging 초기화 성공!", messaging);
  } catch (error) {
    console.error("❌ Messaging 초기화 오류:", error);
    console.error("에러 상세:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
} else {
  console.warn("⚠️ Service Worker를 지원하지 않는 환경입니다.");
}

export { app, messaging };

// VAPID 키 (백엔드 가이드에서 제공받은 키)
export const VAPID_KEY =
  "BKoBWLhs-oyQED60RSpTttUA0XoAOTcwOxongEU8kn0ot6KV_obkfR3P6Cnznc75y0Apn-2InLTj3rkvaIGHNhg";
