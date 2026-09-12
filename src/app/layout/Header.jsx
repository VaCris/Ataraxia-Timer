import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { Bell, BellOff, LogOut, Clock, Download, User, ShieldCheck, Loader2, Menu } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequest } from '@/features/auth/store/authSlice';
import { TEXTS } from '@/shared/constants/texts.constants';
import { useNotifications } from '@/shared/hooks/useNotifications';
import { useInstallPrompt } from '@/shared/hooks/useInstallPrompt';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { sanitizeImageUrl } from '@/shared/utils/sanitize';

const AuthModal = React.lazy(() => import('@/features/auth/components/AuthModal'));

const Header = ({ is24Hour = false, accentColor = '#14b8a6', onOpenSidebar = () => { }, onOpenProfile = () => { } }) => {
  const dispatch = useDispatch();
  const { permission, requestPermission } = useNotifications();
  const { isInstallable, handleInstallClick } = useInstallPrompt();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const authStatus = useSelector((state) => state.auth.status);
  const authUser = useSelector((state) => state.auth.user);

  const logout = () => dispatch(logoutRequest());
  const isGranted = permission === 'granted';

  const profile = useMemo(() => {
    if (!authUser || authUser.isGuest) return null;
    const isEmail = (value) => typeof value === 'string' && value.includes('@');
    if (authUser.username && !isEmail(authUser.username)) return { text: authUser.username, showIcon: false };
    if (authUser.name && !isEmail(authUser.name)) return { text: authUser.name, showIcon: true };
    return { text: 'USER', showIcon: true };
  }, [authUser]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: !is24Hour });

  return (
    <header className="app-header">
      <div className="app-header-brand">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden flex justify-center items-center bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl w-11 h-11 text-white shadow-xl active:scale-95 transition-all shrink-0"
          aria-label="Open sidebar"
        >
          <Menu size={21} />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-baseline min-w-0">
            <h1 className="app-header-title">ATARAXIA</h1>
          </div>
        </div>

        <div className="app-header-clock">
          <Clock size={14} className="text-white/40 shrink-0" strokeWidth={2.5} />
          <span className="app-header-clock-text">{formatTime(currentTime)}</span>
        </div>
      </div>

      <div className="app-header-actions">
        {isInstallable && (
          <button type="button" onClick={handleInstallClick} className="app-header-install group" style={{ color: accentColor, borderColor: `${accentColor}4d` }}>
            <Download size={14} className="shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5" />
            <span className="hidden sm:block ml-2.5 font-bold text-[10px] uppercase tracking-wider">{TEXTS.header.install}</span>
          </button>
        )}

        <button type="button" onClick={requestPermission} className={`app-header-icon-button ${isGranted ? 'bg-accent/10 border-accent/30 text-accent shadow-glow' : 'bg-white/5 border-white/10 text-white/20'}`} style={isGranted ? { color: accentColor, borderColor: `${accentColor}4d`, backgroundColor: `${accentColor}1a` } : {}}>
          {isGranted ? <Bell size={20} /> : <BellOff size={20} />}
        </button>

        {authStatus === 'loading' ? (
          <div className="app-header-icon-button bg-white/5 border-white/10">
            <Loader2 className="animate-spin" size={20} style={{ color: accentColor }} />
          </div>
        ) : profile ? (
          <>
            <button
              type="button"
              onClick={onOpenProfile}
              className="app-header-profile group"
              aria-label={`Perfil de ${profile.text}`}
            >
              {authUser?.avatarUrl ? (
                <LazyLoadImage
                  src={sanitizeImageUrl(authUser.avatarUrl) || authUser.avatarUrl}
                  alt=""
                  effect="blur"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover ring-2 shrink-0 transition-all group-hover:ring-[var(--accent)]"
                  style={{ '--accent': accentColor, ringColor: accentColor }}
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all"
                  style={{ backgroundColor: `${accentColor}1a`, border: `2px solid ${accentColor}` }}
                >
                  <User size={15} style={{ color: accentColor }} />
                </div>
              )}
              <div className="hidden sm:flex flex-col items-end min-w-0">
                <span className="font-bold text-[10px] text-white sm:text-xs uppercase leading-none tracking-widest truncate max-w-28 2xl:max-w-40">
                  {profile.text}
                </span>
                <span className="flex items-center gap-1 mt-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-400">
                  <ShieldCheck size={9} />
                  {TEXTS.header.verified}
                </span>
              </div>
            </button>
            <button
              type="button"
              onClick={logout}
              className="app-header-icon-button bg-black/40 hover:bg-red-500/10 border-white/5 text-white/20 hover:text-red-500"
              aria-label="Cerrar sesion"
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsAuthOpen(true)}
            className="app-header-icon-button bg-white/5 hover:bg-accent/10 shadow-xl border-white/10 text-white/20 hover:text-accent"
            style={{ '--hover-color': accentColor }}
            aria-label="Iniciar sesion"
          >
            <User size={21} className="hover:text-[var(--hover-color)]" />
          </button>
        )}
      </div>

      <Suspense fallback={null}>
        {isAuthOpen && <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />}
      </Suspense>
    </header>
  );
};
export default Header;