import * as mutationTypes from './mutations-types'
import 'ol'
import {Map, View} from 'ol'
import * as olControl from 'ol/control'
import {unByKey} from 'ol/Observable';
import Overlay from 'ol/Overlay';
import {LineString, Polygon} from 'ol/geom'
import {getArea, getLength} from 'ol/sphere.js';

import olLayerTile from 'ol/layer/Tile'
import olLayerVector from 'ol/layer/Vector'

import olXYZ from 'ol/source/XYZ'
import olOSM from 'ol/source/OSM'
import olSourceVector from 'ol/source/Vector'
import olSourceTileDebug from 'ol/source/TileDebug'

import olFeature from 'ol/Feature'
import olGeomPoint from 'ol/geom/Point'
import {getCenter} from 'ol/extent'

import {
    Circle as CircleStyle,
    Fill,
    Stroke,
    Style as olStyleStyle,
    Icon as olStyleIcon
} from 'ol/style.js';

import olInteractionDraw from 'ol/interaction/Draw'

import localLogoImage from '../../assets/logo.png'
import olStyleText from "ol/style/Text"
import olStyleFill from "ol/style/Fill"

// import {transform as olTransform} from 'ol/proj';
// import {get as getProjection} from 'ol/proj';
// import {CLEAR_ALL_LAYERS} from "./mutations-types"


