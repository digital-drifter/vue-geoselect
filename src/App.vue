<template>
  <div id="app">
    <app-navbar></app-navbar>
    <main class="container">
      <b-jumbotron header-level="4" :lead="lead">
        <div slot="header">
          <span>Vue-Ge</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="#455a64"/>
          </svg>
          <span>select</span>
        </div>
        <hr>
        <search-controls @country="onCountry"></search-controls>
        <map-canvas key="map" :options="mapOptions"></map-canvas>
      </b-jumbotron>
    </main>
    <app-footer></app-footer>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {NotFoundError} from 'dexie'
  import {db, Country, SiteState, UserInfo} from './db'
  import {LatLng} from 'leaflet'
  import * as VueGeoselect from '../types'

  @Component({
    components: {
      'app-navbar': () => import('./components/layout/AppNavbar.vue'),
      'app-footer': () => import('./components/layout/AppFooter.vue'),
      'map-canvas': () => import('./components/MapCanvas.vue'),
      'search-controls': () => import('./components/SearchControls.vue')
    }
  })
  export default class App extends Vue {
    name: string = "App"
    mapOptions: VueGeoselect.Leaflet.Map.Options = {
      latlng: {
        lat: 0,
        lng: 0
      },
      zoom: 14,
      markers: []
    }
    countries: Country[] = []
    lead: string = 'WIP - dynamic form <select> controls for displaying a regional map based on user choices.'
    // lead: string = 'Dynamic map with country, region, and municipality form <select> controls.'

    created () {
      Promise.all([
        this.$ip.geolocation(),
        this.fetchCountries(),
      ]).then((values: any[]) => {
        const userInfo: UserInfo = values[0]
        const latlng = { lat: userInfo.latitude, lng: userInfo.longitude }

        this.mapOptions.latlng = latlng

        this.addMarker(latlng)
      }).catch((error: NotFoundError) => {
        console.log(error)
        db.siteState.add({lastUpdated: new Date()})
      })
    }

    addMarker (latlng: number[], options?: any): void {
      this.mapOptions.markers.push({latlng, options})
    }

    async getLatng(): Promise<any> {

    }

    async fetchCountries (): Promise<any> {
      fetch('https://restcountries.eu/rest/v2/all')
        .then((res: Response) => res.json())
        .then((countries: Country[]) => {
          countries.forEach((country: Country) => {
            db.countries.add(...country)
          })

          db.siteState.add({lastUpdated: new Date()})
        })
    }

    async lookupCountry(alpha2Code: string): Promise<any> {
      return db.countries.where({ alpha2Code }).first((country: Country) => country)
    }

    async onCountry (country) {
      const data = await this.lookupCountry(country)

      this.mapOptions.latlng = data.latlng
      this.mapOptions.zoom = 6
    }
  }
</script>
