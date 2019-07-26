<template>
  <div id="app">
    <!--    <nav class="navbar navbar-expand-lg navbar-light bg-light ">-->
    <!--      <a class="navbar-brand" href="#">地图类型</a>-->
    <!--      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"-->
    <!--              aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">-->
    <!--        <span class="navbar-toggler-icon"></span>-->
    <!--      </button>-->
    <!--      <div class="collapse navbar-collapse" id="navbarNav">-->
    <!--        <ul class="navbar-nav">-->
    <!--          <li class="nav-item">-->
    <!--            <router-link class="nav-link" to="/">map</router-link>-->
    <!--          </li>-->
    <!--          <li class="nav-item">-->
    <!--            <router-link class="nav-link" to="/openLayers">OpenLayers</router-link>-->
    <!--          </li>-->
    <!--          <li class="nav-item">-->
    <!--            <router-link class="nav-link" to="/localImg">localImg</router-link>-->
    <!--          </li>-->
    <!--          <li class="nav-item">-->
    <!--            <router-link class="nav-link" to="/TileDebug">TileDebug</router-link>-->
    <!--          </li>-->
    <!--          <li class="nav-item">-->
    <!--            <router-link class="nav-link" to="/featureStyle">featureStyle</router-link>-->
    <!--          </li>-->
    <!--          <li class="nav-item">-->
    <!--            <router-link class="nav-link" to="/onFunctions">onFunctions</router-link>-->
    <!--          </li>-->
    <!--        </ul>-->
    <!--      </div>-->
    <!--    </nav>-->
    <router-view/>
    <!--    <myMap ref="mymap"></myMap>-->
    <!--      <li class="nav-item dropdown">-->
    <!--        <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true"-->
    <!--           aria-expanded="false">图层</a>-->
    <!--        <div class="dropdown-menu">-->
    <!--          <a class="dropdown-item" href="#" v-on:click="switch2OSM">OSM</a>-->
    <!--          <a class="dropdown-item" href="#" v-on:click="switch2BaiduMap">baidu</a>-->
    <!--          <a class="dropdown-item" href="#" v-on:click="switch2Google">google</a>-->
    <!--        </div>-->
    <!--      </li>-->
    <!--      <li class="nav-item">-->
    <!--        <a class="nav-link active" v-if="!turnOnMakerPoint" v-on:click="turnOnMarkPoint" href="#">手动标记</a>-->
    <!--        <a class="nav-link active" v-else v-on:click="turnOffMarkPoint" href="#">手动标记</a>-->
    <!--      </li>-->
    <ul class="nav  nav-fill fixed-bottom  flex-sm-row">
      <li class="nav-item">
        <router-link class="nav-link" to="/">myMap</router-link>
        <!--        <a class="nav-link" href="#">Link</a>-->
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/measure">measure</router-link>
        <!--        <a class="nav-link" href="#" tabindex="-1">new</a>-->
      </li>
    </ul>
  </div>
</template>

<script>
  import 'jquery'
  import 'bootstrap'
  import 'ol/ol.css'
  import 'ol'

  // import myMap from '@/components/myMap/myMap'
  // import '@/assets/css/myMap.less'
  // import measure from '@/components/measure'


  export default {
    name: 'app',
    components: {
      // myMap,
      // measure
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style lang="less">
  @mapHeight: 600px;
  @navLinkHeight: 40px;


  body, html {
    margin: 0;
    padding: 0;
    height: 100vh;
  }

  #app {
    height: 100%;
  }

  .map {
    /*max-width: 1200px;*/
    height: @mapHeight;
    background: whitesmoke;
    /*display: flex;*/
    /*flex-direction: row-reverse;*/
    overflow: hidden;
  }

  .controls {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    padding: 2px 4px;

    button {
      margin: 1px;
    }
  }

  .nav-link {
    background: whitesmoke;
  }

  .tooltip {
    position: relative;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    color: white;
    padding: 4px 8px;
    /*opacity: 0.7;*/
    white-space: nowrap;
    width: 80px;
    opacity: 1 !important;

  }

  .tooltip-measure {
    font-weight: bold;
  }

  .tooltip-static {
    background-color: #ffcc33;
    color: black;
    border: 1px solid white;
  }

  .tooltip-measure:before,
  .tooltip-static:before {
    border-top: 6px solid rgba(0, 0, 0, 0.5);
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    content: "";
    position: absolute;
    bottom: -6px;
    margin-left: -7px;
    left: 50%;
  }

  .tooltip-static:before {
    border-top-color: #ffcc33;
  }

  .hidden{
    display: none;
  }



</style>
