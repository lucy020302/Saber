import Vuex from 'vuex'
import Vue from 'vue';
import axios from 'axios'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: '',
    password: '',
    code: '',
    captchaKey: '',
    captchaImg: '',
    token:''
  },
  mutations: {
    setUser(state, val) {
      state.user = val;
    },
    setPassword(state, val) {
      state.password = val
    },
    setCode(state, val) {
      state.code = val
    },
    setCaptchaKey(state, val) {
      state.captchaKey = val
    },
    setCaptchaImg(state, val) {
      state.captchaImg = val
    },
    setToken(state,val){
      state.token=val
    }
  },
  actions: {
    fetchCaptcha({ commit }) {
      return axios.get('/api/blade-auth/oauth/captcha')
        .then(res => {
          commit('setCaptchaImg', res.data.image);
          commit('setCaptchaKey', res.data.key);
        })
        .catch(err => {
          console.log("err:", err);
        })
    }
  }
});
