import { createContext, useContext } from "react"
import { useYarukoto } from "./yarukoto"

type YarukotoContextValue = ReturnType<typeof useYarukoto>

const YaurkotoContext = createContext<YarukotoContextValue>([
  {},
  () => {
    /* void */
  },
])

export const YarukotoContextProvider = ({
  children,
}: {
  children: React.ReactNode
}): JSX.Element => {
  const value = useYarukoto()
  return (
    <YaurkotoContext.Provider value={value}>
      {children}
    </YaurkotoContext.Provider>
  )
}

export const useYarukotoContext = () => useContext(YaurkotoContext)
