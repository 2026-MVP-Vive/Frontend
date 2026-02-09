## 프로젝트 API 연동 가이드

# 🔄 API 연동 워크플로우

각 화면의 API 연동 작업 시 다음 단계를 따릅니다:

## 1️⃣ 기획 문서 분석

**순서**: MVP_PLAN.md → wire-frame.html → API_DETAIL_SPEC.md

### 1-1. MVP_PLAN.md 확인

- 해당 화면의 기능 요구사항 파악
- UI/UX 구조 이해
- 필수/선택 기능 구분
- 예: "멘티 - 일일 플래너" 섹션 읽기

### 1-2. wire-frame.html 확인

- 실제 UI 디자인 확인
- 버튼 색상, 레이아웃, 텍스트 확인
- 인터랙션 흐름 파악

### 1-3. API_DETAIL_SPEC.md 확인

- 필요한 API 엔드포인트 찾기
- Request/Response 스펙 확인
- 날짜 형식, 필수/선택 필드 확인

## 2️⃣ 구현

### 2-1. 타입 정의 (src/types/api.ts)

```typescript
// API 응답 타입 추가
export interface Task {
  id: number;
  title: string;
  // ... API_DETAIL_SPEC.md의 응답 스펙과 일치하도록
}
```

### 2-2. API 함수 작성 (src/lib/api/)

```typescript
// API_DETAIL_SPEC.md의 스펙 그대로 구현
export const getTasks = async (date: string): Promise<TasksResponse> => {
  const response = await apiClient.get<ApiResponse<TasksResponse>>(
    "/mentee/tasks",
    { params: { date } }, // 스펙의 Query Parameters 그대로
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "조회 실패");
  }

  return response.data.data;
};
```

### 2-3. 컴포넌트 연동

- useState로 상태 관리
- useEffect로 데이터 로드
- 에러 처리 추가
- 로딩 상태 처리

## 3️⃣ Chrome MCP 테스트

### 3-1. 초기 테스트

```bash
# Chrome MCP로 페이지 접속
mcp__chrome-devtools__navigate_page(url: "http://localhost:5173/...")

# 스냅샷으로 UI 확인
mcp__chrome-devtools__take_snapshot()

# 스크린샷으로 시각적 확인
mcp__chrome-devtools__take_screenshot(fullPage: true)
```

### 3-2. 인터랙션 테스트

```bash
# 버튼 클릭
mcp__chrome-devtools__click(uid: "...")

# 입력란 채우기
mcp__chrome-devtools__fill(uid: "...", value: "...")

# JavaScript 실행 (복잡한 인터랙션)
mcp__chrome-devtools__evaluate_script(
  function: "() => { /* 실행할 코드 */ }"
)
```

### 3-3. API 호출 확인

```bash
# 네트워크 요청 목록
mcp__chrome-devtools__list_network_requests(
  resourceTypes: ["fetch", "xhr"]
)

# 특정 요청 상세 확인
mcp__chrome-devtools__get_network_request(reqid: ...)
```

## 4️⃣ 에러 디버깅

### API 에러 발생 시

**4-1. Request Body 확인**

```bash
get_network_request(reqid: xxx)
# Request Body를 API_DETAIL_SPEC.md와 비교
```

**4-2. API_DETAIL_SPEC.md와 대조**

- 필드명 일치 확인
- 데이터 타입 확인
- 날짜 형식 확인 (YYYY-MM-DD)
- 필수 필드 누락 확인

**4-3. 에러 패턴**

- **400 에러**: Request 형식 문제 → API_DETAIL_SPEC.md 재확인
- **500 에러**: 백엔드 이슈 → Request Body가 스펙과 일치하면 보류
- **401 에러**: 인증 토큰 문제 → 로그인 재확인

## 5️⃣ 기획 문서 대조 검증

### 5-1. MVP_PLAN.md와 비교

- 모든 필수 기능 구현 확인
- UI 텍스트가 기획과 일치하는지 확인
- 인터랙션 흐름이 기획과 일치하는지 확인

