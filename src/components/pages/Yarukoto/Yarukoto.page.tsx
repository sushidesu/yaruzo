import type { YarukotoPageProps } from "./yarukoto-page-props"
import { Yarukoto } from "./Yarukoto"
import { Layout } from "../../ui/Layout"
import { Header } from "../../ui/Header"
import { Footer } from "../../ui/Footer"

export const YarukotoPage = ({ dateKey }: YarukotoPageProps) => {
  return (
    <Layout header={<Header />} footer={<Footer />}>
      <Yarukoto dateKey={dateKey} />
    </Layout>
  )
}
