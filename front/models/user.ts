export interface User {
  id: string
  lastLogin: string
  isSuperUser: boolean
  userName: string
  firstName: string
  lastName: string
  email: string
  isStaff: boolean
  isActive: boolean
  dateJoined: string
  groups: string[]
  userPermissions: string[]
}
