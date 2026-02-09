import { apiClient } from './client'
import type {
  ApiResponse,
  TasksResponse,
  CreateTaskRequest,
  Task,
  UpdateStudyTimeRequest,
  YesterdayFeedbackResponse,
  CreateCommentRequest,
  Comment,
  CompletePlannerResponse,
  CreateZoomMeetingRequest,
  ZoomMeeting,
  ZoomMeetingsResponse,
} from '@/types/api'

/**
 * 할 일 목록 조회
 * @param date - 조회할 날짜 (YYYY-MM-DD)
 */
export const getTasks = async (date: string): Promise<TasksResponse> => {
  const response = await apiClient.get<ApiResponse<TasksResponse>>(
    '/mentee/tasks',
    { params: { date } }
  )

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '할 일 목록 조회에 실패했습니다.')
  }

  return response.data.data
}

/**
 * 할 일 상세 조회
 * @param taskId - 할 일 ID
 */
export const getTaskDetail = async (
  taskId: number
): Promise<import('@/types/api').TaskDetailResponse> => {
  const response = await apiClient.get<
    ApiResponse<import('@/types/api').TaskDetailResponse>
  >(`/mentee/tasks/${taskId}`)

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '할 일 상세 조회에 실패했습니다.')
  }

  return response.data.data
}

/**
 * 할 일 추가 (멘티가 직접 추가)
 */
export const createTask = async (
  request: CreateTaskRequest
): Promise<Task> => {
  const response = await apiClient.post<ApiResponse<Task>>(
    '/mentee/tasks',
    request
  )

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '할 일 추가에 실패했습니다.')
  }

  return response.data.data
}

/**
 * 공부 시간 기록
 * @param taskId - 할 일 ID
 * @param studyTime - 공부 시간 (분 단위)
 */
export const updateStudyTime = async (
  taskId: number,
  request: UpdateStudyTimeRequest
): Promise<{ id: number; studyTime: number }> => {
  const response = await apiClient.patch<
    ApiResponse<{ id: number; studyTime: number }>
  >(`/mentee/tasks/${taskId}/study-time`, request)

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '시간 기록에 실패했습니다.')
  }

  return response.data.data
}

/**
 * 할 일 완료 토글
 * @param taskId - 할 일 ID
 */
export const toggleTaskCompletion = async (
  taskId: number
): Promise<{ id: number; isCompleted: boolean }> => {
  const response = await apiClient.patch<
    ApiResponse<{ id: number; isCompleted: boolean }>
  >(`/mentee/tasks/${taskId}/complete`)

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '할 일 상태 변경에 실패했습니다.')
  }

  return response.data.data
}

/**
 * 어제자 피드백 조회
 */
export const getYesterdayFeedback =
  async (): Promise<YesterdayFeedbackResponse> => {
    const response = await apiClient.get<
      ApiResponse<YesterdayFeedbackResponse>
    >('/mentee/feedbacks/yesterday')

    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.message || '피드백 조회에 실패했습니다.'
      )
    }

    return response.data.data
  }

/**
 * 코멘트/질문 등록
 */
export const createComment = async (
  request: CreateCommentRequest
): Promise<Comment> => {
  const response = await apiClient.post<ApiResponse<Comment>>(
    '/mentee/comments',
    request
  )

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '코멘트 등록에 실패했습니다.')
  }

  return response.data.data
}

/**
 * 플래너 마감/피드백 요청
 * @param date - 마감할 날짜 (YYYY-MM-DD)
 * @param tasks - 선택된 할일 ID 목록
 */
export const completePlanner = async (
  date: string,
  tasks: number[]
): Promise<CompletePlannerResponse> => {
  const response = await apiClient.post<
    ApiResponse<CompletePlannerResponse>
  >(`/mentee/planner/${date}/complete`, { tasks })

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '플래너 마감에 실패했습니다.')
  }

  return response.data.data
}

/**
 * Zoom 미팅 신청
 */
export const createZoomMeeting = async (
  request: CreateZoomMeetingRequest
): Promise<ZoomMeeting> => {
  const response = await apiClient.post<ApiResponse<ZoomMeeting>>(
    '/mentee/zoom-meetings',
    request
  )

  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.message || 'Zoom 미팅 신청에 실패했습니다.'
    )
  }

  return response.data.data
}

/**
 * Zoom 미팅 신청 내역 조회
 * @param status - 상태 필터 (PENDING/CONFIRMED/CANCELLED, 선택)
 */
export const getZoomMeetings = async (
  status?: string
): Promise<ZoomMeetingsResponse> => {
  const response = await apiClient.get<ApiResponse<ZoomMeetingsResponse>>(
    '/mentee/zoom-meetings',
    status ? { params: { status } } : undefined
  )

  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.message || 'Zoom 미팅 내역 조회에 실패했습니다.'
    )
  }

  return response.data.data
}

/**
 * 약점 맞춤 솔루션 목록 조회
 * @param subject - 과목 필터 (KOREAN/ENGLISH/MATH, 선택)
 */
export const getSolutions = async (
  subject?: string
): Promise<import('@/types/api').SolutionsResponse> => {
  const response = await apiClient.get<
    ApiResponse<import('@/types/api').SolutionsResponse>
  >('/mentee/solutions', subject ? { params: { subject } } : undefined)

  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.message || '솔루션 목록 조회에 실패했습니다.'
    )
  }

  return response.data.data
}

/**
 * 월간 계획표 조회
 * @param year - 연도
 * @param month - 월 (1-12)
 */
export const getMonthlyPlan = async (
  year: number,
  month: number
): Promise<import('@/types/api').MonthlyPlanResponse> => {
  const response = await apiClient.get<
    ApiResponse<import('@/types/api').MonthlyPlanResponse>
  >('/mentee/monthly-plan', { params: { year, month } })

  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.message || '월간 계획표 조회에 실패했습니다.'
    )
  }

  return response.data.data
}

/**
 * 칼럼 목록 조회
 * @param page - 페이지 번호 (기본값: 0)
 * @param size - 페이지 크기 (기본값: 10)
 */
export const getColumns = async (
  page: number = 0,
  size: number = 10
): Promise<import('@/types/api').ColumnsResponse> => {
  const response = await apiClient.get<
    ApiResponse<import('@/types/api').ColumnsResponse>
  >('/mentee/columns', { params: { page, size } })

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '칼럼 목록 조회에 실패했습니다.')
  }

  return response.data.data
}

/**
 * 과제 제출 (인증 사진 업로드)
 * @param taskId - 할 일 ID
 * @param imageFile - 업로드할 이미지 파일
 */
export const submitTaskImage = async (
  taskId: number,
  imageFile: File
): Promise<import('@/types/api').TaskSubmission> => {
  const formData = new FormData()
  formData.append('image', imageFile)

  const response = await apiClient.post<
    ApiResponse<import('@/types/api').TaskSubmission>
  >(`/mentee/tasks/${taskId}/submission`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '과제 제출에 실패했습니다.')
  }

  return response.data.data
}

/**
 * 날짜별 피드백 조회
 * @param date - 조회할 날짜 (YYYY-MM-DD)
 */
export const getFeedbacksByDate = async (
  date: string
): Promise<import('@/types/api').YesterdayFeedbackResponse> => {
  const response = await apiClient.get<
    ApiResponse<import('@/types/api').YesterdayFeedbackResponse>
  >('/mentee/feedbacks', { params: { date } })

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '피드백 조회에 실패했습니다.')
  }

  return response.data.data
}
