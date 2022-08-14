import { clsx } from "clsx"
import styles from "./Footer.module.css"

export const Footer = () => {
  return <div className={clsx(styles["wrapper"])}>{"©️ yaruzo.app"}</div>
}
