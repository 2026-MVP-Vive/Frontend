import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, CheckCircle2, Clock, AlertCircle, Bell } from "lucide-react";
import toast from "react-hot-toast";
import {
  getStudents,
  getNotifications,
  markNotificationAsRead,
} from "@/lib/api/mentor";
import type { Student, Notification } from "@/types/api";
import { sendFCMTokenToServer, setupFCMMessageListener } from "@/utils/fcm";

export default function MenteeList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedZoomRequest, setSelectedZoomRequest] =
    useState<Notification | null>(null);

  // 멘티 목록 로드
  useEffect(() => {
    const loadStudents = async () => {
      setIsLoading(true);
      try {
        const data = await getStudents();
        setStudents(data.students);
      } catch (error) {
        console.error("멘티 목록 조회 실패:", error);
        toast.error("멘티 목록을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, []);

  // 알림 목록 로드
  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("알림 조회 실패:", error);
    }
  };

  // 알림 폴링 (1분 간격)
  useEffect(() => {
    loadNotifications(); // 초기 로드

    const interval = setInterval(() => {
      loadNotifications();
    }, 60000); // 1분

    return () => clearInterval(interval);
  }, []);

  // FCM 토큰 전송 및 메시지 리스너 설정 (로그인 후 1회)
  useEffect(() => {
    sendFCMTokenToServer();
    const unsubscribe = setupFCMMessageListener();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // 알림 클릭 처리
  const handleNotificationClick = async (notification: Notification) => {
    // 읽음 처리
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification.id);
        // 로컬 상태 업데이트
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, read: true } : n,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("알림 읽음 처리 실패:", error);
      }
    }

    // 알림 타입에 따른 처리
    if (notification.type === "ZOOM_REQUESTED") {
      setSelectedZoomRequest(notification);
    }
  };

  // Zoom 미팅 팝업 닫기
  const handleConfirmZoomRequest = () => {
    setSelectedZoomRequest(null);
  };

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
      <main className="flex-1 overflow-y-auto px-4 pt-12 pb-6">
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
                {/* 알림 말풍선 (미읽음 알림이 있을 때만) */}
                {unreadCount > 0 && !showNotifications && (
                  <div className="absolute -top-10 right-0 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap animate-pulse">
                    새 알림 {unreadCount}건{/* 말풍선 꼬리 (아래쪽) */}
                    <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-blue-600"></div>
                  </div>
                )}

                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-700" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </button>

                {/* 알림 드롭다운 */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    {/* 헤더 */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">알림</h3>
                      <span className="text-sm text-gray-500">
                        {unreadCount}건
                      </span>
                    </div>

                    {/* 알림 목록 */}
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                              className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                                !notification.read ? "bg-blue-50" : ""
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {notification.studentName} —{" "}
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {new Date(
                                      notification.createdAt,
                                    ).toLocaleString("ko-KR")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-8 text-center text-gray-500">
                          <Bell className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">새로운 알림이 없습니다</p>
                        </div>
                      )}
                    </div>
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

      {/* Zoom 미팅 신청 팝업 */}
      {selectedZoomRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Zoom 미팅 신청
            </h3>

            <div className="space-y-4 mb-6">
              {/* 학생 이름 */}
              <div>
                <p className="text-sm text-gray-500 mb-1">학생</p>
                <p className="text-base font-medium text-gray-900">
                  {selectedZoomRequest.studentName || "정보 없음"}
                </p>
              </div>

              {/* 희망 날짜 및 시간 */}
              {selectedZoomRequest.requestDate ? (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <p className="text-sm font-medium text-blue-900 mb-3">
                    희망 일정
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">날짜</span>
                      <span className="text-sm font-medium text-blue-900">
                        {selectedZoomRequest.requestDate.date}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">시간</span>
                      <span className="text-sm font-medium text-blue-900">
                        {selectedZoomRequest.requestDate.time}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-500 text-center">
                    희망 일정 정보를 불러오는 중...
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {/* <button
                onClick={() => setSelectedZoomRequest(null)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                취소
              </button> */}
              <button
                onClick={handleConfirmZoomRequest}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
