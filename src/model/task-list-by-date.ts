import {
  selectorFamily,
  useRecoilCallback,
  useRecoilValue,
  waitForAll,
} from "recoil"

import type { DateKey, Task } from "./task"
import { taskIdRangeQuery } from "./task-id-range-query"
import { taskQuery } from "./task-query"
import { taskSortableList } from "./task-sortable-list"

export const taskListByDateQuery = selectorFamily<Task[], DateKey>({
  key: "taskListByDateQuery",
  get:
    (date) =>
    async ({ get }) => {
      const ids = get(taskIdRangeQuery(date))
      const tasks = get(waitForAll(ids.map((id) => taskQuery(id))))
      return tasks
    },
})

export const useTaskListByDate = (date: DateKey): Task[] => {
  return useRecoilValue(taskListByDateQuery(date))
}

export const useRefreshTaskListByDate = () => {
  return useRecoilCallback(({ refresh, reset }) => (date: DateKey) => {
    console.log(`refresh: ${date}`)
    refresh(taskIdRangeQuery(date))
    reset(taskSortableList(date))
  })
}
