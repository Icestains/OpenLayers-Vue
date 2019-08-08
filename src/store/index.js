import Vue from 'vue'
import Vuex from 'vuex'

import state from '@/store/main/state'
import getters from '@/store/main/getters'
import mutations from '@/store/main/mutations'
import actions from '@/store/main/actions'

Vue.use(Vuex)

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})