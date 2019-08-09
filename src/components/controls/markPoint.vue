<template>
    <div class="btn-group-vertical">
        <button type="button" class="btn btn-light" v-if="!turnOnMakerPoint" v-on:click="turnOnMarkPoint">手动标记
        </button>
        <button type="button" class="btn btn-light" v-else v-on:click="turnOffMarkPoint">关闭标记</button>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {mapMutations} from 'vuex'

    export default {
        name: "markPoint",
        data() {
            return {
                turnOnMakerPoint:false
            }
        },
        computed: {
            ...mapState({
                map: 'map'
            })
        },
        methods: {
            ...mapMutations({
                addPointLayer: 'ADD_POINT_LAYER'
            }),
            markPoint: function (event) {
                // window.console.log('currentPoint:' + event.coordinate);
                this.addPointLayer({point: event.coordinate})
            },
            turnOnMarkPoint(){
                this.turnOnMakerPoint = true;
                this.map.on('click', this.markPoint);
            },
            turnOffMarkPoint() {
                this.turnOnMakerPoint = false;
                this.map.un('click', this.markPoint);
            },

        },
    }
</script>

<style scoped>

</style>