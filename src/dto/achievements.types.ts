export enum AchievementType {
    STREAK = 'streak',
    POMODORO_COUNT = 'pomodoro_count',
}

export enum LeaderboardSortBy {
    EXPERIENCE = 'experience',
    POMODOROS = 'pomodorosCompleted',
}

export interface Achievement {
    id: string;
    code: string;
    name: string;
    description: string;
    driveFileId?: string;
    iconPath?: string; 
    type: AchievementType; 
    threshold: number;
    points?: number;
}

export interface UserAchievement {
    id: string;
    userId: string;
    achievement: Achievement;
    unlockedAt: string;
}

export interface CreateAchievementDto {
    code: string;
    name: string;
    description: string;
    type?: AchievementType;
    threshold: number;
    points?: number;
}

export interface UpdateAchievementDto extends Partial<CreateAchievementDto> {}

export interface GetLeaderboardDto {
    page?: number;
    limit?: number;
    sortBy?: LeaderboardSortBy;
}

export interface LeaderboardEntry {
    userId: string;
    username: string;
    experience: number;
    pomodorosCompleted: number;
    rank: number;
}