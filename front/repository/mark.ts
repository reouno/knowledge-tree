import { PaginatedCrudRepositoryBase } from '~/repository/base'
import { Mark } from '~/models/mark'
import { MarkApi, MarkDto } from '~/apis/mark'

export class MarkRepository extends PaginatedCrudRepositoryBase<Mark, MarkDto> {
  static create(apiClient: MarkApi): MarkRepository {
    return new this(apiClient, convertDtoToMark, convertMarkToDto)
  }

  protected get resourceName(): string {
    return 'tweet'
  }
}

export const convertDtoToMark = (raw: MarkDto): Mark => {
  return {
    id: raw.id,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    tweetId: raw.tweet,
    label: raw.label,
    count: raw.count,
  }
}

export const convertMarkToDto = (item: Mark): MarkDto => {
  return {
    id: item.id,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
    tweet: item.tweetId,
    label: item.label,
    count: item.count,
  }
}
