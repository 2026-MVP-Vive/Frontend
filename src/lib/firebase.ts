import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import type { Messaging } from 'firebase/messaging';

// Firebase 설정 (백엔드 가이드에서 제공받은 설정)
const firebaseConfig = {
  apiKey: "AIzaSyCirg0T_TA7_0XS1UzsWn52BqlHC8RDAAA",
  projectId: "seolstudy-c253a",
  messagingSenderId: "575403466517",
  appId: "1:575403466517:web:16b88022e2ea608e61531c"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Messaging 인스턴스 생성
let messaging: Messaging | null = null;

// 브라우저 환경에서만 messaging 초기화
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.error('Messaging 초기화 오류:', error);
  }
}

export { app, messaging };

// VAPID 키 (백엔드 가이드에서 제공받은 키)
export const VAPID_KEY = 'BKoBWLhs-oyQED60RSpTttUA0XoAOTcwOxongEU8kn0ot6KV_obkfR3P6Cnznc75y0Apn-2InLTj3rkvaIGHNhg';
