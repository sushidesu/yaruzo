import { clsx } from "clsx"
import { Link } from "rocon/react"

import { routes } from "../../../app/Router"
import styles from "./Header.module.css"

export const Header = () => {
  return (
    <div className={clsx(styles["wrapper"])}>
      <Link route={routes.exactRoute} className={clsx(styles["title"])}>
        <h1>Yaruzo</h1>
      </Link>
    </div>
  )
}
