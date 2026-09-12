import React, { useState, lazy, Suspense, useId, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2, KeyRound, ArrowLeft, Eye, EyeOff, CheckCircle2, Circle } from 'lucide-react';
import {
  loginRequest,
  registerRequest,
  forgotPasswordRequest,
} from '@/features/auth/store/authSlice';
import toast from 'react-hot-toast';

const Privacy = lazy(() => import('@/app/pages/Privacy'));
const Terms = lazy(() => import('@/app/pages/Terms'));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthForm = ({ isLogin, toggleMode }) => {
  const dispatch = useDispatch();
  const { status } = useSelector(state => state.auth);
  const accentColor = useSelector(state => state.settings.accentColor);
  const isLoading = status === 'loading';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [activePage, setActivePage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const idPrefix = useId();

  const passwordRules = useMemo(() => ([
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'One number', valid: /[0-9]/.test(password) },
  ]), [password]);

  const validateEmail = () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setEmailError('Email is required.');
      return false;
    }
    if (!EMAIL_RE.test(cleanEmail)) {
      setEmailError('Enter a valid email address.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailValid = validateEmail();
    if (!emailValid) return;

    if (isLogin) {
      if (!password) {
        setPasswordError('Password is required.');
        return;
      }
      setPasswordError('');
      dispatch(loginRequest({ email: email.trim(), password }));
      return;
    }

    const cleanUsername = username.trim();
    if (cleanUsername.length < 2) {
      setUsernameError('Username must have at least 2 characters.');
      return;
    }
    setUsernameError('');

    const failedRule = passwordRules.find(rule => !rule.valid);
    if (failedRule) {
      setPasswordError(failedRule.label);
      toast.error(failedRule.label);
      return;
    }

    setPasswordError('');
    dispatch(registerRequest({ username: cleanUsername, email: email.trim(), password }));
  };

  const handleForgotPassword = () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!validateEmail()) return;
    dispatch(forgotPasswordRequest({ email: cleanEmail }));
  };

  if (activePage) {
    return (
      <motion.div 
        key="inline-page"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col mx-auto w-full max-w-lg h-full max-h-[75vh]"
      >
        <button
          type="button"
          onClick={() => setActivePage(null)}
          className="group flex items-center gap-2 mb-6 min-h-11 text-white/40 hover:text-white transition-colors focus:outline-none rounded-lg"
          aria-label="Back to form"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          <span className="text-[11px] font-bold uppercase tracking-widest">Back</span>
        </button>
        <div className="flex-1 overflow-y-auto rounded-3xl bg-white/[0.03] border border-white/5 p-6 sm:p-8 custom-scrollbar relative shadow-inner">
          <Suspense fallback={
            <div className="absolute inset-0 flex justify-center items-center">
              <Loader2 className="animate-spin text-white/20" size={32} />
            </div>
          }>
            {activePage === 'privacy' ? <Privacy isInline /> : <Terms isInline />}
          </Suspense>
        </div>
      </motion.div>
    );
  }

  const formVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.05 }
    },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  const inputClass = 'auth-input bg-white/5 focus:bg-white/[0.08] min-h-12 px-4 pl-14 sm:pl-16 border border-white/10 focus:border-[var(--color-accent)] rounded-2xl outline-none w-full text-white text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-focus';
  const fieldLabelClass = 'auth-field-label block mb-2 px-1 font-bold text-[11px] sm:text-xs text-white/70 tracking-[0.04em]';
  const errorClass = 'mt-1.5 px-1 text-[12px] sm:text-[13px] text-red-400 leading-snug';

  return (
    <motion.div 
      key={isLogin ? 'login' : 'register'}
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="mx-auto w-full max-w-lg flex flex-col"
    >
      <motion.div variants={fieldVariants} className="mb-8 sm:mb-10 text-center">
        <h2 className="font-display font-black text-white text-2xl sm:text-3xl italic tracking-tighter">
          {isLogin ? 'WELCOME BACK' : 'CREATE ESSENCE'}
        </h2>
        <p className="mt-2 text-white/50 text-[11px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em]">
          {isLogin ? 'Access your private sanctuary' : 'Start your journey into focus'}
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <AnimatePresence mode="popLayout">
          {!isLogin && (
            <motion.div
              key="username-field"
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <label htmlFor={`${idPrefix}-username`} className={fieldLabelClass}>Username</label>
              <div className="group relative">
                <UserIcon className="top-1/2 left-5 absolute text-white/30 group-focus-within:text-[var(--color-accent)] transition-colors -translate-y-1/2" size={19} aria-hidden="true" />
                <input
                  id={`${idPrefix}-username`}
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (usernameError && e.target.value.trim().length >= 2) setUsernameError('');
                  }}
                  onBlur={() => {
                    if (username.trim() && username.trim().length < 2) setUsernameError('Username must have at least 2 characters.');
                  }}
                  disabled={isLoading}
                  className={`${inputClass} ${usernameError ? 'border-red-500/70' : ''}`}
                  required
                  autoComplete="username"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck="false"
                  aria-invalid={Boolean(usernameError)}
                  aria-describedby={usernameError ? `${idPrefix}-username-error` : undefined}
                />
              </div>
              {usernameError && <p id={`${idPrefix}-username-error`} role="alert" className={errorClass}>{usernameError}</p>}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={fieldVariants}>
          <label htmlFor={`${idPrefix}-email`} className={fieldLabelClass}>Email address</label>
          <div className="group relative">
            <Mail className="top-1/2 left-5 absolute text-white/30 group-focus-within:text-[var(--color-accent)] transition-colors -translate-y-1/2" size={19} aria-hidden="true" />
            <input
              id={`${idPrefix}-email`}
              type="email"
              inputMode="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              onBlur={validateEmail}
              disabled={isLoading}
              className={`${inputClass} ${emailError ? 'border-red-500/70' : ''}`}
              required
              autoComplete="email"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? `${idPrefix}-email-error` : undefined}
            />
          </div>
          {emailError && <p id={`${idPrefix}-email-error`} role="alert" className={errorClass}>{emailError}</p>}
        </motion.div>

        <motion.div variants={fieldVariants} className="flex flex-col gap-3">
          <div>
            <label htmlFor={`${idPrefix}-password`} className={fieldLabelClass}>Password</label>
            <div className="group relative">
              <Lock className="top-1/2 left-5 absolute text-white/30 group-focus-within:text-[var(--color-accent)] transition-colors -translate-y-1/2" size={19} aria-hidden="true" />
              <input
                id={`${idPrefix}-password`}
                type={showPassword ? 'text' : 'password'}
                placeholder={isLogin ? 'Enter your password' : 'Create a secure password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                disabled={isLoading}
                className={`${inputClass} pr-14 ${passwordError ? 'border-red-500/70' : ''}`}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                aria-invalid={Boolean(passwordError)}
                aria-describedby={passwordError ? `${idPrefix}-password-error` : (!isLogin ? `${idPrefix}-password-rules` : undefined)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-2 top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-xl text-white/40 hover:text-white/80 transition-colors disabled:opacity-50"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordError && <p id={`${idPrefix}-password-error`} role="alert" className={errorClass}>{passwordError}</p>}
          </div>

          {!isLogin && (
            <div id={`${idPrefix}-password-rules`} className="grid gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5" aria-label="Password requirements">
              {passwordRules.map(rule => (
                <div key={rule.label} className={`flex items-center gap-2 text-[12px] leading-snug ${rule.valid ? 'text-emerald-400' : 'text-white/50'}`}>
                  {rule.valid ? <CheckCircle2 size={14} aria-hidden="true" /> : <Circle size={14} aria-hidden="true" />}
                  <span>{rule.label}</span>
                </div>
              ))}
            </div>
          )}

          <AnimatePresence>
            {isLogin && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="flex justify-end overflow-hidden"
              >
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                  className="flex min-h-11 items-center gap-1.5 px-2 disabled:opacity-40 font-bold text-[11px] sm:text-xs text-white/50 hover:text-white/80 uppercase tracking-[0.1em] transition-colors rounded"
                  aria-label="Forgot your password?"
                >
                  <KeyRound size={13} /> Forgot Password?
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.button
          variants={fieldVariants}
          whileHover={isLoading ? {} : { scale: 1.02, filter: 'brightness(1.1)' }}
          whileTap={isLoading ? {} : { scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          style={{ backgroundColor: accentColor }}
          className="group relative flex min-h-12 justify-center items-center gap-3 mt-2 shadow-[0_8px_24px_-10px_rgba(20,184,166,0.4)] px-5 py-4 rounded-2xl overflow-hidden font-black text-white text-[11px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-wait"
        >
          {isLoading ? (
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={18} />
              <span>Processing...</span>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
              {isLogin ? 'Enter Sanctuary' : 'Initialize Journey'}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </motion.div>
          )}
        </motion.button>
        
        <motion.div variants={fieldVariants} className="text-center mt-2 px-4">
          <p className="text-[10px] sm:text-[11px] text-white/60 uppercase tracking-[0.08em] sm:tracking-[0.12em] leading-relaxed">
            By continuing, you agree to our{' '}
            <button type="button" onClick={() => setActivePage('terms')} className="min-h-11 px-1 underline underline-offset-4 font-bold text-white/80 hover:text-white transition-colors rounded-sm">
              Terms
            </button>{' '}
            and{' '}
            <button type="button" onClick={() => setActivePage('privacy')} className="min-h-11 px-1 underline underline-offset-4 font-bold text-white/80 hover:text-white transition-colors rounded-sm">
              Privacy Policy
            </button>
          </p>
        </motion.div>
      </form>

      <motion.div variants={fieldVariants} className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-white/10 border-t text-center">
        <p className="text-white/50 text-[12px] sm:text-xs">
          {isLogin ? "Don't have an account yet?" : 'Already part of the sanctuary?'}
        </p>
        <button
          onClick={toggleMode}
          disabled={isLoading}
          style={{ color: accentColor }}
          className="mt-2 min-h-11 px-4 py-2 font-black text-[11px] sm:text-xs uppercase tracking-[0.14em] transition-all hover:bg-white/5 active:scale-95 rounded-xl disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLogin ? 'Create new account' : 'Log into your profile'}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default AuthForm;
