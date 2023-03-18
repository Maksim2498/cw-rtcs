import { Logger } from "winston";

export function processError(error: any, logger?: Logger) {
    logger?.error(error)
    logger?.info("Отмена...")
    process.exit(1)
}