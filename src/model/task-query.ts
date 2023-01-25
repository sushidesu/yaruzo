import { selectorFamily } from "recoil"
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
