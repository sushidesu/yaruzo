import { clsx } from "clsx"
import { useCallback, useMemo } from "react"

import { useLeftoverTaskList } from "../../model/leftover-task-list-query"
import { keyToDayjs } from "../../model/task"
import { moveTaskToday, removeTask } from "../../model/task-usecase"
import { Button } from "../ui/Button"
import styles from "./LeftoverList.module.css"

export const LeftoverList = () => {
  const leftovers = useLeftoverTaskList()

  const today = useMemo(() => new Date(), [])

  const handleClickToday = useCallback(
    (id: string) => async (): Promise<void> => {
      await moveTaskToday(id)
    },
    []
  )

  const handleClickRemove = useCallback(
    (id: string) => async (): Promise<void> => {
      await removeTask(id)
    },
    []
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
                    <Button onClick={handleClickToday(task.id)}>Today</Button>
                  )}
                  <Button onClick={handleClickRemove(task.id)}>Remove</Button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
