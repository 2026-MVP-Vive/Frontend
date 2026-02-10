#!/usr/bin/env node

/**
 * Service Worker 빌드 스크립트
 * .env의 환경변수를 Service Worker 파일에 주입
 *
 * ⚠️ 주의: 이것도 결국 빌드 파일에 포함되므로 완전히 숨길 수는 없습니다.
 * Firebase API 키는 공개되어도 안전하므로 이 스크립트는 선택사항입니다.
 */

import { readFileSync, writeFileSync } from 'fs';
import { config } from 'dotenv';

// .env 파일 로드
config();

const FIREBASE_API_KEY = process.env.VITE_FIREBASE_API_KEY;
const FIREBASE_PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID;

if (!FIREBASE_API_KEY || !FIREBASE_PROJECT_ID) {
  console.error('❌ .env 파일에 Firebase 환경변수가 없습니다!');
  process.exit(1);
}

// Service Worker 템플릿 읽기
const template = `// 스크립트 로드
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js",
);

// Firebase 설정 (빌드 시 환경변수에서 주입됨)
firebase.initializeApp({
  apiKey: "${FIREBASE_API_KEY}",
  projectId: "${FIREBASE_PROJECT_ID}",
  messagingSenderId: "575403466517",
  appId: "1:575403466517:web:16b88022e2ea608e61531c",
});

const messaging = firebase.messaging();

// 백그라운드 메시지 수신 시 알림 팝업을 강제로 띄우는 로직
messaging.onBackgroundMessage((payload) => {
  console.log("[sw] 백그라운드 메시지 받음:", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/favicon.ico",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
`;

// public 폴더에 Service Worker 파일 생성
writeFileSync('public/firebase-messaging-sw.js', template);

console.log('✅ Service Worker 빌드 완료!');
console.log('📝 public/firebase-messaging-sw.js 생성됨');
