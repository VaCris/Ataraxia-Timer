import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { TimerDial } from '@/features/pomodoro/components/TimerDial';

const mockStore = configureStore([]);
type TimerDialController = React.ComponentProps<typeof TimerDial>['controller'];

describe('TimerDial', () => {
    let store: MockStoreEnhanced<unknown, {}>;
    const defaultController: TimerDialController = {
        mode: 'FOCUS',
        isActive: false,
        timeLeft: 1500,
        initialTime: 1500,
        currentRound: 1,
        handleTimerComplete: vi.fn(),
        handleModeChange: vi.fn(),
        toggleSession: vi.fn(),
        resetSession: vi.fn(),
    };

    beforeEach(() => {
        store = mockStore({
            timer: {
                timeLeft: 1500,
                initialTime: 1500,
                isActive: false,
                mode: 'FOCUS',
            },
            settings: {
                api: {
                    longBreakInterval: 4,
                }
            }
        });
    });

    const renderComponent = (controller: TimerDialController = defaultController) => render(
        <Provider store={store}>
            <TimerDial controller={controller} />
        </Provider>
    );

    it('renders the correct time formatted as MM:SS', () => {
        renderComponent();
        expect(document.querySelector('.timer-digits')).toHaveTextContent('25:00');
    });

    it('renders the current mode correctly formatted', () => {
        renderComponent();
        expect(screen.getByText('FOCUS')).toBeInTheDocument();
    });

    it('renders the current round information', () => {
        renderComponent();
        expect(document.querySelector('.timer-dial')).toHaveTextContent('ROUND 1/4');
    });

    it('updates time format correctly for single digit minutes and seconds', () => {
        store = mockStore({
            timer: {
                timeLeft: 65,
                initialTime: 1500,
                isActive: true,
                mode: 'SHORT_BREAK',
            },
            settings: {
                api: {
                    longBreakInterval: 4,
                }
            }
        });

        renderComponent({
            ...defaultController,
            mode: 'SHORT_BREAK',
            timeLeft: 65,
        });

        expect(document.querySelector('.timer-digits')).toHaveTextContent('01:05');
        expect(screen.getByText('SHORT BREAK')).toBeInTheDocument();
    });
});
