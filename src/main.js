import Vue from 'vue'
import App from './App.vue'
import 'bootstrap'
import "bootstrap/dist/css/bootstrap.css"
import $ from 'jquery'
import router from "@/router";

import {Map, View} from 'ol'
import * as olControl from 'ol/control'

import olLayerTitle from 'ol/layer/Tile'
import olLayerVector from 'ol/layer/Vector'

import olOSM from 'ol/source/OSM'
import olXYZ from 'ol/source/XYZ'
import olSourceVector from 'ol/source/Vector'

import olTileImage from 'ol/source/TileImage'
import olTileGrid from 'ol/tilegrid/TileGrid'

import {get as getProjection} from 'ol/proj';

import olGeomPoint from 'ol/geom/Point'
import olGeomPolygon from 'ol/geom/Polygon'
import olGeomLineString from 'ol/geom/LineString'
import olFeature from 'ol/Feature'
import {getCenter as getCenter} from 'ol/extent'
import olOverlay from 'ol/Overlay'

import olStyleStyle from 'ol/style/Style'
import olStyleIcon from 'ol/style/Icon'
import olStyleStroke from 'ol/style/Stroke'
import olStyleCircle from 'ol/style/Circle'
import olInteractionDraw from 'ol/interaction/Draw'

import localLogoImage from '@/assets/logo.png'
import olStyleText from 'ol/style/Text'
import olStyleFill from 'ol/style/Fill'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
