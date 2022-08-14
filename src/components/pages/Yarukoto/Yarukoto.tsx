type YarukotoProps = {
  dateKey: string
}

export const Yarukoto = (props: YarukotoProps) => {
  const { dateKey } = props
  return <div>{`hello: ${dateKey}`}</div>
}
