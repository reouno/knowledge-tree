<script lang="ts">

import { Vue } from 'nuxt-property-decorator'
import { Mixin } from 'vue-mixin-decorator'
import { UserProfileRepository } from '~/repository/user'
import { UserProfileApi } from '~/apis/user'
import { User } from '~/models/user'
import { Logger } from '~/gateway/logger'

@Mixin
export default class FetchUser extends Vue {
  get userRepo(): UserProfileRepository {
    return new UserProfileRepository(new UserProfileApi(this.$axios))
  }

  fetchUserOrLogout(): Promise<User> {
    return this.userRepo.get().catch((reason) => {
      Logger.error(`Failed to fetch user, ${reason}`)
      this.$auth.logout()
      throw reason
    })
  }
}
</script>
