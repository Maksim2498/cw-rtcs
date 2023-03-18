import Tank                      from "./Tank";

import { AsyncMqttClient       } from "async-mqtt";
import { Logger                } from "winston";
import { subscribe, parseState } from "util/client";

export interface CreationOptions {
    readonly tank:    Tank
    readonly rate:    number
    readonly logger?: Logger
}

export default class Pump {
    static readonly TOPIC = "act/pump"

    private _state: boolean = false

    readonly tank:    Tank
    readonly rate:    number
    readonly logger?: Logger

    constructor(options: CreationOptions) {
        if (isNaN(options.rate))
            throw new Error(`rate is NaN`)

        if (options.rate < 0)
            throw new Error(`rate must not be negative (${options.rate})`)

        this.tank   = options.tank
        this.rate   = options.rate
        this.logger = options.logger
    }

    get state(): boolean {
        return this._state
    }

    get realRate(): number {
        return this.state ? this.rate : 0
    }

    drain() {
        if (this.state)
            this.tank.current -= this.rate
    }

    async subscribe(client: AsyncMqttClient) {
        subscribe(client, Pump.TOPIC, this.logger)

        client.on("message", (topic, message) => {
            if (topic !== Pump.TOPIC)
                return

            this._state = parseState(message)
            this.logger?.info(this.state ? "Насос включён" : "Насос отключён")
        })
    }
}