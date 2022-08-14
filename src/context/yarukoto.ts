import { useReducer, Reducer } from "react"
import { v4 as uuidv4 } from "uuid"

/* ------------------ */

export type DateKey = string & {
  __brand: "dateKey"
}
const zpad = (v: number, n: number) => v.toString().padStart(n, "0")
export const createDateKey = (y: number, m: number, d: number): DateKey =>
  `${zpad(y, 4)}-${zpad(m, 2)}-${zpad(d, 2)}` as DateKey

export type Timestamp = number & {
  __brand: "timestamp"
}
const createTimeStamp = (value: number): Timestamp => value as Timestamp
const now = () => createTimeStamp(Date.now())

export type Yarukoto = {
  id: string
  name: string
  todoAt: DateKey
  completedAt: Timestamp | undefined
}

/* ------------------ */

type YarukotoMap = Record<DateKey, Yarukoto[]>

type DispatchYarukoto =
  | {
      type: "add"
      key: DateKey
      name: string
    }
  | {
      type: "complete"
      key: DateKey
      id: string
    }
  | {
      type: "remove"
      key: DateKey
      id: string
    }

const reducer: Reducer<YarukotoMap, DispatchYarukoto> = (state, action) => {
  switch (action.type) {
    case "add": {
      const target = state[action.key]
      const item: Yarukoto = {
        id: uuidv4(),
        name: action.name,
        todoAt: action.key,
        completedAt: undefined,
      }
      state[action.key] = target === undefined ? [item] : [...target, item]
      return state
    }
    case "complete": {
      const target = state[action.key]

      if (target === undefined) return state

      state[action.key] = target.map<Yarukoto>((y) => {
        return y.id === action.id
          ? {
              ...y,
              todoAt: action.key,
              completedAt: now(),
            }
          : y
      })
      return state
    }
    case "remove": {
      const target = state[action.key]
      if (target === undefined) return state

      state[action.key] = target.filter((y) => y.id !== action.id)
      return state
    }
  }
}

/* ------------------ */

export const useYarukoto = (init?: YarukotoMap) => {
  return useReducer(reducer, init ?? {})
}
