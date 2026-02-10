import { getToken, onMessage } from 'firebase/messaging'
import { messaging, VAPID_KEY } from '@/lib/firebase'
import { sendFcmToken } from '@/lib/api/fcm'

/**
 * FCM 토큰 가져오기 및 서버 전송
 * Service Worker는 이미 등록되어 있으므로, 토큰만 조회해서 전송
 */
export const sendFCMTokenToServer = async (): Promise<void> => {
  if (!messaging) {
    console.log('FCM messaging 객체가 없습니다.')
    return
  }

  try {
    // 알림 권한 요청
    const permission = await Notification.requestPermission()

    if (permission !== 'granted') {
      console.log('알림 권한이 거부되었습니다.')
      return
    }

    console.log('알림 권한이 허용되었습니다.')

    // 기존 Service Worker 사용 (이미 public/firebase-messaging-sw.js가 등록되어 있음)
    const registration = await navigator.serviceWorker.ready

    // FCM 토큰 가져오기 (브라우저에 이미 있으면 기존 토큰 반환)
    const currentToken = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    })

    if (currentToken) {
      console.log('FCM 토큰:', currentToken)

      // 서버로 토큰 전송 (현재 로그인한 사용자에 연결)
      await sendFcmToken(currentToken)
      console.log('FCM 토큰이 서버로 전송되었습니다.')
    } else {
      console.log('FCM 토큰을 가져올 수 없습니다.')
    }
  } catch (error) {
    console.error('FCM 토큰 전송 오류:', error)
  }
}

/**
 * 포그라운드 메시지 수신 리스너 설정
 */
export const setupFCMMessageListener = (): (() => void) | null => {
  if (!messaging) {
    return null
  }

  const unsubscribe = onMessage(messaging, (payload) => {
    console.log('포그라운드 메시지 수신:', payload)

    // 알림 표시
    if (payload.notification) {
      const notificationTitle = payload.notification.title || '새로운 알림'
      const notificationOptions = {
        body: payload.notification.body || '',
        icon: '/favicon.ico',
      }

      // 알림 권한이 허용된 경우에만 표시
      if (Notification.permission === 'granted') {
        new Notification(notificationTitle, notificationOptions)
      }
    }
  })

  return unsubscribe
}
