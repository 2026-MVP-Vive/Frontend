import { useState, createContext, useContext, useEffect } from "react"
import type { ReactNode } from "react"

interface RouterContextType {
  currentPath: string
  navigate: (path: string | number) => void
  params: Record<string, string>
}

const RouterContext = createContext<RouterContextType>({
  currentPath: "/",
  navigate: () => {},
  params: {}
})

export const useRouter = () => useContext(RouterContext)

interface RouterProviderProps {
  children: ReactNode
  initialPath?: string
}

export function RouterProvider({ children, initialPath = "/" }: RouterProviderProps) {
  const [currentPath, setCurrentPath] = useState(
    typeof window !== "undefined" ? window.location.pathname : initialPath
  )
  const [params] = useState<Record<string, string>>({})

  // 브라우저 히스토리 변경 감지
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [])

  const navigate = (path: string | number) => {
    if (typeof path === "number") {
      // 뒤로가기/앞으로가기
      window.history.go(path)
      return
    }

    if (path !== currentPath) {
      setCurrentPath(path)
      window.history.pushState({}, "", path)
    }
  }

  return (
    <RouterContext.Provider value={{ currentPath, navigate, params }}>
      {children}
    </RouterContext.Provider>
  )
}

interface RouteProps {
  path: string
  element: ReactNode
}

// 경로 패턴과 현재 경로가 매칭되는지 확인하고 파라미터 추출
function matchPath(pattern: string, path: string): { match: boolean; params: Record<string, string> } {
  const patternParts = pattern.split("/")
  const pathParts = path.split("/")

  if (patternParts.length !== pathParts.length) {
    return { match: false, params: {} }
  }

  const params: Record<string, string> = {}

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i]
    const pathPart = pathParts[i]

    if (patternPart.startsWith(":")) {
      // 동적 파라미터
      const paramName = patternPart.slice(1)
      params[paramName] = pathPart
    } else if (patternPart !== pathPart) {
      // 정적 경로가 일치하지 않음
      return { match: false, params: {} }
    }
  }

  return { match: true, params }
}

export function Route({ path, element }: RouteProps) {
  const { currentPath } = useRouter()
  const { match } = matchPath(path, currentPath)
  return match ? <>{element}</> : null
}

interface RoutesProps {
  children: ReactNode
}

export function Routes({ children }: RoutesProps) {
  return <>{children}</>
}
