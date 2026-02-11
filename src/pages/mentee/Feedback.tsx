import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import BottomNav from "@/components/layout/BottomNav"
import { getFeedbacksByDate } from "@/lib/api/mentee"
import toast from "react-hot-toast"
import type { YesterdayFeedbackResponse } from "@/types/api"

export default function FeedbackPage() {
  const navigate = useNavigate()
  const { date: paramDate } = useParams()
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (paramDate) {
      return new Date(paramDate)
    }
    return new Date()
  })
  const [feedbackData, setFeedbackData] =
    useState<YesterdayFeedbackResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 날짜 형식 변환 헬퍼
  const formatDateForDisplay = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}.${month}.${day}`
  }

  const formatDateForApi = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // 피드백 데이터 로드
  useEffect(() => {
    const loadFeedbacks = async () => {
      setIsLoading(true)
      try {
        const apiDate = formatDateForApi(selectedDate)
        const data = await getFeedbacksByDate(apiDate)
        setFeedbackData(data)
      } catch (error) {
        console.error("피드백 조회 실패:", error)
        toast.error("피드백을 불러오는데 실패했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    loadFeedbacks()
  }, [selectedDate])

  const handlePreviousDate = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 1)
    setSelectedDate(newDate)
  }

  const handleNextDate = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 1)
    setSelectedDate(newDate)
  }

  // 과목별 색상 매핑
  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "KOREAN":
        return "bg-red-500 text-white"
      case "ENGLISH":
        return "bg-blue-500 text-white"
      case "MATH":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 max-w-md mx-auto">
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
            {formatDateForDisplay(selectedDate)}
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
        {!feedbackData || feedbackData.feedbacks.length === 0 ? (
          <div className="mt-20 text-center">
            <p className="text-gray-500">해당 날짜의 피드백이 없습니다.</p>
          </div>
        ) : (
          <>
            {/* Subject Feedbacks */}
            <section className="mt-6">
              <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-blue-600 rounded"></span>
                과목별 피드백
              </h3>

              <div className="space-y-4">
                {feedbackData.feedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-blue-600"
                  >
                    {/* Subject and Title */}
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`text-sm px-2.5 py-1 rounded font-medium ${getSubjectColor(
                          feedback.subject
                        )}`}
                      >
                        {feedback.subjectName}
                      </span>
                      <h4 className="font-semibold text-gray-900 flex-1">
                        {feedback.taskTitle}
                      </h4>
                      {feedback.isImportant && (
                        <span className="text-lg">⭐</span>
                      )}
                    </div>

                    {/* Summary (if exists) */}
                    {feedback.summary && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3 flex items-start gap-2">
                        <span className="text-lg flex-shrink-0">💡</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-yellow-900">
                            요약: {feedback.summary}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    {feedback.content && (
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {feedback.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Overall Feedback */}
            {feedbackData.overallComment && (
              <section className="mt-8 mb-6">
                <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-blue-600 rounded"></span>
                  총평
                </h3>

                <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-blue-600">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {feedbackData.overallComment}
                  </p>
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav userRole="mentee" />
    </div>
  )
}
