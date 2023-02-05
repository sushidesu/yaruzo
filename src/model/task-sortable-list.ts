import React, { useCallback } from "react"
import { atomFamily, selectorFamily, useRecoilState } from "recoil"

import type { DateKey, Task } from "./task"
import { taskListByDateQuery } from "./task-list-by-date"

export const taskSortableList = atomFamily<Task[], DateKey>({
  key: "taskSortableList",
  default: selectorFamily({
    key: "taskSortableList/default",
    get:
      (date) =>
      ({ get }) => {
        console.log("default", date)
        return get(taskListByDateQuery(date))
      },
  }),
})

const dragTarget = atomFamily<number | undefined, DateKey>({
  key: "dragTarget",
  default: undefined,
})

type SortableItem<T, U> = {
  item: T
  dragging: boolean
  props: {
    draggable: boolean
    onDragStart: React.DragEventHandler<U>
    onDragEnd: React.DragEventHandler<U>
    onDragEnter: React.DragEventHandler<U>
    onDragOver: React.DragEventHandler<U>
    onDrop: React.DragEventHandler<U>
  }
}

export const useSortableList = <U extends HTMLElement>(
  date: DateKey,
  onDropItem?: (sorted: Task[]) => Promise<void> | void
): SortableItem<Task, U>[] => {
  const [target, setTarget] = useRecoilState(dragTarget(date))
  const [list, setList] = useRecoilState(taskSortableList(date))

  const swap = useCallback(
    (left: number, right: number) => {
      setList((prev) => {
        const l = prev[left]
        const r = prev[right]
        return prev.flatMap((item, i) => {
          if (i === left) {
            return r ? [r] : []
          } else if (i === right) {
            return l ? [l] : []
          } else {
            return [item]
          }
        })
      })
    },
    [setList]
  )

  const onDragStart = useCallback<(i: number) => React.DragEventHandler<U>>(
    (i) => () => {
      setTarget(i)
    },
    [setTarget]
  )

  const onDragEnd = useCallback<(i: number) => React.DragEventHandler<U>>(
    () => () => {
      setTarget(undefined)
    },
    [setTarget]
  )

  const onDragOver = useCallback<(i: number) => React.DragEventHandler<U>>(
    () => (e) => {
      e.preventDefault()
    },
    []
  )

  const onDragEnter = useCallback<(i: number) => React.DragEventHandler<U>>(
    (i) => () => {
      if (target === undefined) return
      if (target === i) return
      swap(target, i)
      setTarget(i)
    },
    [swap, target, setTarget]
  )

  const onDrop = useCallback<(i: number) => React.DragEventHandler<U>>(
    () => async () => {
      await onDropItem?.(list)
    },
    [list, onDropItem]
  )

  const props = useCallback(
    (index: number) => ({
      draggable: true,
      onDragStart: onDragStart(index),
      onDragEnd: onDragEnd(index),
      onDragEnter: onDragEnter(index),
      onDragOver: onDragOver(index),
      onDrop: onDrop(index),
    }),
    [onDragStart, onDragEnd, onDragEnter, onDragOver, onDrop]
  )

  return list.map((item, i) => ({
    item,
    props: props(i),
    dragging: target === i,
  }))
}
