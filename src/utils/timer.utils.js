export const getSecondsFromSettings = (settings, mode) => {
    const value = Number(settings?.[mode]);
    return Number.isFinite(value) ? value * 60 : 0;
};