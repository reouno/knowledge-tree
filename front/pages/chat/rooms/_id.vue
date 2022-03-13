<template>
  <v-main>
    <v-container class="chat-container">
      <div id="chat-history-area" class="chat-history">
        <client-only>
          <infinite-loading
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

  formatToHtml(s: string): string {
    return s
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/\n/g, '<br />')
  }
}
</script>

<style scoped>
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
