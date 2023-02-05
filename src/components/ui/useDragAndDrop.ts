import type React from "react"
import { useCallback, useState } from "react"

export const useDragAndDrop = <T extends HTMLElement, P extends { id: string }>(
  list: P[],
  onDropItem: (sorted: P[]) => Promise<P[] | undefined>
) => {
  const [dragTarget, setDragTarget] = useState<number | undefined>()
  const [previewList, swap, reset] = useSortableList(list)

  const onDragStart = useCallback<(i: number) => React.DragEventHandler<T>>(
    (i) => () => {
      setDragTarget(i)
    },
    []
  )

  const onDragEnd = useCallback<(i: number) => React.DragEventHandler<T>>(
    () => () => {
      setDragTarget(undefined)
    },
    []
  )

  const onDragOver = useCallback<(i: number) => React.DragEventHandler<T>>(
    () => (e) => {
      e.preventDefault()
    },
    []
  )

  const onDragEnter = useCallback<(i: number) => React.DragEventHandler<T>>(
    (i) => () => {
      if (dragTarget === undefined) return
      if (dragTarget === i) return
      swap(dragTarget, i)
      setDragTarget(i)
    },
    [swap, dragTarget]
  )

  const onDrop = useCallback<(i: number) => React.DragEventHandler<T>>(
    () => async () => {
      console.log("drop!")
      const invalid = list.length !== previewList.length
      const equal = equals(list, previewList)
      if (invalid || equal) {
        console.log("equal or invalid", { updated: invalid, equal })
        return
      }
      console.log("swap!")
      const newList = await onDropItem(previewList)
      if (newList) {
        reset(newList)
      }
    },
    [list, previewList, onDropItem, reset]
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

  const result: P[] = previewList

  return [
    result.map((item, i) => ({
      item,
      props: props(i),
      dragging: dragTarget === i,
    })),
    reset,
  ] as const
}

const useSortableList = <T>(
  init: T[]
): [T[], (left: number, right: number) => void, (newList: T[]) => void] => {
  const [list, setList] = useState<T[]>(init)

  const reset = useCallback((newList: T[]): void => {
    setList(newList)
  }, [])

  const swap = useCallback((left: number, right: number) => {
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
  }, [])

  return [list, swap, reset]
}

const equals = <T extends { id: string }>(prev: T[], next: T[]): boolean => {
  const p = prev.reduce((acc, cur) => acc + cur.id, "")
  const n = next.reduce((acc, cur) => acc + cur.id, "")
  return p === n
}
