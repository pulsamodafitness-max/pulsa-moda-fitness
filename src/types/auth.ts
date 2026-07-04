export interface User {
  email: string
  name: string
  phone?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  register: (name: string, email: string, password: string) => boolean
  logout: () => void
}
