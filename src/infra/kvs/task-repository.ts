import type { TaskRepositoryInterface } from "../../model/task-repository-interface"
import {
  Task,
  DateKey,
  now,
  Timestamp,
  generateId,
  createDateKey,
  keyToDayjs,
} from "../../model/task"
import { kvsEnvStorage } from "@kvs/env"

type TasksSchema = Record<
  string,
  {
    id: string
    name: string
    todoAt: DateKey
    completedAt: Timestamp | null
    createdAt: Timestamp
  }
>

export const createTaskRepository = (): TaskRepositoryInterface => {
  const tasksStorage = () =>
    kvsEnvStorage<TasksSchema>({
      name: "tasks",
      version: 1,
      upgrade: async ({ kvs, oldVersion }) => {
        if (oldVersion < 1) {
          const id = generateId()
          kvs.set(id, {
            id,
            name: "やるぞ",
            createdAt: now(),
            todoAt: createDateKey(2022, 9, 10),
            completedAt: null,
          })
        }
      },
    })
  const to = (task: Task): TasksSchema[string] => ({
    id: task.id,
    name: task.name,
    todoAt: task.todoAt,
    completedAt: task.completedAt ?? null,
    createdAt: task.createdAt,
  })
  const from = (value: TasksSchema[string]): Task => ({
    id: value.id,
    name: value.name,
    todoAt: value.todoAt,
    completedAt: value.completedAt ?? undefined,
    createdAt: value.createdAt,
  })

  const getAll = async (): Promise<Task[]> => {
    const storage = await tasksStorage()
    const tasks: Task[] = []
    for await (const [_, value] of storage) {
      tasks.push(from(value))
    }
    return tasks.sort((a, b) => a.createdAt - b.createdAt)
  }

  return {
    get: async (id) => {
      const storage = await tasksStorage()
      const target = await storage.get(id)
      return target ? from(target) : undefined
    },

    query: async ({ gte, lt }) => {
      const tasks = await getAll()
      return tasks.filter((t) => {
        const start = keyToDayjs(gte)
        const end = keyToDayjs(lt)
        const d = keyToDayjs(t.todoAt)
        return (
          (d.isSame(start, "date") || d.isAfter(start, "date")) &&
          d.isBefore(end)
        )
      })
    },

    create: async (task) => {
      const storage = await tasksStorage()
      storage.set(task.id, to(task))
    },

    update: async (id, mutator) => {
      const storage = await tasksStorage()
      const target = await storage.get(id)
      if (target !== undefined) {
        await storage.set(target.id, to(mutator(from(target))))
      }
    },

    remove: async (id) => {
      const storage = await tasksStorage()
      await storage.delete(id)
    },
  }
}
