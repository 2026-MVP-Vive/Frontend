import { useState } from "react"
import { Paperclip } from "lucide-react"
import BottomNav from "@/components/layout/BottomNav"

interface ShortcutCard {
  id: number
  icon: string
  title: string
  description: string
  path: string
}

interface Solution {
  id: number
  subject: string
  subjectColor: string
  title: string
  hasFile: boolean
}

type SubjectFilter = "all" | "korean" | "english" | "math"

export default function Materials() {
  const [selectedSubject, setSelectedSubject] = useState<SubjectFilter>("all")

  const shortcuts: ShortcutCard[] = [
    {
      id: 1,
      icon: "📅",
      title: "월간계획표",
      description: "1월 학습 일정 확인",
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

  const allSolutions: Solution[] = [
    {
      id: 1,
      subject: "국어",
      subjectColor: "text-red-500",
      title: "독해력 강화",
      hasFile: true
    },
    {
      id: 2,
      subject: "국어",
      subjectColor: "text-red-500",
      title: "문학 감상법 정리",
      hasFile: true
    },
    {
      id: 3,
      subject: "영어",
      subjectColor: "text-blue-500",
      title: "구문 독해",
      hasFile: true
    },
    {
      id: 4,
      subject: "수학",
      subjectColor: "text-green-500",
      title: "미적분 보완",
      hasFile: true
    },
    {
      id: 5,
      subject: "수학",
      subjectColor: "text-green-500",
      title: "조건부확률 공식 정리",
      hasFile: true
    }
  ]

  const filteredSolutions = allSolutions.filter((solution) => {
    if (selectedSubject === "all") return true
    if (selectedSubject === "korean") return solution.subject === "국어"
    if (selectedSubject === "english") return solution.subject === "영어"
    if (selectedSubject === "math") return solution.subject === "수학"
    return true
  })

  const handleDownload = (solution: Solution) => {
    console.log("Download material for:", solution.title)
    // 실제 다운로드 로직
  }

  const handleShortcutClick = (path: string) => {
    console.log("Navigate to:", path)
    // 실제로는 페이지 이동 또는 기능 실행
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
              onClick={() => setSelectedSubject("korean")}
              className={`px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedSubject === "korean"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-blue-300"
              }`}
            >
              국어
            </button>
            <button
              onClick={() => setSelectedSubject("english")}
              className={`px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedSubject === "english"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-blue-300"
              }`}
            >
              영어
            </button>
            <button
              onClick={() => setSelectedSubject("math")}
              className={`px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedSubject === "math"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-blue-300"
              }`}
            >
              수학
            </button>
          </div>

          {/* Solutions List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
            {filteredSolutions.map((solution) => (
              <div
                key={solution.id}
                className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
              >
                <span
                  className={`text-sm px-2.5 py-1 bg-opacity-10 rounded font-medium flex-shrink-0 ${
                    solution.subjectColor === "text-red-500"
                      ? "bg-red-500 text-red-600"
                      : solution.subjectColor === "text-blue-500"
                      ? "bg-blue-500 text-blue-600"
                      : "bg-green-500 text-green-600"
                  }`}
                >
                  {solution.subject}
                </span>

                <h3 className="font-semibold text-gray-900 flex-1">
                  {solution.title}
                </h3>

                {solution.hasFile && (
                  <button
                    onClick={() => handleDownload(solution)}
                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Paperclip className="w-4 h-4" />
                    <span className="text-sm font-medium">자료</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {filteredSolutions.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-500">해당 과목의 자료가 없습니다</p>
            </div>
          )}
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav userRole="mentee" />
    </div>
  )
}
