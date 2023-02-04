import { selectorFamily } from "recoil"
import { createTaskRepository } from "../infra/kvs/task-repository"
import type { DateKey } from "./task"

export const taskIdRangeQuery = selectorFamily<
  string[],
  { gte: DateKey; lt: DateKey }
>({
  key: "taskList",
  get:
    ({ gte, lt }) =>
    async () => {
      const taskRepository = createTaskRepository()

      const tasks = await taskRepository.query({
        gte,
        lt,
      })

      return tasks.map(({ id }) => id)
    },
})
