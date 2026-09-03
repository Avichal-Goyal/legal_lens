import { randomUUID } from "crypto";
import { logError, logInfo } from "@/lib/logger";

export function startRagTrace(operation, context = {}) {
    const traceId = randomUUID();
    const startedAt = Date.now();

    logInfo("rag_started", {
        traceId,
        operation,
        ...context,
    });

    return {
        traceId,

        stage(name, details = {}) {
            logInfo("rag_stage_completed", {
                traceId,
                operation,
                stage: name,
                elapseMs: Date.now() - startedAt,
                ...details,
            });
        },

        success(details = {}) {
            logInfo("rag_completed", {
                traceId,
                operation,
                totalDurationMs: Date.now() - startedAt,
                ...details,
            });
        },

        failure(error, details = {}) {
            logError("rag_failed", error, {
                traceId,
                operation,
                totalDurationMs: Date.now() - startedAt,
                ...details,
            });
        },
    }
}