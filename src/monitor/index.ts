import { getAddress           } from "util/address";
import { connect, setupSigInt } from "util/client";
import { processError         } from "util/error";
import { createLogger         } from "util/logger";

const logger = createLogger()

main().catch(error => processError(error, logger))

async function main() {
    const address = getAddress()
    const client  = await connect(address, logger)

    setupSigInt(client, logger)
}