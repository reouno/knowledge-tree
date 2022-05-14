import { Entity } from '~/models/base'
import { Mark } from '~/models/mark'

export interface Tweet extends Entity {
  message: string
  userId: string
  roomId: string
  marks: Mark[]
}
