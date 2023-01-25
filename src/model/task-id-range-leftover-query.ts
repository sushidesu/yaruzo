import { selector } from "recoil"
import { createTaskRepository } from "../infra/kvs/task-repository"

export const taskIdRangeLeftoverQuery = selector<string[]>({
  key: "taskIdRangeLeftoverQuery",
  get: async () => {
    const taskRepository = createTaskRepository()

    const leftovers = await taskRepository.queryByCompletedAt({
      completedAt: undefined,
    })

    return leftovers.map((task) => task.id)
  },
})
