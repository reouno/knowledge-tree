<template>
  <v-main>
    <v-container class="chat-container">
      <div id="chat-history-area" class="chat-history">
        <client-only>
          <infinite-loading
            :identifier="infiniteId"
            direction="top"
            @infinite="infiniteHandler"
          ></infinite-loading>
        </client-only>
        <div v-for="(item, idx) in items" :key="idx">
          <v-hover v-slot="{ hover }">
            <v-card
              :elevation="hover ? 6 : 0"
            >
              <v-card-text class="py-1">
                <p class="my-0" v-html="formatToHtml(item.message)"></p>
              </v-card-text>
              <v-col class="ma-0 pa-0 text-right">
                <v-chip
                  v-if="hover"
                >
                  <v-btn class="mr-1" disabled fab x-small>
                    <v-icon>mdi-pencil-outline</v-icon>
                  </v-btn>
                  <v-btn class="ma-0" fab x-small @click.stop="openDeleteDialog(item)">
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>
                </v-chip>
              </v-col>
            </v-card>
          </v-hover>
        </div>
      </div>
      <v-card class="input-area" elevation="5">
        <v-container>
          <v-row>
            <v-col cols="11">
              <v-textarea
                id="message"
                ref="messageInputArea"
                v-model="message"
                auto-grow
                class="message-area"
                counter
                rows="1"
                @keydown.enter.exact="keyDownEnter"
                @keyup.enter.exact="keyUpEnter"
              ></v-textarea>
            </v-col>
            <v-col align-self="end" cols="1">
              <v-btn
                :disabled="!hasMessage" class="px-1 small-width" color="primary" small
                @click="send">
                <v-icon>mdi-send</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <div class="bottom-space"><!-- Bottom space for iOS --></div>
      <v-dialog
        v-model="deleteDialog"
        width="500"
      >
        <v-card v-if="selectedTweet">
          <v-card-title class="text-h5 grey lighten-2">
            Delete a message
          </v-card-title>

          <v-card-text>
            Are you sure you want to delete the message?<br/>
            {{ selectedTweet.message.slice(0, 10) }}...
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="secondary"
              text
              @click="deleteDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="error"
              text
              @click="onClickDelete(selectedTweet.id)"
            >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import InfiniteLoading from 'vue-infinite-loading'
import { Mixins } from 'vue-mixin-decorator'
import { TweetRepository } from '~/repository/tweet'
import { TweetApi } from '~/apis/tweet'
import { RoomTweetRepository } from '~/repository/room-tweet'
import { Tweet } from '~/models/tweet'
import { Room } from '~/models/room'
import FetchUser from '~/mixins/FetchUser.vue'
import { User } from '~/models/user'

const PAGE_SIZE = 10

@Component({
  layout: 'chat',
  components: {
    InfiniteLoading,
  },
})
export default class ChatRoom extends Mixins<FetchUser>(FetchUser) {
  items: Tweet[] = []
  nextPage: number = 1
  message: string = ''
  room: Room | null = null
  user: User | null = null
  keyDownCode: number = 0
  deleteDialog: boolean = false
  infiniteId = +new Date() // Date as timestamp
  selectedTweet: Tweet | null = null

  get roomId(): string {
    return this.$route.params.id
  }

  get tweetRepo(): RoomTweetRepository {
    return new RoomTweetRepository(
      TweetRepository.create(TweetApi.create(this.$axios)),
      this.roomId,
    )
  }

  get hasMessage(): boolean {
    return this.message.trim().length !== 0
  }

  // escape TS errors
  get refs(): any {
    return this.$refs
  }

  mounted() {
    this.fetchUserOrLogout().then((user) => {
      this.user = user
    })
    this.refs.messageInputArea.focus()
  }

  send() {
    const msg = this.message.trim()
    if (!msg.length) return

    const dummyDate = new Date().toISOString()
    this.tweetRepo
      .create({
        id: 'dummy',
        createdAt: dummyDate,
        updatedAt: dummyDate,
        message: msg,
        userId: this.user!.id,
        roomId: this.roomId,
      })
      .then((tweet) => {
        this.items.push(tweet)
        this.clearMessage()
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      })
  }

  scrollToBottom() {
    document.getElementById('chat-history-area')!.scrollTop =
      document.getElementById('chat-history-area')!.scrollHeight + 100
  }

  infiniteHandler($state: any) {
    this.tweetRepo
      .list({
        page: this.nextPage,
        page_size: PAGE_SIZE,
      })
      .then((response) => {
        if (response.results.length) {
          this.nextPage += 1
          this.items.unshift(...response.results.reverse())
          if (response.next === null) {
            $state.complete()
          } else {
            $state.loaded()
          }
        } else {
          $state.complete()
        }
      })
  }

  // ignore return to new line
  keyDownEnter(e: any) {
    this.keyDownCode = e.keyCode // store keycode
    e.preventDefault()
  }

  keyUpEnter(e: any) {
    if (this.keyDownCode === 229) { // 229 means character conversion
      return
    }
    e.preventDefault()
    this.send()
  }

  clearMessage() {
    this.message = ''
  }

  openDeleteDialog(item: Tweet) {
    this.selectedTweet = item
    this.deleteDialog = true
  }

  onClickDelete(itemId: string) {
    this.tweetRepo.delete(itemId)
    this.selectedTweet = null
    this.deleteDialog = false
    this.resetInfiniteLoading()
  }

  formatToHtml(s: string): string {
    return s
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/\n{3,}/g, '\n\n') // trim successive \n in 2 times
      .replace(/\n/g, '<br />')
      .replace(
        /(https?:\/\/[-_.!~*'()a-zA-Z0-9/?:@&=+$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
      ) // convert URL to a tag link
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // markdown strong
      .replace(/\*([^*]+)\*/g, '<em>$1</em>') // markdown italic
  }

  resetInfiniteLoading() {
    this.nextPage = 1
    this.items = []

    // ref: https://peachscript.github.io/vue-infinite-loading/guide/use-with-filter-or-tabs.html
    this.infiniteId += 1
  }
}
</script>

<style scoped>
/* For iPhone and iPad in portrait */
@media screen and (max-width: 820px) {
  .bottom-space {
    height: 100px;
  }
}

/* For iPad in landscape */
@media screen and (min-width: 821px) and (max-width: 1180px) and (max-height: 820px) {
  .bottom-space {
    height: 100px;
  }
}

.chat-container {
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}

.chat-history {
  flex: 1;
  overflow-y: scroll;
}

.input-area {
  max-height: 242px;
}

.message-area::v-deep textarea {
  max-height: 8rem;
  overflow-y: scroll;
  font-size: 0.9rem;
}

.small-width {
  min-width: 20px !important;
}
</style>
