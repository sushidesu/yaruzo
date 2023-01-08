import type { Timestamp } from "../../model/task"

export const leftoversKey = (query: { completedAt: Timestamp | undefined }) =>
  ({
    key: "leftovers",
    ...query,
  } as const)
