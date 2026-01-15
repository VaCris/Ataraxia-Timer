export interface CreateTimerDto {
    duration: number;
    tag?: string;
    startTime?: string;
    endTime?: string;
    status?: string;
}

export interface UpdateTimerDto extends Partial<CreateTimerDto> { }

export interface TimerResponse extends CreateTimerDto {
    id: string;
    userId: string;
}