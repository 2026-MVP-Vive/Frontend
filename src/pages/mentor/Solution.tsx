import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import {
  getStudentSolutions,
  createSolution,
  updateSolution,
  deleteSolution,
} from "@/lib/api/mentor";
import type { MentorSolution, Subject } from "@/types/api";

export default function Solution() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const studentId = Number(id);

  const [studentName, setStudentName] = useState("");
  const [solutions, setSolutions] = useState<MentorSolution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subject: "" as Subject | "",
    materialFiles: [] as File[],
  });

  // 솔루션 목록 조회
  useEffect(() => {
    const loadSolutions = async () => {
      setIsLoading(true);
      try {
        const data = await getStudentSolutions(studentId);
        setStudentName(data.studentName);
        setSolutions(data.solutions);
      } catch (error) {
        console.error("솔루션 조회 실패:", error);
        toast.error("솔루션 목록을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (studentId) {
      loadSolutions();
    }
  }, [studentId]);

  // 과목별 배지 색상
  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      KOREAN: "bg-red-100 text-red-700",
      ENGLISH: "bg-blue-100 text-blue-700",
      MATH: "bg-green-100 text-green-700",
    };
    return colors[subject] || "bg-gray-100 text-gray-700";
  };

  const handleAdd = () => {
    setShowAddForm(true);
    setEditingId(null);
    setFormData({ title: "", subject: "", materialFiles: [] });
  };

  const handleEdit = (solution: MentorSolution) => {
    setEditingId(solution.id);
    setFormData({
      title: solution.title,
      subject: solution.subject,
      materialFiles: [],
    });
    setShowAddForm(false);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.subject) {
      toast.error("보완점과 과목을 입력하세요.");
      return;
    }

    try {
      if (editingId) {
        // 수정
        const updated = await updateSolution(
          studentId,
          editingId,
          formData.title,
          formData.subject as Subject,
          formData.materialFiles.length > 0 ? formData.materialFiles : undefined
        );

        setSolutions(
          solutions.map((s) =>
            s.id === editingId ? updated : s
          )
        );
        setEditingId(null);
        toast.success("솔루션이 수정되었습니다.");
      } else {
        // 추가
        const newSolution = await createSolution(
          studentId,
          formData.title,
          formData.subject as Subject,
          formData.materialFiles.length > 0 ? formData.materialFiles : undefined
        );

        setSolutions([...solutions, newSolution]);
        setShowAddForm(false);
        toast.success("솔루션이 추가되었습니다.");
      }

      setFormData({ title: "", subject: "", materialFiles: [] });
    } catch (error) {
      console.error("솔루션 저장 실패:", error);
      toast.error("솔루션 저장에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({ title: "", subject: "", materialFiles: [] });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deleteSolution(studentId, id);
      setSolutions(solutions.filter((s) => s.id !== id));
      toast.success("솔루션이 삭제되었습니다.");
    } catch (error) {
      console.error("솔루션 삭제 실패:", error);
      toast.error("솔루션 삭제에 실패했습니다.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFormData({ ...formData, materialFiles: Array.from(files) });
    }
  };

  const handleDownload = (downloadUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = `${import.meta.env.VITE_API_BASE_URL || "http://115.68.232.25:8080"}${downloadUrl}`;
    link.download = fileName;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/mentor/students/${studentId}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              약점 맞춤 솔루션
            </h1>
            <span className="text-sm text-gray-500">{studentName}</span>
          </div>

          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            + 솔루션 추가
          </button>
        </div>
      </div>

      {/* 추가 폼 */}
      {showAddForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
          <h3 className="text-base font-bold text-gray-900 mb-4">
            새 솔루션 추가
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                보완점
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="예: 독해력 강화"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                과목
              </label>
              <select
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value as Subject })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">선택하세요</option>
                <option value="KOREAN">국어</option>
                <option value="ENGLISH">영어</option>
                <option value="MATH">수학</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                추가자료
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                multiple
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                PDF, DOC, DOCX (각 10MB 이하)
              </p>
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              저장
            </button>
          </div>
        </div>
      )}

      {/* 솔루션 테이블 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-600 px-6 py-3">
                보완점
              </th>
              <th className="text-left text-xs font-semibold text-gray-600 px-6 py-3">
                과목
              </th>
              <th className="text-left text-xs font-semibold text-gray-600 px-6 py-3">
                추가자료
              </th>
              <th className="text-center text-xs font-semibold text-gray-600 px-6 py-3 w-32">
                관리
              </th>
            </tr>
          </thead>
          <tbody>
            {solutions.map((solution) => (
              <tr key={solution.id} className="border-b border-gray-100">
                {editingId === solution.id ? (
                  // 수정 모드
                  <>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value as Subject })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="KOREAN">국어</option>
                        <option value="ENGLISH">영어</option>
                        <option value="MATH">수학</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        multiple
                        onChange={handleFileChange}
                        className="text-xs"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, DOCX (각 10MB 이하)
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={handleSave}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          저장
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-3 py-1 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50"
                        >
                          취소
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  // 일반 모드
                  <>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {solution.title}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getSubjectColor(solution.subject)}`}
                      >
                        {solution.subjectName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {solution.materials.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {solution.materials.map((material) => (
                            <button
                              key={material.id}
                              onClick={() => handleDownload(material.downloadUrl, material.fileName)}
                              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-left"
                            >
                              <span>📎</span>
                              <span>{material.fileName}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">
                          자료 없음
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={() => handleEdit(solution)}
                          className="px-3 py-1 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(solution.id)}
                          className="px-3 py-1 border border-red-300 text-red-600 text-xs rounded hover:bg-red-50"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {solutions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-sm">등록된 솔루션이 없습니다</p>
            <p className="text-xs mt-1">위의 "솔루션 추가" 버튼을 눌러 추가하세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
