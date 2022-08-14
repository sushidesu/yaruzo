import type { YarukotoPageProps } from "./yarukoto-page-props"
import { Yarukoto } from "./Yarukoto"

export const YarukotoPage = ({ dateKey }: YarukotoPageProps) => {
  return <Yarukoto dateKey={dateKey} />
}
