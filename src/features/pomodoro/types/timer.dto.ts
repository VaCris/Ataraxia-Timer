import { TimerRequestDto, TimerResponseDto } from '@/infrastructure/api/generated';

export type CreateTimerDto = TimerRequestDto;

export type UpdateTimerDto = Partial<CreateTimerDto>;

export type TimerResponse = TimerResponseDto;