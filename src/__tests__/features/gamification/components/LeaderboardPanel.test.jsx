import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import LeaderboardPanel from '@/features/gamification/components/LeaderboardPanel';
import { gamificationService } from '@/features/gamification/api/gamification.api';

// Mock gamification service
vi.mock('@/features/gamification/api/gamification.api', () => ({
  gamificationService: {
    getLeaderboard: vi.fn(),
  },
}));

describe('LeaderboardPanel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', () => {
        gamificationService.getLeaderboard.mockReturnValue(new Promise(() => {}));
        
        const { container } = render(<LeaderboardPanel />);
        expect(container.querySelector('.animate-spin')).toBeInTheDocument();
        expect(screen.getByText('Leaderboard')).toBeInTheDocument();
    });

    it('renders empty state if leaderboard is empty', async () => {
        gamificationService.getLeaderboard.mockResolvedValue([]);
        
        render(<LeaderboardPanel />);
        
        await waitFor(() => {
            expect(screen.getByText('No rankings available')).toBeInTheDocument();
        });
    });

    it('renders leaderboard items correctly', async () => {
        const mockData = [
            { id: 1, name: 'Alice', level: 10, experience: 5000 },
            { id: 2, username: 'Bob', level: 5, experience: 2000 },
            { id: 3, level: 1, experience: 100 } // Anonymous
        ];
        
        gamificationService.getLeaderboard.mockResolvedValue(mockData);
        
        render(<LeaderboardPanel />);
        
        await waitFor(() => {
            expect(screen.getByText('Alice')).toBeInTheDocument();
            expect(screen.getByText('Lvl 10')).toBeInTheDocument();
            expect(screen.getByText('5000')).toBeInTheDocument();

            expect(screen.getByText('Bob')).toBeInTheDocument();
            expect(screen.getByText('Lvl 5')).toBeInTheDocument();
            expect(screen.getByText('2000')).toBeInTheDocument();

            expect(screen.getByText('Anonymous')).toBeInTheDocument();
            expect(screen.getByText('Lvl 1')).toBeInTheDocument();
            expect(screen.getByText('100')).toBeInTheDocument();
        });
    });
});
