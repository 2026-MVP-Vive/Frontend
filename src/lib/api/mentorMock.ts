import { USE_MOCK_DATA, MOCK_DELAY } from './useMock'
import * as realApi from './mentor'
import * as mockData from '../mock/mentorData'
import type { StudentsResponse, MentorTasksResponse } from '@/types/api'

// Mock 응답 지연 헬퍼
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 담당 멘티 목록 조회 (Mock 지원)
 */
export const getStudents = async (): Promise<StudentsResponse> => {
  if (USE_MOCK_DATA) {
    await delay(MOCK_DELAY)
    return mockData.mockStudents
  }
  return realApi.getStudents()
}

/**
 * 멘티 할 일 목록 조회 (Mock 지원)
 */
export const getStudentTasks = async (
  studentId: number,
  date: string
): Promise<MentorTasksResponse> => {
  if (USE_MOCK_DATA) {
    await delay(MOCK_DELAY)
    return mockData.mockStudentTasks(studentId, date)
  }
  return realApi.getStudentTasks(studentId, date)
}

// 나머지 API는 실제 API 그대로 export
export * from './mentor'
