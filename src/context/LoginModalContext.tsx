'use client'
import { createContext, useContext, useState, useCallback, useRef } from 'react'
import LoginModal from '@/components/auth/LoginModal'

interface LoginModalContextValue {
  openLogin: (onSuccess?: () => void) => void
  closeLogin: () => void
}

const LoginModalContext = createContext<LoginModalContextValue>({
  openLogin: () => {},
  closeLogin: () => {},
})

export function useLoginModal() {
  return useContext(LoginModalContext)
}

export function LoginModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const onSuccessRef = useRef<(() => void) | undefined>(undefined)

  const openLogin = useCallback((onSuccess?: () => void) => {
    onSuccessRef.current = onSuccess
    setIsOpen(true)
  }, [])

  const closeLogin = useCallback(() => setIsOpen(false), [])

  return (
    <LoginModalContext.Provider value={{ openLogin, closeLogin }}>
      {children}
      <LoginModal
        isOpen={isOpen}
        onClose={closeLogin}
        onSuccess={onSuccessRef.current}
      />
    </LoginModalContext.Provider>
  )
}
