import { Home } from "./Home"
import { Layout } from "../../ui/Layout"
import { Header } from "../../ui/Header"
import { Footer } from "../../ui/Footer"

export const HomePage = () => {
  return (
    <Layout header={<Header />} footer={<Footer />}>
      <Home />
    </Layout>
  )
}
