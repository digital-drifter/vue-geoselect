<template>
  <b-col>
    <b-form-select 
      class="w-100"
      v-model="computedSelected" 
      text-field="name"
      value-field="code"
      :options="items"
      :disabled="disabled">
      <template slot="first">
        <option :value="null" disabled>-- {{ label }} --</option>
      </template>
    </b-form-select>
  </b-col>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

@Component
export default class GeoSelect extends Vue {
  name: string = 'GeoSelect'

  get computedSelected (): string {
    return this.selected
  }

  set computedSelected (value) {
    this.$emit('update:selected', value)
  }

  @Prop({type: String, required: false})
  selected?: string

  @Prop({type: Array, required: true})
  items: any[]

  @Prop({type: String, required: true})
  label: string

  @Prop({type: Boolean, required: false, default: false})
  disabled: boolean
}
</script>
