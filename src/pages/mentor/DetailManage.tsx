import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  getStudentTasks,
  saveFeedback,
  saveOverallComment,
  getOverallFeedback,
  confirmTask,
} from "@/lib/api/mentor";
import type { MentorTasksResponse, MentorTask } from "@/types/api";

export default function DetailManage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const studentId = Number(id);

  const [data, setData] = useState<MentorTasksResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [feedbackContent, setFeedbackContent] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [overallComment, setOverallComment] = useState("");
  const [hasOverallFeedback, setHasOverallFeedback] = useState(false);

  // 할 일 목록 로드
  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      try {
        const response = await getStudentTasks(studentId, selectedDate);
        setData(response);
      } catch (error) {
        console.error("할 일 목록 조회 실패:", error);
        alert("할 일 목록을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [studentId, selectedDate]);

  // 총평 작성 여부 확인
  useEffect(() => {
    const loadOverallFeedback = async () => {
      try {
        const response = await getOverallFeedback(studentId, selectedDate);
        setHasOverallFeedback(response.hasOverallFeedback);
        if (response.hasOverallFeedback) {
          setOverallComment(response.content);
        } else {
          setOverallComment("");
        }
      } catch (error) {
        console.error("총평 조회 실패:", error);
        // 에러 시 작성 가능 상태로 설정
        setHasOverallFeedback(false);
        setOverallComment("");
      }
    };

    loadOverallFeedback();
  }, [studentId, selectedDate]);

  // 날짜 포맷 (YYYY-MM-DD → MM.DD 요일)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = weekdays[date.getDay()];
    return `${month}.${day} ${weekday}`;
  };

  // 날짜 이동
  const handlePreviousDate = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  const handleNextDate = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  // 과목별 배지 색상
  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      KOREAN: "bg-red-100 text-red-700",
      ENGLISH: "bg-blue-100 text-blue-700",
      MATH: "bg-green-100 text-green-700",
    };
    return colors[subject] || "bg-gray-100 text-gray-700";
  };

  // 멘토 확인 토글
  const handleConfirmToggle = async (taskId: number) => {
    if (!data) return;

    const task = data.tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      // API 호출
      await confirmTask(studentId, taskId, !task.mentorConfirmed);

      // 상태 업데이트 (낙관적 업데이트)
      setData({
        ...data,
        tasks: data.tasks.map((t) =>
          t.id === taskId ? { ...t, mentorConfirmed: !t.mentorConfirmed } : t,
        ),
      });
    } catch (error) {
      console.error("멘토 확인 실패:", error);
      alert("멘토 확인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 할 일 선택
  const handleTaskSelect = (task: MentorTask) => {
    setSelectedTaskId(task.id);
    setFeedbackContent(task.feedback?.content || "");
    setIsImportant(task.feedback?.isImportant || false);
  };

  // 피드백 저장
  const handleSaveFeedback = async () => {
    if (!selectedTaskId) {
      alert("할 일을 선택해주세요.");
      return;
    }

    if (!feedbackContent.trim()) {
      alert("피드백 내용을 입력해주세요.");
      return;
    }

    try {
      await saveFeedback(
        studentId,
        selectedTaskId,
        feedbackContent,
        isImportant,
      );
      alert("피드백이 저장되었습니다.");

      // 할 일 목록 다시 로드하여 피드백 반영
      const response = await getStudentTasks(studentId, selectedDate);
      setData(response);
    } catch (error) {
      console.error("피드백 저장 실패:", error);
      alert("피드백 저장에 실패했습니다.");
    }
  };

  // 총평 저장
  const handleSaveOverallComment = async () => {
    if (!overallComment.trim()) {
      alert("총평 내용을 입력해주세요.");
      return;
    }

    try {
      await saveOverallComment(studentId, selectedDate, overallComment);
      alert("총평이 저장되었습니다.");

      // 총평 상태 새로고침
      const response = await getOverallFeedback(studentId, selectedDate);
      setHasOverallFeedback(response.hasOverallFeedback);
      setOverallComment(response.content);
    } catch (error) {
      console.error("총평 저장 실패:", error);
      alert("총평 저장에 실패했습니다.");
    }
  };

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {/* Left: 뒤로가기 + 학생 이름 + 날짜 네비게이션 */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/mentor/students")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              {data.studentName}
            </h1>

            {/* 날짜 네비게이션 */}
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={handlePreviousDate}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-sm text-gray-700 min-w-[100px] text-center">
                {formatDate(selectedDate)}
              </span>
              <button
                onClick={handleNextDate}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Right: 버튼 그룹 */}
          <div className="flex gap-2">
            <button
              onClick={() =>
                navigate(`/mentor/students/${studentId}/solutions`)
              }
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              솔루션 관리
            </button>
            <button
              onClick={() =>
                navigate(`/mentor/students/${studentId}/tasks/new`)
              }
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              + 할 일 등록
            </button>
          </div>
        </div>
      </div>

      {/* 플래너 마감 상태 */}
      <div
        className={`mb-4 flex items-center gap-3 p-3 rounded-lg ${
          data.completed
            ? "bg-green-50 border border-green-200"
            : "bg-gray-50 border border-gray-200"
        }`}
      >
        <span className="text-lg">{data.completed ? "✅" : "⏳"}</span>
        <span
          className={`text-sm font-semibold ${
            data.completed ? "text-green-700" : "text-gray-600"
          }`}
        >
          {data.completed
            ? "멘티가 플래너 마감 요청을 했습니다"
            : "멘티가 아직 플래너 마감 요청을 하지 않았습니다"}
        </span>
      </div>

      {/* 2-패널 레이아웃 */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left: 할 일 & 제출 현황 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            📋 할 일 & 제출 현황
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-600 pb-3 w-1/5">
                    이름
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 pb-3 w-1/6">
                    과목
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 pb-3 w-1/5">
                    목표
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 pb-3 w-1/6">
                    유형
                  </th>
                  <th className="text-center text-xs font-semibold text-gray-600 pb-3 w-16">
                    제출완료
                  </th>
                  <th className="text-center text-xs font-semibold text-gray-600 pb-3 w-16">
                    확인
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.tasks.map((task) => (
                  <tr
                    key={task.id}
                    onClick={() => handleTaskSelect(task)}
                    className={`border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      selectedTaskId === task.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="py-3 text-sm font-medium text-gray-900 align-middle">
                      {task.title}
                    </td>
                    <td className="py-3 align-middle">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getSubjectColor(task.subject)}`}
                      >
                        {task.subjectName}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-gray-600 align-middle">
                      {task.goal?.title || "—"}
                    </td>
                    <td className="py-3 align-middle">
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-700">
                        멘티
                      </span>
                    </td>
                    <td className="py-3 text-center align-middle">
                      <span
                        className={`text-sm font-bold ${
                          task.checked ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {task.checked ? "O" : "X"}
                      </span>
                    </td>
                    <td className="py-3 align-middle">
                      <div className="flex justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirmToggle(task.id);
                          }}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                            task.mentorConfirmed
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "border-gray-300 hover:border-blue-400"
                          }`}
                        >
                          {task.mentorConfirmed && (
                            <span className="text-xs">✓</span>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 제출 인증사진 */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-600">
                제출 인증사진
              </h3>
              {(() => {
                const submittedCount = data.tasks.filter(
                  (task) => task.submission,
                ).length;
                const notSubmittedCount = data.tasks.filter(
                  (task) => !task.submission,
                ).length;
                return (
                  <span className="text-xs text-gray-500">
                    제출: {submittedCount}개 | 미제출: {notSubmittedCount}개
                  </span>
                );
              })()}
            </div>
            <div className="flex gap-2 flex-wrap">
              {data.tasks
                .filter((task) => task.submission)
                .map((task) => {
                  const imageUrl = `https://seolstudy.duckdns.org${task.submission!.imageUrl}`;
                  console.log("🖼️ 멘토 페이지 - 제출 이미지:", imageUrl);

                  return (
                    <div
                      key={task.id}
                      className="w-24 h-24 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center text-xs text-gray-600 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => window.open(imageUrl, "_blank")}
                      title={`${task.title} - 클릭하여 확대`}
                    >
                      <img
                        src={imageUrl}
                        alt={task.title}
                        className="w-full h-full object-cover rounded-lg"
                        onLoad={() =>
                          console.log("✅ 이미지 로드 성공:", imageUrl)
                        }
                        onError={(e) => {
                          console.error("❌ 이미지 로드 실패:", imageUrl);
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement!.innerHTML = `
                            <div class="text-center">
                              <div class="text-xs text-gray-400">${task.subjectName}</div>
                              <div class="text-xs text-red-500 mt-1">로드 실패</div>
                            </div>
                          `;
                        }}
                      />
                    </div>
                  );
                })}
              {data.tasks.filter((task) => task.submission).length === 0 && (
                <div className="w-full py-8 text-center">
                  <p className="text-sm text-gray-400">
                    제출된 사진이 없습니다
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: 피드백 작성 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            ✍️ 피드백 작성
            {selectedTaskId &&
              data.tasks.find((t) => t.id === selectedTaskId)?.hasFeedback && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                  작성 완료
                </span>
              )}
          </h2>

          {selectedTaskId ? (
            <>
              {/* 선택된 할 일 */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  선택된 할 일:{" "}
                  {data.tasks.find((t) => t.id === selectedTaskId)?.title}
                </label>
                {data.tasks.find((t) => t.id === selectedTaskId)
                  ?.hasFeedback && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      ✓ 이미 작성된 피드백입니다.
                    </p>
                  </div>
                )}
                <textarea
                  value={feedbackContent}
                  onChange={(e) => setFeedbackContent(e.target.value)}
                  placeholder="피드백 내용을 작성하세요..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  disabled={
                    data.tasks.find((t) => t.id === selectedTaskId)?.hasFeedback
                  }
                />
              </div>

              {/* 중요 표시 */}
              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isImportant}
                    onChange={(e) => setIsImportant(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={
                      data.tasks.find((t) => t.id === selectedTaskId)
                        ?.hasFeedback
                    }
                  />
                  <span className="text-gray-700">
                    중요 표시 (멘티 요약에 노출)
                  </span>
                </label>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <button
                  onClick={handleSaveFeedback}
                  disabled={
                    data.tasks.find((t) => t.id === selectedTaskId)?.hasFeedback
                  }
                  className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    data.tasks.find((t) => t.id === selectedTaskId)?.hasFeedback
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  피드백 저장
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              왼쪽 제출현황에서 할 일을 선택하세요
            </div>
          )}
        </div>
      </div>

      {/* 총평 섹션 (독립적으로 분리) */}
      <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
        <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-blue-600 rounded"></span>
          오늘 전체 학습 총평
          {hasOverallFeedback && (
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
              작성 완료
            </span>
          )}
        </h2>
        {hasOverallFeedback && (
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              ✓ 이미 작성된 총평입니다. 수정이 필요한 경우 내용을 변경하고
              저장해주세요.
            </p>
          </div>
        )}
        <textarea
          value={overallComment}
          onChange={(e) => setOverallComment(e.target.value)}
          placeholder="오늘 전체 학습에 대한 총평을 작성하세요..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          rows={4}
          disabled={hasOverallFeedback}
        />
        <div className="flex justify-end">
          <button
            onClick={handleSaveOverallComment}
            disabled={hasOverallFeedback}
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
              hasOverallFeedback
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            총평 저장
          </button>
        </div>
      </div>
    </div>
  );
}
