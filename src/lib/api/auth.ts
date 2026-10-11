import { api } from './client'

export interface AuthUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: string
  companyName?: string
  gstin?: string
  creditLimit?: number
  paymentTerms?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/login', { email, password })
}

export async function registerApi(data: {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  companyName?: string
  gstin?: string
}): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/register', data)
}

export async function logoutApi(): Promise<void> {
  return api.post('/auth/logout', {})
}

export async function getMeApi(): Promise<AuthUser> {
  return api.get<AuthUser>('/auth/me')
}

export async function refreshTokensApi(userId: string, refreshToken: string): Promise<AuthTokens> {
  return api.post<AuthTokens>('/auth/refresh', { userId, refreshToken })
}

export interface OtpAuthResponse extends AuthResponse {
  isNewUser: boolean
}

export async function sendEmailOtpApi(email: string): Promise<{ message: string; _devOtp?: string }> {
  return api.post('/auth/email/send-otp', { email })
}

export async function verifyEmailOtpApi(email: string, otp: string): Promise<OtpAuthResponse> {
  return api.post<OtpAuthResponse>('/auth/email/verify-otp', { email, otp })
}

export async function googleAuthApi(credential: string): Promise<OtpAuthResponse> {
  return api.post<OtpAuthResponse>('/auth/google', { credential })
}

export async function updateProfileApi(data: {
  firstName?: string
  lastName?: string
  phone?: string
}): Promise<AuthUser> {
  return api.put<AuthUser>('/users/profile', data)
}

export async function forgotPasswordApi(email: string): Promise<{ message: string }> {
  return api.post('/auth/forgot-password', { email })
}

export async function resetPasswordApi(token: string, password: string): Promise<{ message: string }> {
  return api.post('/auth/reset-password', { token, password })
}
