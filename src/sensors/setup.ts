export const DEFAULT_MIN        = 20
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
        throw new Error(`MIN не является числом (${raw})`)

    if (min < MIN_LIMIT)
        throw new Error(`MIN должно быть больше или равно ${MIN_LIMIT}, но оно равно ${min}`)

    if (min > MAX_LIMIT)
        throw new Error(`MIN должно быть меньше или равно ${MAX_LIMIT}, но оно равно ${min}`)

    return min
}

export function getMax(min: number): number {
    const raw = process.env.MAX?.trim()

    if (raw == null)
        return DEFAULT_MAX

    const max = Number(raw)

    if (isNaN(max))
        throw new Error(`MAX не является числом (${raw})`)

    if (max < min)
        throw new Error(`MAX должно быть больше или равн MIN (${min}), но оно равно ${max}`)

    if (max > MAX_LIMIT)
        throw new Error(`MAX должно быть меньше или равно ${MAX_LIMIT}, но оно равно ${max}`)

    return max
}

export function getCurrent(): number {
    const raw = process.env.CURRENT?.trim()

    if (raw == null)
        return DEFAULT_CURRENT

    const current = Number(raw)

    if (isNaN(current))
        throw new Error(`CURRENT является числом (${raw})`)

    if (current < DEFAULT_MIN)
        throw new Error(`CURRENT должно быть больше или равно ${MIN_LIMIT}, но оно равно ${current}`)

    if (current > DEFAULT_MAX)
        throw new Error(`CURRENT должно быть меньше или равно ${MAX_LIMIT}, но оно равно ${current}`)

    return current
}

export function getFillRate(): number {
    const raw = process.env.FILL_RATE?.trim()

    if (raw == null)
        return DEFAULT_FILL_RATE

    const fillRate = Number(raw)

    if (isNaN(fillRate))
        throw new Error(`FILL_RATE не является числом (${raw})`)

    if (fillRate <= 0)
        throw new Error(`FILL_RATE должно быть положительным (${fillRate})`)

    return fillRate
}

export function getDrainRate(): number {
    const raw = process.env.DRAIN_RATE?.trim()

    if (raw == null)
        return DEFAULT_DRAIN_RATE

    const drainRate = Number(raw)

    if (isNaN(drainRate))
        throw new Error(`DRAIN_RATE не является числом (${raw})`)

    if (drainRate <= 0)
        throw new Error(`DRAIN_RATE должно быть положительным (${drainRate})`)

    return drainRate
}

export function getTick(): number {
    const raw = process.env.TICK?.trim()

    if (raw == null)
        return DEFAULT_TICK

    const tick = Number(raw)

    if (isNaN(tick))
        throw new Error(`TICK не является числом (${raw})`)

    if (tick <= 0)
        throw new Error(`TICK должно быть положительным (${tick})`)

    return tick
}