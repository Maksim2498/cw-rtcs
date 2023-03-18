import { getAddress, parseState } from "util/address";
import { connect, setupSigInt   } from "util/client";
import { processError           } from "util/error";
import { createLogger           } from "util/logger";

const PUMP_TOPIC = "act/pump"
const MIN_TOPIC  = "sen/min"
const MAX_TOPIC  = "sen/max"

const logger = createLogger()

main().catch(error => processError(error, logger))

async function main() {
    const address = getAddress()
    const client  = await connect(address, logger)

    client.subscribe(PUMP_TOPIC)
    client.subscribe(MIN_TOPIC)
    client.subscribe(MAX_TOPIC)

    client.on("message", (stream, message) => {
        switch (stream) {
            case PUMP_TOPIC:
                logger.info(`Состояние насоса: ${parseState(message)}`)
                break

            case MIN_TOPIC:
                logger.info(`Состояние сенсора минимального уровня: ${parseState(message)}`)
                break

            case MAX_TOPIC:
                logger.info(`Состояние сенсора максимального уровня: ${parseState(message)}`)
        }
    })

    setupSigInt(client, logger)
}