function getTimestamp() {
    return new Date().toISOString();
}

export function logInfo(event, details = {}) {
    console.info(
        JSON.stringify({
            level: "info",
            event,
            timestamp: getTimestamp(),
            ...details,
        })
    );
}

export function logError(event, error, details = {}) {
    console.error(
        JSON.stringify({
            level: "error",
            event,
            timestamp: getTimestamp(),
            message: error instanceof Error ? error.message : "Unknown error",
            ...details,
        })
    );
}