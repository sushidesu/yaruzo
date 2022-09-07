import { clsx } from "clsx"
import { Link } from "rocon/react"
import { routes_y } from "../../../app/Router"
import { createDateKey } from "../../../model/task"
import { useYarukotoContext } from "../../../context/YarukotoContext"
import dayjs from "dayjs"
import styles from "./Home.module.css"

export const Home = () => {
  const [yarukotoMap] = useYarukotoContext()

  const today = dayjs()
  const start = today.startOf("month")
  const end = today.endOf("month")
  const month = [...range(start.date(), end.date() + 1)]
    .map((d) => today.set("date", d))
    .map((d) => createDateKey(d.year(), d.month() + 1, d.date()))

  return (
    <div className={clsx(styles["wrapper"])}>
      <div className={clsx(styles["boxes"])}>
        {month.map((key) => {
          const y = yarukotoMap[key]
          return (
            <Link
              key={key}
              route={routes_y.anyRoute}
              match={{ dateKey: key }}
              className={clsx(styles["box-link"])}
            >
              <div className={clsx(styles["box"])}>
                <p>{key}</p>
                <p>{y?.length ?? 0}</p>
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
