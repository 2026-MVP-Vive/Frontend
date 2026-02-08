import type { User, UserRole } from '@/types/api'

export type { UserRole }

/**
 * sessionStorage에서 현재 사용자 역할 조회
 */
export function getUserRole(): UserRole | null {
  const role = sessionStorage.getItem('userRole')
  if (role === 'MENTOR' || role === 'MENTEE') {
    return role
  }
  return null
}

/**
 * sessionStorage에 사용자 역할 저장
 */
export function setUserRole(role: UserRole): void {
  sessionStorage.setItem('userRole', role)
}

/**
 * sessionStorage에서 인증 토큰 조회
 */
export function getAuthToken(): string | null {
  return sessionStorage.getItem('authToken')
}

/**
 * sessionStorage에 인증 토큰 저장
 */
export function setAuthToken(token: string): void {
  sessionStorage.setItem('authToken', token)
}

/**
 * sessionStorage에 리프레시 토큰 저장
 */
export function setRefreshToken(token: string): void {
  sessionStorage.setItem('refreshToken', token)
}

/**
 * sessionStorage에서 리프레시 토큰 조회
 */
export function getRefreshToken(): string | null {
  return sessionStorage.getItem('refreshToken')
}

/**
 * sessionStorage에서 사용자 정보 조회
 */
export function getUser(): User | null {
  const userJson = sessionStorage.getItem('user')
  if (!userJson) return null
  try {
    return JSON.parse(userJson)
  } catch {
    return null
  }
}

/**
 * sessionStorage에 사용자 정보 저장
 */
export function setUser(user: User): void {
  sessionStorage.setItem('user', JSON.stringify(user))
  sessionStorage.setItem('userRole', user.role)
  sessionStorage.setItem('userName', user.name)
}

/**
 * sessionStorage에서 username 조회
 */
export function getUsername(): string | null {
  return sessionStorage.getItem('userName')
}

/**
 * 현재 사용자가 멘토인지 확인
 */
export function isMentor(): boolean {
  return getUserRole() === 'MENTOR'
}

/**
 * 현재 사용자가 멘티인지 확인
 */
export function isMentee(): boolean {
  return getUserRole() === 'MENTEE'
}

/**
 * 사용자가 인증되었는지 확인
 */
export function isAuthenticated(): boolean {
  const token = getAuthToken()
  const role = getUserRole()
  return !!token && !!role
}

/**
 * 로그아웃 (모든 인증 정보 삭제)
 */
export function clearAuth(): void {
  sessionStorage.removeItem('authToken')
  sessionStorage.removeItem('refreshToken')
  sessionStorage.removeItem('userRole')
  sessionStorage.removeItem('userName')
  sessionStorage.removeItem('user')
}

// 하위 호환성을 위한 레거시 함수들
/**
 * @deprecated Use setUser instead
 */
export function setUsername(username: string): void {
  sessionStorage.setItem('userName', username)
}

/**
 * @deprecated Use getUserRole instead
 */
export function detectRole(username: string): UserRole | null {
  if (!username) return null
  const lowerUsername = username.toLowerCase()
  if (lowerUsername.includes('mentor')) return 'MENTOR'
  if (lowerUsername.includes('mentee')) return 'MENTEE'
  return null
}

/**
 * @deprecated Use clearAuth instead
 */
export function logout(): void {
  clearAuth()
}
