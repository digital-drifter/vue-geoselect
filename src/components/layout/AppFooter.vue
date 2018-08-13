<template>
  <footer class="w-100 d-flex flex-row justify-content-between">
    <span v-html="copyright"></span>
    <!--<span v-html="dataSource" style="font-weight: 200"></span>-->
  </footer>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'

  @Component
  export default class AppFooter extends Vue {
    name: string = 'AppFooter'
    
    get copyright () {
      return `&copy; ${(new Date()).getFullYear()} | DigitalDrifter`
    }
    get dataSource () {
      return `Data Source <a href="//geodata.solutions/" target="_blank">Geodata Solutions</a>`
    }
  }
</script>
