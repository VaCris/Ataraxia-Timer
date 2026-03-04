export interface CreateTimerDto {
    type: 'work' | 'short_break' | 'long_break';
    durationMinutes: number;
    taskId?: string;
}

export const CreateTimerDto = (
    type: 'work' | 'short_break' | 'long_break', 
    durationMinutes: number, 
    taskId?: string
): CreateTimerDto => ({
    type,
    durationMinutes,
    taskId
});