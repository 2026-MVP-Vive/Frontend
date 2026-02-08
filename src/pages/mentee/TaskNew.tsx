import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createTask } from "@/lib/api"
import type { Subject } from "@/types/api"

export default function TaskNew() {
  const navigate = useNavigate()
  const location = useLocation()
  const [title, setTitle] = useState("")
  const [date, setDate] = useState(() => {
    // 전달받은 날짜가 있으면 사용, 없으면 오늘 날짜
    if (location.state?.date) {
      return location.state.date
    }
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  })
  const [subject, setSubject] = useState<Subject | "">("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert("할 일 제목을 입력해주세요.")
      return
    }

    setIsSubmitting(true)
    try {
      await createTask({
        title: title.trim(),
        date,
        subject: subject || undefined
      })
      alert("할 일이 추가되었습니다!")
      navigate("/mentee")
    } catch (error) {
      console.error("할 일 추가 실패:", error)
      alert("할 일 추가에 실패했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSubjectName = (subjectCode: string) => {
    switch (subjectCode) {
      case 'KOREAN':
        return '국어'
      case 'ENGLISH':
        return '영어'
      case 'MATH':
        return '수학'
      default:
        return '선택 안함'
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">할 일 추가</h1>
        </div>
      </header>

      {/* Form */}
      <main className="flex-1 px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              할 일 제목 <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="예: 오답노트 정리"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
              maxLength={100}
            />
          </div>

          {/* 날짜 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              수행 날짜 <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full"
            />
          </div>

          {/* 과목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              과목 (선택)
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setSubject("")}
                className={`py-3 px-4 rounded-lg border-2 transition-all ${
                  subject === ""
                    ? "border-gray-600 bg-gray-50 text-gray-900 font-semibold"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                선택 안함
              </button>
              <button
                type="button"
                onClick={() => setSubject("KOREAN")}
                className={`py-3 px-4 rounded-lg border-2 transition-all ${
                  subject === "KOREAN"
                    ? "border-red-500 bg-red-50 text-red-700 font-semibold"
                    : "border-gray-200 text-gray-600 hover:border-red-300"
                }`}
              >
                국어
              </button>
              <button
                type="button"
                onClick={() => setSubject("ENGLISH")}
                className={`py-3 px-4 rounded-lg border-2 transition-all ${
                  subject === "ENGLISH"
                    ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                    : "border-gray-200 text-gray-600 hover:border-blue-300"
                }`}
              >
                영어
              </button>
              <button
                type="button"
                onClick={() => setSubject("MATH")}
                className={`py-3 px-4 rounded-lg border-2 transition-all ${
                  subject === "MATH"
                    ? "border-green-500 bg-green-50 text-green-700 font-semibold"
                    : "border-gray-200 text-gray-600 hover:border-green-300"
                }`}
              >
                수학
              </button>
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 멘티가 직접 추가한 할 일은 인증 사진 업로드가 선택사항입니다.
            </p>
          </div>

          {/* 제출 버튼 */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1"
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "추가 중..." : "추가"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
