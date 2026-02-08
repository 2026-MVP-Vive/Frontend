import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

/**
 * 홈 페이지 - 역할에 따라 적절한 페이지로 리다이렉트
 * - 멘토 → /mentor/students
 * - 멘티 → /mentee/planner
 */
export default function Home() {
  const { role, isAuthenticated } = useAuth()

  // 인증되지 않은 경우 로그인 페이지로
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // 역할에 따라 리다이렉트
  if (role === 'MENTOR') {
    return <Navigate to="/mentor/students" replace />
  }

  if (role === 'MENTEE') {
    return <Navigate to="/mentee/planner" replace />
  }

  // 역할이 없는 경우 (비정상 상태)
  return <Navigate to="/login" replace />
}
