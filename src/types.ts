import { STATUS_MAP } from "./constants.js"

export interface Task {
  id: string
  content: string
  status: Status
}

export type Status = keyof typeof STATUS_MAP
