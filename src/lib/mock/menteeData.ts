import type {
  TasksResponse,
  TaskDetailResponse,
  YesterdayFeedbackResponse,
  Task,
  TaskMaterial,
  TaskSubmission,
  Feedback,
  SolutionsResponse,
  MonthlyPlanResponse,
  ColumnsResponse,
} from '@/types/api'

// 할 일 목록 Mock 데이터
export const mockTasks: TasksResponse = {
  date: '2025-01-27',
  tasks: [
    {
      id: 1,
      title: '수학 문제집 3단원 1~20번',
      subject: 'MATH',
      subjectName: '수학',
      goalId: 1,
      goalTitle: '수학 기본 개념 마스터',
      studyTime: 45,
      isCompleted: true,
      isMentorAssigned: true,
      isMentorConfirmed: true,
      hasSubmission: true,
      hasFeedback: true,
      materialCount: 2,
      date: '2025-01-27',
    },
    {
      id: 2,
      title: '영어 단어 암기 50개',
      subject: 'ENGLISH',
      subjectName: '영어',
      goalId: 2,
      goalTitle: '영어 어휘력 향상',
      studyTime: 30,
      isCompleted: true,
      isMentorAssigned: true,
      isMentorConfirmed: false,
      hasSubmission: true,
      hasFeedback: false,
      materialCount: 1,
      date: '2025-01-27',
    },
    {
      id: 3,
      title: '국어 비문학 지문 분석 3지문',
      subject: 'KOREAN',
      subjectName: '국어',
      goalId: 3,
      goalTitle: '국어 독해력 향상',
      studyTime: 40,
      isCompleted: true,
      isMentorAssigned: true,
      isMentorConfirmed: true,
      hasSubmission: true,
      hasFeedback: true,
      materialCount: 3,
      date: '2025-01-27',
    },
    {
      id: 4,
      title: '수학 오답노트 정리',
      subject: 'MATH',
      subjectName: '수학',
      goalId: null,
      goalTitle: null,
      studyTime: 20,
      isCompleted: true,
      isMentorAssigned: false,
      isMentorConfirmed: false,
      hasSubmission: false,
      hasFeedback: false,
      materialCount: 0,
      date: '2025-01-27',
    },
    {
      id: 5,
      title: '영어 듣기 30분',
      subject: 'ENGLISH',
      subjectName: '영어',
      goalId: null,
      goalTitle: null,
      studyTime: null,
      isCompleted: false,
      isMentorAssigned: false,
      isMentorConfirmed: false,
      hasSubmission: false,
      hasFeedback: false,
      materialCount: 0,
      date: '2025-01-27',
    },
    {
      id: 6,
      title: '수학 확률과 통계 유형 풀이',
      subject: 'MATH',
      subjectName: '수학',
      goalId: 1,
      goalTitle: '수학 기본 개념 마스터',
      studyTime: 50,
      isCompleted: true,
      isMentorAssigned: true,
      isMentorConfirmed: false,
      hasSubmission: true,
      hasFeedback: false,
      materialCount: 2,
      date: '2025-01-27',
    },
    {
      id: 7,
      title: '영어 구문 분석 연습',
      subject: 'ENGLISH',
      subjectName: '영어',
      goalId: 2,
      goalTitle: '영어 어휘력 향상',
      studyTime: null,
      isCompleted: false,
      isMentorAssigned: true,
      isMentorConfirmed: false,
      hasSubmission: false,
      hasFeedback: false,
      materialCount: 1,
      date: '2025-01-27',
    },
    {
      id: 8,
      title: '국어 문학 작품 감상문 작성',
      subject: 'KOREAN',
      subjectName: '국어',
      goalId: 3,
      goalTitle: '국어 독해력 향상',
      studyTime: null,
      isCompleted: false,
      isMentorAssigned: true,
      isMentorConfirmed: false,
      hasSubmission: false,
      hasFeedback: false,
      materialCount: 2,
      date: '2025-01-27',
    },
    {
      id: 9,
      title: '수학 교과서 복습',
      subject: 'MATH',
      subjectName: '수학',
      goalId: null,
      goalTitle: null,
      studyTime: 25,
      isCompleted: true,
      isMentorAssigned: false,
      isMentorConfirmed: false,
      hasSubmission: false,
      hasFeedback: false,
      materialCount: 0,
      date: '2025-01-27',
    },
    {
      id: 10,
      title: '영어 독해 5지문',
      subject: 'ENGLISH',
      subjectName: '영어',
      goalId: null,
      goalTitle: null,
      studyTime: null,
      isCompleted: false,
      isMentorAssigned: false,
      isMentorConfirmed: false,
      hasSubmission: false,
      hasFeedback: false,
      materialCount: 0,
      date: '2025-01-27',
    },
    {
      id: 11,
      title: '국어 어휘 암기 30개',
      subject: 'KOREAN',
      subjectName: '국어',
      goalId: null,
      goalTitle: null,
      studyTime: 15,
      isCompleted: true,
      isMentorAssigned: false,
      isMentorConfirmed: false,
      hasSubmission: false,
      hasFeedback: false,
      materialCount: 0,
      date: '2025-01-27',
    },
    {
      id: 12,
      title: 'EBS 수능특강 영어 Unit 5',
      subject: 'ENGLISH',
      subjectName: '영어',
      goalId: 2,
      goalTitle: '영어 어휘력 향상',
      studyTime: 35,
      isCompleted: true,
      isMentorAssigned: true,
      isMentorConfirmed: true,
      hasSubmission: true,
      hasFeedback: true,
      materialCount: 2,
      date: '2025-01-27',
    },
  ],
  summary: {
    total: 12,
    completed: 7,
    totalStudyTime: 260,
  },
}

