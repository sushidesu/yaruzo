import { clsx } from "clsx"

import styles from "./Layout.module.css"

type LayoutProps = {
  header: React.ReactNode
  children: React.ReactNode
  footer: React.ReactNode
}

export const Layout = (props: LayoutProps) => {
  const { header, children, footer } = props
  return (
    <div className={clsx(styles["wrapper"])}>
      <header>{header}</header>
      <main>{children}</main>
      <footer>{footer}</footer>
    </div>
  )
}
