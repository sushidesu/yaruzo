import dayjs from "dayjs"
import { selector, useRecoilValue, waitForAll } from "recoil"

import { range } from "../utils/range"
import { selectedMonthAtom } from "./selected-month-atom"
import { dayjsToKey, Task } from "./task"
import { taskIdRangeQuery } from "./task-id-range-query"
import { taskQuery } from "./task-query"

export const taskListByMonthQuery = selector<Task[]>({
  key: "taskListByMonthQuery",
  get: async ({ get }) => {
    // 月初、月末の日付を取得
    const selectedMonth = get(selectedMonthAtom)
    const selected = dayjs(selectedMonth)
    const start = selected.startOf("month")

    const days = start.daysInMonth()
    const ids = get(
      waitForAll(
        [...range(start.date(), days)]
          .map((i) => start.add(i, "day"))
          .map((d) => taskIdRangeQuery(dayjsToKey(d)))
      )
    ).flat()
    console.log("reset month")
    const tasks = get(waitForAll(ids.map((id) => taskQuery(id))))

    return tasks
  },
})

export const useTaskListByMonth = (): Task[] => {
  return useRecoilValue(taskListByMonthQuery)
}
