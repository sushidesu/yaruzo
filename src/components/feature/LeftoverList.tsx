import { clsx } from "clsx"
import dayjs from "dayjs"
import { useCallback, useMemo, useTransition } from "react"

import { dayjsToKey, keyToDayjs, Task } from "../../model/task"
import { useRefreshTaskListByDate } from "../../model/task-list-by-date"
import {
  useLeftoverTaskList,
  useRefreshLeftoverTaskList,
} from "../../model/task-list-leftovers"
import { useRefreshTaskQuery } from "../../model/task-query"
import { moveTaskToday, removeTask } from "../../model/task-usecase"
import { Button } from "../ui/Button"
import styles from "./LeftoverList.module.css"

export const LeftoverList = () => {
  const [moving, startMoveTask] = useTransition()
  const [removing, startRemoveTask] = useTransition()

  const leftovers = useLeftoverTaskList()
  const refreshLeftovers = useRefreshLeftoverTaskList()
  const refreshTask = useRefreshTaskQuery()
  const refreshDate = useRefreshTaskListByDate()

  const today = useMemo(() => new Date(), [])

  const handleClickToday = useCallback(
    (task: Task) => async (): Promise<void> => {
      await moveTaskToday(task.id)
      startMoveTask(() => {
        refreshLeftovers()
        refreshTask(task.id)
        refreshDate(dayjsToKey(dayjs(today)))
        refreshDate(task.todoAt)
      })
    },
    [today, refreshLeftovers, refreshTask, refreshDate]
  )

  const handleClickRemove = useCallback(
    (task: Task) => async (): Promise<void> => {
      await removeTask(task.id)
      startRemoveTask(() => {
        refreshLeftovers()
        refreshTask(task.id)
        refreshDate(task.todoAt)
      })
    },
    [refreshLeftovers, refreshTask, refreshDate]
  )

  return (
    <div className={clsx(styles["wrapper"])}>
      <h2>Yattenai</h2>
      <div className={clsx(styles["content"])}>
        {leftovers.length <= 0 && <p>No items</p>}
        <ul className={clsx(styles["list"])}>
          {leftovers.map((task) => {
            const todoAt = keyToDayjs(task.todoAt)
            return (
              <li key={task.id} className={clsx(styles["item"])}>
                <div className={clsx(styles["name-with-date"])}>
                  <span>{task.name}</span>
                  <span>{todoAt.format("YYYY/MM/DD")}</span>
                </div>
                <div className={clsx(styles["actions"])}>
                  {!todoAt.isSame(today, "date") && (
                    <Button loading={moving} onClick={handleClickToday(task)}>
                      Today
                    </Button>
                  )}
                  <Button loading={removing} onClick={handleClickRemove(task)}>
                    Remove
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
