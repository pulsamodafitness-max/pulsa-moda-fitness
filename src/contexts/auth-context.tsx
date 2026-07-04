"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import type { User, AuthContextType } from "@/types/auth"

const STORAGE_KEY = "pulsa-user"
const CREDS_KEY = "pulsa-creds"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface StoredUser {
  user: User
  password: string
}

function loadUser(): User | null {
  if (typeof window === "undefined") return null
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

function saveUser(user: User | null) {
  if (typeof window === "undefined") return
  try {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

function loadCreds(): StoredUser[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(CREDS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveCreds(creds: StoredUser[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(CREDS_KEY, JSON.stringify(creds))
  } catch {}
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const saved = loadUser()
    if (saved) setUser(saved)
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) saveUser(user)
  }, [user, hydrated])

  const login = useCallback((email: string, password: string): boolean => {
    const creds = loadCreds()
    const found = creds.find((c) => c.user.email === email && c.password === password)
    if (found) {
      setUser(found.user)
      return true
    }
    return false
  }, [])

  const register = useCallback(
    (name: string, email: string, password: string): boolean => {
      const creds = loadCreds()
      if (creds.some((c) => c.user.email === email)) return false
      const newUser: User = { name, email }
      creds.push({ user: newUser, password })
      saveCreds(creds)
      setUser(newUser)
      return true
    },
    []
  )

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
