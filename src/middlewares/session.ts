import { SessionFlavor } from 'grammy'
import Context from '@/models/Context'

export enum State {
  getName = 'getName',
  getPhone = 'getPhone',
  default = 'default',
}

export interface SessionData {
  userId: number
  state?: State
}

export type BotContext = Context & SessionFlavor<SessionData>
