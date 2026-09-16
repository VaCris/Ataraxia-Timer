import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/setupTests.ts',
        include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
        alias: {
            'virtual:pwa-register/react': path.resolve(__dirname, './src/__tests__/mocks/pwa-register-react.js'),
            '@': path.resolve(__dirname, './src'),
            '@app': path.resolve(__dirname, './src/app'),
            '@components': path.resolve(__dirname, './src/app/components'),
            '@pages': path.resolve(__dirname, './src/app/pages'),
            '@features': path.resolve(__dirname, './src/features'),
            '@shared': path.resolve(__dirname, './src/shared'),
            '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
            '@api': path.resolve(__dirname, './src/infrastructure/api'),
            '@sync': path.resolve(__dirname, './src/infrastructure/sync'),
            '@store': path.resolve(__dirname, './src/store'),
            '@assets': path.resolve(__dirname, './src/assets'),
            '@utils': path.resolve(__dirname, './src/shared/utils'),
        },
    },
});
