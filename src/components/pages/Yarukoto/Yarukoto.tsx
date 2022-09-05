import { useState, useCallback } from "react"
import { clsx } from "clsx"
import { DateKey, generateId, now, today } from "../../../model/task"

import styles from "./Yarukoto.module.css"
import {
  useTasks,
  createTask,
  completeTask,
  uncompleteTask,
} from "../../../context/yarukoto"

type YarukotoProps = {
  dateKey: DateKey
}

export const Yarukoto = (props: YarukotoProps) => {
  const { dateKey } = props
  const [tasks, mutate] = useTasks()

  const [text, setText] = useState("")

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      setText(e.target.value)
    },
    []
  )

  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    async (e) => {
      e.preventDefault()
      console.log("submit")
      const id = generateId()
      await createTask({
        id,
        name: text,
        todoAt: today(),
        createdAt: now(),
        completedAt: undefined,
      })
      await mutate()
      setText("")
    },
    [text]
  )

  const handleRemove = useCallback(
    (_id: string) => () => {
      console.log("remove")
      //      dispatch({
      //        type: "remove",
      //        key: dateKey,
      //        id,
      //      })
    },
    []
  )

  const handleComplete = useCallback(
    (id: string) => async () => {
      await completeTask(id)
      await mutate()
    },
    []
  )

  const handleUncomplete = useCallback(
    (id: string) => async () => {
      await uncompleteTask(id)
      await mutate()
    },
    []
  )

  const handleClickMoveNext = useCallback(
    (_id: string) => () => {
      //      const { y, m, d } = getDate(dateKey)
      //      dispatch({
      //        type: "move",
      //        id,
      //        from: dateKey,
      //        to: createDateKey(y, m, d + 1),
      //      })
    },
    []
  )

  const handleClickMovePrev = useCallback(
    (_id: string) => () => {
      //      const { y, m, d } = getDate(dateKey)
      //      dispatch({
      //        type: "move",
      //        id,
      //        from: dateKey,
      //        to: createDateKey(y, m, d - 1),
      //      })
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
        {tasks.map((task) =>
          task.todoAt === dateKey ? (
            <Item
              key={task.id}
              name={task.name}
              completedAt={task.completedAt}
              onClickRemove={handleRemove(task.id)}
              onClickComplete={handleComplete(task.id)}
              onClickUncomplete={handleUncomplete(task.id)}
              onClickMoveNext={handleClickMoveNext(task.id)}
              onClickMovePrev={handleClickMovePrev(task.id)}
            />
          ) : (
            <ItemNotNow
              key={task.id}
              name={task.name}
              completedAt={task.completedAt}
              onClickComplete={handleComplete(task.id)}
              onClickUncomplete={handleUncomplete(task.id)}
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
  onClickUncomplete: () => void
  onClickMoveNext: () => void
  onClickMovePrev: () => void
}

const Item = (props: ItemProps): JSX.Element => {
  const {
    name,
    completedAt,
    onClickRemove,
    onClickComplete,
    onClickUncomplete,
    onClickMoveNext,
    onClickMovePrev,
  } = props
  const done = completedAt !== undefined && completedAt <= Date.now()
  return (
    <li className={clsx(styles["item"], done && styles["completed"])}>
      <p>{name}</p>
      <div className={clsx(styles["item-actions"])}>
        {!done && <button onClick={onClickComplete}>DONE</button>}
        {done && <button onClick={onClickUncomplete}>UNDO</button>}
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
  onClickUncomplete: () => void
}
const ItemNotNow = (props: ItemNotNowProps): JSX.Element => {
  const { name, completedAt, onClickComplete, onClickUncomplete } = props
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
        {done && <button onClick={onClickUncomplete}>UNDO</button>}
      </div>
    </li>
  )
}
