import { CrudRepositoryBase } from '~/repository/base'
import { Room } from '~/models/room'
import { RoomApi, RoomDto } from '~/apis/room'

export class RoomRepository extends CrudRepositoryBase<Room, RoomDto> {
  static create(apiClient: RoomApi): RoomRepository {
    return new this(apiClient, convertDtoToRoom, convertRoomToDto)
  }

  protected get resourceName(): string {
    return 'room'
  }

  logicalDelete(id: string): Promise<Room> {
    return this.patch(id, { is_deleted: true })
  }
}

const convertDtoToRoom = (raw: RoomDto): Room => {
  return {
    id: raw.id,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    label: raw.label,
    description: raw.description,
    isPublic: raw.is_public,
    isDeleted: raw.is_deleted,
  }
}

const convertRoomToDto = (item: Room): RoomDto => {
  return {
    id: item.id,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
    label: item.label,
    description: item.description,
    is_public: item.isPublic,
    is_deleted: item.isDeleted,
  }
}
