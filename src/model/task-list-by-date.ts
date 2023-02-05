import {
  selectorFamily,
  useRecoilCallback,
  useRecoilValue,
  waitForAll,
} from "recoil"
import { DateKey, dayjsToKey, keyToDayjs, Task } from "./task"
import { taskIdRangeQuery } from "./task-id-range-query"
import { taskQuery } from "./task-query"

const taskListByDateQuery = selectorFamily<Task[], DateKey>({
  key: "taskListByDateQuery",
  get:
    (date) =>
    async ({ get }) => {
      const ids = get(taskIdRangeQuery(dateToRange(date)))
      const tasks = get(waitForAll(ids.map((id) => taskQuery(id))))
      return tasks
    },
})

const dateToRange = (date: DateKey): { gte: DateKey; lt: DateKey } => {
  const d = keyToDayjs(date)
  return {
    gte: dayjsToKey(d.startOf("date")),
    lt: dayjsToKey(d.add(1, "day").startOf("date")),
  }
}

export const useTaskListByDate = (date: DateKey): Task[] => {
  return useRecoilValue(taskListByDateQuery(date))
}

export const useRefreshTaskListByDate = () => {
  return useRecoilCallback(({ refresh }) => (date: DateKey) => {
    refresh(taskIdRangeQuery(dateToRange(date)))
  })
}
