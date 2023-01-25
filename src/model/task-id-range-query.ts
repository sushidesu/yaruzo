import dayjs from "dayjs"
import { selectorFamily } from "recoil"
import { createTaskRepository } from "../infra/kvs/task-repository"
import { dayjsToKey, Timestamp } from "./task"

export const taskIdRangeQuery = selectorFamily<
  string[],
  { gte: Timestamp; lt: Timestamp }
>({
  key: "taskList",
  get:
    ({ gte, lt }) =>
    async () => {
      const taskRepository = createTaskRepository()

      const tasks = await taskRepository.query({
        gte: dayjsToKey(dayjs(gte)),
        lt: dayjsToKey(dayjs(lt)),
      })

      return tasks.map(({ id }) => id)
    },
})
