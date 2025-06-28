function cLog(text) {
    if (!text.length) return;
    console.log(getCurrentLocalTime() + ": " + text);
}

function logRequest(req, res, next) {
    consoleLog(`${req.method}: ${req.url}`);
    next();
}

function getCurrentLocalTime(locale = 'fi-FI') {
    return new Date().toLocaleString(locale);
}

export default {
    cLog,
    logRequest,
    getCurrentLocalTime
}