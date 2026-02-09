import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { getToken, onMessage } from 'firebase/messaging'
import { messaging, VAPID_KEY } from './lib/firebase'
import { sendFcmToken } from './lib/api/fcm'

// Layouts
import MentorLayout from './layouts/MentorLayout'
import MenteeLayout from './layouts/MenteeLayout'

// Components
import { ProtectedRoute } from './components/common/ProtectedRoute'

// Pages
import Login from './pages/Login'
import Home from './pages/Home'
import MentiMain from './pages/MentiMain'
import TaskDetail from './pages/mentee/TaskDetail'
import TaskNew from './pages/mentee/TaskNew'
import Feedback from './pages/mentee/Feedback'
import Materials from './pages/mentee/Materials'
import MenteeList from './pages/mentor/MenteeList'
import DetailManage from './pages/mentor/DetailManage'
import TaskRegister from './pages/mentor/TaskRegister'
import Solution from './pages/mentor/Solution'

function AppContent() {
  const location = useLocation();

  // FCM 초기화 및 토큰 전송 (멘토 + 멘티 모두)
  useEffect(() => {
    const initFCM = async () => {
      // 로그인 페이지에서는 FCM 초기화 하지 않음
      if (location.pathname === '/login') {
        return;
      }

      // 로그인 상태 및 역할 확인
      const authToken = sessionStorage.getItem('authToken');
      const userRole = sessionStorage.getItem('userRole');

      // 로그인하지 않은 경우 건너뛰기
      if (!authToken || !messaging) {
        console.log('FCM 초기화 건너뛰기:', { authToken: !!authToken, messaging: !!messaging, userRole });
        return;
      }

      // 이미 토큰을 전송한 경우 건너뛰기 (중복 방지)
      const fcmTokenSent = sessionStorage.getItem('fcmTokenSent');
      if (fcmTokenSent === 'true') {
        console.log('FCM 토큰 이미 전송됨, 건너뛰기');
        return;
      }

      try {
        // Firebase Messaging Service Worker 등록
        const registration = await navigator.serviceWorker.register(
          '/firebase-messaging-sw.js',
          { scope: '/firebase-cloud-messaging-push-scope' }
        );
        console.log('Firebase Service Worker 등록 완료:', registration);

        // Service Worker가 활성화될 때까지 대기
        await navigator.serviceWorker.ready;

        // 알림 권한 요청
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
          console.log('알림 권한이 허용되었습니다.');

          // FCM 토큰 가져오기
          const currentToken = await getToken(messaging, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: registration
          });

          if (currentToken) {
            console.log('FCM 토큰:', currentToken);

            // 서버로 토큰 전송
            await sendFcmToken(currentToken);
            console.log('FCM 토큰이 서버로 전송되었습니다.');

            // 토큰 전송 완료 플래그 저장
            sessionStorage.setItem('fcmTokenSent', 'true');
          } else {
            console.log('FCM 토큰을 가져올 수 없습니다.');
          }
        } else {
          console.log('알림 권한이 거부되었습니다.');
        }
      } catch (error) {
        console.error('FCM 초기화 오류:', error);
      }
    };

    // 포그라운드 메시지 핸들러 (멘티만)
    const userRole = sessionStorage.getItem('userRole');
    if (messaging && userRole === 'MENTEE') {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('포그라운드 메시지 수신:', payload);

        // 알림 표시
        if (payload.notification) {
          const notificationTitle = payload.notification.title || '새로운 알림';
          const notificationOptions = {
            body: payload.notification.body || '',
            icon: '/favicon.ico'
          };

          // 알림 권한이 허용된 경우에만 표시
          if (Notification.permission === 'granted') {
            new Notification(notificationTitle, notificationOptions);
          }
        }
      });

      return () => {
        unsubscribe();
      };
    }

    // 모든 사용자(멘토 + 멘티) FCM 초기화
    initFCM();
  }, [location.pathname]);

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Home Route - redirects to role-specific home */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Mentee Routes - 모바일 레이아웃 */}
        <Route
          path="/mentee"
          element={
            <ProtectedRoute>
              <MenteeLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MentiMain />} />
          <Route path="planner" element={<MentiMain />} />
          <Route path="task/new" element={<TaskNew />} />
          <Route path="task/:id" element={<TaskDetail />} />
          <Route path="feedback/:date" element={<Feedback />} />
          <Route path="resources" element={<Materials />} />
        </Route>

        {/* Mentor Routes - PC 레이아웃 */}
        <Route
          path="/mentor"
          element={
            <ProtectedRoute>
              <MentorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/mentor/students" replace />} />
          <Route path="students" element={<MenteeList />} />
          <Route path="students/:id" element={<DetailManage />} />
          <Route path="students/:id/tasks/new" element={<TaskRegister />} />
          <Route path="students/:id/solutions" element={<Solution />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
