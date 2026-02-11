// 공통 API 응답 타입
export interface ApiResponse<T> {
  success: boolean
  data: T | null
  message: string | null
  errorCode?: string
}

// 사용자 역할
export type UserRole = 'MENTOR' | 'MENTEE'

// 로그인 요청
export interface LoginRequest {
  loginId: string
  password: string
}

// 로그인 응답 - 사용자 정보
export interface User {
  id: number
  name: string
  role: UserRole
  profileImageUrl: string
}

// 로그인 응답 - 전체 데이터
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user: User
}

// 토큰 갱신 요청
export interface RefreshTokenRequest {
  refreshToken: string
}

// 토큰 갱신 응답
export interface RefreshTokenResponse {
  accessToken: string
  expiresIn: number
}

// === 멘티 API 타입 ===

// 과목 코드
export type Subject = 'KOREAN' | 'ENGLISH' | 'MATH'

// 할 일 (Task)
export interface Task {
  id: number
  title: string
  subject: Subject
  subjectName: string
  goalId: number | null
  goalTitle: string | null
  studyTime: number | null
  completed: boolean
  mentorAssigned: boolean
  mentorConfirmed: boolean
  hasSubmission: boolean
  hasFeedback: boolean
  materialCount: number
  uploadRequired: boolean
  menteeCompleted: boolean
  date?: string
}

// 할 일 목록 조회 응답
export interface TasksResponse {
  date: string
  tasks: Task[]
  summary: {
    total: number
    completed: number
    totalStudyTime: number
  }
}

// 할 일 추가 요청
export interface CreateTaskRequest {
  title: string
  date: string
  subject?: Subject
}

// 공부시간 기록 요청
export interface UpdateStudyTimeRequest {
  studyTime: number
}

// 할 일 완료 토글 요청
export interface ToggleTaskCompletionRequest {
  isCompleted: boolean
}

// 할 일 상세 조회 응답
export interface TaskDetailResponse {
  id: number
  title: string
  date: string
  subject: Subject
  subjectName: string
  goal: {
    id: number
    title: string
    subject: Subject
  } | null
  studyTime: number | null
  mentorAssigned: boolean
  mentorConfirmed: boolean
  materials: TaskMaterial[]
  submission: TaskSubmission | null
  feedback: Feedback | null
  createdAt: string
}

// 학습지 자료
export interface TaskMaterial {
  id: number
  fileName: string
  fileType: string
  fileSize: number
  downloadUrl: string
}

// 과제 제출
export interface TaskSubmission {
  id: number
  imageUrl: string
  submittedAt: string
}

// 피드백
export interface Feedback {
  id: number
  taskId: number
  taskTitle: string
  subject: Subject
  subjectName: string
  isImportant: boolean
  summary: string | null
  content?: string
  createdAt: string
}

// 어제자 피드백 응답
export interface YesterdayFeedbackResponse {
  date: string
  feedbacks: Feedback[]
  overallComment: string | null
}

// 코멘트 등록 요청
export interface CreateCommentRequest {
  content: string
  date: string
}

// 코멘트 응답
export interface Comment {
  id: number
  content: string
  date: string
  createdAt: string
}

// 플래너 마감 응답
export interface CompletePlannerResponse {
  date: string
  completedAt: string
  status: string
}

// Zoom 미팅 신청 요청
export interface CreateZoomMeetingRequest {
  preferredDate: string
  preferredTime: string
}

// Zoom 미팅 응답
export interface ZoomMeeting {
  id: number
  preferredDate: string
  preferredTime: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  createdAt: string
  confirmedAt?: string
  studentName?: string
}

// Zoom 미팅 목록 조회 응답
export interface ZoomMeetingsResponse {
  meetings: ZoomMeeting[]
}

// 알림 타입
export type NotificationType = 'ZOOM_REQUESTED' | 'PLANNER_COMPLETED' | 'TASK_SUBMITTED'

// 알림
export interface Notification {
  id: number
  type: NotificationType
  title: string
  message: string
  relatedId: number | null
  read: boolean
  createdAt: string
  studentName: string
  requestDate?: {
    date: string
    time: string
  }
}

// 알림 목록 조회 응답
export interface NotificationsResponse {
  notifications: Notification[]
  unreadCount: number
}

// === 학습자료 API 타입 ===

// 약점 맞춤 솔루션
export interface Material {
  id: number
  fileName: string
  fileType: string
  downloadUrl: string
}

export interface Solution {
  id: number
  title: string
  subject: Subject
  subjectName: string
  materials: Material[]
}

export interface SolutionsResponse {
  solutions: Solution[]
}

// 월간 계획표
export interface MonthlyPlan {
  date: string
  dayOfWeek: string
  taskCount: number
  completedCount: number
  hasTask: boolean
}

export interface MonthlyPlanResponse {
  year: number
  month: number
  plans: MonthlyPlan[]
}

// 칼럼
export interface Column {
  id: number
  title: string
  summary: string
  thumbnailUrl: string
  createdAt: string
}

export interface ColumnsResponse {
  columns: Column[]
  pagination: {
    page: number
    size: number
    totalElements: number
    totalPages: number
  }
}

// === 멘토 API 타입 ===

// 멘티 정보 (멘토가 보는)
export interface Student {
  id: number
  name: string
  profileImageUrl: string
  todayTaskSummary: {
    total: number
    completed: number
    pendingConfirmation: number
  }
  lastFeedbackDate: string | null
  hasPendingFeedback: boolean
}

// 멘티 목록 조회 응답
export interface StudentsResponse {
  students: Student[]
}

// 멘티 할 일 목록 조회 응답 (멘토용)
export interface MentorTasksResponse {
  studentId: number
  studentName: string
  date: string
  completed: boolean
  tasks: MentorTask[]
  comments: any[]
  summary?: {
    total: number
    completed: number
    pendingConfirmation: number
    totalStudyTime: number
  }
}

// 멘토가 보는 할 일
export interface MentorTask {
  id: number
  title: string
  subject: Subject
  subjectName: string
  checked: boolean
  goal: {
    id: number
    title: string
  } | null
  materials: TaskMaterial[]
  studyTime: number | null
  mentorConfirmed: boolean
  uploadRequired: boolean
  submission: TaskSubmission | null
  feedback: Feedback | null
  hasFeedback: boolean
}

// 멘토용 솔루션 (linkedTaskCount, createdAt 포함)
export interface MentorSolution {
  id: number
  title: string
  subject: Subject
  subjectName: string
  materials: Material[]
  linkedTaskCount: number
  createdAt: string
}

// 멘토 솔루션 목록 조회 응답
export interface MentorSolutionsResponse {
  studentId: number
  studentName: string
  solutions: MentorSolution[]
}

// 솔루션 등록 요청 (multipart/form-data)
export interface CreateSolutionRequest {
  title: string
  subject: Subject
  materials?: File[]
}

// 솔루션 수정 요청 (multipart/form-data)
export interface UpdateSolutionRequest {
  title?: string
  subject?: Subject
  materials?: File[]
  deleteFileIds?: number[]
}

// 총평 조회 응답
export interface OverallFeedbackResponse {
  id: number
  date: string
  content: string
  hasOverallFeedback: boolean
  updatedAt: string
}
