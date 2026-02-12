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

// 백그라운드 메시지 수신 시 알림 표시 (URL 정보 포함)
messaging.onBackgroundMessage((payload) => {
  console.log("[sw] 백그라운드 메시지 받음:", payload);

  const title = payload.notification?.title || payload.data?.title || "새 알림";
  const options = {
    body: payload.notification?.body || payload.data?.body || "",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: "vive-notification", // 중복 방지용 고유 태그
    requireInteraction: false,
    data: {
      url: payload.data?.url || payload.data?.link || "/", // URL 정보 저장
      ...payload.data, // 기타 데이터 보존
    },
  };

  console.log("##### LOG:", options.data);

  return self.registration.showNotification(title, options);
});

// 알림 클릭 이벤트 처리 (URL로 이동)
self.addEventListener("notificationclick", (event) => {
  console.log("[sw] 알림 클릭됨:", event);
  event.notification.close();

  // payload에서 URL 추출 (data.url 또는 data.link)
  const targetUrl = event.notification.data?.url || "/";

  // 🔥 절대 URL 생성 (상대 경로면 origin 붙이기)
  const fullUrl = targetUrl.startsWith("http")
    ? targetUrl
    : `${self.location.origin}${targetUrl}`;

  console.log("[sw] 이동할 URL:", fullUrl);

  // 앱 열기 (특정 URL로 이동)
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // 이미 열린 창이 있으면 해당 URL로 이동 후 포커스
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            return client.focus().then(() => {
              // 페이지 이동 (postMessage 사용 - 상대 경로 전달)
              client.postMessage({
                type: "NOTIFICATION_CLICK",
                url: targetUrl, // 상대 경로 전달 (navigate에서 사용)
              });
            });
          }
        }
        // 없으면 새 창을 절대 URL로 열기
        if (clients.openWindow) {
          return clients.openWindow(fullUrl);
        }
      }),
  );
});
