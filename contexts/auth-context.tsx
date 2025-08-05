"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  username: string
  firstName: string
  lastName: string
  email?: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, password: string, firstName: string, lastName: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // LocalStorage'dan kullanıcı bilgilerini yükle
  useEffect(() => {
    const savedUser = localStorage.getItem("crm_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const register = async (
    username: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<boolean> => {
    try {
      // Mevcut kullanıcıları kontrol et
      const existingUsers = JSON.parse(localStorage.getItem("crm_users") || "[]")

      // Kullanıcı adı zaten var mı kontrol et
      if (existingUsers.find((u: any) => u.username === username)) {
        return false // Kullanıcı adı zaten mevcut
      }

      // Yeni kullanıcı oluştur
      const newUser: User = {
        id: Date.now().toString(),
        username,
        firstName,
        lastName,
      }

      // Kullanıcı bilgilerini kaydet
      const userWithPassword = { ...newUser, password }
      existingUsers.push(userWithPassword)
      localStorage.setItem("crm_users", JSON.stringify(existingUsers))

      // Kullanıcıyı giriş yap
      setUser(newUser)
      localStorage.setItem("crm_user", JSON.stringify(newUser))

      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem("crm_users") || "[]")
      const foundUser = existingUsers.find((u: any) => u.username === username && u.password === password)

      if (foundUser) {
        const userWithoutPassword = {
          id: foundUser.id,
          username: foundUser.username,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
        }
        setUser(userWithoutPassword)
        localStorage.setItem("crm_user", JSON.stringify(userWithoutPassword))
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("crm_user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export type { User }
