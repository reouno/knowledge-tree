import {
  CrudApi,
  PaginatedCrudApi,
  PaginatedResponse,
} from '~/apis/base-client'

export interface RetrieveEditRepository<ModelT> {
  get: (id: string) => Promise<ModelT>
  update: (id: string, data: ModelT) => Promise<ModelT>
  delete: (id: string) => Promise<void>
}

export class RetrieveEditRepositoryBase<ModelT, DtoT>
  implements RetrieveEditRepository<ModelT>
{
  // eslint-disable-next-line no-useless-constructor
  protected constructor(
    protected readonly apiClient: CrudApi<DtoT>,
    protected readonly fromDto: (dto: DtoT) => ModelT,
    protected readonly toDto: (data: ModelT) => DtoT
  ) {}

  get(id: string): Promise<ModelT> {
    return this.apiClient.get(id).then(this.fromDto)
  }

  update(id: string, data: ModelT): Promise<ModelT> {
    return this.apiClient.put(id, this.toDto(data)).then(this.fromDto)
  }

  delete(id: string): Promise<void> {
    return this.apiClient.delete(id)
  }

  // sub-class should override this getter
  protected get resourceName(): string {
    return 'resource'
  }
}

export interface CreateRepository<ModelT> {
  create: (data: ModelT) => Promise<ModelT>
}

export interface CreateRetriveEditRepository<ModelT>
  extends RetrieveEditRepository<ModelT>,
    CreateRepository<ModelT> {}

export interface CrudRepository<ModelT>
  extends CreateRetriveEditRepository<ModelT> {
  list: (query: any) => Promise<ModelT[]>
}

export class CrudRepositoryBase<ModelT, DtoT>
  extends RetrieveEditRepositoryBase<ModelT, DtoT>
  implements CrudRepository<ModelT>
{
  list(query: any = {}): Promise<ModelT[]> {
    return this.apiClient.list(query).then((dtos) => {
      return dtos.map(this.fromDto)
    })
  }

  create(data: ModelT): Promise<ModelT> {
    return this.apiClient.post(this.toDto(data)).then(this.fromDto)
  }
}

export interface PaginatedCrudRepository<ModelT>
  extends CreateRetriveEditRepository<ModelT> {
  list: (query: any) => Promise<PaginatedResponse<ModelT>>
}

const paginatedConvert = (
  f: (x: any) => any
): ((px: PaginatedResponse<any>) => PaginatedResponse<any>) => {
  return (px) => {
    return {
      count: px.count,
      next: px.next,
      previous: px.previous,
      results: px.results.map(f),
    }
  }
}

export class PaginatedCrudRepositoryBase<ModelT, DtoT>
  implements PaginatedCrudRepository<ModelT>
{
  // eslint-disable-next-line no-useless-constructor
  protected constructor(
    protected readonly apiClient: PaginatedCrudApi<DtoT>,
    protected readonly fromDto: (dto: DtoT) => ModelT,
    protected readonly toDto: (data: ModelT) => DtoT
  ) {}

  list(query: any = {}): Promise<PaginatedResponse<ModelT>> {
    console.log('PaginatedCrudRepoで', query)
    return this.apiClient.list({ ...query }).then((response) => {
      return paginatedConvert(this.fromDto)(response)
    })
  }

  get(id: string): Promise<ModelT> {
    return this.apiClient.get(id).then(this.fromDto)
  }

  create(data: ModelT): Promise<ModelT> {
    return this.apiClient.post(this.toDto(data)).then(this.fromDto)
  }

  update(id: string, data: ModelT): Promise<ModelT> {
    return this.apiClient.put(id, this.toDto(data)).then(this.fromDto)
  }

  delete(id: string): Promise<void> {
    return this.apiClient.delete(id)
  }

  // sub-class should override this getter
  protected get resourceName(): string {
    return 'resource'
  }
}
