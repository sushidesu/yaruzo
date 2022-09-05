import { useState, useCallback, useMemo } from "react"
import { clsx } from "clsx"
import {
  DateKey,
  generateId,
  getDate,
  createDateKey,
} from "../../../model/task"
import { useYarukotoContext } from "../../../context/YarukotoContext"

import styles from "./Yarukoto.module.css"

type YarukotoProps = {
  dateKey: DateKey
}

export const Yarukoto = (props: YarukotoProps) => {
  const { dateKey } = props
  const [yarukotoMap, dispatch] = useYarukotoContext()
  const yarukotos = useMemo(
    () => yarukotoMap[dateKey] ?? [],
    [yarukotoMap, dateKey]
  )

  const [text, setText] = useState("")

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      setText(e.target.value)
    },
    []
  )

  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault()
      console.log("submit")
      const id = generateId()
      dispatch({
        type: "add",
        id,
        key: dateKey,
        name: text,
      })
      setText("")
    },
    [text]
  )

  const handleRemove = useCallback(
    (id: string) => () => {
      dispatch({
        type: "remove",
        key: dateKey,
        id,
      })
    },
    []
  )

  const handleComplete = useCallback(
    (id: string) => () => {
      console.log("click!")
      dispatch({
        type: "complete",
        key: dateKey,
        id,
      })
    },
    []
  )

  const handleClickMoveNext = useCallback(
    (id: string) => () => {
      const { y, m, d } = getDate(dateKey)
      dispatch({
        type: "move",
        id,
        from: dateKey,
        to: createDateKey(y, m, d + 1),
      })
    },
    []
  )

  const handleClickMovePrev = useCallback(
    (id: string) => () => {
      const { y, m, d } = getDate(dateKey)
      dispatch({
        type: "move",
        id,
        from: dateKey,
        to: createDateKey(y, m, d - 1),
      })
    },
    []
  )

  return (
    <div className={clsx(styles["wrapper"])}>
      <h1>{dateKey}</h1>
      <form onSubmit={handleSubmit}>
        <input value={text} onChange={handleChange} />
        <button type={"submit"}>ADD</button>
      </form>
      <ul className={clsx(styles["items"])}>
        {yarukotos.map((yarukoto) =>
          yarukoto.todoAt === dateKey ? (
            <Item
              key={yarukoto.id}
              name={yarukoto.name}
              completedAt={yarukoto.completedAt}
              onClickRemove={handleRemove(yarukoto.id)}
              onClickComplete={handleComplete(yarukoto.id)}
              onClickMoveNext={handleClickMoveNext(yarukoto.id)}
              onClickMovePrev={handleClickMovePrev(yarukoto.id)}
            />
          ) : (
            <ItemNotNow
              key={yarukoto.id}
              name={yarukoto.name}
              completedAt={yarukoto.completedAt}
              onClickComplete={handleComplete(yarukoto.id)}
            />
          )
        )}
      </ul>
    </div>
  )
}

type ItemProps = {
  name: string
  completedAt: number | undefined
  onClickRemove: () => void
  onClickComplete: () => void
  onClickMoveNext: () => void
  onClickMovePrev: () => void
}

const Item = (props: ItemProps): JSX.Element => {
  const {
    name,
    completedAt,
    onClickRemove,
    onClickComplete,
    onClickMoveNext,
    onClickMovePrev,
  } = props
  const done = completedAt !== undefined && completedAt <= Date.now()
  return (
    <li className={clsx(styles["item"], done && styles["completed"])}>
      <p>{name}</p>
      <div className={clsx(styles["item-actions"])}>
        {!done && <button onClick={onClickComplete}>DONE</button>}
        <button onClick={onClickRemove}>REMOVE</button>
        <button onClick={onClickMovePrev}>←</button>
        <button onClick={onClickMoveNext}>→</button>
      </div>
    </li>
  )
}

type ItemNotNowProps = {
  name: string
  completedAt: number | undefined
  onClickComplete: () => void
}
const ItemNotNow = (props: ItemNotNowProps): JSX.Element => {
  const { name, completedAt, onClickComplete } = props
  const done = completedAt !== undefined && completedAt <= Date.now()
  return (
    <li
      className={clsx(
        styles["item"],
        done && styles["completed"],
        styles["not-now"]
      )}
    >
      <p>{name}</p>
      <div className={clsx(styles["item-actions"])}>
        {!done && <button onClick={onClickComplete}>DONE</button>}
      </div>
    </li>
  )
}
