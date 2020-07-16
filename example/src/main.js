import Vue from 'vue'
import VueFreshchat from '../../src'
import Index from './Index.vue'

Vue.use(VueFreshchat, { appToken: 'your-app-token' })

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  template: '<Index />',
  components: { Index }
})