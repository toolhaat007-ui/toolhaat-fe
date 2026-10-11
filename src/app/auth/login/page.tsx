'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, error, clearError } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    try {
      await login(email, password)
      router.push('/account')
    } catch {}
  }

  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-dark rounded-th-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-heading font-black text-xl">t</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-text-base">Welcome back</h1>
          <p className="text-text-muted text-sm mt-1">Sign in to your ToolHaat account</p>
        </div>

        <div className="bg-white rounded-th-xl border border-border-light p-6 md:p-8 shadow-card">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-semibold text-text-muted block mb-1">Email</label>
              <input
                type="email" required placeholder="Enter your email"
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border border-border-light rounded px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} required placeholder="Enter password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full border border-border-light rounded px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors pr-16"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle text-xs hover:text-accent">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer text-text-muted">
                <input type="checkbox" className="accent-[#2ec4b6]" /> Remember me
              </label>
              <Link href="/auth/forgot-password" className="text-accent no-underline hover:underline">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full bg-dark text-white border-none rounded-th py-3 font-heading font-extrabold text-sm cursor-pointer hover:bg-mid transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</>
                : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-text-muted mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-accent no-underline font-semibold hover:underline">
            Register for free
          </Link>
        </p>
      </div>
    </div>
  )
}
