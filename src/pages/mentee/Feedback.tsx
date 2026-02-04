import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import BottomNav from "@/components/layout/BottomNav"

interface FeedbackItem {
  id: number
  subject: string
  subjectColor: string
  title: string
  summary?: string
  content: string
}

export default function Feedback() {
  const navigate = useNavigate()
  const { date } = useParams()
  const [selectedDate] = useState(date || "2025.01.26")

  // Mock data - 실제로는 API로 받아올 데이터
  const feedbacks: FeedbackItem[] = [
    {
      id: 1,
      subject: "국어",
      subjectColor: "text-red-500",
      title: "비문학 지문 분석 3지문",
      summary: "선지별 근거 문장 번호를 반드시 표기할 것",
      content:
        "지문의 주제 파악과 구조 분석은 잘하고 있습니다. 하지만 선지 분석에서 본문 근거와의 매칭이 부족합니다. 각 선지마다 해당 근거가 되는 문장 번호를 적는 습관을 들이세요. 오답들이 높은 '적절하지 않은 것' 유형에서 소거법을 활용해보세요."
    },
    {
      id: 2,
      subject: "영어",
      subjectColor: "text-blue-500",
      title: "영어 구문 분석 Day 11",
      summary: "",
      content:
        "관계대명사 절 해석이 많이 나아졌습니다. 특히 which와 that 구분이 정확해졌어요. 다음 단계로 분사구문 파트 추가 연습이 필요합니다. 내일 학습지에 분사구문 집중 문제를 추가해둘게요."
    },
    {
      id: 3,
      subject: "수학",
      subjectColor: "text-green-500",
      title: "수학 확률과 통계 유형 풀이",
      summary: "조건부확률 공식 암기 → 실전 적용 연습",
      content:
        "기본 확률 문제는 안정적입니다. 조건부확률에서 P(A∩B)와 P(A∩B) 혼동이 있으니 공식을 다시 정리하고 유형별 3문제씩 풀어보세요."
    }
  ]

  const overallFeedback =
    "오늘 전체적으로 학습 시간이 잘 확보되었고, 국어와 영어 모두 꾸준한 성장이 보입니다. 수학은 조건부확률을 파트에 집중해서 이번 주 안에 마무리합시다. 내일은 영어 분사구문 학습지가 추가됩니다 💪"

  const handlePreviousDate = () => {
    // 실제로는 날짜 변경 로직
    console.log("Previous date")
  }

  const handleNextDate = () => {
    // 실제로는 날짜 변경 로직
    console.log("Next date")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 pt-safe border-b border-gray-200">
        <div className="flex items-center justify-center py-4 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">피드백 확인</h1>
        </div>
      </header>

      {/* Date Selector */}
      <div className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePreviousDate}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2 className="text-lg font-bold min-w-[200px] text-center">
            {selectedDate} 일
          </h2>

          <button
            onClick={handleNextDate}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-20">
        {/* Subject Feedbacks */}
        <section className="mt-6">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-600 rounded"></span>
            과목별 피드백
          </h3>

          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-blue-600"
              >
                {/* Subject and Title */}
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`text-sm px-2.5 py-1 bg-opacity-10 rounded font-medium ${
                      feedback.subjectColor === "text-red-500"
                        ? "bg-red-500 text-red-600"
                        : feedback.subjectColor === "text-blue-500"
                        ? "bg-blue-500 text-blue-600"
                        : "bg-green-500 text-green-600"
                    }`}
                  >
                    {feedback.subject}
                  </span>
                  <h4 className="font-semibold text-gray-900 flex-1">
                    {feedback.title}
                  </h4>
                </div>

                {/* Summary (if exists) */}
                {feedback.summary && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3 flex items-start gap-2">
                    <span className="text-lg flex-shrink-0">⭐</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-900">
                        요약: {feedback.summary}
                      </p>
                    </div>
                  </div>
                )}

                {/* Content */}
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {feedback.content}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Overall Feedback */}
        <section className="mt-8 mb-6">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-600 rounded"></span>
            총평
          </h3>

          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-blue-600">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {overallFeedback}
            </p>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav userRole="mentee" />
    </div>
  )
}
