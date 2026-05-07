import { combineReducers } from "@reduxjs/toolkit";
import pomodoro from "./pomodoroSlice";
import timer from "./timerSlice";
import timers from "./timersSlice";

export const pomodoroReducer = combineReducers({
    pomodoro,
    timer,
    timers,
});