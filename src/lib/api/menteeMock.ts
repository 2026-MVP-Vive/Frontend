import { USE_MOCK_DATA, MOCK_DELAY } from './useMock'
import * as realApi from './mentee'
import * as mockData from '../mock/menteeData'
import type {
  YesterdayFeedbackResponse,
  TasksResponse,
  TaskDetailResponse,
} from '@/types/api'

// Mock 응답 지연 헬퍼
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 할 일 목록 조회 (Mock 지원)
 */
export const getTasks = async (date: string): Promise<TasksResponse> => {
  if (USE_MOCK_DATA) {
    await delay(MOCK_DELAY)
    return mockData.mockTasks
  }
  return realApi.getTasks(date)
}

/**
 * 할 일 상세 조회 (Mock 지원)
 */
export const getTaskDetail = async (
  taskId: number
): Promise<TaskDetailResponse> => {
  if (USE_MOCK_DATA) {
    await delay(MOCK_DELAY)
    return mockData.mockTaskDetail
  }
  return realApi.getTaskDetail(taskId)
}

/**
 * 날짜별 피드백 조회 (Mock 지원)
 */
export const getFeedbacksByDate = async (
  date: string
): Promise<YesterdayFeedbackResponse> => {
  if (USE_MOCK_DATA) {
    await delay(MOCK_DELAY)
    return mockData.mockFeedbackByDate(date)
  }
  return realApi.getFeedbacksByDate(date)
}

/**
 * 어제자 피드백 조회 (Mock 지원)
 */
export const getYesterdayFeedback =
  async (): Promise<YesterdayFeedbackResponse> => {
    if (USE_MOCK_DATA) {
      await delay(MOCK_DELAY)
      return mockData.mockYesterdayFeedback
    }
    return realApi.getYesterdayFeedback()
  }

// 나머지 API는 실제 API 그대로 export (필요시 Mock 추가 가능)
export * from './mentee'