// 할 일 상세 Mock 데이터
export const mockTaskDetail: TaskDetailResponse = {
  id: 1,
  title: '수학 문제집 3단원 1~20번',
  date: '2025-01-27',
  subject: 'MATH',
  subjectName: '수학',
  goal: {
    id: 1,
    title: '수학 기본 개념 마스터',
    subject: 'MATH',
  },
  studyTime: 45,
  mentorAssigned: true,
  mentorConfirmed: true,
  materials: [
    {
      id: 1,
      fileName: '수학_3단원_문제집.pdf',
      fileType: 'application/pdf',
      fileSize: 2048000,
      downloadUrl: '/files/1/download',
    },
    {
      id: 2,
      fileName: '수학_3단원_해설.pdf',
      fileType: 'application/pdf',
      fileSize: 1536000,
      downloadUrl: '/files/2/download',
    },
  ],
  submission: {
    id: 101,
    imageUrl: '/files/101/view',
    submittedAt: '2025-01-27T15:30:00',
  },
  feedback: {
    id: 301,
    taskId: 1,
    taskTitle: '수학 문제집 3단원 1~20번',
    subject: 'MATH',
    subjectName: '수학',
    isImportant: true,
    summary: '함수 개념 이해도 향상, 응용 문제 추가 연습 필요',
    content:
      '기본 개념은 잘 이해하고 있습니다. 응용 문제에서 실수가 조금 있었는데, 문제를 끝까지 꼼꼼히 읽는 습관을 들이면 좋겠어요.',
    createdAt: '2025-01-27T22:00:00',
  },
  createdAt: '2025-01-27T09:00:00',
}

