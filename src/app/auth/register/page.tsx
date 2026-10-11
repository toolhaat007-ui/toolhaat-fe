'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'

export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading, error, clearError } = useAuthStore()

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', companyName: '', gstin: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        companyName: form.companyName || undefined,
        gstin: form.gstin || undefined,
      })
      router.push('/account')
    } catch {}
  }

  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-[480px]">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-dark rounded-th-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-heading font-black text-xl">t</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-text-base">Create your account</h1>
          <p className="text-text-muted text-sm mt-1">Join 1,500+ businesses buying smarter</p>
        </div>

        <div className="bg-white rounded-th-xl border border-border-light p-6 md:p-8 shadow-card">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm mb-4">
              {Array.isArray(error) ? error.join(', ') : error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-text-muted block mb-1">First Name *</label>
                <input required value={form.firstName} onChange={set('firstName')}
                  placeholder="Rajesh"
                  className="w-full border border-border-light rounded px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted block mb-1">Last Name *</label>
                <input required value={form.lastName} onChange={set('lastName')}
                  placeholder="Kumar"
                  className="w-full border border-border-light rounded px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-muted block mb-1">Email *</label>
              <input type="email" required value={form.email} onChange={set('email')}
                placeholder="rajesh@acmecorp.com"
                className="w-full border border-border-light rounded px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors" />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-muted block mb-1">Phone *</label>
              <input type="tel" required value={form.phone} onChange={set('phone')}
                placeholder="+91 98765 43210"
                className="w-full border border-border-light rounded px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors" />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-muted block mb-1">Password *</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required value={form.password}
                  onChange={set('password')} placeholder="Min 8 chars with uppercase & number"
                  className="w-full border border-border-light rounded px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors pr-16" />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle text-xs hover:text-accent">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="border-t border-border-light pt-4">
              <p className="text-xs text-text-subtle mb-3 font-semibold">Business Details (Optional)</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-text-muted block mb-1">Company Name</label>
                  <input value={form.companyName} onChange={set('companyName')}
                    placeholder="Acme Industrial Supplies"
                    className="w-full border border-border-light rounded px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted block mb-1">GSTIN</label>
                  <input value={form.gstin} onChange={set('gstin')}
                    placeholder="29ABCDE1234F1Z5"
                    className="w-full border border-border-light rounded px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors font-mono uppercase" />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-text-subtle">
              By registering, you agree to our{' '}
              <Link href="/terms" className="text-accent no-underline hover:underline">Terms of Service</Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-accent no-underline hover:underline">Privacy Policy</Link>
            </p>

            <button type="submit" disabled={isLoading}
              className="w-full bg-accent text-dark border-none rounded-th py-3 font-heading font-extrabold text-sm cursor-pointer hover:bg-accent-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading
                ? <><span className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />Creating account…</>
                : 'Create Free Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-text-muted mt-4">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-accent no-underline font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
