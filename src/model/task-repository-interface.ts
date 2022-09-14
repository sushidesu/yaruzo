import type { Task, DateKey } from "./task"

export interface TaskRepositoryInterface {
  get(id: string): Promise<Task | undefined>
  query(q: { gte: DateKey; lt: DateKey }): Promise<Task[]>
  create(task: Task): Promise<void>
  update(id: string, mutator: (prev: Task) => Task): Promise<void>
  remove(id: string): Promise<void>
  swapOrder(leftId: string, rightId: string): Promise<void>
}
