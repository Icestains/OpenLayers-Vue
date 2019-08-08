<template>
    <div id="app">
        <single-map/>
    </div>
</template>

<script>
    import 'jquery'
    import 'bootstrap'
    import singleMap from "@/view/singleMap"

    export default {
        name: 'app',
        components: {
            singleMap,
        },
        data() {
            return {}
        },
        mounted() {
        },
        methods: {}
    }
</script>

<style lang="less">
    @mapHeight: 100%;
    @navLinkHeight: 40px;


    body, html {
        margin: 0;
        padding: 0;
        height: 100vh;
    }

    #app {
        height: 100%;
        /*position: absolute;*/
    }

    .nav-link {
        background: whitesmoke;
    }

    .hidden {
        /*display: none;*/
    }


</style>
