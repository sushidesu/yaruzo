import { selectorFamily, useRecoilCallback } from "recoil"

import { createTaskRepository } from "../infra/kvs/task-repository"
import { DateKey, dayjsToKey, keyToDayjs } from "./task"

export const taskIdRangeQuery = selectorFamily<string[], DateKey>({
  key: "taskList",
  get: (key) => async () => {
    const taskRepository = createTaskRepository()

    console.log(`reset date ${key}`)
    const tasks = await taskRepository.query({
      gte: key,
      lt: dayjsToKey(keyToDayjs(key).add(1, "day")),
    })

    return tasks.map(({ id }) => id)
  },
})

export const useResetTaskIdRangeQuery = (): ((date: DateKey) => void) => {
  return useRecoilCallback(({ refresh }) => (props) => {
    refresh(taskIdRangeQuery(props))
  })
}
