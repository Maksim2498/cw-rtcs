import { createLogger } from "util/logger";

const logger = createLogger()

main().catch(processError)

async function main() {
    
}

function processError(error: any) {
    logger.error(error)
    logger.info("Отмена...")
    process.exit(1)
}