import pino from "pino";
import path from "path";

const logDir = path.join(process.cwd(), "logs", "app");

// Konfigurasi transport untuk Bun
const transport = pino.transport({
    targets: [
        {
            target: "pino-roll",
            options: {
                file: path.join(logDir, "access.log"),
                size: "10m",
                interval: "1d",
                compress: true,
                count: 7,
                mkdir: true,
            },
            level: "info",
        },
        {
            target: "pino-roll",
            options: {
                file: path.join(logDir, "error.log"),
                size: "5m",
                interval: "1d",
                compress: true,
                count: 10,
                mkdir: true,
            },
            level: "error",
        },
        {
            target: "pino-roll",
            options: {
                file: path.join(logDir, "permission.log"),
                size: "5m",
                interval: "1d",
                compress: true,
                count: 10,
                mkdir: true,
            },
            level: "warn",
        },
        {
            target: "pino-pretty",
            options: {
                colorize: true,
            },
            level: "info",
        },
    ],
});

// Inisialisasi Logger
const baseLogger = pino(
    {
        level: "info",
        timestamp: pino.stdTimeFunctions.isoTime,
        base: {
            service: "api-service",
            runtime: "bun", // Opsional: Penanda kalau ini jalan di Bun
        },
    },
    transport,
);

export const logger = {
    info: (data: any, message?: string) => {
        baseLogger.info(data, message);
    },
    error: (data: any, message?: string) => {
        // Di Pino, argumen pertama sebaiknya error object atau data
        baseLogger.error(data, message);
    },
    permission: (data: any, message?: string) => {
        baseLogger.warn(data, message);
    },
};
