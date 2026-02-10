import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { getStudentSolutions, createMentorTask } from "@/lib/api/mentor";
import type { MentorSolution } from "@/types/api";

export default function TaskRegister() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const studentId = Number(id);

  const [studentName, setStudentName] = useState("");
  const [solutions, setSolutions] = useState<MentorSolution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    title: "",
    goalId: "",
    materials: [] as File[],
  });

  // 솔루션 목록 조회
  useEffect(() => {
    const loadSolutions = async () => {
      setIsLoading(true);
      try {
        const data = await getStudentSolutions(studentId);
        setSolutions(data.solutions);
        setStudentName(data.studentName);
      } catch (error) {
        console.error("솔루션 목록 조회 실패:", error);
        alert("솔루션 목록을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadSolutions();
  }, [studentId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        materials: Array.from(e.target.files),
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.title) {
      alert("할 일 이름을 입력하세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createMentorTask(
        studentId,
        formData.title,
        formData.date,
        formData.goalId ? Number(formData.goalId) : undefined,
        formData.materials.length > 0 ? formData.materials : undefined
      );
      alert("할 일이 등록되었습니다.");
      navigate(`/mentor/students/${studentId}`);
    } catch (error) {
      console.error("할 일 등록 실패:", error);
      alert("할 일 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/mentor/students/${studentId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/mentor/students/${studentId}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">할 일 등록</h1>
          <span className="text-sm text-gray-500">{studentName}</span>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          {/* 날짜 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              날짜
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 할 일 이름 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              할 일 이름
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="예: 비문학 지문 분석 3지문"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 목표 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              목표 (약점 맞춤 솔루션에서 선택)
            </label>
            <select
              value={formData.goalId}
              onChange={(e) =>
                setFormData({ ...formData, goalId: e.target.value })
              }
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:bg-gray-100"
            >
              <option value="">선택하세요...</option>
              {solutions.map((solution) => (
                <option key={solution.id} value={solution.id}>
                  {solution.title}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">
              → 과목은 목표 선택 시 자동 매핑됩니다
            </p>
          </div>

          {/* 학습지 업로드 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              학습지 업로드
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <span className="text-3xl mb-2">📎</span>
                <span className="text-sm text-gray-600 mb-1">
                  클릭하여 파일을 업로드하세요
                </span>
                <span className="text-xs text-gray-500">
                  지원 형식: PDF, DOC, DOCX (여러 파일 선택 가능, 각 10MB 이하)
                </span>
                {formData.materials.length > 0 && (
                  <div className="mt-3 text-xs text-blue-600">
                    {formData.materials.length}개 파일 선택됨
                  </div>
                )}
              </label>
            </div>
            {formData.materials.length > 0 && (
              <div className="mt-3 space-y-1">
                {formData.materials.map((file, index) => (
                  <div
                    key={index}
                    className="text-xs text-gray-600 flex items-center gap-2"
                  >
                    <span>📄</span>
                    <span>{file.name}</span>
                    <span className="text-gray-400">
                      ({Math.round(file.size / 1024)}KB)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "등록 중..." : "할 일 등록"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
