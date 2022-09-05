import { createContext, useContext } from "react"
import { v4 as uuidv4 } from "uuid"
import { Task, createDateKey, DateKey, now } from "../model/task"
import { useYarukoto } from "./yarukoto"

type YarukotoContextValue = ReturnType<typeof useYarukoto>

const YarukotoContext = createContext<YarukotoContextValue>([
  {},
  () => {
    /* void */
  },
])

const gen = (name: string, key: DateKey): Task => ({
  id: uuidv4(),
  name,
  todoAt: key,
  createdAt: now(),
  completedAt: undefined,
})

export const YarukotoContextProvider = ({
  children,
}: {
  children: React.ReactNode
}): JSX.Element => {
  const value = useYarukoto({
    [createDateKey(2022, 8, 13)]: [],
    [createDateKey(2022, 8, 14)]: [
      gen("アガルート環境構築", createDateKey(2022, 8, 14)),
      gen("レンジ注文", createDateKey(2022, 8, 14)),
      gen("歯を磨く", createDateKey(2022, 8, 14)),
      gen("風呂に入る", createDateKey(2022, 8, 14)),
    ],
    [createDateKey(2022, 8, 15)]: [],
    [createDateKey(2022, 8, 16)]: [],
  })
  return (
    <YarukotoContext.Provider value={value}>
      {children}
    </YarukotoContext.Provider>
  )
}

export const useYarukotoContext = () => useContext(YarukotoContext)
