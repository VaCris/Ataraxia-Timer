import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'idle',
        error: null,
    },
    reducers: {
        forgotPasswordRequest: (state, action) => {
            const { email, resolve } = action.payload;
            //console.log(`Requesting recovery for: ${email}`);
            setTimeout(() => {
                resolve({ success: true });
            }, 2000);
        }
    }
});

export const { forgotPasswordRequest } = authSlice.actions;
export default authSlice.reducer;