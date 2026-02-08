import { apiClient } from './client'
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '@/types/api'

/**
 * 로그인 API
 */
export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    '/auth/login',
    request
  )

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '로그인에 실패했습니다.')
  }

  return response.data.data
}

/**
 * 토큰 갱신 API
 */
export const refreshToken = async (
  request: RefreshTokenRequest
): Promise<RefreshTokenResponse> => {
  const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
    '/auth/refresh',
    request
  )

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '토큰 갱신에 실패했습니다.')
  }

  return response.data.data
}

/**
 * 로그아웃 API
 */
export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout')

  // 로컬 스토리지 정리
  sessionStorage.clear()
}
