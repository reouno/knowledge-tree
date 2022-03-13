import { Entity } from '~/models/base'

export interface Room extends Entity {
  label: string
  description: string
  isPublic: boolean
  isDeleted: boolean
}
