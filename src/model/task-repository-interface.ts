import type { Task } from "./task"

export interface TaskRepositoryInterface {
  get(id: string): Promise<Task | undefined>
  query(): Promise<Task[]>
  create(task: Task): Promise<void>
  update(id: string, mutator: (prev: Task) => Task): Promise<void>
  remove(id: string): Promise<void>
}
