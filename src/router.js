import Vue from 'vue'
import Router from 'vue-router'
// import Home from './App'
import Home from './view/singleMap'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/openLayers',
      name: 'openLayers',
      component: () => import('./components/openlayers.vue')
    },
    {
      path: '/localImg',
      name: 'localImg',
      component: () => import('./components/localImg.vue')
    },
    {
      path: '/TileDebug',
      name: 'TileDebug',
      component: () => import('./components/TileDebug.vue')
    },
    {
      path: '/featureStyle',
      name: 'featureStyle',
      component: () => import('./components/featurestyle.vue')
    },
    {
      path: '/onFunctions',
      name: 'onFunctions',
      component: () => import('./components/onfunctions.vue')
    },
    {
      path: '/measure',
      name: 'measure',
      component: () => import('./components/measure.vue')
    },

  ]
})