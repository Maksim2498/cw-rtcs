import Tank                from "./Tank"

import { AsyncMqttClient } from "async-mqtt"
import { Logger          } from "winston"

export interface CreationOptions {
    readonly name:    string
    readonly value:   number
    readonly tank:    Tank
    readonly client:  AsyncMqttClient
    readonly logger?: Logger
}

export default class Sensor {
    private publishedState: boolean | null = null
    private onChange:       (current: number) => void

    readonly name:    string
    readonly topic:   string
    readonly value:   number
    readonly tank:    Tank
    readonly client:  AsyncMqttClient
    readonly logger?: Logger

    constructor(options: CreationOptions) {
        if (isNaN(options.value))
            throw new Error(`value is NaN`)

        if (options.value < 0)
            throw new Error(`value must not be negative (${options.value})`)

        this.name     = options.name
        this.topic    = `sen/${options.name}`
        this.value    = options.value
        this.tank     = options.tank
        this.client   = options.client
        this.logger   = options.logger
        this.onChange = () => this.publishState()

        this.tank.on("change", this.onChange)
    }

    get state(): boolean {
        return this.tank.current >= this.value
    }

    async publishState() {
        const state = this.state

        if (state === this.publishedState)
            return

        const json    = { state }
        const message = JSON.stringify(json)

        this.logger?.debug(`Publishing state (${state}) of sensor "${this.name}"...`)
        await this.client.publish(this.topic, message)
        this.logger?.debug("Published")

        this.publishedState = state
    }

    removeListener() {
        this.tank.removeListener("change", this.onChange)
    }
}