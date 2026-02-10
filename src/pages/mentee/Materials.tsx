import { useState, useEffect } from "react"
import { Paperclip } from "lucide-react"
import { useNavigate } from "react-router-dom"
import BottomNav from "@/components/layout/BottomNav"
import { getSolutions } from "@/lib/api"
import type { Solution, Subject } from "@/types/api"

interface ShortcutCard {
  id: number
  icon: string
  title: string
  description: string
  path: string
}

type SubjectFilter = "all" | "KOREAN" | "ENGLISH" | "MATH"

export default function Materials() {
  const navigate = useNavigate()
  const [selectedSubject, setSelectedSubject] = useState<SubjectFilter>("all")
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const shortcuts: ShortcutCard[] = [
    {
      id: 1,
      icon: "📅",
      title: "월간계획표",
      description: "학습 일정 확인",
      path: "/mentee/monthly-plan"
    },
    {
      id: 2,
      icon: "📝",
      title: "서울대쌤 칼럼",
      description: "공부법 칼럼 모아보기",
      path: "/mentee/columns"
    }
  ]

  // 솔루션 목록 조회
  const loadSolutions = async (subject?: Subject) => {
    setIsLoading(true)
    try {
      const data = await getSolutions(subject)
      setSolutions(data.solutions)
    } catch (error) {
      console.error('솔루션 조회 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 과목 필터 변경 시 데이터 재조회
  useEffect(() => {
    if (selectedSubject === "all") {
      loadSolutions()
    } else {
      loadSolutions(selectedSubject as Subject)
    }
  }, [selectedSubject])

  // 과목별 색상 매핑
  const getSubjectColor = (subject: Subject) => {
    switch (subject) {
      case 'KOREAN':
        return 'bg-red-500 text-white'
      case 'ENGLISH':
        return 'bg-blue-500 text-white'
      case 'MATH':
        return 'bg-green-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const handleDownload = (downloadUrl: string, fileName: string) => {
    // 실제 파일 다운로드
    const link = document.createElement('a')
    link.href = `http://115.68.232.25:8080${downloadUrl}`
    link.download = fileName
    link.click()
  }

  const handleShortcutClick = (path: string) => {
    navigate(path)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 pt-safe border-b border-gray-200">
        <div className="flex items-center justify-center py-4">
          <h1 className="text-lg font-bold">학습자료</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-20">
        {/* Shortcuts Section */}
        <section className="mt-6">
          <h2 className="text-base font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-600 rounded"></span>
            바로가기
          </h2>

          <div className="space-y-3">
            {shortcuts.map((shortcut) => (
              <button
                key={shortcut.id}
                onClick={() => handleShortcutClick(shortcut.path)}
                className="w-full bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-4"
              >
                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 text-3xl">
                  {shortcut.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    {shortcut.title}
                  </h3>
                  <p className="text-sm text-gray-500">{shortcut.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Solutions Section */}
        <section className="mt-8 mb-6">
          <h2 className="text-base font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-600 rounded"></span>
            약점 맞춤 솔루션
          </h2>

          {/* Subject Filter */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedSubject("all")}
              className={`px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedSubject === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-blue-300"
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setSelectedSubject("KOREAN")}
              className={`px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedSubject === "KOREAN"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-blue-300"
              }`}
            >
              국어
            </button>
            <button
              onClick={() => setSelectedSubject("ENGLISH")}
              className={`px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedSubject === "ENGLISH"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-blue-300"
              }`}
            >
              영어
            </button>
            <button
              onClick={() => setSelectedSubject("MATH")}
              className={`px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedSubject === "MATH"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-blue-300"
              }`}
            >
              수학
            </button>
          </div>

          {/* Solutions List */}
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-500">로딩 중...</p>
            </div>
          ) : solutions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-500">해당 과목의 자료가 없습니다</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
              {solutions.map((solution) => (
                <div
                  key={solution.id}
                  className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                >
                  <span
                    className={`text-sm px-2.5 py-1 rounded font-medium flex-shrink-0 ${getSubjectColor(solution.subject)}`}
                  >
                    {solution.subjectName}
                  </span>

                  <h3 className="font-semibold text-gray-900 flex-1">
                    {solution.title}
                  </h3>

                  {solution.materials.length > 0 ? (
                    <button
                      onClick={() => handleDownload(solution.materials[0].downloadUrl, solution.materials[0].fileName)}
                      className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Paperclip className="w-4 h-4" />
                      <span className="text-sm font-medium">자료</span>
                    </button>
                  ) : (
                    <span className="text-sm text-gray-400">자료 없음</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav userRole="mentee" />
    </div>
  )
}
