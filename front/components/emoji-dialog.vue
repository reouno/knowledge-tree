<template>
  <v-dialog
    :value="value"
    width="200"
    @input="$emit('input', $event)"
  >
    <v-card>
      <v-card-text>
        <v-text-field
          v-model="emojiShortName"
          autofocus
          label="emoji"
          @keydown.enter.exact="keyDownEnter"
          @keyup.enter.exact="keyUpEnter"
        ></v-text-field>
        <div>
          <span>{{ convertedEmoji() }}</span>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">


import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'
import Emoji from 'emoji-js'
import { convertEmoji } from '~/libs/format-string'
import { MarkRepository } from '~/repository/mark'
import { Mark } from '~/models/mark'

@Component
export default class EmojiDialog extends Vue {
  keyDownCode: number = 0
  emojiShortName: string = ''

  @Prop({required: true, default: false})
  value!: boolean

  @Prop({ required: true, default: null })
  selectedTweetId!: string | null

  @Prop({required: true})
  emojiConverter!: Emoji

  @Prop({ required: true })
  markRepo!: MarkRepository

  convertedEmoji(): string {
    return convertEmoji(`:${this.emojiShortName}:`, this.emojiConverter)
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
    this.addEmojiMark().then((mark) => {
      this.emojiShortName = ''
      this.addedEmojiMark(mark)
    })
  }

  addEmojiMark(): Promise<any> {
    if (this.selectedTweetId === null) return Promise.reject(new Error('tweet is not selected'))

    const shortName = `:${this.emojiShortName}:`
    const emoji = convertEmoji(shortName, this.emojiConverter)
    if (shortName === emoji) return Promise.reject(new Error('Not emoji short name'))

    const dummyDate = new Date().toISOString()
    return this.markRepo.create({
      id: 'dummy',
      createdAt: dummyDate,
      updatedAt: dummyDate,
      tweetId: this.selectedTweetId,
      label: shortName,
      count: 1,
    })
  }

  @Emit('added-emoji-mark')
  addedEmojiMark(_newMark: Mark) {
    // do nothing
  }
}
</script>
