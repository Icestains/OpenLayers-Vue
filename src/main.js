import Vue from 'vue'
import App from './App.vue'
import router from "@/router"
import store from './store'
import 'bootstrap'
import "bootstrap/dist/css/bootstrap.css"

// 打包是否加入map参与调试
// Vue.config.productionSourceMap = false
Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
