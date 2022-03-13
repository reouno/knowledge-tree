// eslint-disable-next-line import/named
import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { CrudApiBase, EntityDto } from '~/apis/base-client'

export interface RoomDto extends EntityDto {
  label: string
  description: string
  is_public: boolean
  is_deleted: boolean
}

export class RoomApi extends CrudApiBase<RoomDto> {
  static create($axios: NuxtAxiosInstance): RoomApi {
    return new this($axios, 'chat/rooms')
  }

  protected get resourceName(): string {
    return 'room'
  }
}
