<template>
  <div id="rootMap" class="map">
    <div class="btn-group-vertical btnGroups" role="group" aria-label="Button group with nested dropdown">
      <div class="btn-group" role="group">
        <button id="btnGroupDrop1" type="button" class="btn btn-light dropdown-toggle" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
          图层
        </button>
        <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
          <a class="dropdown-item" href="#" v-on:click="switch2OSM">OSM</a>
          <a class="dropdown-item" href="#" v-on:click="switch2BaiduMap">baidu</a>
          <a class="dropdown-item" href="#" v-on:click="switch2Google">google</a>
        </div>
      </div>
      <!--      <button type="button" class="btn btn-secondary">插入</button>-->
      <button type="button" class="btn btn-light" v-if="!turnOnMakerPoint" v-on:click="turnOnMarkPoint">手动标记</button>
      <button type="button" class="btn btn-light" v-else v-on:click="turnOffMarkPoint">关闭标记</button>
      <button type="button" class="btn btn-light" v-on:click="markPointCenter">标记中心</button>
      <button type="button" class="btn btn-light" v-if="!turnOnMakerLine" v-on:click="markLine">测量角度</button>
      <button type="button" class="btn btn-light" v-else v-on:click="markLineOff">取消测量角度</button>
      <button type="button" class="btn btn-light" v-if="!turnOnRangingLine" v-on:click="rangingLine">测距</button>
      <button type="button" class="btn btn-light" v-else v-on:click="rangingLineOff">取消测距</button>
      <button type="button" class="btn btn-light" v-if="!turnOnPolygonDraw" v-on:click="polygonDraw">多边形</button>
      <div class="btn-group-vertical" v-else>
        <button type="button" class="btn btn-light" v-on:click="polygonDrawOff">取消绘制</button>
        <button type="button" class="btn btn-light" v-on:click="removePolygonDrawLastPoint">撤销</button>
      </div>
    </div>
  </div>

</template>

