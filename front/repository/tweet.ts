import { PaginatedCrudRepositoryBase } from '~/repository/base'
import { TweetApi, TweetDto } from '~/apis/tweet'
import { Tweet } from '~/models/tweet'
import { convertDtoToMark, convertMarkToDto } from '~/repository/mark'

export class TweetRepository extends PaginatedCrudRepositoryBase<
  Tweet,
  TweetDto
> {
  static create(apiClient: TweetApi): TweetRepository {
    return new this(apiClient, convertDtoToTweet, convertTweetToDto)
  }

  protected get resourceName(): string {
    return 'tweet'
  }
}

const convertDtoToTweet = (raw: TweetDto): Tweet => {
  return {
    id: raw.id,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    message: raw.message,
    userId: raw.user,
    roomId: raw.room,
    marks: raw.marks.map(convertDtoToMark),
  }
}

const convertTweetToDto = (item: Tweet): TweetDto => {
  return {
    id: item.id,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
    message: item.message,
    user: item.userId,
    room: item.roomId,
    marks: item.marks.map(convertMarkToDto),
  }
}
