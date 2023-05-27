import clsx from "clsx"
import { ComponentProps, forwardRef, ForwardRefRenderFunction } from "react"

import styles from "./Button.module.css"

type ButtonProps = {
  variant?: "default" | "primary" | "secondary" | "danger"
  loading?: boolean | undefined
} & Omit<ComponentProps<"button">, "className">

const _Button: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  { variant, loading = false, ...rest },
  ref
): JSX.Element => {
  return (
    <button
      className={clsx(styles["wrapper"], styles[variant ?? "default"])}
      disabled={rest.disabled || loading}
      ref={ref}
      {...rest}
    />
  )
}

export const Button = forwardRef(_Button)
