# Mock 데이터 시스템

API 서버가 불안정하거나 개발 중일 때 Mock 데이터로 프론트엔드 개발을 진행할 수 있습니다.

## 사용 방법

### 1. Mock 모드 활성화/비활성화

`src/lib/api/useMock.ts` 파일에서 설정:

```typescript
// Mock 데이터 사용
export const USE_MOCK_DATA = true

// 실제 API 사용
export const USE_MOCK_DATA = false
```

### 2. Mock 데이터 사용하기

Mock을 지원하는 API를 사용할 때는 `menteeMock.ts`에서 import:

```typescript
// Mock 지원 API
import { getFeedbacksByDate } from '@/lib/api/menteeMock'

// 실제 API만
import { getFeedbacksByDate } from '@/lib/api/mentee'
```

### 3. Mock 데이터 수정

`src/lib/mock/menteeData.ts`에서 Mock 데이터를 수정할 수 있습니다.

```typescript
export const mockYesterdayFeedback: YesterdayFeedbackResponse = {
  date: '2025-01-26',
  feedbacks: [
    // 여기에 Mock 피드백 데이터 추가
  ],
  overallComment: '총평 내용',
}
```

## 현재 Mock 지원 API

### 멘티 (Mentee)

- ✅ `getFeedbacksByDate(date)` - 날짜별 피드백 조회
- ✅ `getYesterdayFeedback()` - 어제자 피드백 조회

### 추가 예정

- `getTasks(date)` - 할 일 목록 조회
- `getTaskDetail(taskId)` - 할 일 상세 조회
- `getSolutions()` - 솔루션 목록 조회
- `getMonthlyPlan()` - 월간 계획표 조회
- `getColumns()` - 칼럼 목록 조회

## Mock 데이터 구조

모든 Mock 데이터는 실제 API 스펙과 동일한 구조를 따릅니다:

```typescript
interface ApiResponse<T> {
  success: boolean
  data: T | null
  message: string | null
}
```

## 주의사항

1. **프로덕션에서는 반드시 비활성화**: `USE_MOCK_DATA = false`로 설정
2. **타입 일치**: Mock 데이터는 실제 API 타입과 정확히 일치해야 함
3. **딜레이 설정**: `MOCK_DELAY`로 실제 API 호출과 유사한 경험 제공

## 새로운 Mock API 추가하기

1. `menteeData.ts`에 Mock 데이터 추가
2. `menteeMock.ts`에 Mock 함수 추가
3. 컴포넌트에서 `menteeMock`에서 import

예시:

```typescript
// 1. menteeData.ts
export const mockTasks: TasksResponse = {
  // Mock 데이터
}

// 2. menteeMock.ts
export const getTasks = async (date: string): Promise<TasksResponse> => {
  if (USE_MOCK_DATA) {
    await delay(MOCK_DELAY)
    return mockData.mockTasks
  }
  return realApi.getTasks(date)
}

// 3. 컴포넌트
import { getTasks } from '@/lib/api/menteeMock'
```
