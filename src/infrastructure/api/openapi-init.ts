import { OpenAPI } from '@/infrastructure/api/generated/core/OpenAPI';

const API_URL = import.meta.env.VITE_API_URL;

OpenAPI.BASE = API_URL
    ? API_URL.replace('/api/v1', '')
    : 'https://ataraxia-api.studios-tkoh.online';

OpenAPI.TOKEN = async () => localStorage.getItem('token') || '';
OpenAPI.WITH_CREDENTIALS = true;
OpenAPI.CREDENTIALS = 'include';
