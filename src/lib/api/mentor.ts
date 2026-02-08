import { apiClient } from './client'
import type {
  ApiResponse,
  StudentsResponse,
  MentorTasksResponse,
  MentorSolutionsResponse,
  MentorSolution,
  Subject,
} from '@/types/api'

/**
 * 담당 멘티 목록 조회
 */
export const getStudents = async (): Promise<StudentsResponse> => {
  const response = await apiClient.get<ApiResponse<StudentsResponse>>(
    '/mentor/students'
  )

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '멘티 목록 조회에 실패했습니다.')
  }

  return response.data.data
}

/**
 * 멘티 할 일 목록 조회
 * @param studentId - 멘티 ID
 * @param date - 조회할 날짜 (YYYY-MM-DD)
 */
export const getStudentTasks = async (
  studentId: number,
  date: string
): Promise<MentorTasksResponse> => {
  const response = await apiClient.get<ApiResponse<MentorTasksResponse>>(
    `/mentor/students/${studentId}/tasks`,
    { params: { date } }
  )

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '할 일 목록 조회에 실패했습니다.')
  }

  return response.data.data
}

/**
 * 멘티 솔루션 목록 조회
 * @param studentId - 멘티 ID
 * @param subject - 과목 필터 (선택)
 */
export const getStudentSolutions = async (
  studentId: number,
  subject?: Subject
): Promise<MentorSolutionsResponse> => {
  const response = await apiClient.get<ApiResponse<MentorSolutionsResponse>>(
    `/mentor/students/${studentId}/solutions`,
    subject ? { params: { subject } } : undefined
  )

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '솔루션 목록 조회에 실패했습니다.')
  }

  return response.data.data
}

/**
 * 솔루션 등록
 * @param studentId - 멘티 ID
 * @param title - 보완점 제목
 * @param subject - 과목
 * @param materials - 추가자료 파일 (선택)
 */
export const createSolution = async (
  studentId: number,
  title: string,
  subject: Subject,
  materials?: File[]
): Promise<MentorSolution> => {
  const formData = new FormData()
  formData.append('title', title)
  formData.append('subject', subject)

  if (materials && materials.length > 0) {
    materials.forEach((file) => {
      formData.append('materials', file)
    })
  }

  const response = await apiClient.post<ApiResponse<MentorSolution>>(
    `/mentor/students/${studentId}/solutions`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '솔루션 등록에 실패했습니다.')
  }

  return response.data.data
}

/**
 * 솔루션 수정
 * @param studentId - 멘티 ID
 * @param solutionId - 솔루션 ID
 * @param title - 보완점 제목 (선택)
 * @param subject - 과목 (선택)
 * @param materials - 추가할 파일 (선택)
 * @param deleteFileIds - 삭제할 파일 ID 목록 (선택)
 */
export const updateSolution = async (
  studentId: number,
  solutionId: number,
  title?: string,
  subject?: Subject,
  materials?: File[],
  deleteFileIds?: number[]
): Promise<MentorSolution> => {
  const formData = new FormData()

  if (title) formData.append('title', title)
  if (subject) formData.append('subject', subject)

  if (materials && materials.length > 0) {
    materials.forEach((file) => {
      formData.append('materials', file)
    })
  }

  if (deleteFileIds && deleteFileIds.length > 0) {
    deleteFileIds.forEach((id) => {
      formData.append('deleteFileIds', id.toString())
    })
  }

  const response = await apiClient.put<ApiResponse<MentorSolution>>(
    `/mentor/students/${studentId}/solutions/${solutionId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '솔루션 수정에 실패했습니다.')
  }

  return response.data.data
}

/**
 * 솔루션 삭제
 * @param studentId - 멘티 ID
 * @param solutionId - 솔루션 ID
 */
export const deleteSolution = async (
  studentId: number,
  solutionId: number
): Promise<void> => {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/mentor/students/${studentId}/solutions/${solutionId}`
  )

  if (!response.data.success) {
    throw new Error(response.data.message || '솔루션 삭제에 실패했습니다.')
  }
}
