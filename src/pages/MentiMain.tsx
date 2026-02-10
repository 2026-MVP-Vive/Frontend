import { useState, useEffect } from "react";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { sendFCMTokenToServer, setupFCMMessageListener } from "@/utils/fcm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { useNavigate } from "react-router-dom";
import {
  getTasks,
  getYesterdayFeedback,
  completePlanner,
  createZoomMeeting,
} from "@/lib/api/mentee";
import type { Task, Feedback } from "@/types/api";

export default function MentiMain() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [yesterdayDate, setYesterdayDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState<Set<number>>(new Set());
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [zoomDate, setZoomDate] = useState("");
  const [zoomTime, setZoomTime] = useState("");
  const [isZoomSubmitting, setIsZoomSubmitting] = useState(false);

  // 날짜 포맷팅 함수
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 날짜 표시 포맷 (예: 2025.01.27 월)
  const getDisplayDate = (date: Date): string => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dayOfWeek = days[date.getDay()];
    return `${year}.${month}.${day} ${dayOfWeek}`;
  };

  // 주간 날짜 계산 (월요일 ~ 일요일)
  const getWeekDays = (date: Date) => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const current = new Date(date);
    const currentDay = current.getDay(); // 0(일) ~ 6(토)

    // 월요일 찾기
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(current);
    monday.setDate(current.getDate() + mondayOffset);

    // 월요일부터 일요일까지 7일
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      weekDays.push({
        day: days[day.getDay()],
        date: day.getDate(),
      });
    }

    return weekDays;
  };

  // 할 일 목록 조회
  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const dateStr = formatDate(currentDate);
      const data = await getTasks(dateStr);
      setTasks(data.tasks);

      // completed가 true인 task들을 자동으로 체크
      const completedTaskIds = data.tasks
        .filter(task => task.completed)
        .map(task => task.id);
      setCheckedTasks(new Set(completedTaskIds));
    } catch (error) {
      console.error("할 일 목록 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 어제자 피드백 조회
  const loadYesterdayFeedback = async () => {
    try {
      const dateStr = formatDate(currentDate);
      const data = await getYesterdayFeedback(dateStr);
      setFeedbacks(data.feedbacks);
      setYesterdayDate(data.date); // 어제 날짜 저장
    } catch (error) {
      console.error("피드백 조회 실패:", error);
    }
  };

  // 할 일 목록 조회 (날짜 변경 시마다)
  useEffect(() => {
    loadTasks();
  }, [currentDate]);

  // 어제자 피드백 조회 (날짜 변경 시마다)
  useEffect(() => {
    loadYesterdayFeedback();
  }, [currentDate]);

  // FCM 토큰 전송 및 메시지 리스너 설정 (로그인 후 1회)
  useEffect(() => {
    sendFCMTokenToServer();
    const unsubscribe = setupFCMMessageListener();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // 할 일 로컬 체크 토글 (API 호출 없음)
  const handleToggleTask = (taskId: number) => {
    setCheckedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  // 플래너 마감
  const handleCompletePlanner = async () => {
    if (
      !confirm("플래너를 마감하시겠습니까? 멘토에게 피드백 요청이 전달됩니다.")
    ) {
      return;
    }

    try {
      const taskIds = Array.from(checkedTasks);
      await completePlanner(formatDate(currentDate), taskIds);
      toast.success("플래너가 마감되었습니다!");
    } catch (error) {
      console.error("플래너 마감 실패:", error);
      toast.error("플래너 마감에 실패했습니다.");
    }
  };

  // Zoom 미팅 신청
  const handleZoomSubmit = async () => {
    if (!zoomDate || !zoomTime) {
      toast.error("날짜와 시간을 모두 선택해주세요.");
      return;
    }

    setIsZoomSubmitting(true);
    try {
      await createZoomMeeting({
        preferredDate: zoomDate,
        preferredTime: zoomTime,
      });
      toast.success("Zoom 미팅이 신청되었습니다!");
      setIsZoomModalOpen(false);
      setZoomDate("");
      setZoomTime("");
    } catch (error) {
      console.error("Zoom 미팅 신청 실패:", error);
      toast.error("Zoom 미팅 신청에 실패했습니다.");
    } finally {
      setIsZoomSubmitting(false);
    }
  };

  // 과목별 색상 매핑
  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "KOREAN":
        return "bg-red-500 text-white";
      case "ENGLISH":
        return "bg-blue-500 text-white";
      case "MATH":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // 과목명 한글 변환
  const getSubjectName = (subject: string) => {
    switch (subject) {
      case "KOREAN":
        return "국어";
      case "ENGLISH":
        return "영어";
      case "MATH":
        return "수학";
      default:
        return subject;
    }
  };

  // 공부 시간 포맷팅 (분 -> h m)
  const formatStudyTime = (minutes: number | null) => {
    if (!minutes) return "—";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // 날짜 이동
  const handlePreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
    setSelectedDate(newDate.getDate());
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
    setSelectedDate(newDate.getDate());
  };

  // 주간 캘린더에서 날짜 선택
  const handleDateSelect = (date: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(date);
    setCurrentDate(newDate);
    setSelectedDate(date);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 max-w-md mx-auto">
      {/* Header with Date Selector and Week Calendar */}
      <Header
        currentDate={getDisplayDate(currentDate)}
        showWeekCalendar={true}
        selectedDate={selectedDate}
        weekDays={getWeekDays(currentDate)}
        onDateSelect={handleDateSelect}
        onPrevious={handlePreviousDay}
        onNext={handleNextDay}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 px-4">
        {/* Mentor Question Input */}
        {/* Todo: 기획의도 파악 불가 임시 보류 */}
        {/* <div className="mt-4 flex gap-2">
          <Input
            placeholder="멘토에게 질문이나 코멘트를 남겨보세요..."
            className="bg-white border-gray-200 py-6 px-4 rounded-xl flex-1"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            onClick={handleSubmitComment}
            disabled={!comment.trim()}
            className="px-6 py-6 rounded-xl"
          >
            등록
          </Button>
        </div> */}

        {/* Today's Tasks */}
        <section className="mt-6">
          <h2 className="text-base font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-600 rounded"></span>
            오늘 할 일
          </h2>

          <div className="space-y-3">
            {isLoading ? (
              <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                로딩 중...
              </div>
            ) : tasks.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                오늘 할 일이 없습니다
              </div>
            ) : (
              <>
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => navigate(`/mentee/task/${task.id}`)}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleTask(task.id);
                        }}
                        className="mt-1 min-w-[24px] min-h-[24px] flex items-center justify-center"
                      >
                        <div
                          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                            checkedTasks.has(task.id)
                              ? "bg-blue-600 border-blue-600"
                              : "border-gray-300 hover:border-blue-400"
                          }`}
                        >
                          {checkedTasks.has(task.id) && (
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
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {task.title}
                          </h3>
                          {task.mentorAssigned && (
                            <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded">
                              멘토
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-sm px-2 py-0.5 rounded ${getSubjectColor(
                              task.subject,
                            )}`}
                          >
                            {getSubjectName(task.subject)}
                          </span>
                          {task.goalTitle && (
                            <span className="text-sm text-gray-500">
                              {task.goalTitle}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-blue-600 font-medium text-sm whitespace-nowrap">
                        {formatStudyTime(task.studyTime)}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Add Task Button - Always visible */}
            <button
              onClick={() =>
                navigate("/mentee/task/new", {
                  state: { date: formatDate(currentDate) },
                })
              }
              className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-gray-500 hover:bg-gray-50 transition-colors text-left min-h-[48px]"
            >
              + 할 일 추가
            </button>
          </div>
        </section>

        {/* 플래너 마감 버튼 */}
        <section className="mt-6">
          <Button
            onClick={handleCompletePlanner}
            disabled={checkedTasks.size === 0}
            className="w-full py-3 rounded-xl text-sm font-semibold bg-[#3d5af1] text-white hover:bg-[#2d4ae1] disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            플래너 마감 / 피드백 요청
          </Button>
          <p className="text-center text-xs text-gray-500 mt-2">
            {checkedTasks.size === 0
              ? "최소 1개 이상의 할 일을 완료해주세요."
              : "할 일을 완료한 후 눌러주세요. 멘토에게 피드백 요청이 전달됩니다."}
          </p>
        </section>

        {/* Yesterday's Feedback */}
        <section className="mt-8 mb-6">
          <h2 className="text-base font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-600 rounded"></span>
            어제자 피드백 보기
          </h2>

          {feedbacks.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500">
              어제자 피드백이 없습니다
            </div>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  onClick={() =>
                    navigate(`/mentee/feedback/${yesterdayDate}`)
                  }
                  className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-600 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span
                      className={`text-sm px-2.5 py-1 rounded font-medium ${getSubjectColor(
                        feedback.subject,
                      )}`}
                    >
                      {getSubjectName(feedback.subject)}
                    </span>
                    <h3 className="font-semibold text-gray-900 flex-1">
                      {feedback.taskTitle}
                    </h3>
                  </div>

                  {feedback.content && (
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                      {feedback.content}
                    </p>
                  )}

                  {feedback.isImportant && feedback.summary && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                      <span className="text-lg">⭐</span>
                      <p className="text-sm text-yellow-900 flex-1">
                        핵심: {feedback.summary}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Zoom 미팅 신청 플로팅 버튼 */}
      <button
        onClick={() => setIsZoomModalOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors z-40"
        aria-label="Zoom 미팅 신청"
      >
        <Video className="w-6 h-6" />
      </button>

      {/* Zoom 미팅 신청 모달 */}
      <Dialog open={isZoomModalOpen} onOpenChange={setIsZoomModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white z-50">
          <DialogHeader>
            <DialogTitle>Zoom 미팅 신청</DialogTitle>
            <DialogDescription>
              멘토와의 Zoom 미팅을 신청합니다. 희망하는 날짜와 시간을
              선택해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="zoom-date" className="text-sm font-medium">
                희망 날짜 <span className="text-red-500">*</span>
              </label>
              <Input
                id="zoom-date"
                type="date"
                value={zoomDate}
                onChange={(e) => setZoomDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="zoom-time" className="text-sm font-medium">
                희망 시간 <span className="text-red-500">*</span>
              </label>
              <Input
                id="zoom-time"
                type="time"
                value={zoomTime}
                onChange={(e) => setZoomTime(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsZoomModalOpen(false)}
              disabled={isZoomSubmitting}
            >
              취소
            </Button>
            <Button
              onClick={handleZoomSubmit}
              disabled={isZoomSubmitting || !zoomDate || !zoomTime}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isZoomSubmitting ? "신청 중..." : "신청"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <BottomNav userRole="mentee" />
    </div>
  );
}