### 5-2. wire-frame.html과 비교

- 버튼 색상 일치 확인
- 레이아웃 일치 확인
- 텍스트 스타일 일치 확인

### 5-3. 부자연스러운 부분 발견

- Chrome MCP로 실제 사용자 플로우 따라가기
- 날짜 이동, 버튼 클릭 등 테스트
- 기획과 다른 동작 찾기
- 예: "날짜 이동할 때마다 API가 불필요하게 재호출되는가?"

## 6️⃣ 반복 테스트

### 체크리스트

- [ ] API 호출이 정상적으로 동작하는가?
- [ ] 로딩 상태가 표시되는가?
- [ ] 에러 처리가 되는가?
- [ ] MVP_PLAN.md의 요구사항을 모두 충족하는가?
- [ ] wire-frame.html과 UI가 일치하는가?
- [ ] 사용자 플로우가 자연스러운가?

---

# 📚 문서 참조 위치

## 기획 문서

- `../Vive_Docs/MVP_PLAN.md` - 서비스 기획 문서 (기능 요구사항)
- `../Vive_Docs/wire-frame.html` - 와이어프레임 (UI/UX 디자인)

## API 문서

- `../Vive_Docs/API_SPEC.md` - API 스펙 간략 버전
- `../Vive_Docs/API_DETAIL_SPEC.md` - API 스펙 상세 버전 ⭐ (주로 사용)
- `../Vive_Docs/DB_SCHEMA.md` - DB 스키마

## API 정보

- **BASE URL**: `https://seolstudy.duckdns.org/api/v1/{endpoint}`
- **인증**: Bearer Token (sessionStorage에 저장)
- **날짜 형식**: `YYYY-MM-DD`

---

# 🔧 실제 작업 예시

## 예시: 멘티 메인 화면 API 연동

```bash
1. MVP_PLAN.md 읽기
   → "2-1. 일일 플래너 (홈)" 섹션 확인
   → 필요한 기능: 오늘 할 일, 어제자 피드백, 코멘트 등록

2. API_DETAIL_SPEC.md에서 API 찾기
   → GET /api/v1/mentee/tasks?date=YYYY-MM-DD
   → GET /api/v1/mentee/feedbacks/yesterday
   → POST /api/v1/mentee/comments

3. 구현
   → src/types/api.ts에 타입 추가
   → src/lib/api/mentee.ts에 API 함수 작성
   → src/pages/MentiMain.tsx에서 연동

4. Chrome MCP 테스트
   → 페이지 로드 확인
   → 네트워크 요청 확인
   → 데이터 렌더링 확인

5. 에러 발생 → API_DETAIL_SPEC.md와 Request Body 비교
   → 날짜 형식이 다름 발견 → 수정

6. 기획 대조
   → MVP_PLAN.md: "어제자 피드백은 어제 날짜 기준"
   → 현재: 날짜 이동마다 API 재호출
   → 수정: 최초 1회만 호출하도록 변경

7. wire-frame.html 대조
   → 버튼 색상이 다름 발견
   → 수정: #3d5af1로 변경
```

---

# ⚠️ 주의사항

## API 연동 시

- **항상 API_DETAIL_SPEC.md를 기준으로 구현**
- Request Body는 스펙과 정확히 일치해야 함
- 날짜 형식은 반드시 `YYYY-MM-DD`

## 테스트 시

- 실제 사용자 플로우를 따라가며 테스트
- 기획 문서와 지속적으로 대조
- 부자연스러운 부분 적극적으로 발견

## 에러 처리

- 500 에러이지만 Request가 스펙과 일치하면 백엔드 이슈로 보류
- 400 에러는 반드시 프론트엔드에서 수정
- 에러 발생 시 항상 API_DETAIL_SPEC.md 재확인

---

# 🎯 작업 시작 명령어 예시

"멘티 메인화면 API 연동해" → 위 워크플로우 자동 실행
"할 일 상세 페이지 구현해" → MVP_PLAN.md 확인 → API 연동 → 테스트
