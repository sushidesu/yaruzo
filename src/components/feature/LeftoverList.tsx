import { useMemo } from "react"
import { clsx } from "clsx"
import useSWR from "swr/immutable"
import type { Task } from "../../model/task"
import styles from "./LeftoverList.module.css"
import { createTaskRepository } from "../../infra/kvs/task-repository"
import { leftoversKey } from "../../lib/keys/leftoversKey"

export const LeftoverList = () => {
  const repo = useMemo(() => createTaskRepository(), [])
  const { data } = useSWR(
    leftoversKey({ completedAt: undefined }),
    ({ completedAt }) => repo.queryByCompletedAt({ completedAt }),
    { suspense: true }
  )
  const leftovers = data as Task[]

  return (
    <div className={clsx(styles["wrapper"])}>
      <h2>Leftovers</h2>
      <div className={clsx(styles["content"])}>
        {leftovers.length <= 0 && <p>No items</p>}
        <div className={clsx(styles["list"])}>
          {leftovers.map((task) => (
            <div key={task.id}>{task.name}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
