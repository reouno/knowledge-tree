import { Entity } from '~/models/base'

export interface Tweet extends Entity {
  message: string
  userId: string
  roomId: string
}
