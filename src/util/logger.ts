import winston, { Logger } from "winston"

export function createLogger(): Logger {
    const Console = winston.transports.Console
    const fmt     = winston.format

    return winston.createLogger({
        level:             process.env.NODE_ENV === "production" ? "info" : "debug",
        transports:        [new Console()],
        exceptionHandlers: [new Console()],
        rejectionHandlers: [new Console()],
        format:            fmt.combine(
            fmt.errors(),
            fmt.colorize({ all: true }),
            fmt.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            fmt.align(),
            fmt.printf(entry => `[${entry.timestamp}] ${entry.level}: ${entry.message}`)
        )
    })
}