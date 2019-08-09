<template>
    <div class="btn-group-vertical">
            <button v-if="!showMeasure" type="button" class="btn btn-light" v-on:click="addLengthLayer">测量
            </button>
            <button v-else type="button" class="btn btn-light" v-on:click="removeMeasureSelect">取消测量
            </button>
            <select v-show="showMeasure" class="btn btn-light" @change="selectVal" v-model="selected">
                <option v-for="item in selects" v-bind:key="item.value">{{ item.value }}</option>
            </select>
    </div>

</template>

<script>
    import {mapState} from 'vuex'
    import {mapMutations} from 'vuex'

    import 'ol/ol.css'

    export default {
        name: "measure",
        data() {
            return {
                lineLength: '',
                selected: this.$store.state.measureType,
                selects: [
                    {value: '距离'},
                    {value: '面积'}
                ],
            }
        },
        computed: {
            ...mapState({
                map: 'map',
                showMeasure: 'showMeasure',
            })
        },
        methods: {
            ...mapMutations({
                removeTopLayer: 'CLEAR_TOP_LAYERS'
            }),
            addLengthLayer() {
                window.console.log('listeners:')
                window.console.log(this.$store.state.map.removeEventListener('on'))
                if (!this.showMeasure) {
                    this.$store.state.showMeasure = true
                    this.$store.commit('ADD_LENGTH_LAYER', {
                        type: this.selected === '面积' ? 'Polygon' : 'LineString'
                    })
                }
            },
            removeMeasureSelect() {
                this.$store.state.map.removeOverlay(this.$store.state.map.getOverlayById('helpTooltip'))
                this.$store.state.showMeasure = false
                this.selectedChanges()
                this.removeTopLayer()

            },
            selectVal: function () {
                this.selectedChanges()
                this.$store.commit('ADD_LENGTH_LAYER', {
                    type: this.selected === '面积' ? 'Polygon' : 'LineString'
                })
                window.console.log('this.selected')
                window.console.log(this.selected)
            },
            selectedChanges() {
                if (!this.$store.state.lineDraw.downPx_) {
                    window.console.log(this.$store.state.lineDraw.downPx_)
                    this.$store.state.map.removeOverlay(this.$store.state.map.getOverlayById('helpTooltip'))

                    this.$store.state.map.removeInteraction(this.$store.state.lineDraw)
                    this.removeTopLayer()
                } else {
                    this.$store.state.map.removeInteraction(this.$store.state.lineDraw)
                }
            }
        },
    }
</script>

<style scoped>

</style>