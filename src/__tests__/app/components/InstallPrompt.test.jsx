import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import InstallPrompt from '@/app/components/InstallPrompt';
import { vi } from 'vitest';
import * as reactRedux from 'react-redux';
import * as useInstallPromptModule from '@/shared/hooks/useInstallPrompt';

vi.mock('react-redux', () => ({
    useSelector: vi.fn(),
}));

vi.mock('@/shared/hooks/useInstallPrompt', () => ({
    useInstallPrompt: vi.fn(),
}));

describe('InstallPrompt', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        localStorage.clear();
        reactRedux.useSelector.mockReturnValue('#e11d48');
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it('does not render if not installable', () => {
        useInstallPromptModule.useInstallPrompt.mockReturnValue({
            isInstallable: false,
            handleInstallClick: vi.fn(),
        });

        act(() => {
            render(<InstallPrompt />);
        });
        
        expect(screen.queryByText(/Install Ataraxia/i)).not.toBeInTheDocument();
    });

    it('renders after delay if installable and not dismissed', () => {
        useInstallPromptModule.useInstallPrompt.mockReturnValue({
            isInstallable: true,
            handleInstallClick: vi.fn(),
        });

        render(<InstallPrompt />);
        
        act(() => {
            vi.advanceTimersByTime(2500);
        });

        expect(screen.getByText(/Install Ataraxia/i)).toBeInTheDocument();
    });

    it('does not render if previously dismissed', () => {
        localStorage.setItem('ataraxia_install_prompt_dismissed', 'true');
        useInstallPromptModule.useInstallPrompt.mockReturnValue({
            isInstallable: true,
            handleInstallClick: vi.fn(),
        });

        render(<InstallPrompt />);
        
        act(() => {
            vi.advanceTimersByTime(2500);
        });

        expect(screen.queryByText(/Install Ataraxia/i)).not.toBeInTheDocument();
    });

    it('calls handleInstallClick on install', async () => {
        const handleInstallClickMock = vi.fn();
        useInstallPromptModule.useInstallPrompt.mockReturnValue({
            isInstallable: true,
            handleInstallClick: handleInstallClickMock,
        });

        render(<InstallPrompt />);
        
        act(() => {
            vi.advanceTimersByTime(2500);
        });

        const installButton = screen.getByText('Install');
        
        await act(async () => {
            fireEvent.click(installButton);
            vi.advanceTimersByTime(300);
        });

        expect(handleInstallClickMock).toHaveBeenCalled();
        expect(localStorage.getItem('ataraxia_install_prompt_dismissed')).toBe('true');
    });
});
