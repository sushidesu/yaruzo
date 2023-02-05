import { clsx } from "clsx"
import dayjs from "dayjs"
import React, { useCallback, useState } from "react"
import { Link } from "rocon/react"

import { routes_y } from "../../../app/Router"
import { DateKey, dayjsToKey, keyToDayjs } from "../../../model/task"
import {
  useRefreshTaskListByDate,
  useTaskListByDate,
} from "../../../model/task-list-by-date"
import { useRefreshLeftoverTaskList } from "../../../model/task-list-leftovers"
import { useRefreshTaskQuery } from "../../../model/task-query"
import { useSortableList } from "../../../model/task-sortable-list"
import {
  createTaskToday,
  moveTaskNext,
  moveTaskPrev,
  removeTask,
  renameTask,
  toggleCompleteTask,
  updateOrders,
} from "../../../model/task-usecase"
import { CompleteButton } from "../../feature/CompleteButton"
import { Button } from "../../ui/Button"
import styles from "./Yarukoto.module.css"

type YarukotoProps = {
  dateKey: DateKey
}

export const Yarukoto = (props: YarukotoProps) => {
  const { dateKey } = props
  const today = keyToDayjs(dateKey)
  const prevDay = today.subtract(1, "day")
  const nextDay = today.add(1, "day")
  // 前後1日も含めて取得する
  const prevDayTasks = useTaskListByDate(dayjsToKey(prevDay))
  const todayTasks = useSortableList(dayjsToKey(today), async (newList) => {
    await updateOrders(newList.map((t) => t.id))
  })
  const nextDayTasks = useTaskListByDate(dayjsToKey(nextDay))
  const refreshTasks = useRefreshTaskListByDate()
  const refreshTask = useRefreshTaskQuery()
  const refreshLeftovers = useRefreshLeftoverTaskList()

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
      if (text === "") return

      await createTaskToday(text)
      refreshTasks(dayjsToKey(today))
      setText("")
    },
    [text, today, refreshTasks]
  )

  const handleRemove = useCallback(
    (id: string) => async () => {
      await removeTask(id)
      refreshTasks(dayjsToKey(today))
      refreshLeftovers()
    },
    [refreshTasks, refreshLeftovers, today]
  )

  const handleToggleComplete = useCallback(
    (id: string) => async () => {
      await toggleCompleteTask(id)
      refreshTask(id)
      refreshLeftovers()
    },
    [refreshTask]
  )

  const handleRename = useCallback(
    (id: string) => async (e: React.FocusEvent<HTMLParagraphElement>) => {
      if (e.currentTarget.textContent !== null) {
        await renameTask(id, e.currentTarget.textContent)
        refreshTask(id)
      }
    },
    [refreshTask]
  )

  const handleClickMoveNext = useCallback(
    (id: string) => async () => {
      await moveTaskNext(id)
      refreshTasks(dayjsToKey(today))
      refreshTasks(dayjsToKey(nextDay))
      refreshTask(id)
    },
    [refreshTasks, refreshTask, today, nextDay]
  )

  const handleClickMovePrev = useCallback(
    (id: string) => async () => {
      await moveTaskPrev(id)
      refreshTasks(dayjsToKey(prevDay))
      refreshTasks(dayjsToKey(today))
      refreshTask(id)
    },
    [refreshTasks, refreshTask, prevDay, today]
  )

  const isToday = dayjs().isSame(today, "date")

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
        <form className={styles["form"]} onSubmit={handleSubmit}>
          <input value={text} onChange={handleChange} />
          <Button variant={"primary"} type={"submit"}>
            ADD
          </Button>
        </form>
      </div>

      <div className={clsx(styles["day"])}>
        <p className={clsx(styles["day-header"])}>{prevDay.format("M/D")}</p>
        <ul className={clsx(styles["items"])}>
          {prevDayTasks.map((task) => (
            <li key={task.id}>
              <ItemNotNow
                name={task.name}
                completedAt={task.completedAt}
                onClickCheck={handleToggleComplete(task.id)}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className={clsx(styles["day"])}>
        <p
          className={clsx(
            styles["day-header"],
            styles["main"],
            isToday && styles["today"]
          )}
        >
          {isToday ? "Today" : today.format("M/D")}
        </p>
        <ul className={clsx(styles["items"])}>
          {todayTasks.map(({ item: task, props, dragging }) => {
            return (
              <li
                key={task.id}
                className={clsx(dragging && styles["dragging"])}
                {...props}
              >
                <Item
                  name={task.name}
                  completedAt={task.completedAt}
                  onClickRemove={handleRemove(task.id)}
                  onClickCheck={handleToggleComplete(task.id)}
                  onClickMoveNext={handleClickMoveNext(task.id)}
                  onClickMovePrev={handleClickMovePrev(task.id)}
                  onBlurName={handleRename(task.id)}
                />
              </li>
            )
          })}
        </ul>
      </div>

      <div className={clsx(styles["day"])}>
        <p className={clsx(styles["day-header"])}>{nextDay.format("M/D")}</p>
        <ul className={clsx(styles["items"])}>
          {nextDayTasks.map((task) => (
            <li key={task.id}>
              <ItemNotNow
                name={task.name}
                completedAt={task.completedAt}
                onClickCheck={handleToggleComplete(task.id)}
              />
            </li>
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
  onClickCheck: () => void
  onClickMoveNext: () => void
  onClickMovePrev: () => void
  onBlurName: React.FocusEventHandler<HTMLParagraphElement>
}

const Item = (props: ItemProps): JSX.Element => {
  const {
    name,
    completedAt,
    onClickRemove,
    onClickCheck,
    onClickMoveNext,
    onClickMovePrev,
    onBlurName,
  } = props
  const done = completedAt !== undefined && completedAt <= Date.now()
  return (
    <div className={clsx(styles["item"])}>
      <CompleteButton complete={done} onClick={onClickCheck} />
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
        <Button onClick={onClickRemove}>REMOVE</Button>
        <Button
          onClick={onClickMovePrev}
          aria-label={"Move task to the previous day"}
        >
          ←
        </Button>
        <Button
          onClick={onClickMoveNext}
          aria-label={"Move task to the next day"}
        >
          →
        </Button>
      </div>
      <DragHere />
    </div>
  )
}

type ItemNotNowProps = {
  name: string
  completedAt: number | undefined
  onClickCheck: () => void
}
const ItemNotNow = (props: ItemNotNowProps): JSX.Element => {
  const { name, completedAt, onClickCheck } = props
  const done = completedAt !== undefined && completedAt <= Date.now()
  return (
    <div
      className={clsx(
        styles["item"],
        done && styles["completed"],
        styles["not-now"]
      )}
    >
      <CompleteButton complete={done} onClick={onClickCheck} />
      <p>{name}</p>
    </div>
  )
}

const DragHere = (): JSX.Element => {
  return (
    <div aria-label={"Drag here"} className={clsx(styles["drag"])}>
      <div />
      <div />
      <div />
    </div>
  )
}
