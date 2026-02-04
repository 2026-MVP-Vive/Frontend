import { useState } from "react"
import { ChevronLeft, FileText, Camera } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

interface Material {
  id: number
  type: "pdf" | "link"
  title: string
  subtitle?: string
  size?: string
  url?: string
}

export default function TaskDetail() {
  const navigate = useNavigate()
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  // Mock data - 실제로는 props나 API로 받아올 데이터
  const task = {
    subject: "국어",
    subjectColor: "text-red-500",
    date: "2025.01.27",
    title: "비문학 지문 분석 3지문",
    goal: "독해력 강화 — 선지 근거 매칭 훈련",
    mentorChecked: false
  }

  const materials: Material[] = [
    {
      id: 1,
      type: "pdf",
      title: "국어_비문학분석_Day27.pdf",
      size: "324KB"
    },
    {
      id: 2,
      type: "link",
      title: "설스터디 칼럼 — 비문학 독해법",
      subtitle: "칼럼 보기"
    }
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024) {
          const reader = new FileReader()
          reader.onload = (e) => {
            if (e.target?.result) {
              setUploadedImages(prev => [...prev, e.target!.result as string])
            }
          }
          reader.readAsDataURL(file)
        }
      })
    }
  }

  const handleDownload = (material: Material) => {
    console.log("Download:", material.title)
    // 실제 다운로드 로직
  }

  const handleOpenLink = (material: Material) => {
    console.log("Open link:", material.title)
    // 실제 링크 열기 로직
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 pt-safe border-b border-gray-200">
        <div className="flex items-center justify-center py-4 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">과제 상세</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-6">
        {/* Task Info */}
        <div className="bg-white rounded-xl p-5 mt-4 shadow-sm border border-gray-100">
          <div className="flex items-start gap-3 mb-3">
            <span
              className={`text-sm px-2.5 py-1 bg-opacity-10 rounded font-medium ${
                task.subjectColor === "text-red-500"
                  ? "bg-red-500 text-red-600"
                  : task.subjectColor === "text-blue-500"
                  ? "bg-blue-500 text-blue-600"
                  : "bg-green-500 text-green-600"
              }`}
            >
              {task.subject}
            </span>
            <span className="text-sm text-gray-500">{task.date}</span>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {task.title}
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed">
            <span className="font-medium">목표: </span>
            {task.goal}
          </p>
        </div>

        {/* Materials Section */}
        <section className="mt-6">
          <h3 className="text-base font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-600 rounded"></span>
            학습지
          </h3>

          <div className="space-y-3">
            {materials.map((material) => (
              <div
                key={material.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {material.type === "pdf" ? (
                    <FileText className="w-6 h-6 text-gray-500" />
                  ) : (
                    <span className="text-2xl">📝</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm mb-0.5 truncate">
                    {material.title}
                  </h4>
                  {material.size && (
                    <p className="text-xs text-gray-500">{material.size}</p>
                  )}
                  {material.subtitle && (
                    <p className="text-xs text-gray-500">{material.subtitle}</p>
                  )}
                </div>

                {material.type === "pdf" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(material)}
                    className="flex-shrink-0"
                  >
                    다운로드
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenLink(material)}
                    className="flex-shrink-0"
                  >
                    열기
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Photo Upload Section */}
        <section className="mt-6">
          <h3 className="text-base font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-600 rounded"></span>
            공부 인증 사진
          </h3>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            {/* Upload Area */}
            <label
              htmlFor="photo-upload"
              className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-1">
                카메라로 촬영하거나 갤러리에서 선택하세요
              </p>
              <p className="text-xs text-gray-400">(JPG, 최대 10MB)</p>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {/* Preview Thumbnails */}
            {uploadedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {uploadedImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                  >
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => {
                        setUploadedImages(prev =>
                          prev.filter((_, i) => i !== index)
                        )
                      }}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Preview Placeholders (when no images) */}
            {uploadedImages.length === 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="aspect-square bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">미리보기</span>
                </div>
                <div className="aspect-square bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">미리보기</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Mentor Check Section */}
        <section className="mt-6">
          <h3 className="text-base font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-600 rounded"></span>
            멘토 확인
          </h3>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={task.mentorChecked}
                disabled
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 cursor-not-allowed"
              />
              <span className="text-gray-600">
                {task.mentorChecked ? "멘토 확인 완료" : "아직 확인 전"}
              </span>
            </label>
          </div>
        </section>
      </main>
    </div>
  )
}
