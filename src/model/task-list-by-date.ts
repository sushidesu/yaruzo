import { selectorFamily, useRecoilValue, waitForAll } from "recoil"
import { DateKey, dayjsToKey, keyToDayjs, Task } from "./task"
import { taskIdRangeQuery } from "./task-id-range-query"
import { taskQuery } from "./task-query"

const taskListByDateQuery = selectorFamily<Task[], DateKey>({
  key: "taskListByDateQuery",
  get:
    (date) =>
    async ({ get }) => {
      const d = keyToDayjs(date)

      const ids = get(
        taskIdRangeQuery({
          gte: dayjsToKey(d.startOf("date")),
          lt: dayjsToKey(d.add(1, "day").startOf("date")),
        })
      )

      const tasks = get(waitForAll(ids.map((id) => taskQuery(id))))
      return tasks
    },
})

export const useTaskListByDate = (date: DateKey): Task[] => {
  return useRecoilValue(taskListByDateQuery(date))
}
