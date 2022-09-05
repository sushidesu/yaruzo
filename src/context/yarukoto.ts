import { useReducer, Reducer } from "react"
import { Task, DateKey, now } from "../model/task"

type TaskMap = Record<DateKey, Task[]>

type YarukotoAction =
  | {
      type: "add"
      id: string
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
  | {
      type: "move"
      id: string
      from: DateKey
      to: DateKey
    }

const reducer: Reducer<TaskMap, YarukotoAction> = (state, action) => {
  switch (action.type) {
    case "add": {
      const target = state[action.key]
      const duplicate = target?.find((a) => a.id === action.id) !== undefined
      if (duplicate) {
        return { ...state }
      } else {
        const item: Task = {
          id: action.id,
          name: action.name,
          todoAt: action.key,
          completedAt: undefined,
          createdAt: now(),
        }
        state[action.key] = target === undefined ? [item] : [...target, item]
        return { ...state }
      }
    }
    case "complete": {
      const target = state[action.key]

      if (target === undefined) return { ...state }

      state[action.key] = target.map<Task>((y) => {
        return y.id === action.id
          ? {
              ...y,
              todoAt: action.key,
              completedAt: now(),
            }
          : y
      })
      return { ...state }
    }
    case "remove": {
      const target = state[action.key]
      if (target === undefined) return { ...state }

      state[action.key] = target.filter((y) => y.id !== action.id)
      return { ...state }
    }
    case "move": {
      const from = state[action.from]
      if (from === undefined) return { ...state }

      const item = from.find((i) => i.id === action.id)
      if (item === undefined) return { ...state }

      // todoAt を action.to にする
      const newItem: Task = {
        ...item,
        todoAt: action.to,
      }
      state[action.from] = from.map((i) => (i.id === action.id ? newItem : i))

      // action.to にコピーする
      const to = state[action.to]
      const duplicate = to?.find((a) => a.id === action.id)
      state[action.to] =
        to === undefined
          ? [newItem]
          : duplicate
          ? to.map((i) => (i.id === action.id ? newItem : i))
          : [...to, newItem]

      return { ...state }
    }
  }
}

/* ------------------ */

export const useYarukoto = (init?: TaskMap) => {
  return useReducer(reducer, init ?? {})
}
