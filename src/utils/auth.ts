/**
 * 사용자 역할 타입
 */
export type UserRole = 'mentor' | 'mentee' | null

/**
 * username에서 역할 판별
 * - username에 'mentor' 포함 → mentor
 * - username에 'mentee' 포함 → mentee
 * - 둘 다 없으면 → null (역할 판별 실패)
 *
 * @param username - 사용자 아이디
 * @returns 'mentor' | 'mentee' | null
 */
export function detectRole(username: string): UserRole {
  if (!username) return null

  const lowerUsername = username.toLowerCase()

  if (lowerUsername.includes('mentor')) {
    return 'mentor'
  }

  if (lowerUsername.includes('mentee')) {
    return 'mentee'
  }

  return null // 역할 판별 실패
}

/**
 * sessionStorage에서 현재 사용자 역할 조회
 */
export function getUserRole(): UserRole {
  const role = sessionStorage.getItem('user_role')
  if (role === 'mentor' || role === 'mentee') {
    return role
  }
  return null
}

/**
 * sessionStorage에 사용자 역할 저장
 */
export function setUserRole(role: UserRole): void {
  if (role) {
    sessionStorage.setItem('user_role', role)
  } else {
    sessionStorage.removeItem('user_role')
  }
}

/**
 * sessionStorage에서 인증 토큰 조회
 */
export function getAuthToken(): string | null {
  return sessionStorage.getItem('auth_token')
}

/**
 * sessionStorage에 인증 토큰 저장
 */
export function setAuthToken(token: string): void {
  sessionStorage.setItem('auth_token', token)
}

/**
 * sessionStorage에서 username 조회
 */
export function getUsername(): string | null {
  return sessionStorage.getItem('username')
}

/**
 * sessionStorage에 username 저장
 */
export function setUsername(username: string): void {
  sessionStorage.setItem('username', username)
}

/**
 * 현재 사용자가 멘토인지 확인
 */
export function isMentor(): boolean {
  return getUserRole() === 'mentor'
}

/**
 * 현재 사용자가 멘티인지 확인
 */
export function isMentee(): boolean {
  return getUserRole() === 'mentee'
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
export function logout(): void {
  sessionStorage.removeItem('auth_token')
  sessionStorage.removeItem('user_role')
  sessionStorage.removeItem('username')
}
