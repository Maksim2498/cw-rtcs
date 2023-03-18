export const DEFAULT_HOST = "localhost"
export const DEFAULT_PORT = 1883

export interface Address {
    host: string
    port: number
}

export function getAddress(): Address {
    return {
        host: getHost(),
        port: getPort()
    }
}

export function getHost(): string {
    return process.env.HOST?.trim() ?? DEFAULT_HOST
}

export function getPort(): number {
    const raw = process.env.PORT?.trim()

    if (raw == null)
        return DEFAULT_PORT

    const port = Number(raw)

    if (isNaN(port))
        throw new Error(`PORT не является числом (${raw})`)

    if (!Number.isInteger(port))
        throw new Error(`PORT должен быть целым числом (${raw})`)

    if (port < 0 || port > 65535)
        throw new Error(`PORT за пределами диапазона доступных портов (${raw})`)

    return port
}

export function addressToString(address: Address): string {
    return `mqtt://${address.host}:${address.port}`
}
