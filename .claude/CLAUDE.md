# React PWA 모바일 웹앱 디자인 가이드라인

## 📱 프로젝트 개요
이 문서는 React 기반 PWA(Progressive Web App) 모바일 웹앱 개발 시 따라야 할 디자인 및 레이아웃 가이드라인을 정의합니다.

---

## 🎨 모바일 디자인 기본 원칙

### 1. Mobile-First 접근
```css
/* 기본: 모바일 스타일 */
.container {
  width: 100%;
  padding: 16px;
}

/* 태블릿 이상 */
@media (min-width: 768px) {
  .container {
    max-width: 768px;
    margin: 0 auto;
  }
}

/* 데스크톱 */
@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}
```

### 2. Safe Area 고려
```css
/* iOS notch, Android status bar 대응 */
.app-header {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

### 3. 터치 타겟 크기
- **최소 크기**: 44x44px (iOS), 48x48px (Android)
- **권장 크기**: 48x48px 이상
- **간격**: 터치 요소 간 최소 8px 여백

```css
.touch-target {
  min-width: 48px;
  min-height: 48px;
  padding: 12px 16px;
  margin: 8px 0;
}
```

---

## 📐 레이아웃 구조

### 1. 기본 앱 구조
```
┌─────────────────────────┐
│   Header (고정)          │ ← 56-64px
├─────────────────────────┤
│                         │
│   Main Content          │
│   (스크롤 가능)           │
│                         │
├─────────────────────────┤
│   Bottom Navigation     │ ← 56px
│   or Tab Bar (고정)     │
└─────────────────────────┘
```

### 2. 컴포넌트 구조
```jsx
// App.jsx
<div className="app-container">
  <Header /> {/* 고정 헤더 */}
  
  <main className="main-content">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </main>
  
  <BottomNav /> {/* 고정 하단 네비게이션 */}
</div>
```

### 3. 레이아웃 CSS 예시
```css
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: -webkit-fill-available; /* iOS Safari */
}

.main-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* iOS 부드러운 스크롤 */
  padding-bottom: 72px; /* 하단 네비게이션 공간 */
}
```

---

## 🎯 반응형 디자인 Breakpoints

```javascript
// constants/breakpoints.js
export const BREAKPOINTS = {
  mobile: '320px',
  mobileLarge: '428px',
  tablet: '768px',
  desktop: '1024px',
  desktopLarge: '1440px'
};

export const MEDIA_QUERIES = {
  mobile: `(min-width: ${BREAKPOINTS.mobile})`,
  mobileLarge: `(min-width: ${BREAKPOINTS.mobileLarge})`,
  tablet: `(min-width: ${BREAKPOINTS.tablet})`,
  desktop: `(min-width: ${BREAKPOINTS.desktop})`,
  desktopLarge: `(min-width: ${BREAKPOINTS.desktopLarge})`
};
```

### Tailwind CSS 사용 시
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '428px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1440px',
    },
  },
}
```

---

## 🖱️ 터치 인터페이스 가이드라인

### 1. 제스처 지원
```jsx
// 스와이프, 핀치 등의 제스처
import { useSwipeable } from 'react-swipeable';

const handlers = useSwipeable({
  onSwipedLeft: () => handleNextSlide(),
  onSwipedRight: () => handlePrevSlide(),
  preventDefaultTouchmoveEvent: true,
  trackMouse: true
});
```

### 2. 터치 피드백
```css
/* Active 상태 시각적 피드백 */
.button {
  transition: transform 0.1s ease, background-color 0.2s ease;
}

.button:active {
  transform: scale(0.95);
  background-color: rgba(0, 0, 0, 0.1);
}

/* 또는 ripple 효과 */
.button::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.button:active::after {
  opacity: 1;
}
```

### 3. Pull-to-Refresh
```jsx
import PullToRefresh from 'react-simple-pull-to-refresh';

<PullToRefresh
  onRefresh={handleRefresh}
  pullingContent=""
  refreshingContent={<Spinner />}
>
  <YourContent />
</PullToRefresh>
```

---

## 🚀 PWA 특화 UI/UX

### 1. 설치 프롬프트
```jsx
// components/InstallPrompt.jsx
const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="install-banner">
      <button onClick={handleInstall}>앱 설치하기</button>
    </div>
  );
};
```

### 2. 오프라인 UI
```jsx
// components/OfflineIndicator.jsx
const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="offline-banner">
      <span>오프라인 모드</span>
    </div>
  );
};
```

