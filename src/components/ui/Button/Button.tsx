import clsx from "clsx"
import { ComponentProps, forwardRef, ForwardRefRenderFunction } from "react"

import styles from "./Button.module.css"

type ButtonProps = {
  variant?: "default" | "primary" | "secondary" | "danger"
} & Omit<ComponentProps<"button">, "className">

const _Button: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  props,
  ref
): JSX.Element => {
  const { variant, ...rest } = props
  return (
    <button
      className={clsx(styles["wrapper"], styles[variant ?? "default"])}
      ref={ref}
      {...rest}
    />
  )
}

export const Button = forwardRef(_Button)
