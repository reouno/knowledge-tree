import { User } from '~/models/user'
import { UserDto, UserProfileApi } from '~/apis/user'

export class UserProfileRepository {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly apiClient: UserProfileApi) {}

  get(): Promise<User> {
    return this.apiClient.get().then(convertDtoToUser)
  }

  private get resourceName(): string {
    return 'resource'
  }
}

const convertDtoToUser = (raw: UserDto): User => {
  return {
    id: raw.uuid,
    lastLogin: raw.last_login,
    isSuperUser: raw.is_superuser,
    userName: raw.username,
    firstName: raw.first_name,
    lastName: raw.last_name,
    email: raw.email,
    isStaff: raw.is_staff,
    isActive: raw.is_active,
    dateJoined: raw.date_joined,
    groups: raw.groups,
    userPermissions: raw.user_permissions,
  }
}

// NOTE: Not needed for now
// const convertUserToDto = (item: User): UserDto => {
//   return {
//     uuid: item.id,
//     last_login: item.lastLogin,
//     is_superuser: item.isSuperUser,
//     username: item.userName,
//     first_name: item.firstName,
//     last_name: item.lastName,
//     email: item.email,
//     is_staff: item.isStaff,
//     is_active: item.isActive,
//     date_joined: item.dateJoined,
//     groups: item.groups,
//     user_permissions: item.userPermissions,
//   }
// }
