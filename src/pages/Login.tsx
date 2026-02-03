import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt:", { username, password })
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
                onChange={(e) => setUsername(e.target.value)}
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

            <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              로그인
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
