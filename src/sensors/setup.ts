export const DEFAULT_MIN        = 1
export const DEFAULT_MAX        = 100
export const DEFAULT_CURRENT    = 0
export const DEFAULT_FILL_RATE  = 10
export const DEFAULT_DRAIN_RATE = 20
export const DEFAULT_TICK       = 1000

export const MIN_LIMIT = 1
export const MAX_LIMIT = 100

interface Setup {
    min:       number
    max:       number
    current:   number
    fillRate:  number
    drainRate: number
    tick:      number
}

export function getSetup(): Setup {
    const min       = getMin()
    const max       = getMax(min)
    const current   = getCurrent()
    const fillRate  = getFillRate()
    const drainRate = getDrainRate()
    const tick      = getTick()

    return {
        min,
        max,
        current,
        fillRate,
        drainRate,
        tick
    }
}

export function getMin(): number {
    const raw = process.env.MIN?.trim()

    if (raw == null)
        return DEFAULT_MIN

    const min = Number(raw)

    if (isNaN(min))
        throw new Error(`MIN is NaN (${raw})`)

    if (min < MIN_LIMIT)
        throw new Error(`MIN must be greater than or equal to ${MIN_LIMIT} but it't ${min}`)

    if (min > MAX_LIMIT)
        throw new Error(`MIN must be lower than or equal to ${MAX_LIMIT} but it't ${min}`)

    return min
}

export function getMax(min: number): number {
    const raw = process.env.MAX?.trim()

    if (raw == null)
        return DEFAULT_MAX

    const max = Number(raw)

    if (isNaN(max))
        throw new Error(`MAX is NaN (${raw})`)

    if (max < min)
        throw new Error(`MAX must be greater than or equal to MIN (${min}) but it't ${max}`)

    if (max > MAX_LIMIT)
        throw new Error(`MAX must be lower than or equal to ${MAX_LIMIT} but it't ${max}`)

    return max
}

export function getCurrent(): number {
    const raw = process.env.CURRENT?.trim()

    if (raw == null)
        return DEFAULT_CURRENT

    const current = Number(raw)

    if (isNaN(current))
        throw new Error(`CURRENT is NaN (${raw})`)

    if (current < DEFAULT_MIN)
        throw new Error(`CURRENT must be greater than or equal to ${DEFAULT_MIN} but it't ${current}`)

    if (current > DEFAULT_MAX)
        throw new Error(`CURRENT must be lower than or equal to ${DEFAULT_MAX} but it't ${current}`)

    return current
}

export function getFillRate(): number {
    const raw = process.env.FILL_RATE?.trim()

    if (raw == null)
        return DEFAULT_FILL_RATE

    const fillRate = Number(raw)

    if (isNaN(fillRate))
        throw new Error(`FILL_RATE is NaN (${raw})`)

    if (fillRate <= 0)
        throw new Error(`FILL_RATE must be positive (${fillRate})`)

    return fillRate
}

export function getDrainRate(): number {
    const raw = process.env.DRAIN_RATE?.trim()

    if (raw == null)
        return DEFAULT_DRAIN_RATE

    const drainRate = Number(raw)

    if (isNaN(drainRate))
        throw new Error(`DRAIN_RATE is NaN (${raw})`)

    if (drainRate <= 0)
        throw new Error(`DRAIN_RATE must be positive (${drainRate})`)

    return drainRate
}

export function getTick(): number {
    const raw = process.env.TICK?.trim()

    if (raw == null)
        return DEFAULT_TICK

    const tick = Number(raw)

    if (isNaN(tick))
        throw new Error(`TICK is NaN (${raw})`)

    if (tick <= 0)
        throw new Error(`TICK must be positive (${tick})`)

    return tick
}