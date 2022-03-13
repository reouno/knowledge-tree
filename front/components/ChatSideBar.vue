<template>
  <v-navigation-drawer
    v-model="drawer"
    :clipped="clipped"
    :mini-variant="miniVariant"
    app
    fixed
  >
    <v-list>
      <v-list-item>
        <v-spacer></v-spacer>
        <v-btn @click="click">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-list-item>
      <v-list-item
        v-for="(item, i) in roomItems"
        :key="i"
        :to="item.to"
        exact
        router
      >
        <v-list-item-action>
          <v-icon>mdi-chat-processing-outline</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="item.room.label"/>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'
import { RoomItem } from '~/layouts/chat.vue'

@Component
export default class ChatSideBar extends Vue {
  @Prop({required: true, default: []})
  roomItems!: RoomItem[]

  drawer: boolean = false
  clipped: boolean = false
  miniVariant: boolean = false

  @Emit('click-create-room')
  click() {
    // do nothing
  }

}
</script>
