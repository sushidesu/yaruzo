import { v4 as uuidv4 } from "uuid"

export type Task = {
  id: string
  name: string
  todoAt: DateKey
  completedAt: Timestamp | undefined
  createdAt: Timestamp
}

export type Timestamp = number & {
  __brand: "timestamp"
}
export const createTimeStamp = (value: number): Timestamp => value as Timestamp
export const now = () => createTimeStamp(Date.now())

export type DateKey = string & {
  __brand: "dateKey"
}

const zpad = (v: number, n: number) => v.toString().padStart(n, "0")

export const createDateKey = (y: number, m: number, d: number): DateKey =>
  `${zpad(y, 4)}-${zpad(m, 2)}-${zpad(d, 2)}` as DateKey
export const today = (): DateKey => {
  const d = new Date()
  return createDateKey(d.getFullYear(), d.getMonth() + 1, d.getDate())
}

export const getDate = (
  key: DateKey
): {
  y: number
  m: number
  d: number
} => {
  const y = Number(key.slice(0, 4))
  const m = Number(key.slice(5, 7))
  const d = Number(key.slice(8))
  return {
    y,
    m,
    d,
  }
}

export const generateId = () => uuidv4()
