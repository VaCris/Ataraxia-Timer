import { combineReducers } from '@reduxjs/toolkit'

import settingsReducer from '@/features/settings/store/settingsSlice'
import authReducer from '@/features/auth/store/authSlice'
import tasksReducer from '@/features/tasks/store/tasksSlice'
import tagsReducer from '@/features/tags/store/tagsSlice'

import timersReducer from '@/features/pomodoro/store/timersSlice'
import timerReducer from '@/features/pomodoro/store/timerSlice'
import pomodoroReducer from '@/features/pomodoro/store/pomodoroSlice'

const rootReducer = combineReducers({
    settings: settingsReducer,
    auth: authReducer,
    tasks: tasksReducer,
    tags: tagsReducer,
    timers: timersReducer,
    timer: timerReducer,
    pomodoro: pomodoroReducer,
})

export default rootReducer