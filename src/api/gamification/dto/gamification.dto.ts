export enum AchievementType {
    STREAK = 'streak',
    POMODORO_COUNT = 'pomodoro_count',
}

export interface CreateAchievementDto {
    code: string;
    name: string;
    description: string;
    type?: AchievementType;
    threshold: number;
    points?: number;
}

export enum LeaderboardSortBy {
    EXPERIENCE = 'experience',
    POMODOROS = 'pomodorosCompleted',
}

export interface GetLeaderboardDto {
    page?: 1;
    limit?: 10;
    sortBy?: LeaderboardSortBy.EXPERIENCE;
}

export interface UpdateAchievementDto extends Partial<CreateAchievementDto> {}