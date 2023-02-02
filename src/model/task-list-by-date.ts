import dayjs from "dayjs"
import { selectorFamily, useRecoilValue, waitForAll } from "recoil"
import { dayjsToTimestamp, Task, Timestamp } from "./task"
import { taskIdRangeQuery } from "./task-id-range-query"
import { taskQuery } from "./task-query"

const taskListByDateQuery = selectorFamily<Task[], Timestamp>({
  key: "taskListByDateQuery",
  get:
    (now) =>
    async ({ get }) => {
      const d = dayjs(now)

      console.log({
        start: d.startOf("date").format("YYYY-MM-DD HH:MM"),
        end: d.endOf("date").format("YYYY-MM-DD HH:MM"),
      })

      const ids = get(
        taskIdRangeQuery({
          gte: dayjsToTimestamp(d.startOf("milliseconds")),
          lt: dayjsToTimestamp(d.endOf("date")),
        })
      )

      const tasks = get(waitForAll(ids.map((id) => taskQuery(id))))
      return tasks
    },
})

export const useTaskListByDate = (date: Timestamp): Task[] => {
  return useRecoilValue(taskListByDateQuery(date))
}
