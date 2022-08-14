import Rocon, { useRoutes } from "rocon/react"
import { Home } from "../pages/Home"
import { Yarukoto } from "../pages/Yarukoto"

export const routes = Rocon.Path()
  .exact({
    action: () => <Home />,
  })
  .route("y")

export const routes_y = routes._.y.attach(Rocon.Path()).any("dateKey", {
  action: ({ dateKey }) => <Yarukoto dateKey={dateKey} />,
})

export const Routes = () => useRoutes(routes)
