import { AsyncMqttClient       } from "async-mqtt";
import { Logger                } from "winston";
import { subscribe, parseState, publishState } from "util/client";

export interface CreationOptions {
    readonly client:  AsyncMqttClient
    readonly logger?: Logger
}

export default class Module {
    static readonly MIN_TOPIC  = "sen/min"
    static readonly MAX_TOPIC  = "sen/max"
    static readonly PUMP_TOPIC = "act/pump"

    private _minState:  boolean = false
    private _maxState:  boolean = false
    private _pumpState: boolean = false
    private _draining:  boolean = false

    readonly client:  AsyncMqttClient
    readonly logger?: Logger

    constructor(options: CreationOptions) {
        this.client = options.client
        this.logger = options.logger
    }

    get minState(): boolean {
        return this._minState
    }

    get maxState(): boolean {
        return this._maxState
    }

    get pumpState(): boolean {
        return this._pumpState
    }

    get draining(): boolean {
        return this._draining
    }

    async subscribe() {
        await Promise.all([
            subscribe(this.client, Module.MIN_TOPIC, this.logger),
            subscribe(this.client, Module.MAX_TOPIC, this.logger)
        ])

        this.client.on("message", (stream, message) => {
            switch (stream) {
                case Module.MIN_TOPIC:
                    this._minState = parseState(message)
                    this.updatePumpState()
                    break

                case Module.MAX_TOPIC:
                    this._maxState = parseState(message)
                    this.updatePumpState()
            }
        })
    }

    private updatePumpState() {
        if (this.draining) {
            if (!this.minState) {
                this._draining = false
                this.logger?.info("Выключение насоса...")
                publishState(this.client, Module.PUMP_TOPIC, false)
                    .then(() => this.logger?.info("Насос выключен"))
            }

            return
        }

        if (this.maxState) {
            this._draining = true
            this.logger?.info("Включение насоса...")
            publishState(this.client, Module.PUMP_TOPIC, true)
                .then(() => this.logger?.info("Насос включен"))
        }
    }
}