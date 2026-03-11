import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import {
  Loader2, Mail, Lock, User, ArrowRight, Eye, EyeOff,
  CheckCircle2, AlertCircle, KeyRound
} from 'lucide-react'
import {
  loginRequest,
  registerRequest,
  forgotPasswordRequest
} from '@/store/slices/authSlice'

const AuthForm = ({ isLogin, toggleMode }) => {
  const dispatch = useDispatch()
  const { status, error } = useSelector(s => s.auth)

  const isLoading = status === 'loading'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)

  const passwordRequirements = [
    { label: 'Min. 6 characters', test: password.length >= 6 },
    { label: 'Upper & Lowercase', test: /[A-Z]/.test(password) && /[a-z]/.test(password) },
    { label: 'Number or Symbol', test: /(?=.*\d)|(?=.*\W+)/.test(password) }
  ]

  const isPasswordStrong = passwordRequirements.every(r => r.test)
  const passwordsMatch = password.length > 0 && password === confirmPassword

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  useEffect(() => {
    if (status === 'succeeded') {
      toast.success('Login success')
      toggleMode(false)
    }
  }, [status])

  const handleSubmit = e => {
    e.preventDefault()
    const cleanEmail = email.trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cleanEmail)) return toast.error("Invalid email")

    if (isForgotPassword) {
      dispatch(forgotPasswordRequest({ email: cleanEmail }))
      setIsForgotPassword(false)
      return
    }

    if (!isLogin) {
      if (!isPasswordStrong) return toast.error('Weak password')
      if (!passwordsMatch) return toast.error('Passwords mismatch')
      dispatch(registerRequest({ username: username.trim(), email: cleanEmail, password }))
      return
    }

    dispatch(loginRequest({ email: cleanEmail, password }))
  }

  return (
    <div className="w-full auth-container">
      <div className="mb-8 text-center">
        <h2 className="mb-1 font-bold text-white text-2xl">
          {isForgotPassword ? 'Recovery' : isLogin ? 'Sign In' : 'Create Account'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {!isLogin && !isForgotPassword && (
          <div className="relative">
            <User size={18} style={iconStyle} />
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}
              className="input-field" style={inputBaseStyle} required />
          </div>
        )}

        <div className="relative">
          <Mail size={18} style={iconStyle} />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            className="input-field" style={inputBaseStyle} required />
        </div>

        {!isForgotPassword && (
          <>
            <div className="relative">
              <Lock size={18} style={iconStyle} />
              <input type={showPassword ? 'text' : 'password'} placeholder="Password"
                value={password} onChange={e => setPassword(e.target.value)}
                className="input-field" style={{ ...inputBaseStyle, paddingRight: '44px' }} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeButtonStyle}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {!isLogin && password.length > 0 && (
              <div className="space-y-2 bg-white/5 p-4 rounded-2xl">
                {passwordRequirements.map((r, i) => (
                  <div key={i} className={`flex gap-2 text-[9px] font-bold ${r.test ? 'text-green-400' : 'text-white/20'}`}>
                    <CheckCircle2 size={10} /> {r.label}
                  </div>
                ))}
              </div>
            )}

            {!isLogin && (
              <div className="space-y-2">
                <div className="relative">
                  <Lock size={18} style={iconStyle} />
                  <input type={showPassword ? 'text' : 'password'} placeholder="Confirm Password"
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    className="input-field" style={inputBaseStyle} required />
                </div>

                {confirmPassword.length > 0 && (
                  <div className={`flex gap-2 ml-2 ${passwordsMatch ? 'text-green-400' : 'text-red-400/50'}`}>
                    {passwordsMatch ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                    <span className="text-[9px] uppercase">{passwordsMatch ? 'Passwords match' : 'Passwords mismatch'}</span>
                  </div>
                )}
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" onClick={() => setIsForgotPassword(true)} className="text-[10px] text-white/40">
                  Forgot Password?
                </button>
              </div>
            )}
          </>
        )}

        <button type="submit" disabled={isLoading}
          className="flex justify-center items-center gap-2 bg-accent rounded-xl w-full h-12 text-white text-xs uppercase">
          {isLoading ? <Loader2 className="animate-spin" size={18} /> :
            isForgotPassword ? <>Send Reset <KeyRound size={16} /></> :
              <>{isLogin ? 'Sign In' : 'Register'} <ArrowRight size={16} /></>
          }
        </button>
      </form>

      <div className="flex flex-col gap-3 mt-8 text-center">
        {!isForgotPassword ? (
          <button onClick={toggleMode} className="text-[10px] text-white/30">
            {isLogin ? "New? Sign Up" : "Member? Log In"}
          </button>
        ) : (
          <button onClick={() => setIsForgotPassword(false)} className="text-[10px] text-white/30">
            Back to Login
          </button>
        )}
      </div>
    </div>
  )
}

const inputBaseStyle = {
  width: '100%', height: '48px', background: 'rgba(255,255,255,0.05)',
  borderRadius: '12px', paddingLeft: '44px', color: 'white',
  border: '1px solid rgba(255,255,255,0.05)'
}

const iconStyle = {
  position: 'absolute', left: '14px', top: '50%',
  transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)'
}

const eyeButtonStyle = {
  position: 'absolute', right: '14px', top: '50%',
  transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)',
  background: 'none', border: 'none', cursor: 'pointer'
}

export default AuthForm