// eslint-disable-next-line import/named
import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { EntityDto, PaginatedCrudApiBase } from '~/apis/base-client'

export interface MarkDto extends EntityDto {
  tweet: string
  label: string
  count: number
}

export class MarkApi extends PaginatedCrudApiBase<MarkDto> {
  static create($axios: NuxtAxiosInstance): MarkApi {
    return new this($axios, 'chat/marks')
  }

  protected get resourceName(): string {
    return 'mark'
  }
}
