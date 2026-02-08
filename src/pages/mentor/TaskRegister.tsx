import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function TaskRegister() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const studentId = Number(id);

  // Mock 학생 이름
  const studentName = "민유진";

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    title: "",
    goalId: "",
    materials: [] as File[],
  });

  // Mock 솔루션 목록
  const mockGoals = [
    { id: 1, title: "국어 — 독해력 강화", subject: "KOREAN" },
    { id: 2, title: "국어 — 문학 감상법 정리", subject: "KOREAN" },
    { id: 3, title: "영어 — 구문 독해", subject: "ENGLISH" },
    { id: 4, title: "수학 — 미적분 보완", subject: "MATH" },
    { id: 5, title: "수학 — 조건부확률 공식 정리", subject: "MATH" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        materials: Array.from(e.target.files),
      });
    }
  };

  const handleSubmit = () => {
    if (!formData.title) {
      alert("할 일 이름을 입력하세요.");
      return;
    }

    // TODO: API 연동
    console.log("Task register:", formData);
    alert("할 일이 등록되었습니다.");
    navigate(`/mentor/students/${studentId}`);
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">선택하세요...</option>
              {mockGoals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title}
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
                <span className="text-sm text-gray-600">
                  설스터디 칼럼 또는 PDF 파일을 업로드하세요
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
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              할 일 등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
