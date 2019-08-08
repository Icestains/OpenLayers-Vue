export default {
    componentsNames: 'store,',
    count: 'fromstate',
    todos: [
        {id: 1, text: '...', done: true},
        {id: 2, text: '...', done: false}
    ],
    // 地图
    map: null,
    // center: center,
    center4326: [120.63, 31.32],
    center3857: [13428470.174392592, 3674377.339303884],
    extent4326: [120.48, 31.22, 120.80, 31.40],
    extent3857: [13411772.250773601, 3661353.4112873743, 13447394.487827446, 3684806.4424220272],
    zoom: 14,
    minZoom: 10,
    maxZoom: 18,

    lineDraw: null,
    lineLayer: null,

    measureType: '测量距离',
    showMeasure: false

}