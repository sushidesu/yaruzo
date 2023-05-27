import clsx from "clsx"

import styles from "./CompleteButton.module.css"

type CompleteButtonProps = {
  complete: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined
  loading?: boolean | undefined
}

export const CompleteButton = (props: CompleteButtonProps): JSX.Element => {
  const { complete, onClick, loading } = props
  return (
    <button
      disabled={loading}
      aria-label={complete ? "Revert to incomplete" : "Complete task"}
      className={clsx(styles["wrapper"], complete && styles["complete"])}
      onClick={onClick}
    />
  )
}
