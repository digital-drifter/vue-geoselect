<template>
  <div>
    <b-row align-h="between">
      <geo-select :items="countries" label="Country" :selected.sync="search.selected.country"></geo-select>
      <geo-select :items="states" label="State" :selected.sync="search.selected.state" :disabled="!search.selected.country"></geo-select>
      <geo-select :items="cities" label="City" :selected.sync="search.selected.city" :disabled="!search.selected.state"></geo-select>
      <map-actions :searched="searched"></map-actions>
    </b-row>
    <b-row class="my-2" v-if="search.loading">
      <search-indicator :label="search.label"></search-indicator>
    </b-row>
    <hr v-else>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator'
  import { stringify } from 'qs'

  @Component({
    components: {
      'geo-select': () => import('./controls/GeoSelect.vue'),
      'map-actions': () => import('./controls/MapActions.vue'),
      'search-indicator': () => import('./controls/SearchIndicator.vue')
    }
  })
  export default class SearchControls extends Vue {
    name: string = "SearchControls"
    search: any = {
      loading: false,
      label: '',
      options: 'order-alpha',
      type: 'getCountries',
      results: {
        countries: [],
        states: [],
        cities: []
      },
      selected: {
        country: null,
        state: null,
        city: null
      }
    }
    get countries() {
      return this.mapToOptions(this.search.results.countries)
    }
    get states() {
      return this.mapToOptions(this.search.results.states)
    }
    get cities() {
      return this.mapToOptions(this.search.results.cities || {})
    }
    get url (): string {
      const {type, options, selected: { country, state, city } }  = this.search

      return `//geodata.solutions/api/api.php?${stringify({
        type,
        addClasses: options,
        countryId: country,
        stateId: state,
        cityId: city
      })}`
    }
    get restUrl(): string {
      const { options: { orderby, limit }, selected: { country, state, city } } = this.search

      return `//geodata.solutions/restapi?${stringify({
        country,
        state,
        city,
        orderby,
        limit
      })}`
    }
    get countryName(): string {
      const country = Object.keys(this.search.results.countries).find((result) => result.code === this.search.selected.country)

      return country ? country.name : ''
    }
    get searched (): boolean {
      return Object.keys(this.search.results).some((key: string) => {
        return this.search.results[key].length
      })
    }
    mounted () {
      this.toggleLoading()

      this.fetchData(this.search.params).then(countries => {
        this.search.results.countries = countries
        this.toggleLoading()
      })
    }
    mapToOptions(entities: any): any {
      return Object.keys(entities).map(key => {
        return {
          code: key,
          name: entities[key]
        }
      })
    }
    toggleLoading () {
      this.search.loading = !this.search.loading
    }
    async fetchData () {
      return fetch(this.url)
        .then((res: Response) => res.json())
        .then((res: any) => res.result)
        .catch((error: any) => {
          console.error(error)
        })
    }
    async fetchDetails () {
      return fetch(this.restUrl)
        .then((res: Response) => res.json())
        .catch((error: any) => {
          console.error(error)
        })
    }

    @Watch('search.selected.country')
    onCountryChanged(current: any, previous: any) {
      this.toggleLoading()

      this.search.type = 'getStates'
      this.search.label = 'Loading States...'
      this.search.selected.country = current
      this.search.selected.state = null
      this.search.selected.city  = null
      this.search.results.states = []
      this.search.results.cities = []

      Promise.all([
        this.fetchData()
      ]).then((values) => {
        this.search.results.states = values[0]
        this.toggleLoading()
        this.$emit('country', current)
      })
    }

    @Watch('search.selected.state')
    onStateChanged (current: any, previous: any) {
      if (current && current !== previous) {
        this.toggleLoading()

        this.search.type = 'getCities'
        this.search.label = 'Loading Cities...'
        this.search.selected.state = current
        this.search.selected.city  = null
        this.search.results.cities = []

        this.fetchData()
          .then(cities => {
            this.search.results.cities = cities
            this.toggleLoading()
          })
      }
    }

    @Watch('search.selected.city')
    onCityChanged (current: any, previous: any) {
      if (current && current !== previous) {
        this.toggleLoading()

        this.search.type = 'confCity'
        this.search.label = 'Loading Details...'
        this.search.selected.city = current

        this.fetchDetails()
          .then(cities => {
            this.search.results.cities = cities
            this.toggleLoading()
          })
      }
    }
    onClearClicked () {
      this.$storage.searched = false
    }
    setMapView () {
      
    }
}
</script>
