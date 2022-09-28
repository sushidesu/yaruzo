import type React from "react"
import { useState, useCallback } from "react"

type Swap<T> = [T, T]

export const useDragAndDrop = <T extends HTMLElement, P>(
  list: P[],
  onDropItem: (swaps: Swap<P>[]) => Promise<P[] | undefined>
) => {
  const [dragTarget, setDragTarget] = useState<number | undefined>()
  const [previewList, swap, reset] = useSortableList(list)

  const onDragStart = useCallback<(i: number) => React.DragEventHandler<T>>(
    (i) => (e) => {
      setDragTarget(i)
    },
    []
  )

  const onDragEnd = useCallback<(i: number) => React.DragEventHandler<T>>(
    (i) => (e) => {
      setDragTarget(undefined)
    },
    []
  )

  const onDragOver = useCallback<(i: number) => React.DragEventHandler<T>>(
    (i) => (e) => {
      e.preventDefault()
    },
    []
  )

  const onDragEnter = useCallback<(i: number) => React.DragEventHandler<T>>(
    (i) => (e) => {
      if (dragTarget === undefined) return
      if (dragTarget === i) return
      swap(dragTarget, i)
      setDragTarget(i)
    },
    [dragTarget]
  )

  const onDrop = useCallback<(i: number) => React.DragEventHandler<T>>(
    (i) => async () => {
      console.log("drop!")
      const s = swaps(list, previewList)
      if (s.length <= 0) return
      console.log("swap!")
      const newList = await onDropItem(s)
      if (newList) {
        reset(newList)
      }
    },
    []
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

const swaps = <T>(prev: T[], next: T[]): Swap<T>[] => {
  if (prev.length !== next.length) return []
  return []
}
