'use client'
import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { User } from '@/src/app/types'
import { authAPI, clientesAPI } from '../lib/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => void
  updateUser: (data: Partial<User>) => void
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
  isAdmin: boolean
  isGarcom: boolean
  isCliente: boolean
}

interface ClienteResponse {
  id: string
  nome: string
  email: string
  role: string
  avatar?: string
  mesa_id?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const updateUser = (data: Partial<User>) => {
    if (!user) return
    
    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    console.log('✅ Usuário atualizado:', updatedUser)
  }

  const refreshUser = async () => {
    if (!user) return

    try {
      if (user.role === 'cliente') {
        const clienteAtualizado = await clientesAPI.get(user.id) as ClienteResponse
        
        const updatedUser = {
          ...user,
          mesa_id: clienteAtualizado.mesa_id
        }
        
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        console.log('✅ Dados do cliente atualizados:', updatedUser)
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
    }
  }

  const login = async (email: string, password: string): Promise<User> => {
    try {
      setLoading(true)
      console.log('🔐 Tentando login com:', email)
      
      let response = null

      // Tentar primeiro como cliente/admin
      try {
        response = await authAPI.loginCliente(email, password)
        console.log('✅ Logado como CLIENTE/ADMIN')
      } catch (clienteError) {
        console.log('⚠️ Não é cliente, tentando como garçom...')
        
        // Se não for cliente, tentar como garçom
        try {
          response = await authAPI.loginGarcom(email, password)
          console.log('✅ Logado como GARÇOM')
        } catch (garcomError) {
          throw new Error('Email ou senha inválidos')
        }
      }

      if (!response || !response.user) {
        throw new Error('Erro ao obter dados do usuário')
      }

      console.log('📊 Dados do usuário:', response.user)
      console.log('🎭 Role:', response.user.role)
      
      // Criar objeto User normalizado
      const normalized: User = {
        id: response.user.id,
        nome: response.user.nome,
        email: response.user.email,
        role: response.user.role,
        avatar: response.user.avatar,
        mesa_id: response.user.mesa_id
      }
      
      setUser(normalized)
      localStorage.setItem('user', JSON.stringify(normalized))
      
      return normalized
    } catch (error: any) {
      console.error('❌ Erro no login:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    console.log('👋 Fazendo logout')
    authAPI.logout()
    setUser(null)
  }

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token')
        const userJson = localStorage.getItem('user')
        
        if (token && userJson) {
          // Verificar se token ainda é válido
          try {
            await authAPI.verifyToken()
            const userData = JSON.parse(userJson)
            
            // Se for cliente, buscar dados atualizados do back-end
            if (userData.role === 'cliente') {
              try {
                const clienteAtualizado = await clientesAPI.get(userData.id) as ClienteResponse
                userData.mesa_id = clienteAtualizado.mesa_id
                console.log('✅ Mesa_id atualizado:', userData.mesa_id)
              } catch (err) {
                console.log('⚠️ Erro ao buscar dados atualizados do cliente')
              }
            }
            
            setUser(userData)
            localStorage.setItem('user', JSON.stringify(userData))
            console.log('✅ Usuário carregado do localStorage:', userData)
          } catch (err) {
            console.log('⚠️ Token expirado, fazendo logout')
            authAPI.logout()
          }
        }
      } catch (err) {
        console.error('Erro ao carregar usuário:', err)
        authAPI.logout()
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        refreshUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isGarcom: user?.role === 'garcom',
        isCliente: user?.role === 'cliente'
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
