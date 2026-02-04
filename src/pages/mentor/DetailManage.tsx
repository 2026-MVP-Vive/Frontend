import Header from "@/components/layout/Header"
import BottomNav from "@/components/layout/BottomNav"

export default function DetailManage() {

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title="상세 관리" showWeekCalendar={false} />

      <main className="flex-1 flex items-center justify-center pb-20">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">상세 관리</h2>
          <p className="text-gray-500">곧 구현될 페이지입니다</p>
        </div>
      </main>

      <BottomNav userRole="mentor" />
    </div>
  )
}
