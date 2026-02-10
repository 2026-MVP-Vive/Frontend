import { useState, useEffect } from "react"
import { ChevronLeft, FileText, Camera } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { getTaskDetail, submitTaskImage } from "@/lib/api/mentee"
import type { TaskDetailResponse } from "@/types/api"

type TabType = "materials" | "submit"

export default function TaskDetail() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<TabType>("materials")
  const [task, setTask] = useState<TaskDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  // 할 일 상세 조회
  useEffect(() => {
    const loadTaskDetail = async () => {
      if (!id) return

      setIsLoading(true)
      try {
        const data = await getTaskDetail(Number(id))
        setTask(data)

        // 기존 제출 사진이 있으면 표시
        if (data.submission) {
          const existingImageUrl = `${import.meta.env.VITE_API_BASE_URL || 'https://seolstudy.duckdns.org'}${data.submission.imageUrl}`
          console.log("📷 기존 제출 이미지:", existingImageUrl)
          setUploadedImages([existingImageUrl])
        }
      } catch (error) {
        console.error('할 일 상세 조회 실패:', error)
        alert('할 일 정보를 불러오는데 실패했습니다.')
        navigate(-1)
      } finally {
        setIsLoading(false)
      }
    }

    loadTaskDetail()
  }, [id, navigate])

  // 과목별 색상 매핑
  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'KOREAN':
        return 'bg-red-500 text-white'
      case 'ENGLISH':
        return 'bg-blue-500 text-white'
      case 'MATH':
        return 'bg-green-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !id) return

    // 파일 크기 및 타입 검증
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("파일 크기는 10MB 이하여야 합니다.")
      return
    }

    setIsUploading(true)

    try {
      // API 호출하여 서버에 업로드
      const submission = await submitTaskImage(Number(id), file)
      console.log("📤 제출 API 응답:", submission)

      // 업로드 성공 - 미리보기 이미지 추가
      const imageUrl = `${import.meta.env.VITE_API_BASE_URL || 'https://seolstudy.duckdns.org'}${submission.imageUrl}`
      console.log("🖼️ 생성된 이미지 URL:", imageUrl)

      setUploadedImages([imageUrl])

      // task 상태 업데이트
      if (task) {
        setTask({
          ...task,
          submission: submission
        })
      }

      alert("과제 제출이 완료되었습니다!")
    } catch (error) {
      console.error("❌ 과제 제출 실패:", error)
      alert("과제 제출에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsUploading(false)
      // input 초기화
      e.target.value = ""
    }
  }

  const handleDownload = (downloadUrl: string, fileName: string) => {
    const link = document.createElement('a')
    link.href = `${import.meta.env.VITE_API_BASE_URL || 'https://seolstudy.duckdns.org'}${downloadUrl}`
    link.download = fileName
    link.click()
  }

  if (isLoading || !task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    )
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
      <main className="flex-1 overflow-y-auto pb-6">
        {/* Task Info */}
        <div className="bg-white px-4 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span
              className={`text-sm px-2.5 py-1 rounded font-medium ${getSubjectColor(task.subject)}`}
            >
              {task.subjectName}
            </span>

            {task.mentorAssigned && (
              <span className="text-xs px-2.5 py-1 bg-blue-500 bg-opacity-10 text-blue-600 rounded font-medium">
                멘토 과제
              </span>
            )}

            {task.mentorAssigned && (
              <span className="text-xs px-2.5 py-1 bg-red-500 bg-opacity-10 text-red-600 rounded font-medium">
                업로드 필수
              </span>
            )}

            <span className="text-xs text-gray-500 ml-auto">
              {task.date}
            </span>
          </div>

          <h2 className="text-lg font-bold text-gray-900 mb-2">
            {task.title}
          </h2>

          {task.goal && (
            <p className="text-sm text-gray-600 leading-relaxed">
              <span className="font-medium">목표: </span>
              {task.goal.title}
            </p>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white px-4 border-b border-gray-200">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("materials")}
              className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                activeTab === "materials"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              학습지
              {activeTab === "materials" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("submit")}
              className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                activeTab === "submit"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              제출
              {activeTab === "submit" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4">
          {/* 학습지 Tab */}
          {activeTab === "materials" && (
            <section className="mt-4">
              {task.materials.length > 0 ? (
                <div className="space-y-3">
                  {task.materials.map((material) => (
                    <div
                      key={material.id}
                      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-gray-500" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm mb-0.5 truncate">
                          {material.fileName}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {(material.fileSize / 1024).toFixed(0)}KB
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(material.downloadUrl, material.fileName)}
                        className="flex-shrink-0"
                      >
                        다운로드
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
                  <p className="text-gray-500 text-sm">학습지가 없습니다</p>
                </div>
              )}
            </section>
          )}

          {/* 제출 Tab */}
          {activeTab === "submit" && (
            <section className="mt-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold mb-4">공부 인증 사진</h3>

                {/* Upload Area - 이미 제출한 경우 비활성화 */}
                {!task.submission ? (
                  <label
                    htmlFor="photo-upload"
                    className={`block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-colors ${
                      isUploading
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-1">
                      {isUploading
                        ? "업로드 중..."
                        : "카메라로 촬영하거나 갤러리에서 선택하세요"}
                    </p>
                    <p className="text-xs text-gray-400">(JPG, 최대 10MB)</p>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="border-2 border-gray-200 rounded-xl p-8 text-center bg-gray-50">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-1">
                      제출이 완료되었습니다
                    </p>
                    <p className="text-xs text-gray-400">
                      제출된 사진은 수정할 수 없습니다
                    </p>
                  </div>
                )}

                {/* Preview Thumbnails */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {uploadedImages.length > 0 ? (
                    uploadedImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                      >
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                          onLoad={() => console.log("✅ 이미지 로드 성공:", image)}
                          onError={(e) => {
                            console.error("❌ 이미지 로드 실패:", image)
                            const imgElement = e.target as HTMLImageElement
                            imgElement.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3E로드 실패%3C/text%3E%3C/svg%3E"
                          }}
                        />
                        {/* 제출 완료된 경우 삭제 버튼 숨김 */}
                        {!task.submission && (
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
                        )}
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="aspect-square bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">미리보기</span>
                      </div>
                      <div className="aspect-square bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">미리보기</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Warning Message for Mentor Tasks */}
                {task.mentorAssigned && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs text-red-600 font-medium">
                      * 멘토 생성 과제입니다. 인증 사진 업로드가 필수입니다.
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

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
                  checked={task.mentorConfirmed}
                  disabled
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 cursor-not-allowed"
                />
                <span className="text-gray-600 text-sm">
                  {task.mentorConfirmed ? "멘토 확인 완료" : "아직 확인 전"}
                </span>
              </label>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
