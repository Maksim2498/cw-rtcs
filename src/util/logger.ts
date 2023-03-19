import winston    from "winston"

import { Logger } from "winston"

const Console = winston.transports.Console
const fmt     = winston.format

export function createLogger(): Logger {
    const production = process.env.NODE_ENV === "production"
    const level      = production ? "info" : "debug"
    const handlers   = [new Console()]
    const format     = fmt.combine(
        fmt.errors(),
        fmt.colorize({ all: true }),
        fmt.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        fmt.align(),
        fmt.printf(entry => `[${entry.timestamp}] ${entry.level}: ${entry.message}`)
    )

    return winston.createLogger({
        level,
        format,
        transports:        handlers,
        exceptionHandlers: handlers,
        rejectionHandlers: handlers,
    })
}