import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React, { forwardRef } from 'react';

vi.mock('framer-motion', async () => {
    const actual = await vi.importActual<any>('framer-motion');

    return {
        ...actual,
        AnimatePresence: ({ children }: { children: React.ReactNode }) =>
            React.createElement(React.Fragment, null, children),
        motion: {
            ...actual.motion,
            div: forwardRef<any, any>((props, ref) => {
                const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props;
                return React.createElement('div', { ref, ...rest });
            }),
            button: forwardRef<any, any>((props, ref) => {
                const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props;
                return React.createElement('button', { ref, ...rest });
            }),
            circle: forwardRef<any, any>((props, ref) => {
                const { initial, animate, exit, transition, ...rest } = props;
                return React.createElement('circle', { ref, ...rest });
            }),
        },
    };
});
