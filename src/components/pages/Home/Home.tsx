import { clsx } from "clsx"
import { Link } from "rocon/react"
import { routes_y } from "../../../app/Router"
import { dayjsToKey } from "../../../model/task"
import { useTasks } from "../../../model/useTasks"
import dayjs from "dayjs"
import styles from "./Home.module.css"

export const Home = () => {
  const [tasks] = useTasks()

  const today = dayjs()
  const start = today.startOf("month")
  const end = today.endOf("month")
  const month = [...range(start.date(), end.date() + 1)].map((d) =>
    today.set("date", d)
  )

  return (
    <div className={clsx(styles["wrapper"])}>
      <div>
        <h2 className={clsx(styles["heading"])}>{today.format("MMMM YYYY")}</h2>
      </div>
      <div className={clsx(styles["boxes"])}>
        {month.map((day) => {
          const key = dayjsToKey(day)
          const isToday = day.isSame(today)
          const todo = tasks.filter((t) => t.todoAt === key)
          const done = todo.filter((t) => t.completedAt !== undefined)
          return (
            <Link
              key={key}
              route={routes_y.anyRoute}
              match={{ dateKey: key }}
              className={clsx(styles["box-link"])}
            >
              <div className={clsx(styles["box"], isToday && styles["today"])}>
                <div className={clsx(styles["box-heading"])}>
                  <p>{day.date()}</p>
                </div>
                <div className={clsx(styles["box-content"])}>
                  {todo.length ? (
                    <p>{`${done.length}/${todo.length}`}</p>
                  ) : null}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function* range(start: number, end: number): Generator<number, void, unknown> {
  for (let i = start; i < end; i++) {
    yield i
  }
}
