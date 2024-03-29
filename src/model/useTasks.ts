import useSWR, { KeyedMutator } from "swr"

import { createTaskRepository } from "../infra/kvs/task-repository"
import type { DateKey, Task } from "./task"

type TasksQuery = {
  gte: DateKey
  lt: DateKey
}

const key = (query: TasksQuery) =>
  ({
    key: "tasks",
    ...query,
  } as const)

export const useTasks = (query: TasksQuery): [Task[], KeyedMutator<Task[]>] => {
  const response = useSWR(
    key(query),
    ({ gte, lt }) => {
      const repo = createTaskRepository()
      return repo.query({ gte, lt })
    },
    {
      suspense: true,
    }
  )
  return [response.data as Task[], response.mutate]
}
