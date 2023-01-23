import { RoconRoot } from "rocon/react"
import { Routes } from "./Router"
import { NotFoundErrorBoundary } from "./NotFoundErrorBoundary"
import { RecoilRoot } from "recoil"

export const App = () => {
  return (
    <RecoilRoot>
      <RoconRoot>
        <NotFoundErrorBoundary>
          <Routes />
        </NotFoundErrorBoundary>
      </RoconRoot>
    </RecoilRoot>
  )
}
