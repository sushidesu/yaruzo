import { selector, useRecoilValue } from "recoil"
import { createTaskRepository } from "../infra/kvs/task-repository"
import type { Task } from "./task"

const leftoverTaskListSelector = selector<Task[]>({
  key: "leftoverTaskListSelector",
  get: async () => {
    const taskRepository = createTaskRepository()

    const tasks = await taskRepository.queryByCompletedAt({
      completedAt: undefined,
    })

    return tasks
  },
})

export const useLeftoverTaskList = () => {
  return useRecoilValue(leftoverTaskListSelector)
}
