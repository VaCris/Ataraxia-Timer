import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../auth/store/authSlice';
import { userService } from '../api/user.api';
import { authService } from '../../auth/api/auth.api';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import {
    ShieldCheck,
    Mail,
    LogOut,
    Edit2,
    Save,
    User,
    Trophy,
    Trash2,
    Lock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { TEXTS } from '@/shared/constants/texts.constants';
import { sanitizeImageUrl } from '@/shared/utils/sanitize';

const ProfileView = () => {
    const user = useSelector((state) => state.auth.user);
    const authStatus = useSelector((state) => state.auth.status);
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newAvatar, setNewAvatar] = useState('');
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');

    const currentLevel = user?.level || 1;
    const currentXP = user?.xp || 0;
    const xpToNextLevel = 100;
    const progressPercentage = currentXP % xpToNextLevel;

    const displayName =
        user?.username ||
        user?.name ||
        user?.email?.split('@')[0] ||
        'Focus Member';

    const displayEmail = user?.email || 'no-email@ataraxia.app';

    const handleStartEdit = () => {
        setNewUsername(displayName);
        setNewAvatar(user?.avatarUrl || '');
        setIsEditing(true);
    };

    const handleUpdateProfile = async () => {
        const cleanUsername = newUsername.trim();
        const cleanAvatar = newAvatar.trim();

        if (cleanUsername.length < 3) {
            toast.error(TEXTS.profile.usernameShort);
            return;
        }

        if (cleanAvatar && !sanitizeImageUrl(cleanAvatar)) {
            toast.error(TEXTS.profile.invalidUrl);
            return;
        }

        try {
            const response = await userService.updateInfo({ username: cleanUsername });
            
            const mergedUser = {
                ...user,
                ...response,
                id: response.id || user?.id,
                email: response.email || user?.email,
                name: response.name || response.username || user?.name,
            };
            
            if (cleanAvatar && cleanAvatar !== user?.avatarUrl) {
                await userService.updateAvatar({ avatarUrl: cleanAvatar });
                mergedUser.avatarUrl = cleanAvatar;
            }
            
            dispatch(updateUser(mergedUser));
            toast.success(TEXTS.profile.updateSuccess);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile", error);
            toast.error(TEXTS.profile.updateFailed);
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch(e) {
            console.error(e);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.reload();
    };

    const confirmDeleteAccount = async () => {
        if (!deletePassword) return;
        try {
            await userService.deleteAccount({ confirmationPassword: deletePassword });
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            window.location.reload();
        } catch (error) {
            console.error("Failed to delete account", error);
            toast.error(TEXTS.profile.deleteFailed);
        }
    };

    if (authStatus === 'loading') {
        return (
            <div className="flex justify-center items-center w-full min-h-[60vh]">
                <div className="font-black text-[10px] text-white/30 uppercase tracking-[0.3em]">
                    {TEXTS.profile.loading}
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
                <Lock size={48} className="text-white/20 mb-4 mx-auto" />
                <h3 className="text-white font-bold text-xl mb-2">{TEXTS.auth.loginRequired}</h3>
                <p className="text-white/50 text-sm">{TEXTS.profile.loginToView}</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 mx-auto p-4 sm:p-8 w-full max-w-5xl"
        >
            <div className="flex md:flex-row flex-col items-center gap-6 sm:gap-8 bg-black/40 backdrop-blur-3xl p-6 sm:p-8 border border-white/5 rounded-3xl glass">
                <div className="relative shrink-0">
                    <div className="flex justify-center items-center bg-accent/10 border border-accent/20 rounded-full w-24 h-24 sm:w-28 sm:h-28 overflow-hidden">
                        {user?.avatarUrl ? (
                            <LazyLoadImage
                                src={sanitizeImageUrl(user.avatarUrl) || user.avatarUrl}
                                alt="Avatar"
                                effect="blur"
                                width={112}
                                height={112}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User size={45} className="text-accent/60" />
                        )}
                    </div>

                    <div className="-right-1 -bottom-1 absolute bg-accent shadow-md p-1.5 rounded-full text-white">
                        <Trophy size={14} />
                    </div>
                </div>

                <div className="flex-1 space-y-2 md:text-left text-center min-w-0 w-full">
                    <div className="flex justify-center md:justify-start items-center gap-3">
                        {isEditing ? (
                            <div className="flex flex-col gap-2 w-full max-w-xs">
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    placeholder={TEXTS.profile.usernamePlaceholder}
                                    className="bg-white/5 px-3 py-1.5 border border-white/10 focus:border-accent/40 rounded-xl outline-none font-bold text-white text-lg uppercase tracking-wider"
                                    autoFocus
                                  />
                                <input
                                    type="text"
                                    value={newAvatar}
                                    onChange={(e) => setNewAvatar(e.target.value)}
                                    placeholder={TEXTS.profile.avatarPlaceholder}
                                    className="bg-white/5 px-3 py-1.5 border border-white/10 focus:border-accent/40 rounded-xl outline-none text-white/70 text-xs"
                                  />
                            </div>
                        ) : (
                            <h2 className="font-display font-semibold text-white text-xl sm:text-2xl tracking-tight truncate">
                                {displayName}
                            </h2>
                        )}

                        <button
                            type="button"
                            onClick={isEditing ? handleUpdateProfile : handleStartEdit}
                            className="p-1.5 text-white/30 hover:text-white transition-colors cursor-pointer shrink-0"
                            title={isEditing ? "Save Profile" : "Edit Profile"}
                        >
                            {isEditing ? <Save size={18} /> : <Edit2 size={16} />}
                        </button>
                    </div>

                    <p className="flex justify-center md:justify-start items-center gap-2 font-medium text-white/40 text-xs tracking-wide">
                        <Mail size={13} />
                        {displayEmail}
                    </p>
                </div>

                <div className="bg-white/5 p-5 border border-white/5 rounded-2xl min-w-[200px] w-full md:w-auto">
                    <div className="flex justify-between items-end mb-2">
                        <span className="font-bold text-[10px] text-accent uppercase tracking-widest">
                            {TEXTS.profile.level} {currentLevel}
                        </span>

                        <span className="font-medium text-[10px] text-white/30">
                            {currentXP} / {xpToNextLevel} XP
                        </span>
                    </div>

                    <div className="bg-white/5 rounded-full w-full h-1.5 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            className="bg-accent h-full transition-all"
                        />
                    </div>
                </div>
            </div>
            
            {isDeletingAccount ? (
                <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-3xl w-full max-w-md ml-auto space-y-4">
                    <div className="space-y-1">
                        <p className="font-bold text-red-400 text-xs uppercase tracking-wider">
                            Confirm Account Deletion
                        </p>
                        <p className="text-white/40 text-[11px] leading-relaxed">
                            {TEXTS.profile.deletePrompt}
                        </p>
                    </div>
                    
                    <input
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Enter password to confirm"
                        className="w-full bg-black/40 px-3.5 py-2.5 border border-white/10 focus:border-red-500/30 rounded-xl outline-none text-white text-xs transition-colors"
                        autoFocus
                    />
                    
                    <div className="flex justify-end gap-3 text-xs">
                        <button
                            type="button"
                            onClick={() => {
                                setIsDeletingAccount(false);
                                setDeletePassword('');
                            }}
                            className="px-4 py-2.5 text-white/40 hover:text-white font-medium transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={confirmDeleteAccount}
                            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-medium rounded-xl transition-all shadow-md shadow-red-600/10 cursor-pointer"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex justify-end items-center gap-4 mt-6">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                    >
                        <LogOut size={14} />
                        {TEXTS.profile.logout}
                    </button>
                    <button
                        onClick={() => setIsDeletingAccount(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all border border-red-500/10 cursor-pointer"
                    >
                        <Trash2 size={14} />
                        {TEXTS.profile.deleteAccount}
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default ProfileView;