### 3. 스플래시 스크린 스타일
```json
// manifest.json
{
  "name": "My PWA App",
  "short_name": "MyApp",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

---

## 🧩 컴포넌트 설계 패턴

### 1. 카드형 레이아웃
```jsx
// components/Card.jsx
const Card = ({ children, onClick }) => (
  <div 
    className="card"
    onClick={onClick}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
  >
    {children}
  </div>
);

// styles
.card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin: 8px 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:active {
  transform: translateY(2px);
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}
```

### 2. 리스트 아이템
```jsx
// components/ListItem.jsx
const ListItem = ({ icon, title, subtitle, rightElement, onClick }) => (
  <div className="list-item" onClick={onClick}>
    {icon && <div className="list-item-icon">{icon}</div>}
    <div className="list-item-content">
      <h3>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
    </div>
    {rightElement && <div className="list-item-right">{rightElement}</div>}
  </div>
);

// styles
.list-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 12px;
  border-bottom: 1px solid #f0f0f0;
  min-height: 64px;
}

.list-item-content {
  flex: 1;
  min-width: 0; /* 텍스트 오버플로우 처리 */
}

.list-item-content h3 {
  font-size: 16px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

### 3. 하단 시트 (Bottom Sheet)
```jsx
// components/BottomSheet.jsx
const BottomSheet = ({ isOpen, onClose, children }) => (
  <>
    {isOpen && (
      <div className="bottom-sheet-overlay" onClick={onClose}>
        <div 
          className={`bottom-sheet ${isOpen ? 'open' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bottom-sheet-handle" />
          <div className="bottom-sheet-content">
            {children}
          </div>
        </div>
      </div>
    )}
  </>
);

// styles
.bottom-sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
}

.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  max-height: 90vh;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.bottom-sheet.open {
  transform: translateY(0);
}

.bottom-sheet-handle {
  width: 40px;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  margin: 12px auto;
}
```

---

## 🎨 스타일링 접근 방식

### 1. CSS Modules 사용
```jsx
// Button.module.css
.button {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
}

.button.primary {
  background: #007AFF;
  color: white;
}

// Button.jsx
import styles from './Button.module.css';

const Button = ({ variant = 'primary', children }) => (
  <button className={`${styles.button} ${styles[variant]}`}>
    {children}
  </button>
);
```

### 2. Styled Components 사용
```jsx
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  background: ${props => props.variant === 'primary' ? '#007AFF' : '#f0f0f0'};
  color: ${props => props.variant === 'primary' ? 'white' : 'black'};
  
  @media (min-width: 768px) {
    padding: 14px 28px;
    font-size: 18px;
  }
`;
```

### 3. Tailwind CSS 사용
```jsx
const Button = ({ variant = 'primary', children }) => (
  <button 
    className={`
      px-6 py-3 rounded-lg font-semibold
      ${variant === 'primary' 
        ? 'bg-blue-500 text-white' 
        : 'bg-gray-100 text-black'}
      active:scale-95 transition-transform
    `}
  >
    {children}
  </button>
);
```

---

## ⚡ 성능 최적화

### 1. 이미지 최적화
```jsx
// components/OptimizedImage.jsx
const OptimizedImage = ({ src, alt, width, height }) => (
  <img
    src={src}
    alt={alt}
    width={width}
    height={height}
    loading="lazy"
    decoding="async"
    style={{ objectFit: 'cover' }}
  />
);
```

### 2. 가상 스크롤 (긴 리스트)
```jsx
import { FixedSizeList } from 'react-window';

const VirtualList = ({ items }) => (
  <FixedSizeList
    height={600}
    itemCount={items.length}
    itemSize={64}
    width="100%"
  >
    {({ index, style }) => (
      <div style={style}>
        <ListItem {...items[index]} />
      </div>
    )}
  </FixedSizeList>
);
```

### 3. 코드 스플리팅
```jsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

---

## 🎯 접근성 (a11y)

### 1. 시맨틱 HTML
```jsx
<nav aria-label="메인 네비게이션">
  <ul>
    <li><a href="/">홈</a></li>
    <li><a href="/about">소개</a></li>
  </ul>
</nav>

<main>
  <section aria-labelledby="section-title">
    <h2 id="section-title">섹션 제목</h2>
  </section>
</main>
```

### 2. 포커스 관리
```css
/* 키보드 포커스 표시 */
button:focus-visible {
  outline: 2px solid #007AFF;
  outline-offset: 2px;
}

