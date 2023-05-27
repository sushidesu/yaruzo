import {
  selector,
  useRecoilCallback,
  useRecoilValue_TRANSITION_SUPPORT_UNSTABLE,
  waitForAll,
} from "recoil"

import type { Task } from "./task"
import { taskIdRangeLeftoverQuery } from "./task-id-range-leftover-query"
import { taskQuery } from "./task-query"

export const leftoverTaskListQuery = selector<Task[]>({
  key: "leftoverTaskListQuery",
  get: async ({ get }) => {
    const ids = get(taskIdRangeLeftoverQuery)
    const tasks = get(waitForAll(ids.map((id) => taskQuery(id))))
    return tasks
  },
})

export const useLeftoverTaskList = (): Task[] =>
  useRecoilValue_TRANSITION_SUPPORT_UNSTABLE(leftoverTaskListQuery)
// useRecoilValue(leftoverTaskListQuery)

export const useRefreshLeftoverTaskList = () => {
  return useRecoilCallback(({ refresh }) => () => {
    refresh(taskIdRangeLeftoverQuery)
  })
}
