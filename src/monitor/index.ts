import { getAddress                                  } from "util/address";
import { connect, setupSigInt, subscribe, parseState } from "util/client";
import { processError                                } from "util/error";
import { createLogger                                } from "util/logger";

const PUMP_TOPIC = "act/pump"
const MIN_TOPIC  = "sen/min"
const MAX_TOPIC  = "sen/max"

const logger = createLogger()

main().catch(error => processError(error, logger))

async function main() {
    const address = getAddress()
    const client  = await connect(address, logger)

    subscribe(client, PUMP_TOPIC, logger)
    subscribe(client, MIN_TOPIC,  logger)
    subscribe(client, MAX_TOPIC,  logger)

    client.on("message", (stream, message) => {
        switch (stream) {
            case PUMP_TOPIC: {
                const state = parseState(message)
                logger.info(state ? "Насос включён" : "Насос выключен")
                break
            }

            case MIN_TOPIC: {
                const state = parseState(message)
                logger.info(state ? "Датчик нижнего уровня воды активен" : "Датчик нижнего уровня воды не активен")
                break
            }

            case MAX_TOPIC: {
                const state = parseState(message)
                logger.info(state ? "Датчик верхнего уровня воды активен" : "Датчик вернхнего уровня воды не активен")
            }
        }
    })

    setupSigInt(client, logger)
}