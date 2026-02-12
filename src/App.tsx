import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

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
  const navigate = useNavigate()

  useEffect(() => {
    // 🔥 서비스 워커로부터 알림 클릭 메시지 수신
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'NOTIFICATION_CLICK' && event.data?.url) {
          console.log('[App] 알림 클릭으로 이동:', event.data.url)
          navigate(event.data.url)
        }
      })
    }
  }, [navigate])

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
