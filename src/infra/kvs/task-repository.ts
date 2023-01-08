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

type TaskOrderScheme = Record<string, number>

type TaskSummaryScheme = {
  count: number
}

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

  const getOrderStorage = () =>
    kvsEnvStorage<TaskOrderScheme>({
      name: "taskOrder",
      version: 1,
      upgrade: async ({ kvs, oldVersion }) => {
        if (oldVersion < 1) {
          const storage = await tasksStorage()
          const tasks: TasksSchema[string][] = []
          for await (const [_, value] of storage) {
            tasks.push(value)
          }
          const sorted = tasks.sort((a, b) => a.createdAt - b.createdAt)
          let i = 0
          for (const task of sorted) {
            await kvs.set(task.id, i)
            ++i
          }
        }
      },
    })

  const summaryStorage = () =>
    kvsEnvStorage<TaskSummaryScheme>({
      name: "taskSummary",
      version: 1,
      upgrade: async ({ kvs, oldVersion }) => {
        if (oldVersion < 1) {
          const tasks = await tasksStorage()
          let i = 0
          for await (const _ of tasks) {
            ++i
          }
          kvs.set("count", i)
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
    const orderStorage = await getOrderStorage()

    const orders: Record<string, number> = {}
    for await (const [key, value] of orderStorage) {
      orders[key] = value
    }

    const tasks: Task[] = []
    for await (const [_, value] of storage) {
      tasks.push(from(value))
    }

    return tasks.sort((a, b) => {
      const aOrder = orders[a.id]
      const bOrder = orders[b.id]
      if (aOrder === undefined || bOrder === undefined) {
        return a.createdAt - b.createdAt
      } else {
        return aOrder - bOrder
      }
    })
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

    queryByCompletedAt: async ({ completedAt }) => {
      const tasks = await getAll()
      return tasks.filter((t) => t.completedAt === completedAt)
    },

    create: async (task) => {
      const storage = await tasksStorage()
      const orders = await getOrderStorage()
      const summary = await summaryStorage()

      const count = await summary.get("count")
      if (count === undefined) {
        throw new Error("count not found")
      }
      await storage.set(task.id, to(task))
      await orders.set(task.id, count)
      await summary.set("count", count + 1)
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
      const orders = await getOrderStorage()
      await storage.delete(id)
      await orders.delete(id)
    },

    swapOrder: async (leftId, rightId) => {
      const orders = await getOrderStorage()
      const left = await orders.get(leftId)
      const right = await orders.get(rightId)

      if (left === undefined || right === undefined) {
        return
      }

      await orders.set(leftId, right)
      await orders.set(rightId, left)
    },

    updateOrders: async (ids) => {
      const orderStorage = await getOrderStorage()

      const orders = (
        await Promise.all(
          ids.map(async (id) => {
            const r = await orderStorage.get(id)
            return r ? [r] : []
          })
        )
      ).flat()

      if (orders.length !== ids.length) {
        throw new Error("some orders not found")
      }

      const sortedOrders = orders.sort((a, b) => a - b)
      const targets: [string, number][] = ids.map((id, i) => [
        id,
        sortedOrders[i] as number,
      ]) // 上で要素数を確認しているのでundefinedにならない
      await Promise.all(
        targets.map(([key, value]) => orderStorage.set(key, value))
      )
    },
  }
}
