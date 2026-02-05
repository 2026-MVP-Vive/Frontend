import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { detectRole, setUserRole, setAuthToken, setUsername } from "@/utils/auth"

export default function Login() {
  const [username, setUsernameInput] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // 간단한 유효성 검사
      if (!username || !password) {
        setError("아이디와 비밀번호를 입력해주세요.")
        return
      }

      // 역할 판별
      const role = detectRole(username)

      if (!role) {
        setError("유효하지 않은 계정입니다. 관리자에게 문의하세요.")
        return
      }

      // TODO: 실제 API 호출로 대체 필요
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, password })
      // })

      // Mock: 로그인 성공 시뮬레이션 (임시 토큰 생성)
      const mockToken = `mock_token_${Date.now()}`

      // sessionStorage에 인증 정보 저장
      setAuthToken(mockToken)
      setUserRole(role)
      setUsername(username)

      // 홈으로 이동 (역할별 레이아웃은 /home에서 처리)
      navigate('/home')

    } catch (err) {
      setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-[#2d3548] px-8 py-16 text-center">
        <h1 className="text-4xl font-bold mb-3">
          <span className="text-white">섬</span>
          <span className="text-[#5b7cff]">스터디</span>
        </h1>
        <p className="text-gray-300 text-sm">
          자체 콘텐츠 기반 수능 국영수 학습코칭
        </p>
      </div>

      {/* Login Form */}
      <div className="flex-1 bg-gray-50 px-6 py-8">
        <div className="bg-white rounded-2xl px-8 py-10 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                아이디
              </label>
              <Input
                id="username"
                type="text"
                placeholder="test_mentee1"
                value={username}
                onChange={(e) => setUsernameInput(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                비밀번호
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p className="font-medium">테스트 계정</p>
            <p className="mt-1">
              멘토: mentor01 / 멘티: mentee01, mentee02
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
