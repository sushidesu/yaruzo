import { clsx } from "clsx"
import type { Task } from "../../model/task"
import styles from "./LeftoverList.module.css"

export const LeftoverList = () => {
  const leftOvers: Task[] = []

  return (
    <div className={clsx(styles["wrapper"])}>
      <h2>Leftovers</h2>
      <div className={clsx(styles["content"])}>
        {leftOvers.length <= 0 && <p>No items</p>}
        <div className={clsx(styles["list"])}>
          {leftOvers.map((task) => (
            <div key={task.id}>{task.name}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
