// eslint-disable-next-line import/named
import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { EntityDto, PaginatedCrudApiBase } from '~/apis/base-client'
import { MarkDto } from '~/apis/mark'

export interface TweetDto extends EntityDto {
  message: string
  user: string
  room: string
  marks: MarkDto[]
}

export class TweetApi extends PaginatedCrudApiBase<TweetDto> {
  static create($axios: NuxtAxiosInstance): TweetApi {
    return new this($axios, 'chat/tweets')
  }

  protected get resourceName(): string {
    return 'tweet'
  }
}
