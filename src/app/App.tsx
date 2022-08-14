import { RoconRoot } from "rocon/react"
import { YarukotoContextProvider } from "../context/YarukotoContext"
import { Routes } from "./Router"

export const App = () => {
  return (
    <YarukotoContextProvider>
      <RoconRoot>
        <Routes />
      </RoconRoot>
    </YarukotoContextProvider>
  )
}
