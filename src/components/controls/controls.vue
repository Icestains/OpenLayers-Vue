<template>
    <div class="btn-group-vertical" role="group" aria-label="Button group with nested dropdown">
        <button class="btn btn-light" v-on:click="removeTopLayer">移除图层</button>
        <button class="btn btn-light" v-on:click="removeAllOverlays">移除覆盖</button>
        <!--        <form class="form">-->
        <!--            <select id="type" class="form-control btn-light">-->
        <!--                <option value="Point">Point</option>-->
        <!--                <option value="LineString">LineString</option>-->
        <!--                <option value="Polygon">Polygon</option>-->
        <!--                <option value="Circle">Circle</option>-->
        <!--                <option value="None">None</option>-->
        <!--            </select>-->
        <!--        </form>-->
        <div class="btn-group" role="group">
            <button id="btnGroupDrop1" type="button" class="btn btn-light dropdown-toggle" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">
                图层
            </button>
            <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                <a class="dropdown-item" href="#" v-on:click="setSourceToOSM">OSM</a>
                <a class="dropdown-item" href="#" v-on:click="setSourceToGoogleMap">google</a>
                <a class="dropdown-item" href="#" v-on:click="setSourceToOffline">offline</a>
            </div>
        </div>
    </div>

</template>

<script>
    import {mapState} from 'vuex'
    import {mapMutations} from 'vuex'

    import 'ol/ol.css'

    export default {
        name: "controls",
        data() {
            return {
                map: null,
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
                sketch: null,
                helpTooltip: null,
                helpTooltipElement: null,
                vectorLayer: null,
            }
        },
        computed: mapState({
            count: 'count',
            theMap: 'map'
        }),

        methods: {
            ...mapMutations({
                setSingleMap: 'SET_SINGLE_MAP',
                setSourceToGoogleMap: 'SET_SOURCE_TO_GOOGLE',
                setSourceToOSM: 'SET_SOURCE_TO_OSM',
                setSourceToOffline: 'SET_SOURCE_TO_offlineMap',
                addXYZLayer: 'ADD_ZXY_LAYER',
                removeTopLayer: 'CLEAR_TOP_LAYERS',
                removeAllOverlays: 'ClEAR_ALL_OVERLAYS',
            }),

            selectVal: function () {
                this.theMap.removeInteraction(this.draw);
                this.addInteraction();
                window.console.log(this.selected)
            },
        }
    }
</script>

<style scoped>

</style>