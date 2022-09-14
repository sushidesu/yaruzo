import React, { useState, useCallback } from "react"
import { clsx } from "clsx"
import { DateKey, dayjsToKey, keyToDayjs } from "../../../model/task"

import styles from "./Yarukoto.module.css"
import {
  createTaskToday,
  completeTask,
  uncompleteTask,
  removeTask,
  renameTask,
  moveTaskPrev,
  moveTaskNext,
} from "../../../model/task-usecase"
import { useTasks } from "../../../model/useTasks"
import { Link } from "rocon/react"
import { routes_y } from "../../../app/Router"
import { CompleteButton } from "../../feature/CompleteButton"

type YarukotoProps = {
  dateKey: DateKey
}

export const Yarukoto = (props: YarukotoProps) => {
  const { dateKey } = props
  const today = keyToDayjs(dateKey)
  const prevDay = today.subtract(1, "day")
  const nextDay = today.add(1, "day")
  // 前後1日も含めて取得する
  const [tasks, mutate] = useTasks({
    gte: dayjsToKey(prevDay),
    lt: dayjsToKey(nextDay.add(1, "day")),
  })

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
      await createTaskToday(text)
      await mutate()
      setText("")
    },
    [text, mutate]
  )

  const handleRemove = useCallback(
    (id: string) => async () => {
      await removeTask(id)
      await mutate()
    },
    [mutate]
  )

  const handleComplete = useCallback(
    (id: string) => async () => {
      await completeTask(id)
      await mutate()
    },
    [mutate]
  )

  const handleUncomplete = useCallback(
    (id: string) => async () => {
      await uncompleteTask(id)
      await mutate()
    },
    [mutate]
  )

  const handleRename = useCallback(
    (id: string) => async (e: React.FocusEvent<HTMLParagraphElement>) => {
      if (e.currentTarget.textContent !== null) {
        await renameTask(id, e.currentTarget.textContent)
      }
    },
    []
  )

  const handleClickMoveNext = useCallback(
    (id: string) => async () => {
      await moveTaskNext(id)
      await mutate()
    },
    [mutate]
  )

  const handleClickMovePrev = useCallback(
    (id: string) => async () => {
      await moveTaskPrev(id)
      await mutate()
    },
    [mutate]
  )

  return (
    <div className={clsx(styles["wrapper"])}>
      <div>
        <div className={clsx(styles["heading"])}>
          <Link
            route={routes_y.anyRoute}
            match={{ dateKey: dayjsToKey(prevDay) }}
          >
            Prev
          </Link>
          <h1>{today.format("MMMM D, YYYY")}</h1>
          <Link
            route={routes_y.anyRoute}
            match={{ dateKey: dayjsToKey(nextDay) }}
          >
            Next
          </Link>
        </div>
        <form onSubmit={handleSubmit}>
          <input value={text} onChange={handleChange} />
          <button type={"submit"}>ADD</button>
        </form>
      </div>

      <div className={clsx(styles["day"])}>
        <p className={clsx(styles["day-header"])}>{prevDay.format("M/D")}</p>
        <ul className={clsx(styles["items"])}>
          {tasks
            .filter((t) => t.todoAt === dayjsToKey(prevDay))
            .map((task) => (
              <ItemNotNow
                key={task.id}
                name={task.name}
                completedAt={task.completedAt}
                onClickComplete={handleComplete(task.id)}
                onClickUncomplete={handleUncomplete(task.id)}
              />
            ))}
        </ul>
      </div>

      <div className={clsx(styles["day"])}>
        <p className={clsx(styles["day-header"], styles["today"])}>{"Today"}</p>
        <ul className={clsx(styles["items"])}>
          {tasks
            .filter((t) => t.todoAt === dayjsToKey(today))
            .map((task) => (
              <Item
                key={task.id}
                name={task.name}
                completedAt={task.completedAt}
                onClickRemove={handleRemove(task.id)}
                onClickComplete={handleComplete(task.id)}
                onClickUncomplete={handleUncomplete(task.id)}
                onClickMoveNext={handleClickMoveNext(task.id)}
                onClickMovePrev={handleClickMovePrev(task.id)}
                onBlurName={handleRename(task.id)}
              />
            ))}
        </ul>
      </div>

      <div className={clsx(styles["day"])}>
        <p className={clsx(styles["day-header"])}>{nextDay.format("M/D")}</p>
        <ul className={clsx(styles["items"])}>
          {tasks
            .filter((t) => t.todoAt === dayjsToKey(nextDay))
            .map((task) => (
              <ItemNotNow
                key={task.id}
                name={task.name}
                completedAt={task.completedAt}
                onClickComplete={handleComplete(task.id)}
                onClickUncomplete={handleUncomplete(task.id)}
              />
            ))}
        </ul>
      </div>
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
  onBlurName: React.FocusEventHandler<HTMLParagraphElement>
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
    onBlurName,
  } = props
  const done = completedAt !== undefined && completedAt <= Date.now()
  return (
    <li className={clsx(styles["item"])}>
      <CompleteButton
        complete={done}
        onClick={done ? onClickUncomplete : onClickComplete}
      />
      {done ? (
        <p className={clsx(styles["item-name"], styles["completed"])}>{name}</p>
      ) : (
        <p
          className={clsx(styles["item-name"])}
          contentEditable
          onBlur={onBlurName}
          suppressContentEditableWarning
        >
          {name}
        </p>
      )}
      <div className={clsx(styles["item-actions"])}>
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
