import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Users, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

/**
 * 멘토 전용 PC 레이아웃
 * - 사이드바 네비게이션
 * - 2컬럼 레이아웃 (사이드바 + 메인 콘텐츠)
 * - 모든 기기에서 PC UI 강제 (min-width: 1024px)
 */
export default function MentorLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, username } = useAuth();

  const navItems: NavItem[] = [
    {
      icon: <Users className="w-5 h-5" />,
      label: "멘티 관리",
      path: "/mentor/students",
    },
  ];

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <div
      className="flex min-h-screen bg-gray-100"
      style={{ minWidth: "1024px" }}
    >
      {/* 사이드바 */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* 로고 */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold">
            <span className="text-gray-900">설</span>
            <span className="text-blue-600">스터디</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">멘토 관리 시스템</p>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive(item.path)
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* 사용자 정보 및 로그아웃 */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-50 rounded-lg">
            <User className="w-5 h-5 text-gray-600" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {username}
              </p>
              <p className="text-xs text-gray-500">멘토</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>로그아웃</span>
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
