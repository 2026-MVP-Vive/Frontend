import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { setAuthToken, setRefreshToken, setUser } from "@/utils/auth"
import { login } from "@/lib/api/auth"

export default function Login() {
  const [loginId, setLoginId] = useState("")
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
      if (!loginId || !password) {
        setError("아이디와 비밀번호를 입력해주세요.")
        return
      }

      // 실제 API 호출
      const response = await login({ loginId, password })

      // sessionStorage에 인증 정보 저장
      setAuthToken(response.accessToken)
      setRefreshToken(response.refreshToken)
      setUser(response.user)

      // 역할별 홈으로 이동
      if (response.user.role === 'MENTOR') {
        navigate('/mentor')
      } else {
        navigate('/mentee')
      }

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.")
      }
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
                htmlFor="loginId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                아이디
              </label>
              <Input
                id="loginId"
                type="text"
                placeholder="mentee01"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
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
