import { Home } from "./Home"
import { LayoutWithSidebar } from "../../ui/LayoutWithSidebar"
import { Header } from "../../ui/Header"
import { Footer } from "../../ui/Footer"
import { Suspense } from "react"
import { LeftoverList } from "../../feature/LeftoverList"

export const HomePage = () => {
  return (
    <LayoutWithSidebar
      header={<Header />}
      footer={<Footer />}
      sidebar={<LeftoverList />}
    >
      <Suspense fallback={<div>loading...</div>}>
        <Home />
      </Suspense>
    </LayoutWithSidebar>
  )
}
