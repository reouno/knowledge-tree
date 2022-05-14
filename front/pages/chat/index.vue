<template>
  <v-main>
    <v-container>
      <v-row>
        Let's take notes
        {{ emojis }}
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { EmojiConvertor } from 'emoji-js'
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  layout: 'chat',
})
export default class Chat extends Vue {
  created() {
    // load data
  }

  get emojis(): string {
    const emo = new EmojiConvertor()
    return emo.replace_colons(
      ':tada:'
    )
  }
}
</script>
