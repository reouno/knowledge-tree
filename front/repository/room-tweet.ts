import { Tweet } from '~/models/tweet'
import { TweetRepository } from '~/repository/tweet'
import { PaginatedCrudRepository } from '~/repository/base'
import { PaginatedResponse } from '~/apis/base-client'

export class RoomTweetRepository implements PaginatedCrudRepository<Tweet> {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private readonly tweetRepo: TweetRepository,
    private readonly roomId: string
  ) {}

  list(query: any = {}): Promise<PaginatedResponse<Tweet>> {
    console.log('RoomTweetRepoで', query)
    return this.tweetRepo.list({
      ...query,
      room_id: this.roomId,
    })
  }

  get(id: string): Promise<Tweet> {
    return this.tweetRepo.get(id)
  }

  create(data: Tweet): Promise<Tweet> {
    return this.tweetRepo.create(data)
  }

  update(id: string, data: Tweet): Promise<Tweet> {
    return this.tweetRepo.update(id, data)
  }

  delete(id: string): Promise<void> {
    return this.tweetRepo.delete(id)
  }
}
