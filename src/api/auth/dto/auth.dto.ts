export const CreateRegisterDto = (username, email, password, deviceId = null) => ({
    username,
    email,
    password,
    deviceId,
});

export const CreateLoginDto = (email, password) => ({
    email,
    password,
});

export const CreateGuestLoginDto = (deviceId) => ({
    deviceId,
});

export const CreateForgotPasswordDto = (email) => ({
    email,
});

export const CreateResetPasswordDto = (token, newPassword) => ({
    token,
    newPassword
});