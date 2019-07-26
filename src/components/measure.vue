<template>
  <div class="root">
    <div id="map" class="map"></div>
    <label>Measurement type &nbsp;</label>
    <!--      <select id="type">-->
    <!--        <option value="length">Length (LineString)</option>-->
    <!--        <option value="area">Area (Polygon)</option>-->
    <!--      </select>-->
    <select @change="selectVal" v-model="selected">
      <option v-for="item in selects" v-bind:key="item.value">{{ item.value }}</option>
    </select>
    <p>length:{{ lineLength }}</p>
  </div>
</template>

<script>
  import 'ol/ol.css'
  import Map from 'ol/Map.js';
  import {
    unByKey
  } from 'ol/Observable.js';
  import Overlay from 'ol/Overlay.js';
  import {
    getArea,
    getLength
  } from 'ol/sphere.js';
  import View from 'ol/View.js';
  import {
    LineString,
    Polygon
  } from 'ol/geom.js';
  import Draw from 'ol/interaction/Draw.js';
  import {
    Tile as TileLayer,
    Vector as VectorLayer
  } from 'ol/layer.js';
  import {
    OSM,
    Vector as VectorSource
  } from 'ol/source.js';
  import {
    Circle as CircleStyle,
    Fill,
    Stroke,
    Style
  } from 'ol/style.js';
  import olGeomPoint from 'ol/geom/Point'
  import olFeature from 'ol/Feature'

  /**
   * Format length output.
   * @param {module:ol/geom/LineString~LineString} line The line.
   * @return {string} The formatted length.
   */


  /**
   * Format area output.
   * @param {module:ol/geom/Polygon~Polygon} polygon The polygon.
   * @return {string} Formatted area.
   */


  export default {
    name: "measure",
    data() {
      return {
        lineLength: '',
        selected: 'length',
        selects: [
          {value: 'length'},
          {value: 'area'}
        ],
        source: null,
        measureTooltipElement: null,
        measureTooltip: null,
        continuePolygonMsg: 'Click to continue drawing the polygon',
        continueLineMsg: 'Click to continue drawing the line',
        draw: null,
        map: null,
        sketch: null,
        helpTooltip: null,
        helpTooltipElement: null,
      }
    },
    created() {
    },
    mounted() {
      this.init()
      this.addInteraction()
    },
    methods: {
      // addInteraction(){
      //   addInteraction()
      // },
      init() {
        let that = this
        let raster = new TileLayer({
          source: new OSM()
        });
        let count = 0

        this.source = new VectorSource();

        let vector = new VectorLayer({
          source: this.source,
          style: new Style({
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new Stroke({
              color: '#ffcc33',
              width: 2
            }),
            image: new CircleStyle({
              radius: 7,
              fill: new Fill({
                color: '#ffcc33'
              })
            })
          })
        })

        this.map = new Map({
          layers: [raster, vector],
          target: 'map',
          view: new View({
            center: [120.58, 31.30],
            projection: 'EPSG:4326',
            zoom: 15
          })
        });
        this.map.on('pointermove', this.pointerMoveHandler);
        //地图单击事件
        this.map.on('singleclick', function (evt) {
          //设置测量提示信息的位置坐标，用来确定鼠标点击后测量提示框的位置
          that.measureTooltip.setPosition(evt.coordinate);
          //如果是第一次点击，则设置测量提示框的文本内容为起点
          if (count === 0) {
            that.measureTooltipElement.innerHTML = "起点";
            window.console.log(count)

          }
          //根据鼠标点击位置生成一个点
          var point = new olGeomPoint(evt.coordinate);
          //将该点要素添加到矢量数据源中
          that.source.addFeature(new olFeature(point));
          //更改测量提示框的样式，使测量提示框可见
          that.measureTooltipElement.className = 'tooltip tooltip-static';
          //创建测量提示框
          that.createMeasureTooltip();
          //点击次数增加
          count++;
          // window.console.log(count)
        })

        //地图双击事件
        this.map.on('dblclick', function (evt) {
          //根据
          var point = new olGeomPoint(evt.coordinate);
          that.source.addFeature(new olFeature(point));
        })

        this.map.getViewport().addEventListener('mouseout', function () {
          that.helpTooltipElement.classList.add('hidden');
          window.console.log(that.helpTooltipElement.classList)

        })

      },
      formatLength: function (line) {
        let length = getLength(line);
        let output;
        length = length * 100000
        if (length > 1000) {
          output = (Math.round(length / 1000 * 100) / 100) +
            ' ' + 'km';
        } else {
          output = (Math.round(length * 100) / 100) +
            ' ' + 'm';
        }
        return output;
      },
      formatArea: function (polygon) {
        let area = getArea(polygon)
        let output
        area = area * 100
        //area 100km*100km=10*10^4 km^2 =100 * 100km^2
        if (area > 1) {
          output = (Math.round(area * 100) / 100) +
            ' ' + 'km<sup>2</sup>';
        } else {
          output = (Math.round(area * 1000000 * 100) / 100) +
            ' ' + 'm<sup>2</sup>';
        }
        return output;
      },
      addInteraction() {
        let that = this
        let type = (this.selected === 'area' ? 'Polygon' : 'LineString');
        this.draw = new Draw({
          source: this.source,
          type: type,
          style: new Style({
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new Stroke({
              color: 'rgba(0, 0, 0, 0.5)',
              lineDash: [10, 10],
              width: 2
            }),
            image: new CircleStyle({
              radius: 5,
              stroke: new Stroke({
                color: 'rgba(0, 0, 0, 0.7)'
              }),
              fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)'
              })
            })
          })
        })
        this.map.addInteraction(this.draw)
        this.createMeasureTooltip()
        this.createHelpTooltip()

        let listener;

        this.draw.on('drawstart',
          function (evt) {
            // set sketch
            that.sketch = evt.feature;

            /** @type {module:ol/coordinate~Coordinate|undefined} */
            let tooltipCoord = evt.coordinate;

            listener = that.sketch.getGeometry().on('change', function (evt) {
              let geom = evt.target;
              let output;
              if (geom instanceof Polygon) {
                output = that.formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
              } else if (geom instanceof LineString) {
                output = that.formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
              }
              that.lineLength = output
              that.measureTooltipElement.innerHTML = output;
              that.measureTooltip.setPosition(tooltipCoord);
            });
          }, this)

        this.draw.on('drawend',
          function () {
            that.measureTooltipElement.className = 'tooltip tooltip-static';
            that.measureTooltip.setOffset([-40, -50]);
            // unset sketch
            that.sketch = null;
            // unset tooltip so that a new one can be created
            that.measureTooltipElement = null;
            that.createMeasureTooltip();
            unByKey(listener);
          }, this)
      },

      createHelpTooltip() {
        if (this.helpTooltipElement) {
          this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
        }
        this.helpTooltipElement = document.createElement('div');
        this.helpTooltipElement.className = 'tooltip';
        this.helpTooltip = new Overlay({
          element: this.helpTooltipElement,
          offset: [20, 0],
          positioning: 'center-left'
        });
        // window.console.log(this.helpTooltip)
        this.map.addOverlay(this.helpTooltip);
      },
      createMeasureTooltip() {
        if (this.measureTooltipElement) {
          this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
        }
        this.measureTooltipElement = document.createElement('div');
        this.measureTooltipElement.className = 'tooltip tooltip-measure';
        this.measureTooltip = new Overlay({
          element: this.measureTooltipElement,
          offset: [-40, -50],
          positioning: 'bottom-center',
          autoPan:true
        });
        this.map.addOverlay(this.measureTooltip);
      },
      pointerMoveHandler: function (evt) {
        if (evt.dragging) {
          return;
        }
        /** @type {string} */
        let helpMsg = 'Click to start drawing';
        if (this.sketch) {

          let geom = (this.sketch.getGeometry());
          if (geom instanceof Polygon) {
            helpMsg = this.continuePolygonMsg;
          } else if (geom instanceof LineString) {
            helpMsg = this.continueLineMsg;
          }
        }
        // window.console.log(this.helpTooltip.getPosition())

        this.helpTooltipElement.innerHTML = helpMsg;
        this.helpTooltip.setPosition(evt.coordinate);

        this.helpTooltipElement.classList.remove('hidden');
      },
      selectVal: function () {
        this.map.removeInteraction(this.draw);
        this.addInteraction();
        window.console.log(this.selected)
      },


    }
  }
</script>

<style scoped>
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
</style>