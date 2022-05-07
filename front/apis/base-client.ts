// eslint-disable-next-line import/named
import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { Logger } from '~/gateway/logger'

export const API_BASE = '/api'

export interface EntityDto {
  id: string
  created_at: string
  updated_at: string
}

export interface RetrieveEditApi<T> {
  get: (id: string) => Promise<T>
  put: (id: string, data: T) => Promise<T>
  patch: (id: string, data: any) => Promise<T>
  delete: (id: string) => Promise<void>
}

export interface CreateApi<T> {
  post: (data: T) => Promise<T>
}

export interface CreateRetrieveEditApi<T>
  extends RetrieveEditApi<T>,
    CreateApi<T> {}

export class CreateRetrieveEditApiBase<T> implements CreateRetrieveEditApi<T> {
  // eslint-disable-next-line no-useless-constructor
  protected constructor(
    protected readonly $axios: NuxtAxiosInstance,
    protected readonly endpoint: string,
    protected readonly basePath: string = API_BASE
  ) {}

  get(id: string): Promise<T> {
    return this.$axios
      .get(`${this.basePath}/${this.endpoint}/${id}/`)
      .then((response) => {
        return response.data
      })
      .catch((err) => {
        Logger.error(`Failed to fetch ${this.resourceName}(ID=${id})`, err)
        throw err
      })
  }

  post(data: T): Promise<T> {
    return this.$axios
      .post(`${this.basePath}/${this.endpoint}/`, data)
      .then((response) => {
        return response.data
      })
      .catch((err) => {
        Logger.error(`Failed to create ${this.resourceName}`, err)
        throw err
      })
  }

  put(id: string, data: T): Promise<T> {
    return this.$axios
      .put(`${this.basePath}/${this.endpoint}/${id}/`, data)
      .then((response) => {
        return response.data
      })
      .catch((err) => {
        Logger.error(`Failed to update ${this.resourceName}(ID=${id})`, err)
        throw err
      })
  }

  patch(id: string, data: any): Promise<T> {
    return this.$axios
      .patch(`${this.basePath}/${this.endpoint}/${id}/`, data)
      .then((response) => {
        return response.data
      })
      .catch((err) => {
        Logger.error(`Failed to patch ${this.resourceName}(ID=${id})`, err)
        throw err
      })
  }

  delete(id: string): Promise<void> {
    return this.$axios
      .delete(`${this.basePath}/${this.endpoint}/${id}/`)
      .then((_r) => {})
      .catch((err) => {
        Logger.error(`Failed to delete ${this.resourceName}(ID=${id})`, err)
        throw err
      })
  }

  // sub-class should override this getter
  protected get resourceName(): string {
    return 'resource'
  }
}

export interface CrudApi<T> extends CreateRetrieveEditApi<T> {
  list: (queries: any) => Promise<T[]>
}

export class CrudApiBase<T>
  extends CreateRetrieveEditApiBase<T>
  implements CrudApi<T>
{
  list(queries: any = {}): Promise<T[]> {
    return this.$axios
      .get(`${this.basePath}/${this.endpoint}/`, queries)
      .then((response) => {
        return response.data
      })
      .catch((err) => {
        Logger.error(`Failed to fetch ${this.resourceName} list`, err)
        throw err
      })
  }
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface PaginatedCrudApi<T> extends CreateRetrieveEditApi<T> {
  list: (queries: any) => Promise<PaginatedResponse<T>>
}

export class PaginatedCrudApiBase<T>
  extends CreateRetrieveEditApiBase<T>
  implements PaginatedCrudApi<T>
{
  list(queries: any = {}): Promise<PaginatedResponse<T>> {
    console.log('PaginatedCrudRepoで', queries)
    return this.$axios
      .get(`${this.basePath}/${this.endpoint}/`, { params: queries })
      .then((response) => {
        return response.data
      })
      .catch((err) => {
        Logger.error(`Failed to fetch ${this.resourceName} list`, err)
        throw err
      })
  }
}

export class ApiClientBase {
  // eslint-disable-next-line no-useless-constructor
  constructor(protected readonly basePath: string = API_BASE) {}
}
