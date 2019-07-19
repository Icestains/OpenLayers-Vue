<template>
    <div id="rootMap" class="map"></div>
</template>

<script>

    import 'ol/ol.css'
    import {Map, View} from 'ol'
    import olTitle from 'ol/layer/Tile'
    import olOSM from 'ol/source/OSM'
    import {get as getProjection} from 'ol/proj';


    export default {
        name: "rootMap",
        data() {
            return {
                map: null,
                view: null
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                var projection = getProjection('EPSG:4326');

                this.map = new Map({
                    target: 'rootMap',
                    layers: [
                        new olTitle({
                            source: new olOSM()
                        })
                    ],
                    view: new View({
                        center: [120.58, 31.30],
                        projection: projection,
                        zoom: 12
                    })
                })
            }
        }
    }

</script>

<style scoped>
    .map {
        height: 100%;
        width: 100%;
    }

</style>