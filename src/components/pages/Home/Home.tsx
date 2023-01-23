import { clsx } from "clsx"
import { Link } from "rocon/react"
import { routes_y } from "../../../app/Router"
import { dayjsToKey } from "../../../model/task"
import dayjs from "dayjs"
import styles from "./Home.module.css"
import { useTaskListByMonth } from "../../../model/task-list-by-month-selector"
import {
  useChangeSelectedMonth,
  useSelectedMonth,
} from "../../../model/selected-month-atom"
import { Button } from "../../ui/Button"

export const Home = () => {
  const today = dayjs()

  const selected = dayjs(useSelectedMonth())
  const { prev, next } = useChangeSelectedMonth()

  const tasks = useTaskListByMonth()

  const start = selected.startOf("month")
  const end = selected.endOf("month")
  const month = [...range(start.date(), end.date() + 1)].map((d) =>
    selected.set("date", d)
  )

  return (
    <div className={clsx(styles["wrapper"])}>
      <div className={clsx(styles["selected-month"])}>
        <Button onClick={prev}>Prev</Button>
        <h2 className={clsx(styles["heading"])}>
          {selected.format("MMMM YYYY")}
        </h2>
        <Button onClick={next}>Next</Button>
      </div>
      <div className={clsx(styles["boxes"])}>
        {month.map((day) => {
          const key = dayjsToKey(day)
          const isToday = day.isSame(today, "date")
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
