<template>
  <v-app>
    <chat-side-bar
      v-model="drawer"
      :room-items="roomItems"
      @click-create-room="showCreateRoomDialog = true"
    ></chat-side-bar>
    <chat-room-header v-if="roomId" :room="current" @open-side-bar="openSideBar"></chat-room-header>
    <create-room
      :room-repo="roomRepo"
      :show-dialog="showCreateRoomDialog"
      @close-dialog="closeCreateRoomDialog()"
      @room-created="onRoomCreated"
    ></create-room>
    <Nuxt/>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ChatSideBar from '~/components/ChatSideBar.vue'
import { RoomRepository } from '~/repository/room'
import { RoomApi } from '~/apis/room'
import { Room } from '~/models/room'
import ChatRoomHeader from '~/components/ChatRoomHeader.vue'
import CreateRoom from '~/components/CreateRoom.vue'

export interface RoomItem {
  room: Room
  to: string
}

@Component({
  components: {CreateRoom, ChatRoomHeader, ChatSideBar},
})
export default class ChatLayout extends Vue {
  drawer: boolean | null = null
  roomItems: RoomItem[] = []
  showCreateRoomDialog: boolean = false

  get roomRepo(): RoomRepository {
    return RoomRepository.create(RoomApi.create(this.$axios))
  }

  get roomId(): string | null {
    return this.$route.params.id || null
  }

  get current(): Room | null {
    if (this.roomId === null) return null

    return this.roomItems.find((item) => item.room.id === this.roomId)?.room || null
  }

  created() {
    this.fetchRooms()
  }

  fetchRooms() {
    return this.roomRepo.list().then((rooms) => {
      this.roomItems = rooms.map((room) => {
        return {
          room,
          to: `/chat/rooms/${room.id}`,
        }
      })
    })
  }

  closeCreateRoomDialog() {
    this.showCreateRoomDialog = false
  }

  async onRoomCreated(room: Room) {
    this.showCreateRoomDialog = false
    await this.fetchRooms()

    const roomItem = this.roomItems.find((elem) => elem.room.id === room.id)
    if (roomItem === undefined) {
      throw new Error(`Room(ID=${room.id}) is not found in room items`)
    }

    this.$router.push(roomItem.to)
  }

  openSideBar() {
    this.drawer = true
  }
}
</script>

<style>
html, body {
  margin: 0;
  height: 100%;
  overflow: hidden;
}
</style>
