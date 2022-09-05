import { clsx } from "clsx"
import { Link } from "rocon/react"
import { routes_y } from "../../../app/Router"
import { createDateKey } from "../../../model/task"
import { useYarukotoContext } from "../../../context/YarukotoContext"
import styles from "./Home.module.css"

export const Home = () => {
  const [yarukotoMap] = useYarukotoContext()
  const month = Array.from({ length: 30 }).map((_, i) =>
    createDateKey(2022, 8, i + 1)
  )
  console.log("render home")
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
