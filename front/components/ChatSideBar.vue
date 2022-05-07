<template>
  <div>
    <v-app-bar-nav-icon @click.stop="input(drawer = !drawer)"></v-app-bar-nav-icon>
    <v-navigation-drawer
      v-model="drawer"
      app
      fixed
    >
      <v-container style="padding-bottom: 0">
        <v-row>
          <v-col class="text-right">
            <v-btn fab small @click="click">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-container class="chatroom-list-height">
        <div class="inherit-hw">
          <v-list class="scrollable-list">
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
                <v-btn @click="onClickEditRoom(item.room)">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
      </v-container>
      <v-container>
        <v-row>
          <v-col>
            <v-btn fab small @click="onClickLogout">
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'
import { RoomItem } from '~/layouts/chat.vue'
import { Room } from '~/models/room'

@Component
export default class ChatSideBar extends Vue {
  @Prop({required: true, default: []})
  roomItems!: RoomItem[]

  @Prop({default: null})
  private value!: boolean | null

  private get drawer(): boolean | null {
    return this.value
  }

  private set drawer(value: boolean | null) {
    this.input(value)
  }

  @Emit('click-create-room')
  click() {
    // do nothing
  }

  @Emit('click-edit-room')
  onClickEditRoom(_room: Room) {
    // do nothing
  }

  @Emit()
  public input(_value: boolean | null) {
  }

  @Emit('click-logout')
  onClickLogout() {
    // do nothing
  }

}
</script>

<style scoped>
/* Disable scrolling navigation drawer */
::v-deep .v-navigation-drawer__content { /* stylelint-disable-line selector-class-pattern */
  overflow: hidden
}

/* For iPhone and iPad portrait */
@media screen and (max-width: 820px) {
  .chatroom-list-height {
    height: 100%;
    max-height: calc(100% - 220px);
  }
}

/* For iPad in landscape */
@media screen and (min-width: 821px) and (max-width: 1180px) and (max-height: 820px) {
  .chatroom-list-height {
    height: 100%;
    max-height: calc(100% - 220px);
  }
}

@media screen and (min-width: 821px) and (min-height: 821px), screen and (min-width: 1181px) {
  .chatroom-list-height {
    height: 100%;
    max-height: calc(100% - 120px);
  }
}

.inherit-hw {
  height: inherit;
  width: inherit;
}

/* Enable scrolling only in chatroom list area */
.scrollable-list {
  padding: 0;
  height: inherit;

  /* -webkit-overflow-scrolling: auto; */
  overflow-y: scroll;
}
</style>
