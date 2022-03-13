// eslint-disable-next-line import/named
import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { API_BASE } from '~/apis/base-client'
import { Logger } from '~/gateway/logger'

export interface UserDto {
  uuid: string
  last_login: string
  is_superuser: boolean
  username: string
  first_name: string
  last_name: string
  email: string
  is_staff: boolean
  is_active: boolean
  date_joined: string
  groups: string[]
  user_permissions: string[]
}

// NOTE: Can only get user info for now
export class UserProfileApi {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private readonly $axios: NuxtAxiosInstance,
    private readonly endpoint: string = 'accounts/me',
    private readonly basePath: string = API_BASE
  ) {}

  get(): Promise<UserDto> {
    return this.$axios
      .get(`${this.basePath}/${this.endpoint}/`)
      .then((response) => {
        return response.data
      })
      .catch((err) => {
        Logger.error(`Failed to fetch ${this.resourceName}`, err)
        throw err
      })
  }

  private get resourceName(): string {
    return 'resource'
  }
}
