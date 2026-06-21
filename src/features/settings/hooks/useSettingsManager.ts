import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { updateSettingsRequest } from '../store/settingsSlice';
import { SettingResponse, UpdateSettingDto } from '@/features/settings/types/setting.dto';

interface UseSettingsManagerReturn {
    apiSettings: SettingResponse | null;
    isLoading: boolean;
    error: string | null;
    updateSettings: (settings: UpdateSettingDto) => void;
}

export const useSettingsManager = (): UseSettingsManagerReturn => {
    const dispatch = useDispatch();

    const apiSettings = useSelector((state: RootState) => state.settings.api);
    const isLoading = useSelector((state: RootState) => state.settings.status === 'loading');
    const error = useSelector((state: RootState) => state.settings.error);

    const updateSettings = useCallback((newSettings: UpdateSettingDto) => {
        dispatch(updateSettingsRequest(newSettings));
    }, [dispatch]);

    return {
        apiSettings,
        isLoading,
        error,
        updateSettings
    };
};