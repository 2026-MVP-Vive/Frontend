import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { setAuthToken, setRefreshToken, setUser } from "@/utils/auth";
import { login } from "@/lib/api/auth";
import { GraduationCap, User, Lock } from "lucide-react";

export default function Login() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 간단한 유효성 검사
      if (!loginId || !password) {
        setError("아이디와 비밀번호를 입력해주세요.");
        return;
      }

      // 실제 API 호출
      const response = await login({ loginId, password });

      // sessionStorage에 인증 정보 저장
      setAuthToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      setUser(response.user);

      // 역할별 홈으로 이동
      if (response.user.role === "MENTOR") {
        navigate("/mentor");
      } else {
        navigate("/mentee");
      }
    } catch (err) {
      setError("아이디/비밀번호가 다릅니다");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* 로고 및 타이틀 */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl mb-4 shadow-lg">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            설스터디
          </h1>
          <p className="text-gray-600 text-sm">
            자체 콘텐츠 기반 수능 국영수 학습코칭
          </p>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-white rounded-3xl px-8 py-10 shadow-2xl shadow-indigo-100 border border-gray-100">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm animate-shake">
                {error}
              </div>
            )}

            {/* 아이디 입력 */}
            <div>
              <label
                htmlFor="loginId"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                아이디
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="loginId"
                  type="text"
                  placeholder="mentee01"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                비밀번호
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
            </div>

            {/* 로그인 버튼 */}
            <Button
              type="submit"
              size="lg"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  로그인 중...
                </div>
              ) : (
                "로그인"
              )}
            </Button>
          </form>

          {/* 테스트 계정 안내 */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                🔑 테스트 계정
              </p>
              <div className="space-y-1 text-xs text-gray-600">
                <p>
                  멘토:{" "}
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    mentor01
                  </span>
                </p>
                <p>
                  멘티:{" "}
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    mentee01
                  </span>
                  ,{" "}
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    mentee02
                  </span>
                </p>
                <p className="text-gray-500 mt-2">
                  비밀번호: <span className="font-mono">password123</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <p className="text-center text-xs text-gray-500 mt-6">
          © 2026 설스터디. All rights reserved.
        </p>
      </div>
    </div>
  );
}
