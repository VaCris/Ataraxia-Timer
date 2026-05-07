import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { loginRequest, registerRequest } from '@/features/auth/store/authSlice';

const AuthForm = ({ isLogin, toggleMode }) => {
  const dispatch = useDispatch();
  const { status } = useSelector(state => state.auth);
  const accentColor = useSelector(state => state.settings.accentColor);
  const isLoading = status === 'loading';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(loginRequest({ email: email.trim(), password }));
    } else {
      dispatch(registerRequest({ username: username.trim(), email: email.trim(), password }));
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg"> {/* Aumentamos el ancho máximo */}
      <div className="mb-10 text-center">
        <h2 className="font-black text-white text-3xl italic tracking-tighter">
          {isLogin ? 'WELCOME BACK' : 'CREATE ESSENCE'}
        </h2>
        <p className="mt-2 text-white/40 text-xs uppercase tracking-[0.3em]">
          {isLogin ? 'Access your private sanctuary' : 'Start your journey into focus'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <AnimatePresence mode="wait">
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="group relative"
            >
              <UserIcon className="top-1/2 left-5 absolute text-white/20 group-focus-within:text-accent transition-colors -translate-y-1/2" size={20} />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/5 focus:bg-white/[0.08] p-5 pl-14 border border-white/10 focus:border-accent/50 rounded-2xl outline-none w-full text-white transition-all"
                required
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="group relative">
          <Mail className="top-1/2 left-5 absolute text-white/20 group-focus-within:text-accent transition-colors -translate-y-1/2" size={20} />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/5 focus:bg-white/[0.08] p-5 pl-14 border border-white/10 focus:border-accent/50 rounded-2xl outline-none w-full text-white transition-all"
            required
          />
        </div>

        <div className="space-y-3">
          <div className="group relative">
            <Lock className="top-1/2 left-5 absolute text-white/20 group-focus-within:text-accent transition-colors -translate-y-1/2" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 focus:bg-white/[0.08] p-5 pl-14 border border-white/10 focus:border-accent/50 rounded-2xl outline-none w-full text-white transition-all"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
            />
          </div>

          {isLogin && (
            <div className="flex justify-end">
              <button type="button" className="flex items-center gap-1.5 font-bold text-[10px] text-white/30 hover:text-white/60 uppercase tracking-widest transition-colors">
                <KeyRound size={12} /> Forgot Password?
              </button>
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isLoading}
          style={{ backgroundColor: accentColor }}
          className="group relative flex justify-center items-center gap-3 disabled:opacity-50 shadow-2xl py-5 rounded-2xl overflow-hidden font-black text-white text-xs uppercase tracking-[0.25em]"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={22} />
          ) : (
            <>
              {isLogin ? 'Enter Sanctuary' : 'Initialize Journey'}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </>
          )}
        </motion.button>
      </form>

      {/* Footer del Formulario */}
      <div className="mt-10 pt-8 border-white/5 border-t text-center">
        <p className="text-white/30 text-xs">
          {isLogin ? "Don't have an account yet?" : "Already part of the sanctuary?"}
        </p>
        <button
          onClick={toggleMode}
          style={{ color: accentColor }}
          className="hover:brightness-125 mt-2 font-black text-[11px] uppercase tracking-[0.2em] transition-all"
        >
          {isLogin ? 'Create new account' : 'Log into your profile'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;