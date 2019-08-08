<template>
    <div class="btn-group">
        <button type="button" class="btn btn-light" v-on:click="addAngleLayer">测量角度
        </button>
    </div>
</template>

<script>
    export default {
        name: "measuringAngle",
        data() {
            return {}
        },
        methods: {
            addAngleLayer(){

                this.$store.commit('ADD_ANGLE_LAYER')
            },

        },
    }
</script>


<style scoped>

</style>