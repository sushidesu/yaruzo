import dayjs from "dayjs"
import ObjectSupport from "dayjs/plugin/objectSupport"
import { useCallback, useMemo } from "react"
import {
  atom,
  useRecoilValue_TRANSITION_SUPPORT_UNSTABLE,
  useSetRecoilState,
} from "recoil"

import { createTimeStamp, now, Timestamp } from "./task"

dayjs.extend(ObjectSupport)

export const selectedMonthAtom = atom<Timestamp>({
  key: "selectedMonthAtom",
  default: now(),
})

export const useChangeSelectedMonth = (): {
  prev: () => void
  next: () => void
} => {
  const setter = useSetRecoilState(selectedMonthAtom)

  const prev = useCallback(() => {
    setter((prev) => {
      return createTimeStamp(dayjs(prev).add(-1, "month").valueOf())
    })
  }, [setter])

  const next = useCallback(() => {
    setter((prev) => createTimeStamp(dayjs(prev).add(1, "month").valueOf()))
  }, [setter])

  return useMemo(
    () => ({
      prev,
      next,
    }),
    [prev, next]
  )
}

export const useSelectedMonth = (): Timestamp => {
  return useRecoilValue_TRANSITION_SUPPORT_UNSTABLE(selectedMonthAtom)
}
