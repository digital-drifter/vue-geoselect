<template>
  <b-col class="d-flex flex-row justify-content-end" cols="2">
    <b-button variant="warning" :disabled="searched" @click="onClearClicked" class="mx-auto">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M5 13h14v-2H5v2zm-2 4h14v-2H3v2zM7 7v2h14V7H7z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
    </b-button>
    <b-button variant="outline-secondary" @click="setMapView">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
      </svg>
    </b-button>
  </b-col>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

@Component
export default class MapACtions extends Vue {
  name: string = 'MapActions'

  @Prop({type: Boolean, required: true})
  searched: Boolean

  onClearClicked () {
    this.$emit('clear')
  }

  setMapView () {
    this.$emit('update:map')
  }
}
</script>
