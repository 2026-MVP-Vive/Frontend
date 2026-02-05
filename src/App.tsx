import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

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
import Feedback from './pages/mentee/Feedback'
import Materials from './pages/mentee/Materials'
import MenteeList from './pages/mentor/MenteeList'
import DetailManage from './pages/mentor/DetailManage'
import TaskRegister from './pages/mentor/TaskRegister'
import Solution from './pages/mentor/Solution'

function App() {
  return (
    <BrowserRouter>
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
          <Route path="planner" element={<MentiMain />} />
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
          <Route path="students" element={<MenteeList />} />
          <Route path="students/:id" element={<DetailManage />} />
          <Route path="students/:id/tasks/new" element={<TaskRegister />} />
          <Route path="students/:id/solutions" element={<Solution />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
