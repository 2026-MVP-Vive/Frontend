import { useState } from "react"
import { Minus } from "lucide-react"
import { Input } from "@/components/ui/input"
import Header from "@/components/layout/Header"
import BottomNav from "@/components/layout/BottomNav"
import { useNavigate } from "react-router-dom"

interface TodoItem {
  id: number
  title: string
  subject: string
  subjectColor: string
  description: string
  duration: string
  completed: boolean
}

interface Feedback {
  id: number
  subject: string
  subjectColor: string
  title: string
  content: string
  highlight?: string
}

export default function MentiMain() {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(27)
  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: 1,
      title: "비문학 지문 분석 3지문",
      subject: "국어",
      subjectColor: "text-red-500",
      description: "독해력 강화",
      duration: "1h 20m",
      completed: true
    },
    {
      id: 2,
      title: "영어 구문 분석 Day 12",
      subject: "영어",
      subjectColor: "text-blue-500",
      description: "구문 독해",
      duration: "0h 45m",
      completed: true
    },
    {
      id: 3,
      title: "수학 미적분 유형 풀이",
      subject: "수학",
      subjectColor: "text-green-500",
      description: "미적분 보완",
      duration: "",
      completed: false
    }
  ])

  const [feedbacks] = useState<Feedback[]>([
    {
      id: 1,
      subject: "국어",
      subjectColor: "text-red-500",
      title: "비문학 지문 분석 3지문",
      content: "지문 구조 파악은 잘 되고 있습니다. 다만 선지 분석에서 근거 매칭이 부족해요.",
      highlight: "핵심: 선지별 근거 문장 번호를 반드시 표기하세요"
    },
    {
      id: 2,
      subject: "영어",
      subjectColor: "text-blue-500",
      title: "영어 구문 분석 Day 11",
      content: "관계대명사 절 해석이 많이 나아졌습니다. 분사구문 파트 추가 연습 필요.",
      highlight: ""
    }
  ])

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with Date Selector and Week Calendar */}
      <Header
        currentDate="2025.01.27 월"
        showWeekCalendar={true}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        onPrevious={() => console.log("Previous")}
        onNext={() => console.log("Next")}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 px-4">
        {/* Mentor Question Input */}
        <div className="mt-4">
          <Input
            placeholder="멘토에게 질문이나 코멘트를 남겨보세요..."
            className="bg-white border-gray-200 py-6 px-4 rounded-xl"
          />
        </div>

        {/* Today's Tasks */}
        <section className="mt-6">
          <h2 className="text-base font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-600 rounded"></span>
            오늘 할 일
          </h2>

          <div className="space-y-3">
            {todos.map((todo) => (
              <div
                key={todo.id}
                onClick={() => navigate(`/mentee/task/${todo.id}`)}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleTodo(todo.id)
                    }}
                    className="mt-1 min-w-[24px] min-h-[24px] flex items-center justify-center"
                  >
                    <div
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                        todo.completed
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {todo.completed && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </div>
                  </button>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {todo.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-sm px-2 py-0.5 bg-opacity-10 rounded ${
                          todo.subjectColor === "text-red-500"
                            ? "bg-red-500 text-red-600"
                            : todo.subjectColor === "text-blue-500"
                            ? "bg-blue-500 text-blue-600"
                            : "bg-green-500 text-green-600"
                        }`}
                      >
                        {todo.subject}
                      </span>
                      <span className="text-sm text-gray-500">
                        {todo.description}
                      </span>
                    </div>
                  </div>

                  {todo.duration && (
                    <span className="text-blue-600 font-medium text-sm whitespace-nowrap">
                      {todo.duration}
                    </span>
                  )}

                  {!todo.duration && (
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Minus className="w-5 h-5 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Add Task Button */}
            <button className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-gray-500 hover:bg-gray-50 transition-colors text-left min-h-[48px]">
              + 할 일 추가
            </button>
          </div>
        </section>

        {/* Yesterday's Feedback */}
        <section className="mt-8 mb-6">
          <h2 className="text-base font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-600 rounded"></span>
            어제자 피드백 보기
          </h2>

          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                onClick={() => navigate("/mentee/feedback/2025-01-26")}
                className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-600 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span
                    className={`text-sm px-2.5 py-1 bg-opacity-10 rounded font-medium ${
                      feedback.subjectColor === "text-red-500"
                        ? "bg-red-500 text-red-600"
                        : "bg-blue-500 text-blue-600"
                    }`}
                  >
                    {feedback.subject}
                  </span>
                  <h3 className="font-semibold text-gray-900 flex-1">
                    {feedback.title}
                  </h3>
                </div>

                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  {feedback.content}
                </p>

                {feedback.highlight && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                    <span className="text-lg">⭐</span>
                    <p className="text-sm text-yellow-900 flex-1">
                      {feedback.highlight}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav userRole="mentee" />
    </div>
  )
}
