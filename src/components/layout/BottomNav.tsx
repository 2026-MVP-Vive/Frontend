import { Calendar, BookOpen, User, Home, Users, ClipboardList } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

interface NavItem {
  icon: React.ReactNode
  label: string
  path: string
  active?: boolean
}

interface BottomNavProps {
  userRole?: "mentee" | "mentor"
}

export default function BottomNav({
  userRole = "mentee"
}: BottomNavProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const menteeNavItems: NavItem[] = [
    { icon: <Calendar className="w-6 h-6" />, label: "캘린더", path: "/mentee/planner" },
    { icon: <BookOpen className="w-6 h-6" />, label: "학습자료", path: "/mentee/resources" },
    { icon: <User className="w-6 h-6" />, label: "마이", path: "/mentee/mypage" }
  ]

  const mentorNavItems: NavItem[] = [
    { icon: <Home className="w-6 h-6" />, label: "홈", path: "/mentor/students" },
    { icon: <Users className="w-6 h-6" />, label: "멘티", path: "/mentor/students" },
    { icon: <ClipboardList className="w-6 h-6" />, label: "관리", path: "/mentor/students" },
    { icon: <User className="w-6 h-6" />, label: "마이", path: "/mentor/mypage" }
  ]

  const navItems = userRole === "mentee" ? menteeNavItems : mentorNavItems

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-[480px] mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/")
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[48px] transition-colors ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {item.icon}
              <span className={`text-xs ${isActive ? "font-medium" : ""}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
