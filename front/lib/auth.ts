import { jwtDecode } from 'jwt-decode'
import { authService } from './api'

interface TokenPayload {
  exp: number
  sub: string
  name: string
  role: string
}

export const getToken = () => {
  const user = localStorage.getItem('user')
  if (!user) return null
  const { token } = JSON.parse(user)
  return token
}

export const setToken = (token: string) => {
  const user = localStorage.getItem('user')
  if (user) {
    const userData = JSON.parse(user)
    userData.token = token
    localStorage.setItem('user', JSON.stringify(userData))
  }
}

export const removeToken = () => {
  localStorage.removeItem('user')
}

export const isTokenExpired = (token: string) => {
  try {
    const decoded = jwtDecode<TokenPayload>(token)
    return decoded.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export const refreshToken = async () => {
  try {
    const response = await authService.refreshToken()
    setToken(response.token)
    return response.token
  } catch (error) {
    removeToken()
    throw error
  }
}

export const getAuthHeader = () => {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const isAuthenticated = () => {
  const token = getToken()
  if (!token) return false
  return !isTokenExpired(token)
} 