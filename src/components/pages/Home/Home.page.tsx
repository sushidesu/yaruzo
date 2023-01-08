import { Home } from "./Home"
// import { Layout } from "../../ui/Layout"
import { LayoutWithSidebar } from "../../ui/LayoutWithSidebar"
import { Header } from "../../ui/Header"
import { Footer } from "../../ui/Footer"
import { Suspense } from "react"

export const HomePage = () => {
  return (
    <LayoutWithSidebar
      header={<Header />}
      footer={<Footer />}
      sidebar={<div>Sidebar</div>}
    >
      <Suspense fallback={<div>loading...</div>}>
        <Home />
      </Suspense>
    </LayoutWithSidebar>
  )
}
