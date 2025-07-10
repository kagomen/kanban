import { Status } from "./types"

export const STATUS_MAP = {
  todo: { label: "Todo" },
  doing: { label: "Doing" },
  done: { label: "Done" },
} as const

export const statuses = Object.keys(STATUS_MAP) as Status[]
