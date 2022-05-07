<template>
  <v-app>
    <chat-side-bar
      v-model="drawer"
      :room-items="roomItems"
      @click-create-room="onClickCreateRoom"
      @click-edit-room="onClickEditRoom"
      @click-logout="logout"
    ></chat-side-bar>
    <chat-room-header v-if="roomId" :room="current" @open-side-bar="openSideBar"></chat-room-header>
    <edit-room
      :current="selectedRoom"
      :room-repo="roomRepo"
      :show-dialog="showEditRoomDialog"
      @close-dialog="closeCreateRoomDialog()"
      @room-created="onRoomCreated"
      @room-updated="onRoomUpdated"
      @room-deleted="onRoomDeleted"
    ></edit-room>
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
import EditRoom from '~/components/EditRoom.vue'

export interface RoomItem {
  room: Room
  to: string
}

@Component({
  components: {EditRoom, ChatRoomHeader, ChatSideBar},
})
export default class ChatLayout extends Vue {
  drawer: boolean | null = null
  roomItems: RoomItem[] = []
  showEditRoomDialog: boolean = false
  selectedRoom: Room | null = null

  created() {
    this.fetchRooms()
  }

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
    this.showEditRoomDialog = false
  }

  onClickCreateRoom() {
    this.selectedRoom = null
    this.showEditRoomDialog = true
  }

  onClickEditRoom(room: Room) {
    this.selectedRoom = room
    this.showEditRoomDialog = true
  }

  async onRoomCreated(room: Room) {
    this.showEditRoomDialog = false
    await this.fetchRooms()

    const roomItem = this.roomItems.find((elem) => elem.room.id === room.id)
    if (roomItem === undefined) {
      throw new Error(`Room(ID=${room.id}) is not found in room items`)
    }

    this.$router.push(roomItem.to)
  }

  async onRoomUpdated(_room: Room) {
    this.showEditRoomDialog = false
    await this.fetchRooms()
  }

  async onRoomDeleted(_room: Room) {
    this.showEditRoomDialog = false
    await this.fetchRooms()
    this.$router.push('/chat')
  }

  openSideBar() {
    this.drawer = true
  }

  async logout() {
    await this.$auth.logout()
    alert('Signed out!')
  }
}
</script>

<style>
/* Disable scrolling body */
html, body {
  margin: 0;
  height: 100%;
  overflow: hidden;
}
</style>
