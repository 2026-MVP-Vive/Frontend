import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Pages
import Login from './pages/Login'
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
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <div className="w-full max-w-[480px] min-h-screen bg-white shadow-xl relative">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            {/* 멘티 페이지 */}
            <Route path="/mentee/planner" element={<MentiMain />} />
            <Route path="/mentee/task/:id" element={<TaskDetail />} />
            <Route path="/mentee/feedback/:date" element={<Feedback />} />
            <Route path="/mentee/resources" element={<Materials />} />

            {/* 멘토 페이지 */}
            <Route path="/mentor/students" element={<MenteeList />} />
            <Route path="/mentor/students/:id" element={<DetailManage />} />
            <Route path="/mentor/students/:id/tasks/new" element={<TaskRegister />} />
            <Route path="/mentor/students/:id/solutions" element={<Solution />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
