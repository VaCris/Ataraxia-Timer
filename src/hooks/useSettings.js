import { useState, useEffect } from 'react';
import { settingsService } from '@api/settings/settings.service';
import { CreateUpdateSettingDto } from '@api/settings/dto/settings.dto';
import toast from 'react-hot-toast';

export const useSettings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await settingsService.getSettings();
                setSettings(data);
            } catch (error) {;
                toast.error("Error obtaining configuration");
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const updateSettings = async (newConfig) => {
        try {
            const dto = CreateUpdateSettingDto(newConfig);
            const updated = await settingsService.updateSettings(dto);
            setSettings(updated);
            toast.success("Configuración guardada");
        } catch (error) {
            toast.error("Error al guardar cambios");
        }
    };

    return { settings, loading, updateSettings };
};