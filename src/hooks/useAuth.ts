import { useNavigate } from 'react-router-dom'
import {
  getUserRole,
  getAuthToken,
  getUsername,
  isMentor,
  isMentee,
  isAuthenticated,
  logout as authLogout,
  type UserRole
} from '@/utils/auth'

/**
 * 인증 관련 상태 및 함수를 제공하는 커스텀 훅
 */
export function useAuth() {
  const navigate = useNavigate()

  const role: UserRole = getUserRole()
  const token = getAuthToken()
  const username = getUsername()
  const authenticated = isAuthenticated()

  /**
   * 로그아웃 처리
   * - sessionStorage 초기화
   * - 로그인 페이지로 이동
   */
  const logout = () => {
    authLogout()
    navigate('/login')
  }

  return {
    // 사용자 정보
    role,
    token,
    username,

    // 인증 상태
    isAuthenticated: authenticated,
    isMentor: isMentor(),
    isMentee: isMentee(),

    // 함수
    logout
  }
}