<script>

  // import myMapControls from "@/components/myMap/myMapControls";
  import '@/assets/css/myMap.less'

  // import Vue from 'vue'
  import 'bootstrap'
  import 'ol/ol.css'
  import 'ol'
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

  import localLogoImage from '../../assets/logo.png'
  import olStyleText from 'ol/style/Text'
  import olStyleFill from 'ol/style/Fill'

  export default {
    name: "myMap",
    components: {
      // myMapControls
    },
    data() {
      return {
        map: null,
        view: null,
        source: null,
        zoom: 12,
        resolution: 0,
        center: [0, 0],
        extent: [0, 0, 0, 0],
        moveStep: 10000,
        turnOnMakerPoint: false,
        turnOnMakerLine: false,
        turnOnRangingLine: false,
        turnOnPolygonDraw: false,
        lineDraw: null,
        lineLayer: null,
        drawPolygon: null,
        wordFeature: null,
        EARTH_RADIUS: 6378.137,
        finDist: 0,
        start: false,
        distPoint: [0, 0],
        startPoint: [0, 0],
      }
    },
    mounted() {
      this.init();
      // this.initControls();
    },
    methods: {
      init() {
        let projection = getProjection('EPSG:4326');
        let OSM = new olOSM();

        this.map = new Map({
          target: 'rootMap',
          controls: olControl.defaults({
            attribution: false,
          }).extend([
            new olControl.MousePosition(),
            new olControl.ScaleLine(),
            new olControl.ZoomSlider(),
          ]),
          layers: [
            new olLayerTitle({
              source: OSM
            }),
          ],
          view: new View({
            // extent: [120, 31, 121, 32],
            center: [120.58, 31.30],
            projection: projection,
            zoom: 12,
            minZoom: 4,
            maxZoom: 20,
          })
        });
        this.getMapInfo(this.map);

      },
      initControls() {
        let viewport = this.map.getViewport();
        // window.console.log(viewport);
        $(viewport).append('<button class="btn btn-light btnView" >图层</button>');
        // $(viewport).append();

      },
      initDraw() {
        this.markLineOff()
        this.turnOffMarkPoint()
        this.rangingLineOff()
        this.polygonDrawOff()
      },
      getMapInfo: function (map) {
        let view = map.getView();
        this.zoom = view.getZoom();
        this.resolution = view.getResolution();
        this.extent = view.calculateExtent(map.getSize());
        this.center = getCenter(this.extent);
        this.moveStep = (this.extent[2] - this.extent[0]) / 4;
      },
      switch2OSM() {
        this.markLineOff();
        this.rangingLineOff();
        let OSMMapLayer = new olLayerTitle({
          source: new olOSM()
        })

        this.map.removeLayer(this.map.getLayers().item(0));
        this.map.addLayer(OSMMapLayer)
      },
      switch2Google() {
        this.markLineOff();
        this.rangingLineOff();
        let GoogleMapLayer = new olLayerTitle({
          source: new olXYZ({
            url: 'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i345013117!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0'
          })
        });

        this.map.removeLayer(this.map.getLayers().item(0));
        this.map.addLayer(GoogleMapLayer)
      },
      switch2BaiduMap() {
        this.markLineOff();
        this.rangingLineOff();
        // 自定义分辨率和瓦片坐标系
        let resolutions = [];
        let maxZoom = 18;

        // 计算百度使用的分辨率
        for (let i = 0; i <= maxZoom; i++) {
          resolutions[i] = Math.pow(2, maxZoom - i);
        }
        // new ol.resolutions
        let tilegrid = new olTileGrid({
          origin: [0, 0],    // 设置原点坐标
          resolutions: resolutions    // 设置分辨率
        });

        // 创建百度地图的数据源
        let baiduSource = new olTileImage({
          projection: 'EPSG:3857',
          tileGrid: tilegrid,
          tileUrlFunction: function (tileCoord) {
            let z = tileCoord[0];
            let x = tileCoord[1];
            let y = tileCoord[2];

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

        let baiduMapLayer = new olLayerTitle({
          source: baiduSource
        })

        this.map.removeLayer(this.map.getLayers().item(0));
        this.map.addLayer(baiduMapLayer)
      },
      markLocalImage(map, currentPointer = [120.58, 31.30]) {
        let center = currentPointer;
        window.console.log('center:' + center);
        let activityLayer = new olLayerVector({
          source: new olSourceVector()
        });
        let activity = new olFeature({
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
      turnOnMarkPoint() {
        this.initDraw()
        this.turnOnMakerPoint = true;
        this.map.on('singleclick', this.markPoint);
      },
      turnOffMarkPoint() {
        this.turnOnMakerPoint = false;
        this.map.un('singleclick', this.markPoint);
      },
      markPoint: function (event) {
        window.console.log('currentPoint:' + event.coordinate);
        this.markLocalImage(this.map, event.coordinate)
        // window.console.log(this);
        // this.clickPoint = event.coordinate;
      },
      markPointCenter() {
        let extent = this.map.getView().calculateExtent(this.map.getSize());
        let center = getCenter(extent);
        this.markLocalImage(this.map, center);
      },
      //测量角度
      markLine() {
        this.initDraw()
        // 添加一个绘制的线使用的layer
        this.turnOnMakerLine = true
        let that = this;
        let lineLayer = new olLayerVector({
          source: new olSourceVector(),
          style: new olStyleStyle({
            stroke: new olStyleStroke({
              color: '#26A69A',
              size: 1,
              width: 2,
            })
          })
        });
        this.map.addLayer(lineLayer);
        this.lineDraw = new olInteractionDraw({
          type: 'LineString',
          source: lineLayer.getSource(),
          // 注意设置source，这样绘制好的线，就会添加到这个source里
          style: new olStyleStyle({            // 设置绘制时的样式
            stroke: new olStyleStroke({
              color: '#1DE9B6',
              size: 1,
              width: 2
            })
          }),
          maxPoints: 3    // 限制不超过3个点
        })
        this.map.addInteraction(this.lineDraw);
        this.lineDraw.on('drawend', function (event) {
          let linePoints = event.feature.getGeometry().getCoordinates()
          let aPoint = linePoints[0];
          let bPoint = linePoints[1];
          let cPoint = linePoints[2];
          let ALine = that.distanceOfPoints(bPoint, cPoint);
          let BLine = that.distanceOfPoints(aPoint, cPoint);
          let CLine = that.distanceOfPoints(aPoint, bPoint);
          let angleB = Math.acos((Math.pow(ALine, 2) + Math.pow(CLine, 2) - Math.pow(BLine, 2)) / (2 * ALine * CLine));
          let angleContent = "angleB:" + (180 * angleB / Math.PI).toFixed(2);
          that.wordAnchor(bPoint, angleContent)
          window.console.log(angleContent);
        });

      },
      distanceOfPoints(pointA, pointB) {
        return Math.sqrt(Math.pow((pointA[0] - pointB[0]), 2) + Math.pow((pointA[1] - pointB[1]), 2));
      },
      markLineOff() {
        this.turnOnMakerLine = false;
        this.map.removeInteraction(this.lineDraw);
      },
      // 测距
      rangingDist: function (event) {
        if ((!this.start) && (this.finDist === 0)) {
          window.console.log("startPoint:!");
          this.startPoint = event.coordinate;
          this.start = true;
          this.finDist = 0;
        } else {
          window.console.log("secPoint:!!!!\n");
          this.distPoint = event.coordinate;
          this.finDist += this.distanceOfLatAndLong(this.startPoint, this.distPoint);
          this.startPoint = this.distPoint;
          let dist = 'distence:' + this.finDist.toFixed(2) + 'km';
          this.wordAnchor(this.startPoint, dist)
        }
      },
      rangingLine() {
        this.initDraw()
        // 添加一个绘制的线使用的layer
        this.turnOnRangingLine = true;
        this.source = new olSourceVector()
        let that = this;
        this.lineLayer = new olLayerVector({
          source: this.source,
          style: new olStyleStyle({
            stroke: new olStyleStroke({
              color: '#0277BD',
              size: 1,
              width: 2,
            })
          })
        });
        this.map.addLayer(this.lineLayer);
        this.lineDraw = new olInteractionDraw({
          type: 'LineString',
          source: this.lineLayer.getSource(),
          // 注意设置source，这样绘制好的线，就会添加到这个source里
          style: new olStyleStyle({            // 设置绘制时的样式
            stroke: new olStyleStroke({
              color: '#4FC3F7',
              size: 1,
              width: 4
            })
          }),
          maxPoints: 100
        })
        this.map.addInteraction(this.lineDraw);
        this.lineDraw.on('drawstart', function () {
          that.map.on('click', that.rangingDist);
        });
        this.lineDraw.on('drawend', function (event) {
          let linePoints = event.feature.getGeometry().getCoordinates();
          that.distPoint = linePoints[linePoints.length - 1]
          window.console.log('distPoint:' + that.distPoint + '\nstartPoint:' + that.startPoint)
          that.finDist += that.distanceOfLatAndLong(that.startPoint, that.distPoint);
          let dist = 'distence:' + that.finDist.toFixed(2) + 'km';
          that.wordAnchor(that.distPoint, dist);
          that.startPoint = [0, 0];
          that.start = false;
          that.finDist = 0;
          that.map.un('click', that.rangingDist);
        });
      },
      rangingLineOff() {

        this.turnOnRangingLine = false;
        // this.map.removeLayer(this.lineLayer)
        this.map.removeInteraction(this.lineDraw);
        this.map.un('click', this.rangingDist);
        this.startPoint = [0, 0];
        this.start = false;
        this.finDist = 0;
      },
      distanceOfLatAndLong(pointA, pointB) {
        let latRad = this.rad(pointA[0] - pointB[0]);
        let longRad = this.rad(pointA[1] - pointB[1]);
        let latRadA = this.rad(pointA[0]);
        let latRadB = this.rad(pointB[0]);
        let a = Math.sin(latRad / 2) * Math.sin(latRad / 2) + Math.cos(latRadA) * Math.cos(latRadB) * Math.sin(longRad / 2) * Math.sin(longRad / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = this.EARTH_RADIUS * c;
        window.console.log('distanceOfLatAndLong:' + d);
        return d;
      },
      rad(d) {
        return d * Math.PI / 180.0;
      },
      //设置文字
      wordAnchor(center = [120.58, 31.30], textcontent = "none", fontColor = 'black') {
        this.source = new olSourceVector()
        this.map.removeLayer(this.lineLayer)
        // let lastFeature = this.wordFeature
        // window.console.log(this.wordFeature)
        // if (lastFeature !== null) {
        //   this.lineLayer.getSource().removeFeature(lastFeature)
        //   lastFeature = null
        // }
        this.wordFeature = new olFeature({
          geometry: new olGeomPoint(center)
        });
        this.wordFeature.setStyle(new olStyleStyle({
          text: new olStyleText({
            font: '18px bold sans-serif ', //默认这个字体，可以修改成其他的，格式和css的字体设置一样
            text: textcontent,
            fill: new olStyleFill({
              color: fontColor,
            })
          })
        }))
        this.lineLayer.getSource().addFeature(this.wordFeature)
        this.map.addLayer(this.lineLayer)

        window.console.log('??????finDist????' + textcontent + '\nPoint:' + center)
      },
      // 绘制多边形
      polygonDraw() {
        this.initDraw()
        this.turnOnPolygonDraw = true
        this.source = new olSourceVector()
        let that = this
        let color = 'rgba(255, 255, 0, 0.3)'
        let colorLine = '#F57F17'
        let polygonLayer = new olLayerVector({
          source: this.source,
          /*图形绘制好时最终呈现的样式,显示在地图上的最终图形*/
          style: new olStyleStyle({
            fill: new olStyleFill({
              color: color
            }),
            stroke: new olStyleStroke({
              color: colorLine,
              width: 2
            }),
            image: new olStyleCircle({
              radius: 4,
              fill: new olStyleFill({
                color: colorLine
              })
            })
          })
        })
        this.map.addLayer(polygonLayer)
        this.drawPolygon = new olInteractionDraw({
          source: this.source,
          type: 'Polygon',
          /*用于交互绘制图形时所设置的样式*/
          style: new olStyleStyle({
            fill: new olStyleFill({
              color: color
            }),
            stroke: new olStyleStroke({//边框
              color: colorLine,
              width: 2
            }),
            image: new olStyleCircle({//鼠标跟随
              radius: 8,
              stroke: new olStyleStroke({
                color: colorLine
              }),
              fill: new olStyleFill({
                color: color
              })
            })
          })
        })
        this.map.addInteraction(this.drawPolygon)


      },
      polygonDrawOff() {
        this.turnOnPolygonDraw = false
        this.map.removeInteraction(this.drawPolygon)
      },
      removePolygonDrawLastPoint() {
        this.drawPolygon.removeLastPoint()
      },

    }
  }
</script>

<style scoped lang="less">
  /**
          * 提示框的样式信息
          */
  .tooltip {
    position: relative;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    color: white;
    padding: 4px 8px;
    opacity: 0.7;
    white-space: nowrap;
  }

  .tooltip-measure {
    opacity: 1;
    font-weight: bold;
  }

  .tooltip-static {
    background-color: #ffffff;
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
    border-top-color: #ffffff;
  }


</style>
