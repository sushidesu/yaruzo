import {
  Task,
  DateKey,
  generateId,
  now,
  today,
  keyToDayjs,
  dayjsToKey,
} from "../model/task"
import { createTaskRepository } from "../infra/kvs/task-repository"

export const createTaskToday = async (name: string) => {
  const id = generateId()
  const task: Task = {
    id,
    name,
    todoAt: today(),
    createdAt: now(),
    completedAt: undefined,
  }
  const repo = createTaskRepository()
  await repo.create(task)
}

export const completeTask = async (id: string) => {
  const repo = createTaskRepository()
  await repo.update(id, (prev) => ({
    ...prev,
    completedAt: now(),
  }))
}

export const uncompleteTask = async (id: string) => {
  const repo = createTaskRepository()
  await repo.update(id, (prev) => ({
    ...prev,
    completedAt: undefined,
  }))
}

export const moveTask = async (id: string, to: DateKey): Promise<void> => {
  const repo = createTaskRepository()
  await repo.update(id, (prev) => ({
    ...prev,
    todoAt: to,
  }))
}

export const moveTaskNext = async (id: string): Promise<void> => {
  const repo = createTaskRepository()
  await repo.update(id, (prev) => {
    const day = keyToDayjs(prev.todoAt)
    return {
      ...prev,
      todoAt: dayjsToKey(day.add(1, "day")),
    }
  })
}

export const moveTaskPrev = async (id: string): Promise<void> => {
  const repo = createTaskRepository()
  await repo.update(id, (prev) => {
    const day = keyToDayjs(prev.todoAt)
    return {
      ...prev,
      todoAt: dayjsToKey(day.subtract(1, "day")),
    }
  })
}

export const renameTask = async (id: string, name: string): Promise<void> => {
  const repo = createTaskRepository()
  await repo.update(id, (prev) => ({
    ...prev,
    name,
  }))
}

export const removeTask = async (id: string): Promise<void> => {
  const repo = createTaskRepository()
  await repo.remove(id)
}
