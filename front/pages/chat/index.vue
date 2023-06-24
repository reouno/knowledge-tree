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
import { Component, Vue } from 'nuxt-property-decorator'
import { convertEmoji } from '~/libs/format-string'

@Component({
  layout: 'chat',
})
export default class Chat extends Vue {
  created() {
    // load data
  }

  get emojis(): string {
    return convertEmoji(':tada:')
  }
}
</script>
