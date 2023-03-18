import Tank                    from "./Tank"
import Sensor                  from "./Sensor"
import Pump                    from "./Pump"

import { getAddress          } from "util/address"
import { connect, disconnect } from "util/client"
import { createLogger        } from "util/logger"
import { getSetup            } from "./setup"

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
    const client    = await connect(address, logger)
    const minSensor = new Sensor({ name: "min", value: min, tank, client, logger })
    const maxSensor = new Sensor({ name: "max", value: max, tank, client, logger })

    await minSensor.publishState()
    await maxSensor.publishState()

    await pump.subscribe(client)

    setupUpdate()
    setupSigInt()

    function setupUpdate() {
        setInterval(update, tick)
    }

    function update() {
        const rate = fillRate - pump.realRate
        tank.current += rate
        logger.info(`Текущий уровень: ${tank.current}`)
    }

    function setupSigInt() {
        let stopping = false

        process.on("SIGINT", async () => {
            if (stopping)
                return

            stopping = true
            console.log()

            try {
                await disconnect(client, logger)
            } catch (error) {
                console.error(error)
            }

            process.exit()
        })
    }
}

function processError(error: any) {
    logger.error(error)
    logger.info("Отмена...")
    process.exit(1)
}