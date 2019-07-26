<template>
  <div class="root" id="local">
    <!--  离线图片展示模块-->
    <div id="imageMap" class="map"></div>
    <div class="controls">
      <button type="button" class="btn btn-outline-primary" v-on:click="markLocalImage(imap)">标记中心</button>
    </div>
<!--    <div id="VectorMap" class="map"></div>-->
  </div>
</template>

<script>
  import 'bootstrap'

  import 'ol'
  import {Map, View} from 'ol'

  import olLayerImage from 'ol/layer/Image'
  import olLayerVector from 'ol/layer/Vector'
  import olProjProjection from 'ol/proj/Projection';
  import olSourceImageStatic from 'ol/source/ImageStatic'
  import olSourceVector from 'ol/source/Vector'
  import {getCenter as getCenter} from 'ol/extent'

  import olStyleStyle from 'ol/style/Style'
  import olStyleIcon from 'ol/style/Icon'
  import olGeomPoint from 'ol/geom/Point'
  import olFeature from 'ol/Feature'

  import localBackImage from '../assets/backimage.jpg'
  import localLogoImage from '../assets/logo.png'


  export default {
    name: "localImg",
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
      this.initLocalImage();
    },
    methods: {
      initLocalImage() {
        var extent = [0, 0, 2732, 2048];
        var projection = new olProjProjection({
          code: 'xkcd-image',
          units: 'pixels',
          extent: extent
        });

        this.imap = new Map({
          target: 'imageMap',

          layers: [
            new olLayerImage({
              source: new olSourceImageStatic({
                url: localBackImage,
                imageExtent: extent,
              })
            })
          ],
          view: new View({
            extent: extent,
            center: getCenter(extent),
            projection: projection,
            zoom: 2,
            minZoom: 1,
            maxZoom: 5,
          }),
        });
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
    }
  }
</script>

<style scoped lang="less">


</style>