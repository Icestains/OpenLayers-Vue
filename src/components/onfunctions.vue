<template>
  <div class="root">
    <div id="rootMap" class="map"></div>
    <div class="controls">
      <button class="btn btn-outline-secondary" disabled>zoom: {{ zoom }}</button>
      <button class="btn btn-outline-secondary" disabled>resolution: {{ resolution }}</button>
      <button class="btn btn-outline-secondary" disabled>center: {{ center }}</button>
      <button class="btn btn-outline-secondary" disabled>click point: {{ clickPoint }}</button>
      <button class="btn btn-outline-secondary" disabled>extent: {{ extent }}</button>
    </div>
    <div class="controls">
      <button type="button" class="btn btn-outline-primary" v-on:click="cancelSingleClickListener">注销点击事件</button>
      <button type="button" class="btn btn-outline-primary" v-on:click="turnOnSingleClickListener">开启点击事件</button>
    </div>
  </div>
</template>

<script>
  import 'bootstrap'
  import 'ol/ol.css'
  import 'ol'
  import {Map, View} from 'ol'
  import olLayerTitle from 'ol/layer/Tile'
  import olOSM from 'ol/source/OSM'
  import {get as getProjection} from 'ol/proj';
  import {getCenter as getCenter} from 'ol/extent'

  export default {
    name: "onfunctions",
    data() {
      return {
        map: null,
        view: null,
        imap: null,
        zoom: 12,
        resolution: 0,
        clickPoint: [0, 0],
        center: [120.58, 31.30],
        extent: [0, 0, 0, 0],
        moveStep: 10000,
      }
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        var that = this;
        const projection = getProjection('EPSG:4326');
        var OSM = new olOSM();
        this.map = new Map({
          target: 'rootMap',
          layers: [
            new olLayerTitle({
              source: OSM
            }),
          ],
          view: new View({
            extent: [120, 31, 121, 32],
            center: [120.58, 31.30],
            projection: projection,
            zoom: 12,
            minZoom: 8,
            maxZoom: 14,
          })
        });

        this.getMapInfo(this.map);
        this.map.getView().on('change:resolution', function () {
          that.getMapInfo(that.map)
        });
        this.map.getView().on('change:center', function () {
          that.getMapInfo(that.map)
        });
        this.map.on('pointerdrag', function () {
          that.getMapInfo(that.map)
        });
        this.map.on('singleclick', this.singleClickListener);
      },
      cancelSingleClickListener() {
        this.map.un('singleclick', this.singleClickListener);
      },
      singleClickListener: function (event) {
        window.console.log(event.coordinate);
        // window.console.log(this);
        this.clickPoint = event.coordinate;
      },
      turnOnSingleClickListener() {
        this.map.on('singleclick', this.singleClickListener);
      },
      getMapInfo: function (map) {
        const view = map.getView();
        this.zoom = view.getZoom();
        this.resolution = view.getResolution();
        this.extent = view.calculateExtent(map.getSize());
        this.center = getCenter(this.extent);
        this.moveStep = (this.extent[2] - this.extent[0]) / 4;
      },

    }
  }

</script>

<style scoped>

</style>