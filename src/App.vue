<template>
    <div id="app">
        <OpenLayers/>
    </div>
</template>

<script>
    import OpenLayers from './components/openlayers'

    export default {
        name: 'app',
        components: {
            OpenLayers
        }
    }
</script>

<style>
    body, html {
        height: 100%;
        margin: 0;
        padding: 0;
    }

    #app {
        height: 100%;
    }
</style>
