import { Suspense } from "react"

import { LeftoverList } from "../../feature/LeftoverList"
import { Footer } from "../../ui/Footer"
import { Header } from "../../ui/Header"
import { LayoutWithSidebar } from "../../ui/LayoutWithSidebar"
import { Home } from "./Home"

export const HomePage = () => {
  return (
    <LayoutWithSidebar
      header={<Header />}
      footer={<Footer />}
      sidebar={
        <Suspense fallback={<div>loading...</div>}>
          <LeftoverList />
        </Suspense>
      }
    >
      <Suspense fallback={<div>loading...</div>}>
        <Home />
      </Suspense>
    </LayoutWithSidebar>
  )
}
