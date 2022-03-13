<template>
  <v-row justify="center">
    <v-dialog
      v-model="showDialog"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title>
          <v-icon>mdi-chat</v-icon>
          <span class="text-h6">New Room</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="label"
                  label="Room name"
                  required
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="description"
                  label="description"
                  required
                >
                </v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="close()"
          >
            Cancel
          </v-btn>
          <v-btn
            :disabled="!isEnteredRequiredFields()"
            color="primary"
            text
            @click="create()"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>

    </v-dialog>
  </v-row>
</template>

<script lang="ts">

import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'
import { Room } from '~/models/room'
import { RoomRepository } from '~/repository/room'

@Component
export default class CreateRoom extends Vue {
  label: string = ''
  description: string = ''

  @Prop({required: true, default: false})
  showDialog!: boolean

  @Prop({required: true})
  roomRepo!: RoomRepository

  @Emit('close-dialog')
  close() {
    // do nothing
  }

  newRoom(): Room {
    const dummyDate = new Date().toISOString()
    return {
      id: 'dummy',
      createdAt: dummyDate,
      updatedAt: dummyDate,
      label: this.label.trim(),
      description: this.description.trim(),
      isPublic: false,
      isDeleted: false,
    }
  }

  async create() {
    const newRoom = this.newRoom()
    await this.roomRepo.create(newRoom).then((room) => {
      this.clearData()
      this.roomCreated(room)
    }).catch((reason => {
      alert(`Failed to create room "${newRoom.label}": ${reason}`)
    }))
  }

  @Emit('room-created')
  roomCreated(_room: Room) {
    // do nothing
  }

  clearData() {
    this.label = ''
    this.description = ''
  }

  isEnteredRequiredFields() {
    return this.label.trim().length !== 0
  }
}
</script>
