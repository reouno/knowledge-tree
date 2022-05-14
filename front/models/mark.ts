import { Entity } from '~/models/base'

export interface Mark extends Entity {
  tweetId: string
  label: string
  count: number
}
