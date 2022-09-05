import type { YarukotoPageProps } from "./yarukoto-page-props"
import { Yarukoto } from "./Yarukoto"
import { Layout } from "../../ui/Layout"
import { Header } from "../../ui/Header"
import { Footer } from "../../ui/Footer"
import { Suspense } from "react"
import type { DateKey } from "../../../model/task"

export const YarukotoPage = ({ dateKey }: YarukotoPageProps) => {
  if (!isDateKey(dateKey)) {
    return (
      <Layout header={<Header />} footer={<Footer />}>
        <div>not found</div>
      </Layout>
    )
  } else {
    return (
      <Layout header={<Header />} footer={<Footer />}>
        <Suspense fallback={<div>loading</div>}>
          <Yarukoto dateKey={dateKey} />
        </Suspense>
      </Layout>
    )
  }
}

const isDateKey = (val: string): val is DateKey => {
  return val.length === 10
}
