import winston                         from "winston"
import mqtt                            from "async-mqtt"
import Tank                            from "./Tank"
import Sensor                          from "./Sensor"
import Pump                            from "./Pump"

import { getAddress, addressToString } from "util/address"
import { getSetup                    } from "./setup"

const logger = createLogger()

main().catch(processError)

async function main() {
    const {
        min,
        max,
        current,
        fillRate,
        drainRate,
        tick
    } = getSetup()

    const tank      = new Tank(current)
    const pump      = new Pump({ tank, rate: drainRate, logger })
    const address   = getAddress()
    const client    = await connect()
    const minSensor = new Sensor({ name: "min", value: min, tank, client, logger })
    const maxSensor = new Sensor({ name: "max", value: max, tank, client, logger })

    await minSensor.publishState()
    await maxSensor.publishState()

    await pump.subscribe(client)

    setupUpdate()
    setupSigInt()

    async function connect(): Promise<mqtt.AsyncClient> {
        const addressString = addressToString(address)
        logger.debug(`Connecting to ${addressString}...`)
        const client = await mqtt.connectAsync(addressString)
        logger.debug("Connected")
        return client
    }

    function setupUpdate() {
        setInterval(update, tick)
    }

    function update() {
        const rate = fillRate - pump.realRate
        tank.current += rate
        logger.info(`Current level: ${tank.current}`)
    }

    function setupSigInt() {
        let stopping = false

        process.on("SIGINT", async () => {
            if (stopping)
                return

            stopping = true
            console.log()

            try {
                await disconnect()
            } catch (error) {
                console.error(error)
            }

            process.exit()
        })
    }

    async function disconnect() {
        logger.debug("Disconnecting...")
        await client.end()
        logger.debug("Disconnected")
    }
}

function createLogger() {
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

function processError(error: any) {
    logger.error(error)
    logger.info("Aborting...")
    process.exit(1)
}