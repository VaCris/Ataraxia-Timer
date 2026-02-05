export interface CreateTimerDto {
    tag?: string;
    duration: number;
    startTime?: string;
    endTime?: string;
    status?: 'completed' | 'interrupted';
    taskId?: string;
}
export interface UpdateTimerDto extends Partial<CreateTimerDto> { }

export interface TimerResponse extends CreateTimerDto {
    id: string;
    userId: string;
}