'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import {
  sendEmailOtpApi, verifyEmailOtpApi, googleAuthApi, updateProfileApi,
  type AuthUser,
} from '@/lib/api/auth'

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

type Step = 'main' | 'otp' | 'profile'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

function formatTimer(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const router = useRouter()
  const setSession = useAuthStore(s => s.setSession)
  const [step, setStep] = useState<Step>('main')
  const [email, setEmail] = useState('')
  // Locked copy of the email at the moment OTP was sent — ref updates
  // synchronously so verify always uses the exact address OTP went to.
  const sentEmailRef = useRef('')
  const [sentEmailDisplay, setSentEmailDisplay] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(0)

  const googleBtnRef = useRef<HTMLDivElement>(null)
  const otpInputRef = useRef<HTMLInputElement>(null)
  const gsiDone = useRef(false)
  // Synchronous in-flight guards — block duplicate calls before React re-renders
  const sendingRef = useRef(false)
  const verifyingRef = useRef(false)
  const onSuccessRef = useRef(onSuccess)
  useEffect(() => { onSuccessRef.current = onSuccess }, [onSuccess])

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStep('main')
        setEmail('')
        sentEmailRef.current = ''
        setSentEmailDisplay('')
        setOtp('')
        setName('')
        setPhone('')
        setError('')
        setLoading(false)
        setTimer(0)
        gsiDone.current = false
        sendingRef.current = false
        verifyingRef.current = false
      }, 350)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  // OTP countdown
  useEffect(() => {
    if (timer <= 0) return
    const id = setTimeout(() => setTimer(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timer])

  // ESC to close + iOS-safe scroll lock
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const scrollY = window.scrollY
    document.body.style.cssText = `position:fixed;top:-${scrollY}px;left:0;right:0;overflow:hidden;width:100%`
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.cssText = ''
      window.scrollTo(0, scrollY)
    }
  }, [isOpen, onClose])

  const finish = useCallback((user: AuthUser, accessToken: string, refreshToken: string) => {
    setSession(user, accessToken, refreshToken)
    onClose()
    if (onSuccessRef.current) onSuccessRef.current()
    else router.refresh()
  }, [setSession, onClose, router])

  const handleGoogleCredential = useCallback(async (response: { credential: string }) => {
    setError('')
    setLoading(true)
    try {
      const data = await googleAuthApi(response.credential)
      const missingProfile = data.isNewUser || !data.user?.phone
      if (missingProfile) {
        setSession(data.user, data.accessToken, data.refreshToken)
        if (data.user?.firstName && data.user.lastName !== '-') {
          setName(`${data.user.firstName} ${data.user.lastName}`.trim())
        }
        if (data.user?.phone) setPhone(data.user.phone)
        setLoading(false)
        setStep('profile')
      } else {
        finish(data.user, data.accessToken, data.refreshToken)
      }
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed')
      setLoading(false)
    }
  }, [setSession, finish])

  // Load Google Sign-In on MAIN step
  useEffect(() => {
    if (!isOpen || step !== 'main' || !GOOGLE_CLIENT_ID || gsiDone.current) return

    const renderBtn = (attempts = 0) => {
      const g = (window as any).google
      if (!googleBtnRef.current || attempts > 15 || !g?.accounts?.id) {
        if (attempts <= 15) setTimeout(() => renderBtn(attempts + 1), 80)
        return
      }
      const w = googleBtnRef.current.offsetWidth
      if (!w) { setTimeout(() => renderBtn(attempts + 1), 80); return }
      g.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
        cancel_on_tap_outside: true,
      })
      g.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline', size: 'large', width: w,
        text: 'continue_with', shape: 'rectangular', logo_alignment: 'left',
      })
      gsiDone.current = true
    }

    if ((window as any).google?.accounts?.id) {
      renderBtn()
    } else if (!document.getElementById('gsi-script')) {
      const s = document.createElement('script')
      s.id = 'gsi-script'
      s.src = 'https://accounts.google.com/gsi/client'
      s.async = true
      s.defer = true
      s.onload = () => renderBtn()
      document.head.appendChild(s)
    } else {
      const poll = setInterval(() => {
        if ((window as any).google?.accounts?.id) { clearInterval(poll); renderBtn() }
      }, 100)
      return () => clearInterval(poll)
    }
  }, [isOpen, step, handleGoogleCredential])

  const handleEmailContinue = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (sendingRef.current) return
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address')
      return
    }
    sendingRef.current = true
    setError('')
    setLoading(true)
    try {
      await sendEmailOtpApi(trimmed)
      sentEmailRef.current = trimmed
      setSentEmailDisplay(trimmed)
      setStep('otp')
      setTimer(60)
      setOtp('')
      setTimeout(() => otpInputRef.current?.focus(), 150)
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
      sendingRef.current = false
    }
  }

  const handleVerifyOtp = async () => {
    if (verifyingRef.current) return
    const code = otp.trim()
    if (code.length < 6) return
    verifyingRef.current = true
    setError('')
    setLoading(true)
    try {
      const data = await verifyEmailOtpApi(sentEmailRef.current, code)
      const missingProfile = data.isNewUser || !data.user?.phone
      if (missingProfile) {
        setSession(data.user, data.accessToken, data.refreshToken)
        if (data.user?.firstName && data.user.lastName !== '-') {
          setName(`${data.user.firstName} ${data.user.lastName}`.trim())
        }
        if (data.user?.phone) setPhone(data.user.phone)
        setStep('profile')
      } else {
        finish(data.user, data.accessToken, data.refreshToken)
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP')
      setOtp('')
      setTimeout(() => otpInputRef.current?.focus(), 50)
    } finally {
      setLoading(false)
      verifyingRef.current = false
    }
  }

  const handleResend = async () => {
    if (timer > 0) return
    verifyingRef.current = false
    setLoading(true)
    setError('')
    try {
      await sendEmailOtpApi(sentEmailRef.current)
      setTimer(60)
      setOtp('')
      setTimeout(() => otpInputRef.current?.focus(), 100)
    } catch (err: any) {
      setError(err.message || 'Failed to resend')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('Please enter your full name'); return }
    if (!phone.trim()) { setError('Please enter your mobile number'); return }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) { setError('Please enter a valid 10-digit mobile number'); return }
    setError('')
    setLoading(true)
    try {
      const parts = name.trim().split(/\s+/)
      const firstName = parts[0]
      const lastName = parts.slice(1).join(' ') || '-'
      const user = await updateProfileApi({ firstName, lastName, phone: phone.trim() })
      const { accessToken, refreshToken } = useAuthStore.getState()
      finish(user, accessToken!, refreshToken!)
    } catch (err: any) {
      setError(err.message || 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" onClick={onClose} />

      {/* Card — bottom sheet on mobile, centered on desktop */}
      <div
        className="relative w-full sm:max-w-[420px] bg-white sm:rounded-3xl rounded-t-[28px] shadow-2xl overflow-y-auto max-h-[92dvh]"
        style={{ animation: 'loginModalIn 0.32s cubic-bezier(0.34,1.2,0.64,1) both' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all bg-transparent border-none cursor-pointer text-lg leading-none"
          aria-label="Close"
        >
          ✕
        </button>

        {/* ── STEP: MAIN ── */}
        {step === 'main' && (
          <div className="p-7 pt-8">
            {/* Logo + headline */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center">
                <span className="text-white font-heading font-black text-lg leading-none">t</span>
              </div>
              <div>
                <p className="font-bold text-text-base leading-tight">ToolHaat</p>
                <p className="text-[11px] text-text-subtle">Powering your business growth</p>
              </div>
            </div>

            <h2 className="text-2xl font-heading font-extrabold text-text-base mb-1">Sign in</h2>
            <p className="text-sm text-text-muted mb-6">
              Track orders, GST invoices &amp; unlock bulk pricing
            </p>

            {/* Google button */}
            {GOOGLE_CLIENT_ID && (
              <>
                {loading ? (
                  <div className="w-full h-11 border border-border-light rounded-lg flex items-center justify-center gap-2 text-sm text-text-subtle bg-bg-page">
                    <span className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    Signing you in…
                  </div>
                ) : (
                  <div ref={googleBtnRef} className="w-full min-h-[44px]" />
                )}

                {/* OR divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-border-light" />
                  <span className="text-xs text-text-subtle font-medium">or continue with email</span>
                  <div className="flex-1 h-px bg-border-light" />
                </div>
              </>
            )}

            {/* Email form */}
            <form onSubmit={handleEmailContinue} noValidate>
              <div className="relative mb-3">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle text-sm">✉</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-4 py-3 text-sm border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-text-subtle"
                  autoComplete="email"
                />
              </div>

              {error && (
                <p className="text-xs text-red-500 mb-3 flex items-start gap-1.5">
                  <span className="mt-0.5">⚠</span> {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-dark hover:bg-mid text-white text-sm font-heading font-extrabold py-3 rounded-xl border-none cursor-pointer transition-colors disabled:opacity-60"
              >
                Continue with Email →
              </button>
            </form>

            {/* New member perk */}
            <div className="mt-5 p-3 bg-accent-light/40 border border-accent-light rounded-xl flex items-center gap-2.5">
              <span className="text-lg">🎉</span>
              <p className="text-xs text-accent-dark">
                <strong>New to ToolHaat?</strong> Get 10% OFF your first order with WELCOME10
              </p>
            </div>

            {/* Legal */}
            <p className="text-[11px] text-text-subtle text-center mt-4 leading-relaxed">
              By signing in you agree to our{' '}
              <a href="/terms" className="text-accent hover:underline" onClick={onClose}>Terms</a>
              {' '}&amp;{' '}
              <a href="/privacy-policy" className="text-accent hover:underline" onClick={onClose}>Privacy Policy</a>
            </p>
          </div>
        )}

        {/* ── STEP: OTP ── */}
        {step === 'otp' && (
          <div className="p-7 pt-8">
            <button
              onClick={() => { setStep('main'); setError(''); setOtp('') }}
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-base transition-colors mb-6 bg-transparent border-none cursor-pointer p-0"
            >
              ← Back
            </button>

            {/* Icon */}
            <div className="w-14 h-14 bg-accent-light/50 rounded-2xl flex items-center justify-center mb-4 text-2xl">
              ✉
            </div>

            <h2 className="text-xl font-heading font-extrabold text-text-base mb-1">Check your email</h2>
            <p className="text-sm text-text-muted mb-6">
              We sent a 6-digit code to{' '}
              <strong className="text-text-base font-semibold">{sentEmailDisplay || email}</strong>
            </p>

            {/* OTP input */}
            <input
              ref={otpInputRef}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              autoComplete="one-time-code"
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-3 text-center text-2xl font-bold tracking-[0.4em] border-2 border-border-light rounded-xl outline-none transition-all focus:border-accent focus:bg-white placeholder:text-text-subtle placeholder:text-base placeholder:tracking-normal mb-5"
            />

            {error && (
              <p className="text-xs text-red-500 mb-3 flex items-start gap-1.5">
                <span className="mt-0.5">⚠</span> {error}
              </p>
            )}

            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length < 6}
              className="w-full bg-dark hover:bg-mid disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-heading font-extrabold py-3 rounded-xl border-none cursor-pointer transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Verifying…</>
              ) : (
                '🛡 Verify & Sign In'
              )}
            </button>

            {/* Resend */}
            <div className="mt-4 text-center">
              {timer > 0 ? (
                <p className="text-xs text-text-subtle">
                  Resend code in <strong className="text-text-muted">{formatTimer(timer)}</strong>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-xs text-accent hover:text-accent-dark font-medium bg-transparent border-none cursor-pointer"
                >
                  Didn&apos;t receive it? Resend OTP
                </button>
              )}
            </div>

            <p className="text-[11px] text-text-subtle text-center mt-3">
              Check your spam folder if you don&apos;t see it
            </p>
          </div>
        )}

        {/* ── STEP: PROFILE ── */}
        {step === 'profile' && (
          <div className="p-7 pt-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent-light to-accent-light/40 rounded-2xl flex items-center justify-center mb-4 text-2xl">
              🏢
            </div>

            <h2 className="text-xl font-heading font-extrabold text-text-base mb-1">One last step!</h2>
            <p className="text-sm text-text-muted mb-1">
              Tell us who&apos;s placing the orders
            </p>
            <p className="text-[11px] text-text-subtle mb-5 flex items-center gap-1">
              <span className="w-2 h-2 bg-red-400 rounded-full inline-block" />
              Both fields are required for delivery updates
            </p>

            <form onSubmit={handleProfileSubmit} noValidate>
              {/* Name */}
              <div className="mb-1">
                <label className="block text-xs font-semibold text-text-muted mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setError('') }}
                  placeholder="e.g. Aman Kumar"
                  autoFocus
                  className="w-full px-4 py-3 text-sm border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-text-subtle"
                />
              </div>

              {/* Phone */}
              <div className="mt-3 mb-1">
                <label className="block text-xs font-semibold text-text-muted mb-1.5">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError('') }}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className="w-full px-4 py-3 text-sm border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-text-subtle"
                />
                <p className="text-[11px] text-text-subtle mt-1.5 ml-1">
                  📦 We&apos;ll send delivery updates on this number
                </p>
              </div>

              {error && (
                <p className="text-xs text-red-500 mb-3 mt-2 flex items-start gap-1.5">
                  <span className="mt-0.5">⚠</span> {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-dark hover:bg-mid text-white text-sm font-heading font-extrabold py-3.5 rounded-xl border-none cursor-pointer transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
                  : 'Continue →'}
              </button>
            </form>
          </div>
        )}

        {/* Trust bar at bottom */}
        {step === 'main' && (
          <div className="px-7 pb-5 flex items-center justify-center gap-5 border-t border-border-light/50 pt-4">
            {[
              { icon: '🔒', label: 'SSL Secured' },
              { icon: '🧾', label: 'GST Invoices' },
              { icon: '🚚', label: '24hr Dispatch' },
            ].map(b => (
              <div key={b.label} className="flex flex-col items-center gap-0.5">
                <span className="text-sm">{b.icon}</span>
                <span className="text-[10px] text-text-subtle">{b.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
