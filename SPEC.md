# 역할 기반 반응형 디자인 구현 명세서

## 📋 프로젝트 개요

React PWA 애플리케이션에서 **사용자의 역할(멘토/멘티)**에 따라 다른 UI/UX를 제공하는 시스템을 구현합니다.

- **멘토(Mentor)**: PC 버전 UI (데스크톱 최적화, 모든 기기에서 PC UI 강제)
- **멘티(Mentee)**: 모바일 버전 UI (모바일 최적화, 모든 기기에서 모바일 UI 강제)

---

## 🎯 핵심 요구사항

### 1. 역할 판별 로직

#### 1.1 판별 방법
- **기준**: 사용자 아이디(username)에 포함된 텍스트로 구분
  - `'mentor'` 문자열 포함 → 멘토
  - `'mentee'` 문자열 포함 → 멘티
- **대소문자 처리**: Case-insensitive 검색 권장 (MENTOR, Mentor, mentor 모두 인식)
- **위치**: 아이디 내 어느 위치에든 포함 가능 (prefix, suffix, 중간 모두 가능)

#### 1.2 판별 타이밍
- **로그인 API 응답 받은 즉시** 역할 판별 실행
- 판별 후 sessionStorage에 역할 정보 저장
- 역할에 따라 적절한 UI로 리다이렉트

#### 1.3 판별 실패 처리
- username에 'mentor' 또는 'mentee' 문자열이 없는 경우
- **처리 방식**: 로그인 실패로 처리
- **에러 메시지**: "유효하지 않은 계정입니다. 관리자에게 문의하세요."

---

### 2. 로그인 API 통합

#### 2.1 API 응답 형식
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer"
  },
  "message": "로그인 성공"
}
```

**참고**: 현재 API는 별도의 role 필드를 제공하지 않음. username은 토큰에서 디코딩하거나 별도 API로 조회 필요.

#### 2.2 역할 정보 추출 프로세스
1. 로그인 API 호출 → 토큰 획득
2. 토큰에서 username 추출 (JWT 디코딩 또는 /me API 호출)
3. username에서 역할 판별 (mentor/mentee 문자열 검색)
4. 역할 정보를 sessionStorage에 저장

---

### 3. 상태 관리

#### 3.1 인증 상태 관리
- **도구**: TanStack Query (React Query)
- **저장소**: sessionStorage (탭 닫으면 삭제)

#### 3.2 저장 데이터 구조
```typescript
// sessionStorage keys
{
  "auth_token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_role": "mentor" | "mentee",
  "username": "mentor_john"
}
```

#### 3.3 TanStack Query 활용
```typescript
// 로그인 mutation
const loginMutation = useMutation({
  mutationFn: loginApi,
  onSuccess: (data) => {
    // 1. 토큰 저장
    sessionStorage.setItem('auth_token', data.data.accessToken);

    // 2. 사용자 정보 조회 (username 획득)
    fetchUserInfo(data.data.accessToken);
  }
});

