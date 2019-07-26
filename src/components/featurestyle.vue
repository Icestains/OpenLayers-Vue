<template>
  <div class="root">
    <div id="rootMap" class="map"></div>
  </div>
</template>

<script>
  import 'ol/ol.css'
  import 'ol'
  import {Map, View} from 'ol'

  import olLayerTitle from 'ol/layer/Tile'
  import olLayerVector from 'ol/layer/Vector'
  import olSourceVector from 'ol/source/Vector'

  import olStyleStyle from 'ol/style/Style'
  import olStyleIcon from 'ol/style/Icon'
  import olStyleText from 'ol/style/Text'
  import olStyleFill from 'ol/style/Fill'
  import olStyleRegularShape from 'ol/style/RegularShape'
  import olStyleStroke from 'ol/style/Stroke'
  import olGeomPoint from 'ol/geom/Point'
  import olFeature from 'ol/Feature'

  import {get as getProjection} from 'ol/proj';

  import olOSM from 'ol/source/OSM'
  import localLogoImage from '../assets/logo.png'

  export default {
    name: "overlay",
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
    },
    methods: {
      init() {
        var OSM = new olOSM();
        var projection = getProjection('EPSG:4326');
        // var center = [120.77215829, 31.2830007];
        var center = [120.58, 31.30];

        var layer = new olLayerVector({
          source: new olSourceVector()
        });

        this.map = new Map({
          target: 'rootMap',
          layers: [
            new olLayerTitle({
              source: OSM
            }),
            layer,

          ],
          view: new View({
            extent: [120, 31, 121, 32],
            center: center,
            projection: projection,
            zoom: 10,
            minZoom: 8,
            maxZoom: 14,
          })
        });
        // 创建一个Feature，并设置好在地图上的位置
        var anchor = new olFeature({
          geometry: new olGeomPoint(center)
        });
        // 设置样式，在样式中就可以设置图标
        anchor.setStyle(new olStyleStyle({
          image: new olStyleIcon({
            src: localLogoImage,
            anchor: [0.5, 1],
            scale: 0.4,
          })
        }));
        layer.getSource().addFeature(anchor);
        this.map.getView().on('change:resolution', function () {
          var style = anchor.getStyle();
          // 重新设置图标的缩放率，基于层级10来做缩放
          style.getImage().setScale(this.getZoom() / 25);
          anchor.setStyle(style);
        })

        var anchorSVG = new olFeature({
          geometry: new olGeomPoint(center)
        });
        // 构建svg的Image对象
        var svg = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 30 30" enable-background="new 0 0 30 30" xml:space="preserve">' +
          '<path fill="#156BB1" d="M22.906,10.438c0,4.367-6.281,14.312-7.906,17.031c-1.719-2.75-7.906-12.665-7.906-17.031S10.634,2.531,15,2.531S22.906,6.071,22.906,10.438z"/>' +
          '<circle fill="#FFFFFF" cx="15" cy="10.677" r="3.291"/></svg>';
        var mysvg = new Image();
        mysvg.src = 'data:image/svg+xml,' + escape(svg);
        anchorSVG.setStyle(new olStyleStyle({
          image: new olStyleIcon({
            img: mysvg,    // 设置Image对象
            anchor: [0.5, 1],
            imgSize: [30, 30]    // 及图标大小
//          src: 'http://www.williambuck.com/portals/0/Skins/WilliamBuck2014/images/location-icon.svg',
//          size: [30, 30]
          })
        }));
        layer.getSource().addFeature(anchorSVG);

        // 添加一个三角形
        var shape = new olFeature({
          geometry: new olGeomPoint(center)
        });
        shape.setStyle(new olStyleStyle({
          image: new olStyleRegularShape({
            points: 6,    // 顶点数
            // radius: 100,    // 图形大小，单位为像素
            radius1: 30,
            radius2: 15,
            anchor: [0, 0],
            stroke: new olStyleStroke({ // 设置边的样式
              color: 'green',
              size: 20
            })
          })
        }));

        layer.getSource().addFeature(shape);

        // 添加一个五星
        var star = new olFeature({
          geometry: new olGeomPoint([center[0] - 0.2, center[1] - 0.2])
        });
        star.setStyle(new olStyleStyle({
          image: new olStyleRegularShape({
            points: 5,    // 顶点个数
            radius1: 20, // 外圈大小
            radius2: 10, // 内圈大小
            anchor: [2, 2],
            stroke: new olStyleStroke({ // 设置边的样式
              color: 'red',
              size: 2
            }),
            fill: new olStyleFill({ // 设置五星填充样式
              color: 'blue'
            })
          })

        }));

        layer.getSource().addFeature(star);

        // 设置文字style
        var wordAnchor = new olFeature({
          geometry: new olGeomPoint(center)
        });
        wordAnchor.setStyle(new olStyleStyle({
          text: new olStyleText({
            // font: '10px sans-serif' 默认这个字体，可以修改成其他的，格式和css的字体设置一样
            text: 'im here',
            fill: new olStyleFill({
              color: 'red'
            })
          })
        }));
        layer.getSource().addFeature(wordAnchor);
      },
    }
  }
</script>

<style scoped>

</style>