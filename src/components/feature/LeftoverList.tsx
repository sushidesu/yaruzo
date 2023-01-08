import { useCallback, useMemo } from "react"
import { clsx } from "clsx"
import useSWR from "swr/immutable"
import { keyToDayjs, Task } from "../../model/task"
import styles from "./LeftoverList.module.css"
import { createTaskRepository } from "../../infra/kvs/task-repository"
import { leftoversKey } from "../../lib/keys/leftoversKey"
import { Button } from "../ui/Button"
import { moveTaskToday, removeTask } from "../../model/task-usecase"

export const LeftoverList = () => {
  const repo = useMemo(() => createTaskRepository(), [])
  const { data } = useSWR(
    leftoversKey({ completedAt: undefined }),
    ({ completedAt }) => repo.queryByCompletedAt({ completedAt }),
    { suspense: true }
  )
  const leftovers = data as Task[]

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