// 사용자 정보 조회 query
const { data: userInfo } = useQuery({
  queryKey: ['userInfo'],
  queryFn: fetchUserInfo,
  enabled: !!sessionStorage.getItem('auth_token'),
  onSuccess: (data) => {
    // 3. 역할 판별
    const role = detectRole(data.username);
    sessionStorage.setItem('user_role', role);
    sessionStorage.setItem('username', data.username);

    // 4. 홈으로 리다이렉트
    navigate('/home');
  }
});
```

---

### 4. 라우팅 구조

#### 4.1 라우팅 전략
- **방식**: 공통 라우트 + 역할 기반 컴포넌트 렌더링
- **라우트 경로**: 역할에 관계없이 동일한 경로 사용
- **컴포넌트 분기**: 각 라우트에서 역할에 따라 다른 컴포넌트 렌더링

#### 4.2 라우트 맵
```
/ (root)
  ├─ /login (공용 로그인 페이지)
  ├─ /home (공용 경로, 역할별 컴포넌트)
  │    ├─ Mentor → <MentorHome />
  │    └─ Mentee → <MenteeHome />
  ├─ /profile (공용 경로, 역할별 컴포넌트)
  └─ /* (404 또는 역할별 동적 라우팅)
```

#### 4.3 Protected Routes
```tsx
// ProtectedRoute.tsx
const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('auth_token');
  const role = sessionStorage.getItem('user_role');

  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
```

#### 4.4 로그인 후 리다이렉트
- **목적지**: `/home`
- **역할 구분 없음**: 멘토/멘티 모두 `/home`으로 이동
- `/home`에서 역할에 따라 `<MentorLayout />` 또는 `<MenteeLayout />` 렌더링

---

### 5. UI/UX 분기 처리

#### 5.1 레이아웃 컴포넌트 분리
```
src/
├─ layouts/
│   ├─ MentorLayout.jsx    # 멘토 전용 PC 레이아웃
│   ├─ MenteeLayout.jsx    # 멘티 전용 모바일 레이아웃
│   └─ AuthLayout.jsx      # 로그인 페이지 레이아웃
├─ pages/
│   ├─ Login.jsx           # 공용 로그인 페이지
│   ├─ mentor/             # 멘토 전용 페이지 컴포넌트
│   │   ├─ MentorHome.jsx
│   │   └─ MentorDashboard.jsx
│   └─ mentee/             # 멘티 전용 페이지 컴포넌트
│       ├─ MenteeHome.jsx
│       └─ MenteeLearning.jsx
```

#### 5.2 역할별 Layout 특징

##### MentorLayout (PC 버전)
- **네비게이션**: 사이드바 또는 상단 메뉴
- **레이아웃**: 2-3 컬럼 그리드 (넓은 화면 활용)
- **콘텐츠**: 테이블, 그리드 기반 데이터 표시
- **스타일링**: 데스크톱 최적화 (큰 버튼, 마우스 호버 효과)
- **반응형**: 모든 기기에서 PC UI 강제 (모바일에서도 PC 레이아웃 유지)

##### MenteeLayout (모바일 버전)
- **네비게이션**: 하단 탭 바 (Bottom Navigation)
- **레이아웃**: 단일 컬럼 (세로 스크롤)
- **콘텐츠**: 카드, 리스트 기반 표시
- **스타일링**: 모바일 최적화 (큰 터치 타겟, 스와이프 제스처)
- **반응형**: PWA 가이드라인 따름 (CLAUDE.md 참조)
  - 기본: 모바일 스타일 (320px~428px)
  - 태블릿: 768px 이하까지 모바일 UI
  - PC에서도 모바일 UI 강제 (중앙 정렬된 모바일 뷰)

---

### 6. 기기 크기와 역할의 우선순위

#### 6.1 우선순위 정책
**역할 우선**: 디바이스 크기와 무관하게 역할에 따라 UI 결정

- **멘토 (mentor)**:
  - 모바일 기기에서 접속해도 → PC 버전 UI 표시
  - 작은 화면이지만 PC 레이아웃 유지
  - 가로 스크롤이 필요할 수 있음 (또는 축소된 PC 뷰)

- **멘티 (mentee)**:
  - 데스크톱 PC에서 접속해도 → 모바일 버전 UI 표시
  - 큰 화면 중앙에 모바일 뷰포트 (max-width: 768px) 표시
  - 좌우 여백 또는 배경 처리

#### 6.2 구현 예시

```css
/* MentorLayout.module.css - 모든 화면에서 PC UI */
.mentorLayout {
  min-width: 1024px; /* PC 최소 너비 유지 */
  display: grid;
  grid-template-columns: 240px 1fr;
  /* 모바일에서는 가로 스크롤 발생 가능 */
}

/* MenteeLayout.module.css - 모든 화면에서 모바일 UI */
.menteeLayout {
  max-width: 768px; /* 모바일 최대 너비 제한 */
  margin: 0 auto; /* 큰 화면에서 중앙 정렬 */
  width: 100%;
  display: flex;
  flex-direction: column;
}

.menteeLayout .bottomNav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 768px;
  width: 100%;
}
```

---

### 7. 역할 판별 유틸리티

#### 7.1 역할 판별 함수
```typescript
// utils/auth.ts

export type UserRole = 'mentor' | 'mentee' | null;

/**
 * username에서 역할 판별
 * @param username - 사용자 아이디
 * @returns 'mentor' | 'mentee' | null
 */
export function detectRole(username: string): UserRole {
  if (!username) return null;

  const lowerUsername = username.toLowerCase();

  if (lowerUsername.includes('mentor')) {
    return 'mentor';
  }

  if (lowerUsername.includes('mentee')) {
    return 'mentee';
  }

  return null; // 역할 판별 실패
}

