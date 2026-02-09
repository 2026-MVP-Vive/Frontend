import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, CheckCircle2, Clock, AlertCircle, Bell } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import { getStudents } from "@/lib/api/mentor";
import type { Student } from "@/types/api";

export default function MenteeList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  // 멘티 목록 로드
  useEffect(() => {
    const loadStudents = async () => {
      setIsLoading(true);
      try {
        const data = await getStudents();
        setStudents(data.students);
      } catch (error) {
        console.error("멘티 목록 조회 실패:", error);
        alert("멘티 목록을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, []);

  // 날짜 포맷 (YYYY-MM-DD → MM.DD)
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}.${day}`;
  };

  // 현재 날짜 포맷 (YYYY.MM.DD 요일)
  const formatCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = weekdays[today.getDay()];
    return `${year}.${month}.${day} ${weekday}요일`;
  };

  // 알림 개수 (Mock - 실제로는 API에서 가져와야 함)
  const notificationCount = 3;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6 pb-20">
        {/* Header */}
        <div className="mb-6">
          <div
            className="flex items-start justify-between"
            style={{ padding: "0 10px" }}
          >
            {/* Left: 제목 및 서브 타이틀 */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">담당 멘티</h1>
              <p className="text-sm text-gray-500 mt-2">
                총 {students.length}명의 멘티를 관리하고 있습니다
              </p>
            </div>

            {/* Right: 날짜 및 알림 */}
            <div className="flex items-center gap-4">
              {/* 날짜 */}
              <span className="text-sm text-gray-600">
                {formatCurrentDate()}
              </span>

              {/* 알림 버튼 */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-700" />
                  {notificationCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {/* 알림 드롭다운 */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    {/* 헤더 */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">알림</h3>
                      <span className="text-sm text-gray-500">
                        {notificationCount}건
                      </span>
                    </div>

                    {/* 알림 목록 */}
                    <div className="max-h-96 overflow-y-auto">
                      {notificationCount > 0 ? (
                        <div className="divide-y divide-gray-100">
                          <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                            <p className="text-sm font-medium text-gray-900">
                              민유진 학생의 과제 제출
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              "React 기초 학습" 과제가 제출되었습니다.
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              10분 전
                            </p>
                          </div>
                          <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                            <p className="text-sm font-medium text-gray-900">
                              김철수 학생의 피드백 요청
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              어제 과제에 대한 피드백을 기다리고 있습니다.
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              1시간 전
                            </p>
                          </div>
                          <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                            <p className="text-sm font-medium text-gray-900">
                              이영희 학생의 질문
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              "TypeScript 타입" 과제에 질문이 등록되었습니다.
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              2시간 전
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="px-4 py-8 text-center text-gray-500">
                          <Bell className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">새로운 알림이 없습니다</p>
                        </div>
                      )}
                    </div>

                    {/* 하단 버튼 */}
                    {notificationCount > 0 && (
                      <div className="border-t border-gray-200 px-4 py-3">
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium w-full text-center">
                          모든 알림 보기
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {students.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">담당 멘티가 없습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {students.map((student) => (
              <div
                key={student.id}
                onClick={() => navigate(`/mentor/students/${student.id}`)}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* 멘티 정보 */}
                <div className="flex items-center gap-4 mb-4">
                  {/* 프로필 이미지 */}
                  <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-7 h-7 text-gray-500" />
                  </div>

                  {/* 이름 및 피드백 상태 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {student.name}
                      </h3>
                      {student.hasPendingFeedback && (
                        <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full font-medium">
                          피드백 대기
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      마지막 피드백: {formatDate(student.lastFeedbackDate)}
                    </p>
                  </div>
                </div>

                {/* 오늘의 학습 현황 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 font-medium mb-3">
                    오늘의 학습 현황
                  </p>

                  <div className="grid grid-cols-3 gap-3">
                    {/* 전체 할 일 */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-500">전체</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {student.todayTaskSummary.total}
                      </p>
                    </div>

                    {/* 완료 */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-gray-500">완료</span>
                      </div>
                      <p className="text-lg font-bold text-green-600">
                        {student.todayTaskSummary.completed}
                      </p>
                    </div>

                    {/* 확인 대기 */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        <span className="text-xs text-gray-500">확인 대기</span>
                      </div>
                      <p className="text-lg font-bold text-orange-600">
                        {student.todayTaskSummary.pendingConfirmation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 진행률 바 */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>학습 진행률</span>
                    <span className="font-medium">
                      {student.todayTaskSummary.total > 0
                        ? Math.round(
                            (student.todayTaskSummary.completed /
                              student.todayTaskSummary.total) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{
                        width: `${
                          student.todayTaskSummary.total > 0
                            ? (student.todayTaskSummary.completed /
                                student.todayTaskSummary.total) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav userRole="mentor" />
    </div>
  );
}
