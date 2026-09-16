import { OpenAPI } from '@/infrastructure/api/generated/core/OpenAPI';
import { getAccessToken } from '@/infrastructure/auth/remoteSession';

const API_URL = import.meta.env.VITE_API_URL;

OpenAPI.BASE = API_URL
    ? API_URL.replace('/api/v1', '')
    : 'https://ataraxia-api.studios-tkoh.online';

OpenAPI.TOKEN = async () => getAccessToken() || '';
OpenAPI.WITH_CREDENTIALS = true;
OpenAPI.CREDENTIALS = 'include';
