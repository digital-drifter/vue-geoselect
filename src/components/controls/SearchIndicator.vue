<template>
  <b-col>
    <b-progress striped animated :max="max" :height="height">
      <b-progress-bar :value="counter">
        <strong>{{ label }}</strong>
      </b-progress-bar>
    </b-progress>
  </b-col>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'

  @Component
  export default class SearchIndicator extends Vue {
    max: number = 100
    counter: number = 100

    @Prop({type: String, required: false, default: 'Loading...'})
    label: string

    @Prop({type: String, required: false, default: '17px'})
    height: string
  }
</script>