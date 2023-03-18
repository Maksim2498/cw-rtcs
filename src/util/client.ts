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

export async function publishState(client: AsyncMqttClient, topic: string, state: boolean) {
    const json    = { state }
    const message = JSON.stringify(json)

    await client.publish(topic, message)
}

export async function subscribe(client: AsyncMqttClient, topic: string, logger?: Logger) {
    logger?.debug(`Подписка на канал ${topic}...`)
    await client.subscribe(topic)
    logger?.debug("Успешно")

}

export function parseState(message: Buffer): boolean {
    const text  = message.toString()
    const json  = JSON.parse(text)
    const state =  !!json.state

    return state
}