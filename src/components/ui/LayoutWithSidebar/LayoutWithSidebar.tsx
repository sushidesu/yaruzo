import { clsx } from "clsx"
import styles from "./LayoutWithSidebar.module.css"

type LayoutWithSidebarProps = {
  header: React.ReactNode
  children: React.ReactNode
  footer: React.ReactNode
  sidebar: React.ReactNode
}

export const LayoutWithSidebar = (props: LayoutWithSidebarProps) => {
  const { header, children, footer, sidebar } = props
  return (
    <div className={clsx(styles["wrapper"])}>
      <header>{header}</header>
      <nav>{sidebar}</nav>
      <main>{children}</main>
      <footer>{footer}</footer>
    </div>
  )
}