// 어제자 피드백 Mock 데이터
export const mockYesterdayFeedback: YesterdayFeedbackResponse = {
  date: '2025-01-26',
  feedbacks: [
    {
      id: 301,
      taskId: 5,
      taskTitle: '수능완성 4회 전범위',
      subject: 'KOREAN',
      subjectName: '국어',
      isImportant: true,
      summary: '접속부사 활용 부분 다시 복습 필요',
      content:
        '오늘 풀이한 문학 작품 해석은 전반적으로 잘 했습니다. 다만 접속부사 활용 부분에서 아직 개념이 헷갈리는 것 같아요. 내일 추가 자료 올려드릴게요.',
      createdAt: '2025-01-26T22:00:00',
    },
    {
      id: 302,
      taskId: 6,
      taskTitle: 'EBS 올림포스 Unit 4',
      subject: 'ENGLISH',
      subjectName: '영어',
      isImportant: false,
      summary: null,
      content: '빈칸 추론 정답률이 많이 올랐어요! 이 페이스 유지해주세요.',
      createdAt: '2025-01-26T22:05:00',
    },
    {
      id: 303,
      taskId: 7,
      taskTitle: '수학 확률과 통계 유형 풀이',
      subject: 'MATH',
      subjectName: '수학',
      isImportant: true,
      summary: '조건부확률 공식 암기 → 실전 적용 연습',
      content:
        '기본 확률 문제는 안정적입니다. 조건부확률에서 P(A∩B)와 P(B|A) 혼동이 있으니 공식을 다시 정리하고 유형별 3문제씩 풀어보세요.',
      createdAt: '2025-01-26T22:10:00',
    },
  ],
  overallComment:
    '오늘 전체적으로 학습 시간이 잘 확보되었고, 국어와 영어 모두 꾸준한 성장이 보입니다. 수학은 조건부확률 파트에 집중해서 이번 주 안에 마무리합시다. 💪',
}

// 날짜별 피드백 Mock 데이터 - 날짜에 따라 다른 데이터 반환
export const mockFeedbackByDate = (date: string): YesterdayFeedbackResponse => {
  // 날짜별 피드백 데이터 맵
  const feedbackMap: Record<string, YesterdayFeedbackResponse> = {
    '2025-01-27': {
      date: '2025-01-27',
      feedbacks: [
        {
          id: 501,
          taskId: 1,
          taskTitle: '수학 문제집 3단원 1~20번',
          subject: 'MATH',
          subjectName: '수학',
          isImportant: true,
          summary: '함수 개념 이해도 향상됨',
          content:
            '기본 개념 문제는 완벽하게 풀었습니다. 응용 문제에서 실수가 몇 개 있었는데, 문제를 끝까지 꼼꼼히 읽는 습관을 들이면 좋겠어요.',
          createdAt: '2025-01-27T22:00:00',
        },
        {
          id: 502,
          taskId: 2,
          taskTitle: '영어 단어 암기 50개',
          subject: 'ENGLISH',
          subjectName: '영어',
          isImportant: false,
          summary: null,
          content: '단어 테스트 결과 48개 정답! 잘하고 있어요. 이 페이스 유지하세요.',
          createdAt: '2025-01-27T22:10:00',
        },
      ],
      overallComment:
        '오늘 전체적으로 집중력이 좋았습니다. 수학 응용 문제 실수만 줄이면 완벽해요! 💪',
    },
    '2025-01-26': mockYesterdayFeedback,
    '2025-01-25': {
      date: '2025-01-25',
      feedbacks: [
        {
          id: 601,
          taskId: 20,
          taskTitle: '영어 독해 5지문',
          subject: 'ENGLISH',
          subjectName: '영어',
          isImportant: true,
          summary: '빈칸 추론 유형 약점 발견',
          content:
            '시간 내에 다 풀었지만 빈칸 추론 2문제를 틀렸습니다. 문맥 파악 연습이 더 필요해요. 내일 추가 자료 제공할게요.',
          createdAt: '2025-01-25T22:00:00',
        },
        {
          id: 602,
          taskId: 21,
          taskTitle: '수학 미적분 연습',
          subject: 'MATH',
          subjectName: '수학',
          isImportant: false,
          summary: null,
          content: '미분 계산 정확도가 많이 올랐어요. 계속 이 상태 유지하세요!',
          createdAt: '2025-01-25T22:15:00',
        },
        {
          id: 603,
          taskId: 22,
          taskTitle: '국어 문학 작품 분석',
          subject: 'KOREAN',
          subjectName: '국어',
          isImportant: true,
          summary: '시적 화자 파악 연습 필요',
          content:
            '작품의 표현 기법은 잘 찾아냈습니다. 하지만 시적 화자의 태도와 정서를 파악하는 부분에서 어려움이 있는 것 같아요.',
          createdAt: '2025-01-25T22:20:00',
        },
      ],
      overallComment:
        '1월 25일 학습: 꾸준히 공부하는 모습이 보기 좋습니다. 영어 빈칸 추론과 국어 화자 파악 집중 연습해봅시다.',
    },
    '2025-01-24': {
      date: '2025-01-24',
      feedbacks: [
        {
          id: 701,
          taskId: 30,
          taskTitle: '수학 확률과 통계',
          subject: 'MATH',
          subjectName: '수학',
          isImportant: true,
          summary: '경우의 수 계산 실수 주의',
          content:
            '확률 개념은 이해했는데 경우의 수를 계산할 때 빠뜨리는 경우가 있어요. 체계적으로 나열하는 연습을 하세요.',
          createdAt: '2025-01-24T22:00:00',
        },
      ],
      overallComment: '1월 24일 학습: 수학에 집중한 하루였네요. 꾸준히 하면 실력이 늘 거예요!',
    },
  }

  // 해당 날짜의 피드백이 있으면 반환, 없으면 기본 메시지
  if (feedbackMap[date]) {
    return feedbackMap[date]
  }

  // 기본 응답 (피드백 없음)
  return {
    date,
    feedbacks: [],
    overallComment: null,
  }
}

