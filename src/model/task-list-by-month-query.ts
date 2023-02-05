import { selector, useRecoilValue, waitForAll } from "recoil"
import { Task, dayjsToKey } from "./task"
import { selectedMonthAtom } from "./selected-month-atom"
import { taskQuery } from "./task-query"
import { taskIdRangeQuery } from "./task-id-range-query"
import dayjs from "dayjs"

export const taskListByMonthQuery = selector<Task[]>({
  key: "taskListByMonthQuery",
  get: async ({ get }) => {
    // 月初、月末の日付を取得
    const selectedMonth = get(selectedMonthAtom)
    const selected = dayjs(selectedMonth)
    const start = selected.startOf("month")
    const end = selected.add(1, "month").startOf("month")

    const ids = get(
      taskIdRangeQuery({
        gte: dayjsToKey(start),
        lt: dayjsToKey(end),
      })
    )
    const tasks = get(waitForAll(ids.map((id) => taskQuery(id))))

    return tasks
  },
})

export const useTaskListByMonth = (): Task[] => {
  return useRecoilValue(taskListByMonthQuery)
}