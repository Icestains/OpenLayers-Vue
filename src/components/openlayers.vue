<template>
  <div id="openLayers" class="root">
    <div id="rootMap" class="map"></div>

    <div class="controls">
      <span>地图源：</span>
      <div class="custom-control custom-radio" v-on:click="switch2OSM">
        <input type="radio" id="customRadio1" name="customRadio" class="custom-control-input" checked>
        <label class="custom-control-label" for="customRadio1">OSM</label>
      </div>
      <div class="custom-control custom-radio" v-on:click="switch2BaiduMap">
        <input type="radio" id="customRadio2" name="customRadio" class="custom-control-input">
        <label class="custom-control-label" for="customRadio2">baidu</label>
      </div>
      <!--<div class="custom-control custom-radio" v-on:click="switch2BaiduFixed">-->
      <!--<input type="radio" id="customRadio4" name="customRadio" class="custom-control-input">-->
      <!--<label class="custom-control-label" for="customRadio4">BD-MC</label>-->
      <!--</div>-->
      <div class="custom-control custom-radio" v-on:click="switch2Google">
        <input type="radio" id="customRadio3" name="customRadio" class="custom-control-input">
        <label class="custom-control-label" for="customRadio3">google</label>
      </div>
      <!--<div class="custom-control custom-radio" v-on:click="switch2LocalImage">-->
      <!--<input type="radio" id="customRadio4" name="customRadio" class="custom-control-input">-->
      <!--<label class="custom-control-label" for="customRadio4">local</label>-->
      <!--</div>-->
    </div>
    <div class="controls">
      <button class="btn btn-outline-secondary" disabled>zoom: {{ zoom }}</button>
      <button class="btn btn-outline-secondary" disabled>resolution: {{ resolution }}</button>
      <button class="btn btn-outline-secondary" disabled>center: {{ center }}</button>
      <button class="btn btn-outline-secondary" disabled>extent: {{ extent }}</button>
    </div>
    <div class="controls">
      <button type="button" class="btn btn-outline-primary" v-on:click="moveToLeft">left</button>
      <button type="button" class="btn btn-outline-primary" v-on:click="moveToRight">Right</button>
      <button type="button" class="btn btn-outline-primary" v-on:click="moveToUp">up</button>
      <button type="button" class="btn btn-outline-primary" v-on:click="moveToDown">down</button>
    </div>
    <div class="controls">
      <button type="button" class="btn btn-outline-primary" v-on:click="zoomOut">放大</button>
      <button type="button" class="btn btn-outline-primary" v-on:click="zoomIn">缩小</button>
      <button type="button" class="btn btn-outline-primary" v-on:click="moveToSuZhou">苏州</button>
      <button type="button" class="btn btn-outline-primary" v-on:click="fitToSuZhou">显示苏州</button>
      <button type="button" class="btn btn-outline-primary" v-on:click="markLocalImage(map)">标记中心</button>
    </div>

  </div>
</template>

