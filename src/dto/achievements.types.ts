export interface Achievement {
    id: number;
    code: string;
    name: string;
    description: string;
    driveFileId: string;
    type: 'streak' | 'pomodoro_count';
    threshold: number;
    unlockedAt?: string;
}