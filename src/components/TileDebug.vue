<template>
  <div class="root">
    <div id="rootMap" class="map"></div>
  </div>
</template>

<script>
  import 'bootstrap'
  import 'ol/ol.css'
  import 'ol'
  import {Map, View} from 'ol'


  import olOSM from 'ol/source/OSM'

  import olLayerTile from 'ol/layer/Tile'
  import olSourceTileDebug from 'ol/source/TileDebug'
  import {transform as olTransform} from 'ol/proj';

  export default {
    name: "TileDebug",
    data() {
      return {
        map: null,
        view: null,
        imap: null,
        zoom: 12,
        resolution: 0,
        center: [0, 0],
        extent: [0, 0, 0, 0],
        moveStep: 10000,
      }
    },
    mounted() {
      this.init();
      // this.initVectorMap();
    }, methods: {
      init() {
        var OSM = new olOSM();
        // var center = [13445675.176432969,3647753.7778898114]

        this.map = new Map({
          target: 'rootMap',

          layers: [
            new olLayerTile({
              source: OSM
            }),
            new olLayerTile({
              source: new olSourceTileDebug({
                projection: 'EPSG:3857',
                tileGrid: OSM.getTileGrid()
              })
            })
          ],
          view: new View({
            // center: center,
            center: olTransform([120.7765829,31.2820007], 'EPSG:4326', 'EPSG:3857'),
            zoom: 12,
            minZoom: 8,
            maxZoom: 14,
          })
        });
      },
    }
  }
</script>

<style scoped>

</style>