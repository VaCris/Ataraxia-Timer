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
    <header className="z-50 flex justify-between items-center gap-3 px-4 xs:px-5 sm:px-8 lg:px-8 xl:px-10 2xl:px-16 3xl:px-20 py-4 sm:py-5 lg:py-5 xl:py-6 2xl:py-10 w-full min-w-0">
      <div className="flex items-center gap-3 sm:gap-5 lg:gap-8 2xl:gap-12 min-w-0">
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
            <h1 className="font-black text-white text-xl xs:text-2xl sm:text-3xl lg:text-2xl xl:text-3xl 2xl:text-5xl italic uppercase leading-none tracking-tighter truncate">
              ATARAXIA
            </h1>

            <div
              className="hidden xs:block bg-accent/10 px-2 py-1 border border-accent/20 rounded-lg shrink-0"
              style={{ borderColor: `${accentColor}33` }}
            >
              <span
                className="font-black text-[9px] sm:text-xs lg:text-[10px] xl:text-xs 2xl:text-lg uppercase leading-none tracking-widest"
                style={{ color: accentColor }}
              >
                BETA V2
              </span>
            </div>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-3 2xl:gap-4 bg-white/5 shadow-xl backdrop-blur-2xl px-4 2xl:px-6 py-2.5 2xl:py-3 border border-white/5 rounded-2xl">
          <Clock
            size={15}
            style={{ color: accentColor }}
            className="animate-pulse"
            strokeWidth={3}
          />

          <span className="font-black tabular-nums text-white/60 text-xs 2xl:text-2xl tracking-widest">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 xs:gap-3 sm:gap-4 2xl:gap-6 min-w-0 shrink-0">
        {isInstallable && (
          <button
            type="button"
            onClick={handleInstallClick}
            className="flex justify-center items-center bg-accent/10 hover:bg-accent/20 shadow-glow px-0 sm:px-5 2xl:px-6 border border-accent/30 rounded-xl sm:rounded-2xl w-10 xs:w-11 sm:w-auto h-10 xs:h-11 sm:h-12 2xl:h-14 text-accent active:scale-95 transition-all"
            style={{
              color: accentColor,
              borderColor: `${accentColor}4d`,
            }}
          >
            <Download size={18} className="animate-bounce" />

            <span className="hidden sm:block ml-3 font-black text-[11px] 2xl:text-xl uppercase">
              Install
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={requestPermission}
          className={`flex justify-center items-center border rounded-xl sm:rounded-2xl w-10 xs:w-11 sm:w-12 2xl:w-14 h-10 xs:h-11 sm:h-12 2xl:h-14 transition-all active:scale-95 ${isGranted
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
          <div className="flex justify-center items-center bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl w-10 xs:w-11 sm:w-12 2xl:w-14 h-10 xs:h-11 sm:h-12 2xl:h-14">
            <Loader2
              className="animate-spin"
              size={20}
              style={{ color: accentColor }}
            />
          </div>
        ) : profile ? (
          <div className="flex items-center gap-2 sm:gap-3 bg-white/5 shadow-lg p-1.5 sm:py-2 sm:pr-2 sm:pl-5 2xl:sm:pl-8 border border-white/10 rounded-xl sm:rounded-2xl">
            <div className="hidden md:flex flex-col items-end">
              <div className="flex items-center gap-2">
                {profile.showIcon && (
                  <User
                    size={12}
                    className="opacity-60"
                    style={{ color: accentColor }}
                  />
                )}

                <span className="font-black text-[10px] text-white sm:text-xs 2xl:text-xl uppercase leading-none tracking-widest">
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
              className="flex justify-center items-center bg-black/40 hover:bg-red-500/10 border border-white/5 rounded-lg sm:rounded-xl w-8 sm:w-10 2xl:w-11 h-8 sm:h-10 2xl:h-11 text-white/20 hover:text-red-500 transition-all"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAuthOpen(true)}
            className="flex justify-center items-center bg-white/5 hover:bg-accent/10 shadow-xl border border-white/10 rounded-xl sm:rounded-2xl w-10 xs:w-11 sm:w-12 2xl:w-14 h-10 xs:h-11 sm:h-12 2xl:h-14 text-white/20 hover:text-accent transition-all"
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
