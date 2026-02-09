// 스크립트 로드
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js",
);

// Firebase 설정 (본인의 Firebase 콘솔 설정값을 넣으세요)
firebase.initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
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
