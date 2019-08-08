<template>
    <div id="rootMap" class="map">
        <div class="btn-group-vertical btnGroups" role="group">
            <controls/>
            <mark-point/>
            <measuring-angle/>
            <measure/>
        </div>
    </div>
</template>

<script>
    import controls from "@/components/controls/controls"
    import measure from "@/components/controls/measure"
    import markPoint from "@/components/controls/markPoint"
    import measuringAngle from "@/components/controls/measuringAngle"
    import '@/assets/css/singleMap.less'

    import {mapState} from 'vuex'
    import {mapMutations} from 'vuex'

    import 'ol/ol.css'

    export default {
        name: "singleMap",
        components:{
            measuringAngle,
            controls,
            measure,
            markPoint
        },
        computed: mapState({
            map: 'map',
            count: 'count'
        }),
        mounted() {
            window.console.log('moutedStart')
            this.setSingleMap()
            window.console.log("mountedEnd")
        },
        methods: {
            ...mapMutations({
                setSingleMap: 'SET_SINGLE_MAP',
            }),
        }
    }
</script>

<style scoped>

</style>