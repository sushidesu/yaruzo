import useSWR, { KeyedMutator } from "swr"
import type { Task } from "./task"
import { createTaskRepository } from "../infra/kvs/task-repository"

export const useTasks = (): [Task[], KeyedMutator<Task[]>] => {
  const response = useSWR(
    "tasks",
    () => {
      const repo = createTaskRepository()
      return repo.query()
    },
    {
      suspense: true,
    }
  )
  return [response.data as Task[], response.mutate]
}
