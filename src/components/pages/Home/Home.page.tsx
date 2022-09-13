import { Home } from "./Home"
import { Layout } from "../../ui/Layout"
import { Header } from "../../ui/Header"
import { Footer } from "../../ui/Footer"
import { Suspense } from "react"

export const HomePage = () => {
  return (
    <Layout header={<Header />} footer={<Footer />}>
      <Suspense fallback={<div>loading...</div>}>
        <Home />
      </Suspense>
    </Layout>
  )
}
