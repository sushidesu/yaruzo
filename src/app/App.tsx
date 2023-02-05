import { RecoilRoot } from "recoil"
import { RoconRoot } from "rocon/react"

import { NotFoundErrorBoundary } from "./NotFoundErrorBoundary"
import { Routes } from "./Router"

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
