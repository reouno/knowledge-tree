<template>
  <div>
    <v-app-bar-nav-icon @click.stop="input(drawer = !drawer)"></v-app-bar-nav-icon>
    <v-navigation-drawer
      v-model="drawer"
      app
      fixed
    >
      <v-list
        class="scrollable-list"
      >
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
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'
import { RoomItem } from '~/layouts/chat.vue'

@Component
export default class ChatSideBar extends Vue {
  @Prop({default: null})
  private value!: boolean | null

  @Prop({required: true, default: []})
  roomItems!: RoomItem[]

  @Emit('click-create-room')
  click() {
    // do nothing
  }

  @Emit()
  public input(_value: boolean | null) {}

  private get drawer(): boolean | null {
    return this.value
  }

  private set drawer(value: boolean | null) {
    this.input(value)
  }

}
</script>

<style lang="css" scoped>
.scrollable-list {
  -webkit-overflow-scrolling: auto;
  overflow-y: auto;
}
</style>
