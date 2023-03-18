import Tank                from "./Tank"

import { AsyncMqttClient } from "async-mqtt"
import { Logger          } from "winston"
import { publishState    } from "util/client"

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

        this.logger?.debug(`Публикация состояния (${state}) датчика "${this.name}"...`)
        await publishState(this.client, this.topic, this.state)
        this.logger?.debug("Успешно")

        this.publishedState = state
    }

    removeListener() {
        this.tank.removeListener("change", this.onChange)
    }
}