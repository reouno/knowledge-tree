<template>
  <v-app-bar :clipped-left="clipped" app fixed>
    <template v-if="room">
      <v-toolbar-title v-text="room.label" />
      <v-toolbar-title class="ml-4 body-2">{{ description }}</v-toolbar-title>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Room } from '~/models/room'

@Component
export default class ChatRoomHeader extends Vue {
  @Prop({ required: true })
  room!: Room | null

  clipped: boolean = false
  fixed: boolean = false

  get description(): string {
    const MAX_LEN = 32
    if (this.room === null) return ''

    if (this.room.description.length > MAX_LEN) {
      return this.room.description.slice(0, MAX_LEN) + '…'
    }

    return this.room.description
  }
}
</script>
