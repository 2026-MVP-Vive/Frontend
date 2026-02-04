import { ChevronLeft, ChevronRight } from "lucide-react"

interface HeaderProps {
  currentDate?: string
  showWeekCalendar?: boolean
  selectedDate?: number
  onDateSelect?: (date: number) => void
  onPrevious?: () => void
  onNext?: () => void
  title?: string
}

export default function Header({
  currentDate = "2025.01.27 월",
  showWeekCalendar = true,
  selectedDate = 27,
  onDateSelect,
  onPrevious,
  onNext,
  title
}: HeaderProps) {
  const weekDays = [
    { day: "월", date: 24 },
    { day: "화", date: 25 },
    { day: "수", date: 26 },
    { day: "목", date: 27 },
    { day: "금", date: 28 },
    { day: "토", date: 29 },
    { day: "일", date: 30 }
  ]

  return (
    <header className="bg-white px-4 pt-safe">
      <div className="flex items-center justify-between py-4">
        <button
          onClick={onPrevious}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h1 className="text-lg font-bold">{title || currentDate}</h1>

        <button
          onClick={onNext}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {showWeekCalendar && (
        <div className="flex justify-between pb-4">
          {weekDays.map((item) => (
            <button
              key={item.date}
              onClick={() => onDateSelect?.(item.date)}
              className={`flex flex-col items-center min-w-[48px] min-h-[64px] justify-center rounded-2xl transition-all ${
                selectedDate === item.date
                  ? "bg-blue-600 text-white shadow-md"
                  : "hover:bg-gray-100"
              }`}
            >
              <span className="text-xs mb-1">{item.day}</span>
              <span className="text-xl font-semibold">{item.date}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  )
}
