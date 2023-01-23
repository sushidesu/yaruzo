import { selector, useRecoilValue } from "recoil"
import { createTaskRepository } from "../infra/kvs/task-repository"
import { dayjsToKey, Task } from "./task"
import { selectedMonthAtom } from "./selected-month-atom"
import dayjs from "dayjs"

const taskListByMonthSelector = selector<Task[]>({
  key: "taskListByMonthSelector",
  get: async ({ get }) => {
    const taskRepository = createTaskRepository()

    const selectedMonth = get(selectedMonthAtom)
    const selected = dayjs(selectedMonth)

    const start = selected.startOf("month")
    const end = selected.endOf("month")

    const tasks = await taskRepository.query({
      gte: dayjsToKey(start),
      lt: dayjsToKey(end),
    })

    return tasks
  },
})

export const useTaskListByMonth = (): Task[] => {
  return useRecoilValue(taskListByMonthSelector)
}
