import EventEmitter from "events"

export interface TankEventEmitter extends EventEmitter {
    on(eventName: "change", listener: (current: number) => void): this
}

export default class Tank extends    EventEmitter
                          implements TankEventEmitter {
    private _current: number = 0

    constructor(current: number = 0) {
        super()
        this.current = current
    }

    get current(): number {
        return this._current
    }

    set current(value: number) {
        if (value === this._current)
            return

        this._current = isNaN(value) || value < 0 ? 0 : value

        this.emit("change", value)
    }
}