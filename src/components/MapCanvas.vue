<template>
  <div class="map" id="map"></div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  import * as L from 'leaflet'

  @Component
  export default class MapCanvas extends Vue {
    name: string = "MapCanvas"
    map: any = {}
    tileLayer: any = {}
    layers: any[] = []

    @Prop({type:Object,required: true})
    options: object

    @Watch('options', {deep: true})
    onOptionsChanged(current: any, previous: any) {
      this.setView()
      this.addMarkers()
    }
      
    mounted() {
      this.initMap();
      // this.initLayers();
    }

    layerChanged(layerId, active) {
      const layer = this.layers.find(layer => layer.id === layerId);
      
      layer.features.forEach((feature) => {
        if (active) {
          feature.leafletObject.addTo(this.map);
        } else {
          feature.leafletObject.removeFrom(this.map);
        }
      });
    }

    initLayers() {
      this.layers.forEach((layer) => {
        const markerFeatures = layer.features.filter(feature => feature.type === 'marker');
        const polygonFeatures = layer.features.filter(feature => feature.type === 'polygon');
        
        markerFeatures.forEach((feature) => {
          feature.leafletObject = L.marker(feature.coords)
            .bindPopup(feature.name);
        });
        
        polygonFeatures.forEach((feature) => {
          feature.leafletObject = L.polygon(feature.coords)
            .bindPopup(feature.name);
        });
      });
    }

    addMarkers():void {
      if (this.options.markers.length) {
        this.options.markers.forEach((marker: L.marker) => {
          const {lat, lng} = marker.latlng
          L.marker([lat, lng]).addTo(this.map)
          console.log([lat, lng])
        })
      }
    }

    setView () {
      const { latlng, zoom } = this.options
      this.map.setView(latlng, zoom);
    }

    setTileLayer () {
      this.tileLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',{
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
      });
      this.tileLayer.addTo(this.map);
    }

    initMap() {
      this.map = L.map('map')
      this.setView()     
      this.setTileLayer()  
    }
}
</script>