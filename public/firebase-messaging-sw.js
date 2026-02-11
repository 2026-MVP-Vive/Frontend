// 스크립트 로드
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js",
);

// Firebase 설정
// ⚠️ Service Worker는 import.meta.env를 사용할 수 없으므로 직접 값을 넣어야 함
firebase.initializeApp({
  apiKey: "AIzaSyCirg0T_TA7_0XS1UzsWn52BqlHC8RDAAA",
  projectId: "seolstudy-c253a",
  messagingSenderId: "575403466517",
  appId: "1:575403466517:web:16b88022e2ea608e61531c",
});

const messaging = firebase.messaging();

// 백그라운드 메시지 수신 시 알림 팝업을 강제로 띄우는 로직
messaging.onBackgroundMessage((payload) => {
  console.log("[sw] 백그라운드 메시지 받음:", payload);
  const notificationTitle = payload.notification?.title || "새 알림";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: "notification-tag",
    requireInteraction: false,
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// 🔥 iOS Safari 호환: push 이벤트를 직접 핸들링
self.addEventListener("push", (event) => {
  console.log("[sw] Push 이벤트 받음:", event);

  if (!event.data) {
    console.log("[sw] Push 데이터 없음");
    return;
  }

  try {
    const payload = event.data.json();
    console.log("[sw] Push 데이터:", payload);

    const title = payload.notification?.title || payload.data?.title || "새 알림";
    const options = {
      body: payload.notification?.body || payload.data?.body || "",
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: "notification-tag",
      requireInteraction: false,
      data: payload.data,
    };

    // iOS Safari는 이 showNotification 호출이 동기적이어야 함
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  } catch (error) {
    console.error("[sw] Push 처리 오류:", error);
    // 에러가 발생해도 기본 알림 표시 (iOS Safari 필수)
    event.waitUntil(
      self.registration.showNotification("새 알림", {
        body: "알림이 도착했습니다.",
        icon: "/favicon.ico",
      })
    );
  }
});

// 알림 클릭 이벤트 처리
self.addEventListener("notificationclick", (event) => {
  console.log("[sw] 알림 클릭됨:", event);
  event.notification.close();

  // 앱 열기
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // 이미 열린 창이 있으면 포커스
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      // 없으면 새 창 열기
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});
