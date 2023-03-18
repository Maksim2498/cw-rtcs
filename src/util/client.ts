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

export async function disconnect(client: AsyncMqttClient, logger?: Logger) {
    logger?.debug("Отключение...")
    await client.end()
    logger?.debug("Успешно")
}