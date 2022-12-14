import styles from "./CompleteButton.module.css"
import clsx from "clsx"

type CompleteButtonProps = {
  complete: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined
}

export const CompleteButton = (props: CompleteButtonProps): JSX.Element => {
  const { complete, onClick } = props
  return (
    <button
      aria-label={complete ? "Revert to incomplete" : "Complete task"}
      className={clsx(styles["wrapper"], complete && styles["complete"])}
      onClick={onClick}
    />
  )
}
