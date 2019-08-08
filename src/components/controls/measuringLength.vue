<template>
    <div class="btn-group">
        <button type="button" class="btn btn-light" v-on:click="addLengthLayer">测量距离
        </button>
    </div>
</template>

<script>
    export default {
        name: "measuringLength",
        methods: {
            addLengthLayer() {
                if (!this.$store.state.showMeasure) {
                    this.$store.state.showMeasure = true
                    this.$store.commit('ADD_LENGTH_LAYER', {
                        type: this.selected === 'area' ? 'Polygon' : 'LineString'
                    })
                }
            },
        }
    }
</script>

<style scoped>

</style>