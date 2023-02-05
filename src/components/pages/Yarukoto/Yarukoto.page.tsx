import { Suspense } from "react"

import type { DateKey } from "../../../model/task"
import { Footer } from "../../ui/Footer"
import { Header } from "../../ui/Header"
import { Layout } from "../../ui/Layout"
import { Yarukoto } from "./Yarukoto"
import type { YarukotoPageProps } from "./yarukoto-page-props"

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
