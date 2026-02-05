import { Outlet } from 'react-router-dom'
import BottomNav from '@/components/layout/BottomNav'

/**
 * 멘티 전용 모바일 레이아웃
 * - 하단 탭 네비게이션
 * - 단일 컬럼 레이아웃
 * - 모든 기기에서 모바일 UI 강제 (max-width: 768px, 중앙 정렬)
 */
export default function MenteeLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ maxWidth: '768px', margin: '0 auto' }}>
      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* 하단 네비게이션 */}
      <BottomNav userRole="mentee" />
    </div>
  )
}
