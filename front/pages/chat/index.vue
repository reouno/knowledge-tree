<template>
  <v-main>
    <v-container> Chat </v-container>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  layout: 'chat',
})
export default class Chat extends Vue {
  created() {
    // load data
  }
}
</script>