// 솔루션 Mock 데이터
export const mockSolutions: SolutionsResponse = {
  solutions: [
    {
      id: 1,
      title: '수학 함수 약점 보완',
      subject: 'MATH',
      subjectName: '수학',
      materials: [
        {
          id: 10,
          fileName: '함수_기본개념.pdf',
          fileType: 'application/pdf',
          downloadUrl: '/files/10/download',
        },
        {
          id: 11,
          fileName: '함수_응용문제.pdf',
          fileType: 'application/pdf',
          downloadUrl: '/files/11/download',
        },
      ],
    },
    {
      id: 2,
      title: '영어 독해 속도 향상',
      subject: 'ENGLISH',
      subjectName: '영어',
      materials: [
        {
          id: 12,
          fileName: '독해_스킬업.pdf',
          fileType: 'application/pdf',
          downloadUrl: '/files/12/download',
        },
      ],
    },
  ],
}

// 월간 계획표 Mock 데이터
export const mockMonthlyPlan: MonthlyPlanResponse = {
  year: 2025,
  month: 1,
  plans: [
    {
      date: '2025-01-01',
      dayOfWeek: '수',
      taskCount: 0,
      completedCount: 0,
      hasTask: false,
    },
    {
      date: '2025-01-02',
      dayOfWeek: '목',
      taskCount: 3,
      completedCount: 3,
      hasTask: true,
    },
    {
      date: '2025-01-03',
      dayOfWeek: '금',
      taskCount: 4,
      completedCount: 2,
      hasTask: true,
    },
    // ... 나머지 날짜들
  ],
}

// 칼럼 Mock 데이터
export const mockColumns: ColumnsResponse = {
  columns: [
    {
      id: 1,
      title: '효율적인 수학 공부법',
      summary: '수학 성적을 올리는 3가지 핵심 전략',
      thumbnailUrl: '/images/column1.jpg',
      createdAt: '2025-01-20T10:00:00',
    },
    {
      id: 2,
      title: '영어 단어 암기의 비밀',
      summary: '과학적으로 증명된 효과적인 단어 암기법',
      thumbnailUrl: '/images/column2.jpg',
      createdAt: '2025-01-18T10:00:00',
    },
  ],
  pagination: {
    page: 0,
    size: 10,
    totalElements: 2,
    totalPages: 1,
  },
}