/* 마우스 클릭 시에는 outline 제거 */
button:focus:not(:focus-visible) {
  outline: none;
}
```

### 3. 스크린 리더 지원
```jsx
<button 
  aria-label="메뉴 열기"
  aria-expanded={isMenuOpen}
  aria-controls="main-menu"
>
  <MenuIcon aria-hidden="true" />
</button>

<div 
  id="main-menu" 
  role="menu"
  aria-hidden={!isMenuOpen}
>
  {/* 메뉴 내용 */}
</div>
```

---

## 📏 디자인 토큰

```javascript
// constants/design-tokens.js
export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: {
    primary: '#000000',
    secondary: '#3C3C43',
    tertiary: '#8E8E93'
  }
};

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px'
};

export const TYPOGRAPHY = {
  fontFamily: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px'
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
};

export const BORDER_RADIUS = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px'
};

export const SHADOWS = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 2px 8px rgba(0, 0, 0, 0.1)',
  lg: '0 4px 16px rgba(0, 0, 0, 0.15)',
  xl: '0 8px 24px rgba(0, 0, 0, 0.2)'
};
```

---

## 🔧 유틸리티

### 1. 반응형 Hook
```javascript
// hooks/useMediaQuery.js
import { useState, useEffect } from 'react';

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(
    window.matchMedia(query).matches
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

// 사용 예시
const Component = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div>
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  );
};
```

### 2. Safe Area Hook
```javascript
// hooks/useSafeArea.js
import { useState, useEffect } from 'react';

export const useSafeArea = () => {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });

  useEffect(() => {
    const updateSafeArea = () => {
      setSafeArea({
        top: parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--sat') || '0'),
        right: parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--sar') || '0'),
        bottom: parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--sab') || '0'),
        left: parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--sal') || '0')
      });
    };

    // CSS 변수 설정
    document.documentElement.style.setProperty('--sat', 'env(safe-area-inset-top)');
    document.documentElement.style.setProperty('--sar', 'env(safe-area-inset-right)');
    document.documentElement.style.setProperty('--sab', 'env(safe-area-inset-bottom)');
    document.documentElement.style.setProperty('--sal', 'env(safe-area-inset-left)');

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);
    
    return () => window.removeEventListener('resize', updateSafeArea);
  }, []);

  return safeArea;
};
```

---

## 📱 네이티브 느낌 구현

### 1. 네이티브 스크롤 동작
```css
/* 부드러운 스크롤 */
* {
  -webkit-overflow-scrolling: touch;
}

/* 스크롤바 숨기기 (선택적) */
.scrollable {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollable::-webkit-scrollbar {
  display: none;
}
```

### 2. 햅틱 피드백 (지원 기기만)
```javascript
// utils/haptic.js
export const triggerHaptic = (type = 'medium') => {
  if (navigator.vibrate) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30
    };
    navigator.vibrate(patterns[type] || patterns.medium);
  }
};

// 사용 예시
<button onClick={() => {
  triggerHaptic('medium');
  handleClick();
}}>
  클릭
</button>
```

### 3. 상태바 색상 제어
```html
<!-- index.html -->
<meta name="theme-color" content="#000000" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

```javascript
// 동적 변경
const updateThemeColor = (color) => {
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute('content', color);
};
```

---

## ✅ 체크리스트

### PWA 필수 요소
- [ ] manifest.json 설정 완료
- [ ] Service Worker 구현
- [ ] HTTPS 적용
- [ ] 오프라인 폴백 페이지
- [ ] 앱 아이콘 (192x192, 512x512)

### 모바일 최적화
- [ ] 뷰포트 메타 태그 설정
- [ ] Safe Area 대응
- [ ] 터치 타겟 크기 48px 이상
- [ ] 터치 피드백 구현
- [ ] 가로/세로 모드 대응

### 성능
- [ ] 이미지 lazy loading
- [ ] 코드 스플리팅
- [ ] 번들 사이즈 최적화
- [ ] First Contentful Paint < 2초
- [ ] Time to Interactive < 3.5초

### 접근성
- [ ] 시맨틱 HTML 사용
- [ ] 키보드 네비게이션 지원
- [ ] ARIA 속성 적용
- [ ] 명도 대비 4.5:1 이상
- [ ] 포커스 표시 명확


## 🔗 참고 자료

- [MDN - Progressive Web Apps](https://developer.mozilla.org/ko/docs/Web/Progressive_web_apps)
- [Google - Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Apple - Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design - Mobile](https://m3.material.io/)
