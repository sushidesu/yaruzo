import { RoconRoot } from "rocon/react"
import { Routes } from "./Router"
import { NotFoundErrorBoundary } from "./NotFoundErrorBoundary"

export const App = () => {
  return (
    <RoconRoot>
      <NotFoundErrorBoundary>
        <Routes />
      </NotFoundErrorBoundary>
    </RoconRoot>
  )
}
