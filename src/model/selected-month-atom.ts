import dayjs from "dayjs"
import ObjectSupport from "dayjs/plugin/objectSupport"
import { useCallback, useMemo } from "react"
import { atom, useRecoilValue, useSetRecoilState } from "recoil"
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
    setter((prev) => createTimeStamp(dayjs(prev).add(-1, "month").unix()))
  }, [setter])

  const next = useCallback(() => {
    setter((prev) => createTimeStamp(dayjs(prev).add(1, "month").unix()))
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
  return useRecoilValue(selectedMonthAtom)
}
