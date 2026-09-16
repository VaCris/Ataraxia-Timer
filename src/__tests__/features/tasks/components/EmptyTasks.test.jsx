import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import EmptyTasks from '@/features/tasks/components/EmptyTasks';

describe('EmptyTasks', () => {
    it('renders a guided empty state with a clear action', () => {
        const onCreate = vi.fn();
        render(<EmptyTasks onCreate={onCreate} />);

        expect(screen.getByText('No missions yet')).toBeInTheDocument();
        expect(screen.getByText(/Create your first mission/i)).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /Create mission/i }));
        expect(onCreate).toHaveBeenCalledTimes(1);
    });
});
