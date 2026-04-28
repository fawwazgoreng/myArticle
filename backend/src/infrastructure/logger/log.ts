import pino from "pino";
import path from "path";

const logDir = path.join(process.cwd(), "logs", "app");

const transport = pino.transport({
    targets: [
        {
            target: "pino-roll",
            options: {
                file: path.join(logDir, "combined.log"),
                size: "20m",
                interval: "1d",
                compress: true,
                count: 5,
                mkdir: true,
            },
            level: "info",
        },
        {
            target: "pino-roll",
            options: {
                file: path.join(logDir, "error.log"),
                size: "10m",
                interval: "1d",
                count: 10,
                mkdir: true,
            },
            level: "error",
        },
        ...(process.env.NODE_ENV !== "production" 
            ? [{
                target: "pino-pretty",
                options: { colorize: true },
                level: "debug",
              }] 
            : [])
    ],
});

const baseLogger = pino(
    {
        level: process.env.LOG_LEVEL || "info",
        timestamp: pino.stdTimeFunctions.isoTime,
        base: {
            service: "api-service",
            env: process.env.NODE_ENV
        },
    },
    transport,
);

const loggers = {
    info: baseLogger.child({ category: "APPLICATION" }),
    error: baseLogger.child({ category: "APPLICATION" }),
    permission: baseLogger.child({ category: "SECURITY_AUDIT" }),
    architecture: baseLogger.child({ category: "INFRASTRUCTURE" }),
};

export const logger = {
    info: (message: string, data?: any) => loggers.info.info(data, message),
    
    error: (message: string, error?: Error | any) => {
        const logData = error instanceof Error ? { err: error, ...error } : error;
        loggers.error.error(logData, message);
    },

    permission: (message: string, data: { userId: string; action: string; [key: string]: any }) => {
        loggers.permission.warn(data, message);
    },

    architecture: (message: string, data: { component: "REDIS" | "POSTGRES" | "ELASTICSEARCH" | "INFRASTRUCTURE_FAIL"; latency?: number; [key: string]: any }) => {
        loggers.architecture.error(data, message);
    }
};