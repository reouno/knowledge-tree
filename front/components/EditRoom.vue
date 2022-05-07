<template>
  <v-row justify="center">
    <v-dialog v-model="showDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <v-icon>mdi-chat</v-icon>
          <span class="text-h6">{{ forCreate ? 'New' : 'Edit' }} Room</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="label" label="Room name" required>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="description" label="description" required>
                </v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn
            v-if="!forCreate"
            color="error"
            text
            @click="showDeleteConfirmDialog = true"
          >
            Delete
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="close()"> Cancel </v-btn>
          <v-btn
            v-if="forCreate"
            :disabled="!isEnteredRequiredFields()"
            color="primary"
            text
            @click="create()"
          >
            Create
          </v-btn>
          <v-btn
            v-else
            :disabled="!hasChanged()"
            color="primary"
            text
            @click="update()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="!forCreate"
      v-model="showDeleteConfirmDialog"
      max-width="300px"
    >
      <v-card style="color: red">
        <v-card-title class="text-h5 grey lighten-2">
          Delete room?
        </v-card-title>

        <v-card-text>
          Are you sure to delete "{{ current.label }}"?
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showDeleteConfirmDialog = false"> Cancel </v-btn>
          <v-btn color="error" text @click="logicalDelete"> Delete </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { Room } from '~/models/room'
import { RoomRepository } from '~/repository/room'

@Component
export default class CreateRoom extends Vue {
  label: string = ''
  description: string = ''
  showDeleteConfirmDialog: boolean = false

  // `null` means creating new room
  @Prop({ required: true, default: null })
  current!: Room | null

  @Prop({ required: true, default: false })
  showDialog!: boolean

  @Prop({ required: true })
  roomRepo!: RoomRepository

  get forCreate(): boolean {
    return this.current === null
  }

  @Watch('showDialog')
  setInitialValues() {
    if (!this.forCreate) {
      this.label = this.current!.label
      this.description = this.current!.description
    } else {
      this.clearData()
    }
  }

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
    await this.roomRepo
      .create(newRoom)
      .then((room) => {
        this.clearData()
        this.roomCreated(room)
      })
      .catch((reason) => {
        alert(`Failed to create room "${newRoom.label}": ${reason}`)
      })
  }

  async update() {
    if (!this.forCreate) {
      const updated = {
        label: this.label.trim(),
        description: this.description.trim(),
      }

      await this.roomRepo
        .patch(this.current!.id, updated)
        .then((room) => {
          this.clearData()
          this.roomUpdated(room)
        })
        .catch((reason) => {
          alert(`Failed to update room "${updated.label}": ${reason}`)
        })
    }
  }

  async logicalDelete() {
    if (!this.forCreate) {
      const current = this.current! // must exist

      await this.roomRepo
        .logicalDelete(current.id)
        .then((_response) => {
          this.clearData()
          this.roomDeleted(current)
        })
        .catch((reason) => {
          alert(`Failed to delete room "${current.label}": ${reason}`)
        })
      this.showDeleteConfirmDialog = false
    }
  }

  @Emit('room-created')
  roomCreated(_room: Room) {
    // do nothing
  }

  @Emit('room-updated')
  roomUpdated(_room: Room) {
    // do nothing
  }

  @Emit('room-deleted')
  roomDeleted(_room: Room) {
    // do nothing
  }

  clearData() {
    this.label = ''
    this.description = ''
  }

  isEnteredRequiredFields() {
    return this.label.trim().length !== 0
  }

  hasChanged() {
    return (
      this.isEnteredRequiredFields() &&
      (this.label.trim() !== this.current?.label ||
        this.description.trim() !== this.current.description)
    )
  }
}
</script>
