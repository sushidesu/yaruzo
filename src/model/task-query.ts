import { selectorFamily, useRecoilCallback } from "recoil"

import { createTaskRepository } from "../infra/kvs/task-repository"
import type { Task } from "./task"

export const taskQuery = selectorFamily<Task, string>({
  key: "taskQuery",
  get: (id) => async () => {
    const taskRepository = createTaskRepository()
    const task = await taskRepository.get(id)
    if (task === undefined) throw new Error(`${id} not found`)
    return task
  },
})

export const useRefreshTaskQuery = (): ((id: string) => void) => {
  return useRecoilCallback(({ refresh }) => (id: string) => {
    refresh(taskQuery(id))
  })
}