/**
 * sessionStorage에서 현재 사용자 역할 조회
 */
export function getUserRole(): UserRole {
  return sessionStorage.getItem('user_role') as UserRole;
}

/**
 * 현재 사용자가 멘토인지 확인
 */
export function isMentor(): boolean {
  return getUserRole() === 'mentor';
}

/**
 * 현재 사용자가 멘티인지 확인
 */
export function isMentee(): boolean {
  return getUserRole() === 'mentee';
}
```

#### 7.2 Custom Hook
```typescript
// hooks/useAuth.ts

export function useAuth() {
  const navigate = useNavigate();

  const role = getUserRole();
  const token = sessionStorage.getItem('auth_token');
  const isAuthenticated = !!token && !!role;

  const logout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  return {
    role,
    isAuthenticated,
    isMentor: isMentor(),
    isMentee: isMentee(),
    logout
  };
}
```

---

### 8. 로그인 페이지 구현

#### 8.1 Login.jsx 수정 사항
- **파일 위치**: `src/pages/Login.jsx`
- **수정 방식**: 기존 파일에 역할 판별 로직 추가

#### 8.2 로그인 플로우
```
1. 사용자 입력: username, password
   ↓
2. POST /api/auth/login
   ↓
3. 응답: { success: true, data: { accessToken, tokenType } }
   ↓
4. sessionStorage에 accessToken 저장
   ↓
5. GET /api/auth/me (또는 JWT 디코딩)
   ↓
6. username 획득
   ↓
7. detectRole(username) 실행
   ↓
8. role === null ?
   YES → 로그인 실패 에러 표시
   NO  → sessionStorage에 role, username 저장 → navigate('/home')
```

#### 8.3 Login.jsx 구현 예시 (핵심 로직)
```jsx
// src/pages/Login.jsx

import { useMutation, useQuery } from '@tanstack/react-query';
import { detectRole } from '../utils/auth';

