import { selectorFamily, useRecoilCallback } from "recoil"
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

      console.info(`QUERY: ${gte} ~ ${lt}`)
      const tasks = await taskRepository.query({
        gte,
        lt,
      })

      return tasks.map(({ id }) => id)
    },
})

export const useResetTaskIdRangeQuery = (): ((props: {
  gte: DateKey
  lt: DateKey
}) => void) => {
  return useRecoilCallback(
    ({ refresh }) =>
      (props: { gte: DateKey; lt: DateKey }) => {
        console.info(`REFRESH: ${props.gte} ~ ${props.lt}`)
        refresh(taskIdRangeQuery(props))
      }
  )
}