<script>
  import Vue from 'vue'
  import 'bootstrap'
  import 'ol/ol.css'
  import 'ol'
  import {Map, View} from 'ol'

  import olLayerTitle from 'ol/layer/Tile'
  import olLayerVector from 'ol/layer/Vector'

  import olOSM from 'ol/source/OSM'
  import olXYZ from 'ol/source/XYZ'
  import olSourceVector from 'ol/source/Vector'

  import olTileImage from 'ol/source/TileImage'
  import olTileGrid from 'ol/tilegrid/TileGrid'

  import {get as getProjection} from 'ol/proj';

  import olGeomPoint from 'ol/geom/Point'
  import olFeature from 'ol/Feature'
  import {getCenter as getCenter} from 'ol/extent'

  import olStyleStyle from 'ol/style/Style'
  import olStyleIcon from 'ol/style/Icon'

  import localLogoImage from '../assets/logo.png'

  // import olLayerTile from 'ol/layer/Tile'
  // import olSourceTileDebug from 'ol/source/TileDebug'
  // import {transform as olTransform} from 'ol/proj';
  // import getTileGrid from 'ol/source/OSM'
  // import olFormatGeoJSON from 'ol/format/GeoJSON'
  // import olStyleStroke from 'ol/style/Stroke'
  // import localVectorGeoJSON from '../assets/vector'

  export default {
    name: "rootMap",
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
    },
    methods: {
      init() {
        var projection = getProjection('EPSG:4326');
        var OSM = new olOSM();
        // var that = this;

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

      },
      getMapInfo: function (map) {
        var view = map.getView();
        this.zoom = view.getZoom();
        this.resolution = view.getResolution();
        this.extent = view.calculateExtent(map.getSize());
        this.center = getCenter(this.extent);
        this.moveStep = (this.extent[2] - this.extent[0]) / 4;
      },
      zoomIn() {
        var view = this.map.getView();
        view.setZoom(view.getZoom() - 1);
      },
      zoomOut() {
        var view = this.map.getView();
        view.setZoom(view.getZoom() + 1);
      },
      moveToSuZhou() {
        var view = this.map.getView();
        view.setCenter([120.58, 31.30]);
        this.map.render();
      },
      moveToLeft() {
        var view = this.map.getView();
        var mapCenter = view.getCenter();
        // 让地图中心的x值增加，即可使得地图向左移动，增加的值根据效果可自由设定
        mapCenter[0] += this.moveStep;
        view.setCenter(mapCenter);
        this.center = mapCenter;
        Vue.set(this.center, mapCenter);
        this.map.render();
      },
      moveToRight() {
        var view = this.map.getView();
        var mapCenter = view.getCenter();
        // 让地图中心的x值增加，即可使得地图向左移动，增加的值根据效果可自由设定
        mapCenter[0] -= this.moveStep;
        view.setCenter(mapCenter);
        this.getMapInfo(this.map);

        this.map.render();
      },
      moveToUp() {
        var view = this.map.getView();
        var mapCenter = view.getCenter();
        // 让地图中心的x值增加，即可使得地图向左移动，增加的值根据效果可自由设定
        mapCenter[1] += this.moveStep;
        view.setCenter(mapCenter);
        this.getMapInfo(this.map);

        this.map.render();
      },
      moveToDown() {
        var view = this.map.getView();
        var mapCenter = view.getCenter();
        // 让地图中心的x值增加，即可使得地图向左移动，增加的值根据效果可自由设定
        mapCenter[1] -= this.moveStep;
        view.setCenter(mapCenter);
        this.getMapInfo(this.map);
        this.map.render();

      },
      fitToSuZhou() {

        this.map.getView().fit([120.46, 31.24, 120.70, 31.36], this.map.getSize())
      },
      switch2BaiduMap() {

        // 自定义分辨率和瓦片坐标系
        var resolutions = [];
        var maxZoom = 18;

        // 计算百度使用的分辨率
        for (var i = 0; i <= maxZoom; i++) {
          resolutions[i] = Math.pow(2, maxZoom - i);
        }
        // new ol.resolutions
        var tilegrid = new olTileGrid({
          origin: [0, 0],    // 设置原点坐标
          resolutions: resolutions    // 设置分辨率
        });

        // 创建百度地图的数据源
        var baiduSource = new olTileImage({
          projection: 'EPSG:3857',
          tileGrid: tilegrid,
          tileUrlFunction: function (tileCoord) {
            var z = tileCoord[0];
            var x = tileCoord[1];
            var y = tileCoord[2];

            // 百度瓦片服务url将负数使用M前缀来标识
            if (x < 0) {
              x = 'M' + (-x);
            }
            if (y < 0) {
              y = 'M' + (-y);
            }

            return "http://online0.map.bdimg.com/onlinelabel/?qt=tile&x=" + x + "&y=" + y + "&z=" + z + "&styles=pl&udt=20160426&scaler=1&p=0";
          }
        });

        var baiduMapLayer = new olLayerTitle({
          source: baiduSource
        })

        this.map.removeLayer(this.map.getLayers().item(0));
        this.map.addLayer(baiduMapLayer)
      },
      // switch2BaiduFixed(){
      //   var baidu = new olTitle({
      //     title: 'Baidu',
      //     source: new olXYZ({
      //       projection: 'BD-MC',
      //       maxZoom: 19,
      //       tileUrlFunction: function (tileCoord) {
      //         var URLS_LENGTH = 5
      //
      //         var x = tileCoord[1]
      //         var y = tileCoord[2]
      //         var z = tileCoord[0]
      //
      //         var hash = (x << z) + y
      //         var index = hash % URLS_LENGTH
      //         index = index < 0 ? index + URLS_LENGTH : index
      //
      //         if (x < 0) {
      //           x = 'M' + (-x)
      //         }
      //         if (y < 0) {
      //           y = 'M' + (-y)
      //         }
      //         return 'http://online{}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl'
      //           .replace('{}', index).replace('{x}', x).replace('{y}', y).replace('{z}', z)
      //       },
      //       tileGrid: new olTileGrid({
      //         extent: olTransformExtent([-180, -74, 180, 74], 'EPSG:4326', 'BD-MC'),
      //         origin: [0, 0],
      //         resolutions: [
      //           262144, 131072, 65536, 32768, 16384, 8192, 4096, 2048,
      //           1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5,
      //         ],
      //         // resolutions: 'BD-MC'
      //       }),
      //     })
      //   });
      //   this.map.removeLayer(this.map.getLayers().item(0));
      //   this.map.addLayer(baidu)
      // },
      switch2OSM() {

        var OSMMapLayer = new olLayerTitle({
          source: new olOSM()
        })

        this.map.removeLayer(this.map.getLayers().item(0));
        this.map.addLayer(OSMMapLayer)
      },
      switch2Google() {
        var GoogleMapLayer = new olLayerTitle({
          source: new olXYZ({
            url: 'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i345013117!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0'
          })
        });

        this.map.removeLayer(this.map.getLayers().item(0));
        this.map.addLayer(GoogleMapLayer)
      },
      markLocalImage(map) {
        var extent = map.getView().calculateExtent(map.getSize());
        var center = getCenter(extent);
        window.console.log('extent:' + extent);
        window.console.log('center:' + center);
        var activityLayer = new olLayerVector({
          source: new olSourceVector()
        });
        var activity = new olFeature({
          geometry: new olGeomPoint([center[0], center[1]])
        });
        activity.setStyle(new olStyleStyle({
          image: new olStyleIcon({
            src: localLogoImage,
            anchor: [0.5, 1],
            scale: 0.2
          })
        }))
        activityLayer.getSource().addFeature(activity);
        map.addLayer(activityLayer);
      },
      // initVectorMap() {
      //   // var that = this;
      //   // var vectorLayer = null;
      //   // var map = new Map({
      //   //   layers: [
      //   //     new olLayerTile({
      //   //       source: new olOSM()
      //   //     })
      //   //   ],
      //   //   view: new View({
      //   //     center: [-72.980624870461128, 48.161307640513321],
      //   //     zoom: 8,
      //   //     projection: 'EPSG:4326'
      //   //   }),
      //   //   target: 'VectorMap'
      //   // });
      //   // var jsonurl = '../assets/vector.json';
      //   // window.console.log(jsonurl)
      //   // $.getJSON(
      //   //   jsonurl,
      //   //   function (data) {
      //   //     window.console.log('???'+data);
      //   //   }
      //   // )
      //   // $.ajax({
      //   //   url: localVectorGeoJSON,
      //   //   success: function (data, status) {
      //   //     window.console.log(data);
      //   //     that.vectorJSON = data;
      //   //     vectorLayer = that.getGeoJSON(data);
      //   //     return data;
      //   //   }
      //   // })
      //
      //   // map.addLayer(vectorLayer);
      // },
      // getGeoJSON(src) {
      //   var newVectorLayer=  new olLayerVector({
      //     source: new olSourceVector({
      //       feature: (new olFormatGeoJSON()).readFeatures(src, {
      //           dataProjection: 'EPSG:4326',    // 设定JSON数据使用的坐标系
      //           featureProjection: 'EPSG:3857' // 设定当前地图使用的feature的坐标系
      //         }
      //       )
      //     }),
      //     // 设置样式，颜色为红色，线条粗细为1个像素
      //     style: new olStyleStyle({
      //       stroke: new olStyleStroke({
      //         color: 'red',
      //         size: 1
      //       })
      //     })
      //   });
      //   return newVectorLayer;
      // },

    },
  }

</script>

<style scoped lang="less">

  /*#openLayers {*/
  /*  display: flex;*/
  /*  flex-direction: column;*/
  /*  height: 100%;*/
  /*}*/

</style>