export default function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  // 1. 로그인 mutation
  const loginMutation = useMutation({
    mutationFn: async (creds) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds)
      });
      if (!response.ok) throw new Error('로그인 실패');
      return response.json();
    },
    onSuccess: (data) => {
      // 토큰 저장
      sessionStorage.setItem('auth_token', data.data.accessToken);
      sessionStorage.setItem('token_type', data.data.tokenType);
    },
    onError: (error) => {
      alert('로그인에 실패했습니다.');
    }
  });

  // 2. 사용자 정보 조회 query (로그인 성공 후 자동 실행)
  const { data: userInfo } = useQuery({
    queryKey: ['userInfo'],
    queryFn: async () => {
      const token = sessionStorage.getItem('auth_token');
      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('사용자 정보 조회 실패');
      return response.json();
    },
    enabled: !!sessionStorage.getItem('auth_token') && !sessionStorage.getItem('user_role'),
    retry: false
  });

  // 3. 역할 판별 및 리다이렉트
  useEffect(() => {
    if (userInfo?.username) {
      const role = detectRole(userInfo.username);

      if (!role) {
        // 역할 판별 실패
        alert('유효하지 않은 계정입니다. 관리자에게 문의하세요.');
        sessionStorage.clear();
        return;
      }

      // 역할 정보 저장
      sessionStorage.setItem('user_role', role);
      sessionStorage.setItem('username', userInfo.username);

      // 홈으로 이동
      navigate('/home');
    }
  }, [userInfo, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(credentials);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="아이디"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
        <button type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
}
```

---

### 9. 역할별 페이지 라우팅

#### 9.1 App.jsx 라우팅 구조
```jsx
// src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Home from './pages/Home';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* 기타 라우트 */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

#### 9.2 Home.jsx - 역할 기반 레이아웃 분기
```jsx
// src/pages/Home.jsx

import { useAuth } from '../hooks/useAuth';
import MentorLayout from '../layouts/MentorLayout';
import MenteeLayout from '../layouts/MenteeLayout';

export default function Home() {
  const { role } = useAuth();

  // 역할에 따라 다른 레이아웃 컴포넌트 렌더링
  if (role === 'mentor') {
    return <MentorLayout />;
  }

  if (role === 'mentee') {
    return <MenteeLayout />;
  }

  // 역할 정보 없음 (비정상 상태)
  return <Navigate to="/login" replace />;
}
```

---

### 10. 접근 제어 및 예외 처리

#### 10.1 역할 불일치 접근 처리
**시나리오**: 멘토가 멘티 전용 페이지 URL을 직접 입력하여 접근 시도

**처리 방식**: 홈 페이지로 리다이렉트

```jsx
// components/RoleGuard.jsx

export function RoleGuard({ allowedRoles, children }) {
  const { role } = useAuth();

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

// 사용 예시
<Route
  path="/mentor/analytics"
  element={
    <ProtectedRoute>
      <RoleGuard allowedRoles={['mentor']}>
        <MentorAnalytics />
      </RoleGuard>
    </ProtectedRoute>
  }
/>
```

#### 10.2 미인증 사용자 처리
- 모든 보호된 페이지 접근 시 → `/login`으로 리다이렉트
- 로그인 페이지는 누구나 접근 가능

#### 10.3 역할 정보 불일치 처리
- sessionStorage에 role이 있지만 token이 없는 경우 → sessionStorage 초기화 후 로그인 페이지로
- token은 있지만 role이 없는 경우 → 사용자 정보 재조회 시도

---

### 11. 기능 접근 권한

#### 11.1 현재 정의
- **멘토/멘티 공통 기능**: 아직 미정의
- **멘토 전용 기능**: 추후 정의 예정
- **멘티 전용 기능**: 추후 정의 예정

#### 11.2 향후 확장 방안
```typescript
// constants/permissions.ts

export const PERMISSIONS = {
  mentor: [
    'dashboard.view',
    'analytics.view',
    'mentees.manage',
    'sessions.schedule'
  ],
  mentee: [
    'learning.view',
    'sessions.join',
    'progress.view',
    'chat.send'
  ]
};

// 권한 체크 함수
export function hasPermission(permission: string): boolean {
  const role = getUserRole();
  return PERMISSIONS[role]?.includes(permission) || false;
}
```

---

### 12. PWA 설정 고려사항

#### 12.1 현재 상태
- **vite-plugin-pwa**: 이미 설정됨
- **manifest.json**: 존재 (public/manifest.json)

#### 12.2 역할별 PWA 아이콘 (선택사항)
향후 멘토/멘티용 앱을 구분하고 싶다면:
- manifest.json을 동적으로 생성하여 역할별 아이콘 제공 가능
- 현재는 공용 아이콘 사용

#### 12.3 Safe Area 대응
- **멘티 모바일 버전**: CLAUDE.md의 Safe Area 가이드라인 준수
- **멘토 PC 버전**: Safe Area 고려 불필요 (데스크톱 환경)

---

### 13. 스타일링 전략

#### 13.1 CSS 구조
```
src/
├─ styles/
│   ├─ mentor/
│   │   ├─ mentor-layout.module.css
│   │   └─ mentor-components.module.css
│   └─ mentee/
│       ├─ mentee-layout.module.css
│       └─ mentee-components.module.css
```

#### 13.2 CSS Modules 사용
- 역할별 스타일 완전 분리
- 클래스명 충돌 방지
- 코드 스플리팅으로 필요한 스타일만 로드

#### 13.3 공통 스타일
```
src/
├─ styles/
│   ├─ common/
│   │   ├─ reset.css
│   │   ├─ variables.css (디자인 토큰)
│   │   └─ utilities.css
```

---

### 14. 구현 우선순위

#### Phase 1: 기본 인프라 (필수)
1. ✅ 역할 판별 유틸리티 (`detectRole`, `getUserRole` 등)
2. ✅ useAuth 커스텀 훅
3. ✅ ProtectedRoute 컴포넌트
4. ✅ Login.jsx에 역할 판별 로직 추가

#### Phase 2: 레이아웃 분리 (필수)
5. ✅ MentorLayout 컴포넌트 (PC UI 기본 구조)
6. ✅ MenteeLayout 컴포넌트 (모바일 UI 기본 구조)
7. ✅ Home.jsx에서 역할별 레이아웃 렌더링

#### Phase 3: 라우팅 및 네비게이션 (필수)
8. ✅ App.jsx 라우팅 구조 설정
9. ✅ 역할 기반 네비게이션 (멘토: 사이드바, 멘티: 하단 탭)

#### Phase 4: 접근 제어 (필수)
10. ✅ RoleGuard 컴포넌트
11. ✅ 역할 불일치 시 리다이렉트 처리

#### Phase 5: 스타일링 및 반응형 (중요)
12. ✅ 멘토 PC 버전 스타일 (모든 기기에서 PC UI)
13. ✅ 멘티 모바일 버전 스타일 (모든 기기에서 모바일 UI)
14. ✅ PWA 가이드라인 준수 (Safe Area, 터치 타겟 등)

#### Phase 6: 기능 페이지 구현 (향후)
15. 멘토 전용 페이지들
16. 멘티 전용 페이지들
17. 공통 페이지들

---

### 15. 테스트 전략

#### 15.1 테스트 계정
- **방식**: 기존 계정 활용
- **요구사항**:
  - 멘토 테스트: username에 'mentor' 포함된 계정
  - 멘티 테스트: username에 'mentee' 포함된 계정

#### 15.2 테스트 시나리오
1. **역할 판별 테스트**
   - `mentor_john` → mentor 역할
   - `john_mentor` → mentor 역할
   - `MENTOR123` → mentor 역할
   - `mentee_sarah` → mentee 역할
   - `john_doe` → 로그인 실패

2. **UI 분기 테스트**
   - 멘토 로그인 → PC 레이아웃 확인 (모바일/태블릿/데스크톱 모두)
   - 멘티 로그인 → 모바일 레이아웃 확인 (모바일/태블릿/데스크톱 모두)

3. **접근 제어 테스트**
   - 미인증 상태로 /home 접근 → /login 리다이렉트
   - 멘토가 멘티 전용 URL 접근 → /home 리다이렉트
   - 멘티가 멘토 전용 URL 접근 → /home 리다이렉트

4. **세션 관리 테스트**
   - 새로고침 시 역할 유지 확인
   - 탭 닫고 재접속 → 로그인 필요 (sessionStorage)
   - 로그아웃 → 모든 상태 초기화

---

### 16. 예상 이슈 및 해결 방안

#### 16.1 이슈: username 조회 API 미존재
**증상**: 로그인 API가 username을 반환하지 않고 토큰만 반환

**해결 방안**:
- **Option 1**: JWT 토큰 디코딩하여 username 추출 (jwt-decode 라이브러리)
- **Option 2**: `/api/auth/me` 같은 사용자 정보 조회 API 사용
- **Option 3**: 로그인 폼에서 입력한 username을 그대로 사용 (보안 취약)

**권장**: Option 1 또는 Option 2

#### 16.2 이슈: 모바일에서 PC UI가 너무 작게 보임 (멘토)
**증상**: 멘토가 모바일로 접속 시 PC UI가 축소되어 사용 어려움

**해결 방안**:
- **Option 1**: viewport meta 태그 조정 (initial-scale 조정)
- **Option 2**: "데스크톱에서 접속을 권장합니다" 안내 메시지
- **Option 3**: 최소 width 강제 + 가로 스크롤 허용

**권장**: Option 3 (사용 가능하되 불편함을 감수)

#### 16.3 이슈: 데스크톱에서 모바일 UI가 어색함 (멘티)
**증상**: 멘티가 데스크톱으로 접속 시 좁은 모바일 뷰가 중앙에 표시됨

**해결 방안**:
- **Option 1**: max-width 제한 + 중앙 정렬 + 좌우 배경/일러스트
- **Option 2**: max-width 제한 + 중앙 정렬 + 좌우 빈 공간
- **Option 3**: 브라우저 창 크기 조절 안내 메시지

**권장**: Option 1 (심미적으로 처리)

---

### 17. 기술 스택 요약

| 항목 | 기술/도구 |
|------|-----------|
| 프레임워크 | React 18 |
| 빌드 도구 | Vite |
| 라우팅 | React Router v6 |
| 상태 관리 | TanStack Query (React Query) |
| 스타일링 | CSS Modules |
| PWA | vite-plugin-pwa |
| 인증 | JWT + sessionStorage |
| 역할 판별 | String matching (username) |

---

### 18. 폴더 구조 (최종)

```
src/
├─ App.jsx
├─ main.jsx
│
├─ pages/
│   ├─ Login.jsx                    # 공용 로그인 (역할 판별 로직 포함)
│   ├─ Home.jsx                     # 역할별 레이아웃 분기
│   ├─ mentor/                      # 멘토 전용 페이지들
│   │   ├─ MentorDashboard.jsx
│   │   └─ MentorAnalytics.jsx
│   └─ mentee/                      # 멘티 전용 페이지들
│       ├─ MenteeLearning.jsx
│       └─ MenteeProgress.jsx
│
├─ layouts/
│   ├─ MentorLayout.jsx             # 멘토 PC 레이아웃
│   └─ MenteeLayout.jsx             # 멘티 모바일 레이아웃
│
├─ components/
│   ├─ common/                      # 공통 컴포넌트
│   ├─ mentor/                      # 멘토 전용 컴포넌트
│   └─ mentee/                      # 멘티 전용 컴포넌트
│
├─ hooks/
│   ├─ useAuth.ts                   # 인증 상태 hook
│   └─ useMediaQuery.ts             # 반응형 hook (필요 시)
│
├─ utils/
│   ├─ auth.ts                      # 역할 판별 유틸리티
│   └─ api.ts                       # API 호출 함수들
│
├─ styles/
│   ├─ common/                      # 공통 스타일
│   ├─ mentor/                      # 멘토 스타일
│   └─ mentee/                      # 멘티 스타일
│
└─ constants/
    ├─ permissions.ts               # 권한 정의 (향후)
    └─ design-tokens.ts             # 디자인 토큰 (CLAUDE.md)
```

---

## ✅ 체크리스트

### 구현 완료 조건
- [ ] `detectRole()` 함수 구현 및 테스트
- [ ] `useAuth` 훅 구현
- [ ] Login.jsx에 역할 판별 로직 추가
- [ ] sessionStorage에 역할 정보 저장/조회
- [ ] MentorLayout 컴포넌트 구현 (기본 구조)
- [ ] MenteeLayout 컴포넌트 구현 (기본 구조)
- [ ] Home.jsx에서 역할별 레이아웃 분기
- [ ] ProtectedRoute 구현
- [ ] RoleGuard 구현 (선택)
- [ ] 멘토 PC 스타일 적용 (모든 기기)
- [ ] 멘티 모바일 스타일 적용 (모든 기기)
- [ ] 역할 판별 실패 시 에러 처리
- [ ] 역할 불일치 URL 접근 시 리다이렉트

### 테스트 완료 조건
- [ ] 멘토 계정으로 로그인 → PC UI 확인
- [ ] 멘티 계정으로 로그인 → 모바일 UI 확인
- [ ] 모바일에서 멘토 로그인 → PC UI 표시 확인
- [ ] 데스크톱에서 멘티 로그인 → 모바일 UI 표시 확인
- [ ] 잘못된 username 로그인 → 에러 메시지 확인
- [ ] 미인증 상태로 /home 접근 → 로그인 페이지 이동 확인
- [ ] 새로고침 시 역할 유지 확인
- [ ] 탭 닫고 재접속 시 재로그인 필요 확인

---

## 📝 참고 문서

- **PWA 가이드라인**: `/home/ubuntu/dev/Frontend/.claude/CLAUDE.md`
- **디자인 토큰**: `CLAUDE.md` 내 "디자인 토큰" 섹션 참조
- **Safe Area 처리**: `CLAUDE.md` 내 "Safe Area 고려" 섹션 참조
- **터치 타겟 크기**: `CLAUDE.md` 내 "터치 타겟 크기" 섹션 참조

---

## 🔄 업데이트 이력

- **2026-02-05**: 초기 명세서 작성 (인터뷰 기반)

---

## 💬 추가 논의 필요 사항

1. **API 엔드포인트 명세**
   - 로그인 API: `/api/auth/login`
   - 사용자 정보 조회 API: `/api/auth/me` (?)
   - 응답 형식 재확인 필요

2. **멘토/멘티 전용 기능 정의**
   - 현재는 미정의 상태
   - 기능 목록이 확정되면 permissions.ts 작성 필요

3. **에러 핸들링 상세화**
   - 네트워크 에러, API 에러, 역할 판별 실패 등
   - 각 에러별 사용자 안내 메시지 정의

4. **로깅 및 모니터링**
   - 역할 판별 실패 케이스 추적
   - 사용자 역할별 접속 통계

---

**문서 작성자**: Claude (Interview Agent)
**작성일**: 2026-02-05
**버전**: 1.0
