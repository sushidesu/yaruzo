export const equals = <T extends { id: string }>(
  prev: T[],
  next: T[]
): boolean => {
  const p = prev.reduce((acc, cur) => acc + cur.id, "")
  const n = next.reduce((acc, cur) => acc + cur.id, "")
  return p === n
}
