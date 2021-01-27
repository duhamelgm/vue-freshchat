/* globals window, document */
import { callIf, assert, is, mapInstanceToProps } from './util'

const VueFreshchat = {}

let Vue
const getFreshchatInstance = ({ appToken, host }) => {
  assert(Vue, 'call Vue.use(VueFreshchat) before creating an instance')

  const vm = new Vue({
    data() {
      return {
        ready: false,
        isOpen: false,
        hideWidget: false,
        externalId: null,
        user: {},
        dom: null
      }
    },
    watch: {
      isOpen() {
        if (this.hideWidget) this.onHideWidget()
      },
      hideWidget() {
        if (!this.hideWidget) {
          this.dom.style.display = 'block'
          return
        }

        this.onHideWidget()
      },
      dom() {
        if (this.hideWidget) {
          this.onHideWidget()
        }
      }
    },
    methods: {
      onHideWidget() {
        if (!this.dom) return

        if (this.isOpen) {
          this.dom.style.display = 'block'
        } else {
          this.dom.style.display = 'none'
        }
      }
    }
  })

  const freshchat = { _vm: vm }

  Object.defineProperties(freshchat, mapInstanceToProps(vm, ['ready', 'isOpen']))

  freshchat._init = () => {
    vm.ready = true

    freshchat._boot()
  }
  freshchat._boot = () => {
    window.fcWidget.init({
      token: appToken,
      host: host ?? 'https://wchat.freshchat.com'
    })
    window.fcWidget.setExternalId(vm.externalId)
    window.fcWidget.user.setMeta(vm.user)
    window.fcWidget.on('widget:opened', () => {
      vm.isOpen = true
    })
    window.fcWidget.on('widget:closed', () => {
      vm.isOpen = false
    })

    vm.dom = document.querySelector('#fc_frame')
  }

  freshchat.setExternalId = externalId => {
    vm.externalId = externalId
    if (!vm.ready) return

    window.fcWidget.setExternalId(vm.externalId)
  }
  freshchat.setUserProperties = (user = {}) => {
    vm.user = { ...vm.user, ...user }
    if (!vm.ready) return

    window.fcWidget.user.setProperties(vm.user)
  }
  freshchat.open = payload => {
    if (!vm.ready) return

    window.fcWidget.open(payload)
  }
  freshchat.close = () => {
    if (!vm.ready) return

    window.fcWidget.close()
  }
  freshchat.toggle = () => {
    const isOpen = vm.isOpen

    if (isOpen) {
      freshchat.close()
    } else {
      freshchat.open()
    }
  }
  freshchat.hideWidget = () => {
    vm.hideWidget = true
  }

  return freshchat
}

VueFreshchat.loadScript = function loadScript(done) {
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://wchat.freshchat.com/js/widget.js'
  const firstScript = document.getElementsByTagName('script')[0]
  firstScript.parentNode.insertBefore(script, firstScript)
  script.onload = done
}

let installed
VueFreshchat.install = function install(_Vue, { appToken, host }) {
  assert(!Vue, 'already installed.')
  Vue = _Vue

  const vueFreshchat = getFreshchatInstance({ appToken, host })

  Vue.mixin({
    mounted() {
      if (!installed) {
        installed = true

        if (typeof window.fcWidget === 'function') {
          this.$freshchat._init()
          return
        }

        const loaded = () => VueFreshchat.loadScript(() => this.$freshchat._init())

        if (document.readyState === 'complete') {
          loaded()
        } else if (window.attachEvent) {
          window.attachEvent('onload', loaded)
        } else {
          window.addEventListener('load', loaded, false)
        }
      }
    }
  })

  Object.defineProperty(Vue.prototype, '$freshchat', {
    get: () => vueFreshchat
  })
}

export default VueFreshchat
