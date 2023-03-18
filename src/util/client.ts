import { AsyncMqttClient, connectAsync } from "async-mqtt";
import { Logger                        } from "winston";
import { Address, addressToString      } from "./address";

export async function connect(address: Address, logger?: Logger) {
    const addressString = addressToString(address)
    logger?.debug(`Подключение к ${addressString}...`)
    const client = await connectAsync(addressString)
    logger?.debug("Успешно")
    return client
}

export function setupSigInt(client: AsyncMqttClient, logger?: Logger) {
    let stopping = false

    process.on("SIGINT", async () => {
        if (stopping)
            return

        stopping = true
        console.log()

        try {
            await disconnect(client, logger)
        } catch (error) {
            logger?.error(error)
        }

        process.exit()
    })
}

export async function disconnect(client: AsyncMqttClient, logger?: Logger) {
    logger?.debug("Отключение...")
    await client.end()
    logger?.debug("Успешно")
}