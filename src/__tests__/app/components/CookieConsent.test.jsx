import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import CookieConsent from '@/app/components/CookieConsent';
import { vi } from 'vitest';

describe('CookieConsent', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        localStorage.clear();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('does not show immediately', () => {
        act(() => {
            render(<CookieConsent />);
        });
        expect(screen.queryByText(/Privacy notice/i)).not.toBeInTheDocument();
    });

    it('shows after delay if no consent is saved', () => {
        render(<CookieConsent />);
        
        act(() => {
            vi.advanceTimersByTime(1200);
        });

        expect(screen.getByText(/Privacy notice/i)).toBeInTheDocument();
    });

    it('does not show if consent is already saved', () => {
        localStorage.setItem('ataraxia_cookie_consent', 'accepted');
        render(<CookieConsent />);
        
        act(() => {
            vi.advanceTimersByTime(1200);
        });

        expect(screen.queryByText(/Privacy notice/i)).not.toBeInTheDocument();
    });

    it('saves consent and hides when "Got it" is clicked', () => {
        render(<CookieConsent />);
        
        act(() => {
            vi.advanceTimersByTime(1200);
        });

        const button = screen.getByText(/Got it/i);
        
        act(() => {
            fireEvent.click(button);
            vi.advanceTimersByTime(300);
        });

        expect(localStorage.getItem('ataraxia_cookie_consent')).toBe('accepted');
        expect(screen.queryByText(/Privacy notice/i)).not.toBeInTheDocument();
    });
});
