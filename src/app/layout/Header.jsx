import React, { useState, useEffect, Suspense, useMemo } from 'react';
import {
  Bell,
  BellOff,
  LogOut,
  Clock,
  Download,
  User,
  ShieldCheck,
  Loader2,
  Menu,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequest } from '@/features/auth/store/authSlice';
import { useNotifications } from '@/shared/hooks/useNotifications';
import { useInstallPrompt } from '@/shared/hooks/useInstallPrompt';

const AuthModal = React.lazy(() => import('@/features/auth/components/AuthModal'));

const Header = ({ is24Hour = false, accentColor = '#e11d48', onOpenSidebar }) => {
  const dispatch = useDispatch();

  const { permission, requestPermission } = useNotifications();
  const { isInstallable, handleInstallClick } = useInstallPrompt();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const authStatus = useSelector((state) => state.auth.status);
  const authUser = useSelector((state) => state.auth.user);

  const logout = () => {
    dispatch(logoutRequest());
  };

  const isGranted = permission === 'granted';

  const profile = useMemo(() => {
    if (!authUser || authUser.isGuest) return null;

    const isEmail = (value) => typeof value === 'string' && value.includes('@');

    if (authUser.username && !isEmail(authUser.username)) {
      return { text: authUser.username, showIcon: false };
    }

    if (authUser.name && !isEmail(authUser.name)) {
      return { text: authUser.name, showIcon: true };
    }

    return { text: 'USER', showIcon: true };
  }, [authUser]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: !is24Hour,
    });
  };

  return (
    <header className="app-header">
      <div className="app-header-brand">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="md:hidden flex justify-center items-center bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl w-11 h-11 text-white shadow-xl active:scale-95 transition-all shrink-0"
          aria-label="Open sidebar"
        >
          <Menu size={21} />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-baseline gap-2 sm:gap-4 min-w-0">
            <h1 className="app-header-title">
              ATARAXIA
            </h1>

            <div
              className="app-header-badge"
              style={{ borderColor: `${accentColor}33` }}
            >
              <span
                className="app-header-badge-text"
                style={{ color: accentColor }}
              >
                BETA V2
              </span>
            </div>
          </div>
        </div>

        <div className="app-header-clock">
          <Clock
            size={15}
            style={{ color: accentColor }}
            className="animate-pulse shrink-0"
            strokeWidth={3}
          />

          <span className="app-header-clock-text">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>

      <div className="app-header-actions">
        {isInstallable && (
          <button
            type="button"
            onClick={handleInstallClick}
            className="app-header-install"
            style={{
              color: accentColor,
              borderColor: `${accentColor}4d`,
            }}
          >
            <Download size={18} className="animate-bounce shrink-0" />

            <span className="hidden sm:block ml-3 font-black text-[11px] 2xl:text-sm uppercase">
              Install
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={requestPermission}
          className={`app-header-icon-button ${isGranted
              ? 'bg-accent/10 border-accent/30 text-accent shadow-glow'
              : 'bg-white/5 border-white/10 text-white/20'
            }`}
          style={
            isGranted
              ? {
                color: accentColor,
                borderColor: `${accentColor}4d`,
                backgroundColor: `${accentColor}1a`,
              }
              : {}
          }
        >
          {isGranted ? <Bell size={20} /> : <BellOff size={20} />}
        </button>

        {authStatus === 'loading' ? (
          <div className="app-header-icon-button bg-white/5 border-white/10">
            <Loader2
              className="animate-spin"
              size={20}
              style={{ color: accentColor }}
            />
          </div>
        ) : profile ? (
          <div className="app-header-profile">
            <div className="hidden md:flex flex-col items-end min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                {profile.showIcon && (
                  <User
                    size={12}
                    className="opacity-60 shrink-0"
                    style={{ color: accentColor }}
                  />
                )}

                <span className="font-black text-[10px] text-white sm:text-xs 2xl:text-sm uppercase leading-none tracking-widest truncate max-w-32 2xl:max-w-48">
                  {profile.text}
                </span>
              </div>

              <span
                className="flex items-center gap-1 mt-1 text-[8px] uppercase tracking-tighter"
                style={{ color: accentColor }}
              >
                <ShieldCheck size={10} />
                Verified
              </span>
            </div>

            <button
              type="button"
              onClick={logout}
              className="flex justify-center items-center bg-black/40 hover:bg-red-500/10 border border-white/5 rounded-lg sm:rounded-xl w-8 sm:w-10 h-8 sm:h-10 text-white/20 hover:text-red-500 transition-all shrink-0"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAuthOpen(true)}
            className="app-header-icon-button bg-white/5 hover:bg-accent/10 shadow-xl border-white/10 text-white/20 hover:text-accent"
            style={{ '--hover-color': accentColor }}
          >
            <User size={21} className="hover:text-[var(--hover-color)]" />
          </button>
        )}
      </div>

      <Suspense fallback={null}>
        {isAuthOpen && (
          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
          />
        )}
      </Suspense>
    </header>
  );
};

export default Header;
