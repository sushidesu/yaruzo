import { clsx } from "clsx"
import styles from "./Header.module.css"

export const Header = () => {
  return (
    <div className={clsx(styles["wrapper"])}>
      <h1>Yaruzo</h1>
    </div>
  )
}
