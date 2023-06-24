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
            <v-card :elevation="0" class="focused-tweet">
              <v-card-text class="py-1">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <p class="my-0" v-html="formatToHtmlStr(item.message)"></p>
              </v-card-text>
              <v-col class="ma-0 pa-0 pl-2 tip-width">
                <v-btn
                  v-for="(mark, mIdx) in item.marks"
                  :key="mIdx"
                  class="emoji-icon"
                  depressed
                  fab
                  x-small
                  @click.stop="deleteMark(mark.id, item.id)"
                  >{{ toEmojiIcon(mark.label) }}
                </v-btn>
                <v-chip v-if="hover" class="ml-4">
                  <v-btn
                    class="mr-1"
                    fab
                    x-small
                    @click.stop="openEmojiDialog(item.id)"
                  >
                    <v-icon>mdi-emoticon-happy-outline</v-icon>
                  </v-btn>
                  <v-btn class="mr-1" disabled fab x-small>
                    <v-icon>mdi-pencil-outline</v-icon>
                  </v-btn>
                  <v-btn
                    class="ma-0"
                    fab
                    x-small
                    @click.stop="openDeleteDialog(item)"
                  >
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
                :disabled="!hasMessage"
                class="px-1 small-width"
                color="primary"
                small
                @click="send"
              >
                <v-icon>mdi-send</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <div class="bottom-space"><!-- Bottom space for iOS --></div>
      <v-dialog v-model="deleteDialog" width="500">
        <v-card v-if="selectedTweet">
          <v-card-title class="text-h5 grey lighten-2">
            Delete a message
          </v-card-title>

          <v-card-text>
            Are you sure you want to delete the message?<br />
            {{ selectedTweet.message.slice(0, 10) }}...
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" text @click="deleteDialog = false">
              Cancel
            </v-btn>
            <v-btn color="error" text @click="onClickDelete(selectedTweet.id)">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <emoji-dialog
        v-model="emojiDialog"
        :emoji-converter="emojiConverter"
        :mark-repo="markRepo"
        :selected-tweet-id="selectedTweetId"
        @added-emoji-mark="onEmojiMarkAdded"
      ></emoji-dialog>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import InfiniteLoading from 'vue-infinite-loading'
import { Mixins } from 'vue-mixin-decorator'
import Emoji, { EmojiConvertor } from 'emoji-js'
import { TweetRepository } from '~/repository/tweet'
import { TweetApi } from '~/apis/tweet'
import { RoomTweetRepository } from '~/repository/room-tweet'
import { Tweet } from '~/models/tweet'
import { Room } from '~/models/room'
import FetchUser from '~/mixins/FetchUser.vue'
import { User } from '~/models/user'
import { convertEmoji, formatToHtml } from '~/libs/format-string'
import { MarkRepository } from '~/repository/mark'
import { MarkApi } from '~/apis/mark'
import EmojiDialog from '~/components/emoji-dialog.vue'
import { Mark } from '~/models/mark'

const PAGE_SIZE = 10

@Component({
  layout: 'chat',
  components: {
    EmojiDialog,
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
  emojiConverter: Emoji = new EmojiConvertor()
  emojiDialog: boolean = false
  selectedTweetId: string | null = null

  get roomId(): string {
    return this.$route.params.id
  }

  get tweetRepo(): RoomTweetRepository {
    return new RoomTweetRepository(
      TweetRepository.create(TweetApi.create(this.$axios)),
      this.roomId
    )
  }

  get markRepo(): MarkRepository {
    return MarkRepository.create(MarkApi.create(this.$axios))
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
        marks: [],
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
    if (this.keyDownCode === 13) {
      // 13 means return
      e.preventDefault()
      this.send()
    }
    this.keyDownCode = 0
  }

  onEmojiMarkAdded(newMark: Mark) {
    this.emojiDialog = false
    const tweetIdx = this.items.findIndex(
      (elem) => elem.id === this.selectedTweetId
    )
    if (tweetIdx >= 0) {
      this.items[tweetIdx].marks.push(newMark)
    }
    this.selectedTweetId = null
  }

  deleteMark(id: string, tweetId: string) {
    this.markRepo.delete(id).then(() => {
      const tweetIdx = this.items.findIndex((elem) => elem.id === tweetId)
      if (tweetIdx === -1) return

      const markIdx = this.items[tweetIdx].marks.findIndex(
        (elem) => elem.id === id
      )
      if (markIdx === -1) return

      this.items[tweetIdx].marks.splice(markIdx, 1)
    })
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

  openEmojiDialog(id: string) {
    this.selectedTweetId = id
    this.emojiDialog = true
  }

  formatToHtmlStr(s: string): string {
    return formatToHtml(convertEmoji(s, this.emojiConverter))
  }

  toEmojiIcon(shortName: string): string {
    return convertEmoji(shortName, this.emojiConverter)
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

  .tip-width {
    max-width: 100px;
  }
}

/* For iPad in landscape */
@media screen and (min-width: 821px) and (max-width: 1180px) and (max-height: 820px) {
  .bottom-space {
    height: 100px;
  }

  .tip-width {
    max-width: 100px;
  }
}

@media screen and (min-width: 821px) and (min-height: 821px),
  screen and (min-width: 1181px) {
  .bottom-space {
    height: 10px;
  }

  .tip-width {
    max-width: 200px;
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

.focused-tweet:hover {
  background-color: #f3f3f3;
}

.emoji-icon {
  font-size: 1.2rem;
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