export default {
    // 数字加一
    [mutationTypes.INCREMENT_COUNT](state, payload) {
        state.count += payload.amount
    },
    // 删除一个Layers
    [mutationTypes.CLEAR_TOP_LAYERS](state) {
        let i = state.map.getLayers().getArray()
        if (i.length > 1) {
            window.console.log('remove layer:')
            window.console.log(i[i.length - 1])
            state.map.removeLayer(i[i.length - 1])
            // state.map.setVisible(i[i.length - 1])
        } else {
            window.console.log('only one Layer')
        }
    },
    // 删除所有地图Layers
    [mutationTypes.CLEAR_ALL_LAYERS](state) {
        let i = state.map.getLayers().getArray()
        let len = i.length
        while (len > 0) {
            state.map.removeLayer(i[len - 1])
            len = len - 1
        }
    },
    // 移除所有地图上的overLay
    [mutationTypes.ClEAR_ALL_OVERLAYS](state) {
        let OverlaysArr = state.map.getOverlays().getArray()
        let OverlaysArrLen = OverlaysArr.length
        window.console.log(OverlaysArrLen)
        while (OverlaysArrLen) {
            state.map.removeOverlay(OverlaysArr[OverlaysArrLen - 1])
            OverlaysArrLen = OverlaysArr.length
        }
    },
    // 初始化地图图层
    [mutationTypes.SET_SINGLE_MAP](state) {
        state.map = new Map({
            target: 'rootMap',
            controls: olControl.defaults({
                attribution: false,
            }).extend([
                new olControl.MousePosition(),
                new olControl.ScaleLine(),
                new olControl.ZoomSlider(),
            ]),
            view: new View({
                extent: state.extent3857,
                projection: 'EPSG:3857',
                center: state.center3857,
                zoom: state.zoom,
                minZoom: state.minZoom,
                maxZoom: state.maxZoom,
            })
        });
        // 添加默认地图源图层为离线图层
        this.commit('SET_SOURCE_TO_offlineMap', state)
        // this.commit('ADD_ZXY_LAYER', state)
    },
    // 切换图层到Google地图
    [mutationTypes.SET_SOURCE_TO_GOOGLE](state) {
        this.commit('ClEAR_ALL_OVERLAYS')

        let GoogleMapLayer = new olLayerTile({
            source: new olXYZ({
                url: 'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i345013117!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0'
            })
        });
        // for (let item in state.map.getLayers().items)
        window.console.log(state.map.getLayers())
        this.commit('CLEAR_ALL_LAYERS', state)
        // state.map.getLayers().item(0)
        // state.map.removeLayer(state.map.getLayers().item(0))
        state.map.addLayer(GoogleMapLayer)
    },
    // 切换OSM源
    [mutationTypes.SET_SOURCE_TO_OSM](state) {
        this.commit('ClEAR_ALL_OVERLAYS')
        let OSMMapLayer = new olLayerTile({
            name: 'OSMMapLayer',
            source: new olOSM()
        })
        this.commit('CLEAR_ALL_LAYERS', state)

        state.map.addLayer(OSMMapLayer)
    },
    // 切换离线地图
    [mutationTypes.SET_SOURCE_TO_offlineMap](state) {
        this.commit('ClEAR_ALL_OVERLAYS')

        let XYZ = new olXYZ({
            url: 'http://localhost:3000/sdcard/digital/{z}/{x}/{-y}.png',
        })

        let offlineMapLayer = new olLayerTile({
            source: XYZ
        })
        this.commit('CLEAR_ALL_LAYERS', state)
        state.map.addLayer(offlineMapLayer)
        // state.map.getView().setCenter(state.center)
    },
    // 添加坐标轴图层
    [mutationTypes.ADD_ZXY_LAYER](state) {
        // 显示坐标轴
        let XYZ = new olXYZ()
        let tileGrid = new olLayerTile({
            source: new olSourceTileDebug({
                projection: 'EPSG:3857',
                tileGrid: XYZ.getTileGrid()
            })
        })
        state.map.addLayer(tileGrid)
    },
    // 测量角度
    [mutationTypes.ADD_ANGLE_LAYER](state) {
        // this.turnOnMakerLine = true
        let that = this

        state.lineLayer = new olLayerVector({
            source: new olSourceVector(),
            style: new olStyleStyle({
                stroke: new Stroke({
                    color: '#26A69A',
                    size: 1,
                    width: 2,
                })
            })
        });
        state.map.addLayer(state.lineLayer);

        state.lineDraw = new olInteractionDraw({
            type: 'LineString',
            source: state.lineLayer.getSource(),
            // 注意设置source，这样绘制好的线，就会添加到这个source里
            style: new olStyleStyle({            // 设置绘制时的样式
                stroke: new Stroke({
                    color: '#1DE9B6',
                    size: 1,
                    width: 2
                })
            }),
            maxPoints: 3    // 限制不超过3个点
        })
        window.console.log(state.lineDraw)
        let distanceOfPoints = (pointA, pointB) => {
            return Math.sqrt(Math.pow((pointA[0] - pointB[0]), 2) + Math.pow((pointA[1] - pointB[1]), 2))
        }

        state.lineDraw.on('drawend', function (event) {
            let linePoints = event.feature.getGeometry().getCoordinates()
            let aPoint = linePoints[0];
            let bPoint = linePoints[1];
            let cPoint = linePoints[2];
            let ALine = distanceOfPoints(bPoint, cPoint);
            let BLine = distanceOfPoints(aPoint, cPoint);
            let CLine = distanceOfPoints(aPoint, bPoint);
            let angleB = Math.acos((Math.pow(ALine, 2) + Math.pow(CLine, 2) - Math.pow(BLine, 2)) / (2 * ALine * CLine));
            let angleContent = "angleB:" + (180 * angleB / Math.PI).toFixed(2);
            that.commit('ADD_WORD_OVERLAY', {
                position: bPoint,
                content: angleContent,
            })
            window.console.log(angleContent);
            state.map.removeInteraction(state.lineDraw);
        });

        state.map.addInteraction(state.lineDraw);
    },
    // 添加点标记
    [mutationTypes.ADD_POINT_LAYER](state, payload) {

        window.console.log('center:' + payload.point);
        let activityLayer = new olLayerVector({
            source: new olSourceVector()
        });
        let activity = new olFeature({
            geometry: new olGeomPoint([payload.point[0], payload.point[1]])
        });
        activity.setStyle(new olStyleStyle({
            image: new olStyleIcon({
                src: localLogoImage,
                anchor: [0.5, 1],
                scale: 0.2
            })
        }))
        activityLayer.getSource().addFeature(activity);
        state.map.addLayer(activityLayer);

    },

    // 添加文字
    [mutationTypes.ADD_WORD](state, payload) {
        let wordFeature = new olFeature({
            geometry: new olGeomPoint(payload.point)
        });
        wordFeature.setStyle(new olStyleStyle({
            text: new olStyleText({
                font: '18px bold sans-serif ', //默认这个字体，可以修改成其他的，格式和css的字体设置一样
                text: payload.textContent,
                fill: new olStyleFill({
                    color: payload.fontColor,
                })
            })
        }))
        state.lineLayer.getSource().addFeature(wordFeature)
        window.console.log('??????finDist????' + payload.textContent + '\nPoint:' + payload.point)
    },

    // 添加文字new
    // 参数： id content position
    [mutationTypes.ADD_WORD_OVERLAY](state, payload) {
        let helpTooltipElement;
        let helpTooltip;
        if (helpTooltipElement) {
            helpTooltipElement.parentNode.removeChild(helpTooltipElement);
        }
        helpTooltipElement = document.createElement('div');
        helpTooltipElement.className = 'tooltips tooltips-measure';
        helpTooltipElement.innerHTML = payload.content
        helpTooltip = new Overlay({
            id: payload.id,
            element: helpTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center',
            position: payload.position,
        });
        state.map.addOverlay(helpTooltip);
    },

    // 测距
    [mutationTypes.ADD_LENGTH_LAYER](state, payload) {
        let that = this
        let sketch
        let continuePolygonMsg = '双击结束测量面积';
        let continueLineMsg = '双击结束测距';
        let helpTooltipElement;
        let helpTooltip;
        let measureTooltipElement;
        let measureTooltip;
        // 绘制feature监听事件
        let listener
        // 点击监听事件
        let singleClickListener
        // 添加一个绘制的线使用的layer
        window.console.log('state.showMeasure:' + state.showMeasure)

        // 创建一个用于接收绘制的矢量图层
        state.lineLayer = new olLayerVector({
            source: new olSourceVector(),
            style: new olStyleStyle({
                stroke: new Stroke({
                    color: '#0277BD',
                    size: 1,
                    width: 2,
                }),
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({
                        color: '#ffcc33'
                    })
                }),
                fill: new Fill({
                    color: 'rgba(0, 0, 0, 0.2)'
                })
            })
        });

        // 添加矢量图层
        state.map.addLayer(state.lineLayer)

        // 鼠标移动事件
        let pointerMoveHandler = (evt) => {
            if (evt.dragging) {
                return;
            }
            let helpMsg = '点击开始';

            if (sketch) {
                let geom = (sketch.getGeometry());
                if (geom instanceof Polygon) {
                    helpMsg = continuePolygonMsg;
                } else if (geom instanceof LineString) {
                    helpMsg = continueLineMsg;
                }
            }

            helpTooltipElement.innerHTML = helpMsg;
            helpTooltip.setPosition(evt.coordinate);

            helpTooltipElement.classList.remove('hidden');
        }

        // 添加地图 鼠标移动事件pointerMoveHandler
        state.map.on('pointermove', pointerMoveHandler)

        // 创建绘制图层
        state.lineDraw = new olInteractionDraw({
            type: payload.type,
            source: state.lineLayer.getSource(),
            // 注意设置source，这样绘制好的线，就会添加到这个source里
            style: new olStyleStyle({            // 设置绘制时的样式
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
            }),
            maxPoints: 100
        })

        // 添加绘制图层
        state.map.addInteraction(state.lineDraw)

        // 初始化提示框
        createMeasureTooltip()
        createHelpTooltip()

        // 格式化面积输出
        let formatArea = function (polygon) {
            let area = getArea(polygon);
            let output;
            if (area > 10000) {
                output = (Math.round(area / 1000000 * 100) / 100) +
                    ' ' + 'km<sup>2</sup>';
            } else {
                output = (Math.round(area * 100) / 100) +
                    ' ' + 'm<sup>2</sup>';
            }
            return output;
        }

        // 格式化距离输出
        let formatLength = function (line) {
            let length = getLength(line);
            let output;
            if (length > 100) {
                output = (Math.round(length / 1000 * 100) / 100) +
                    ' ' + 'km';
            } else {
                output = (Math.round(length * 100) / 100) +
                    ' ' + 'm';
            }
            return output;

        }

        state.lineDraw.on('drawstart', function (evt) {
            sketch = evt.feature;
            let tooltipCoord = evt.coordinate

            let output = '起点';
            listener = sketch.getGeometry().on('change', function (event) {
                let geom = event.target;
                if (geom instanceof Polygon) {
                    unByKey(singleClickListener);
                    output = formatArea(geom);
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof LineString) {
                    output = formatLength(geom);
                    tooltipCoord = geom.getLastCoordinate();
                }
                measureTooltipElement.innerHTML = output
                measureTooltipElement.classList.remove('hidden')
                measureTooltip.setPosition(tooltipCoord);
            })

            // 鼠标点击事件监听// 鼠标点击事件
            singleClickListener = state.map.on('click', (e) => {
                let content = output
                that.commit('ADD_WORD_OVERLAY', {
                    id: 'helpTooltip',
                    content: content,
                    position: e.coordinate
                })
            })

        }, this);

        state.lineDraw.on('drawend', function () {

            helpTooltipElement.classList.add('hidden');

            sketch = null
            measureTooltipElement = null
            helpTooltipElement = null

            state.map.removeInteraction(state.lineDraw);
            unByKey(listener);
            unByKey(singleClickListener);
            state.map.un('pointermove', pointerMoveHandler)
            state.showMeasure = false
            window.console.log('state.showMeasure:' + state.showMeasure)
        })

        function createHelpTooltip() {
            if (helpTooltipElement) {
                helpTooltipElement.parentNode.removeChild(helpTooltipElement);
            }
            helpTooltipElement = document.createElement('div');
            helpTooltipElement.className = 'tooltips hidden';
            helpTooltip = new Overlay({
                id: 'helpTooltip',
                element: helpTooltipElement,
                offset: [15, 0],
                positioning: 'center-left'
            });
            state.map.addOverlay(helpTooltip);
        }

        function createMeasureTooltip() {
            if (measureTooltipElement) {
                measureTooltipElement.parentNode.removeChild(measureTooltipElement)
            }
            measureTooltipElement = document.createElement('div')
            measureTooltipElement.className = 'tooltips tooltips-measure'
            measureTooltip = new Overlay({
                id: 'measureTooltip',
                element: measureTooltipElement,
                offset: [0, -15],
                positioning: 'bottom-center'
            })
            state.map.addOverlay(measureTooltip)
        }

    }
}