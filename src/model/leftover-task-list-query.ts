import { selector, useRecoilValue, waitForAll } from "recoil"

import type { Task } from "./task"
import { taskIdRangeLeftoverQuery } from "./task-id-range-leftover-query"
import { taskQuery } from "./task-query"

export const leftoverTaskListQuery = selector<Task[]>({
  key: "leftoverTaskListQueyr",
  get: async ({ get }) => {
    const ids = get(taskIdRangeLeftoverQuery)
    const tasks = get(waitForAll(ids.map((id) => taskQuery(id))))
    return tasks
  },
})

export const useLeftoverTaskList = (): Task[] =>
  useRecoilValue(leftoverTaskListQuery)
