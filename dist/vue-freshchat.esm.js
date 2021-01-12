function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var callIf = function callIf(a, f) {
  return a && f();
};
var assert = function assert(condition, msg) {
  return callIf(!condition, function () {
    throw new Error("[vue-freshchat] ".concat(msg));
  });
};
var mapInstanceToProps = function mapInstanceToProps(vm, props) {
  var o = {};
  props.forEach(function (p) {
    return o[p] = {
      get: function get() {
        return vm[p];
      }
    };
  });
  return o;
};

var VueFreshchat = {};
var Vue;

var getFreshchatInstance = function getFreshchatInstance(_ref) {
  var appToken = _ref.appToken,
      host = _ref.host;
  assert(Vue, 'call Vue.use(VueFreshchat) before creating an instance');
  var vm = new Vue({
    data: function data() {
      return {
        ready: false,
        isOpen: false,
        hideWidget: false,
        externalId: null,
        user: {},
        dom: null
      };
    },
    watch: {
      isOpen: function isOpen() {
        if (this.hideWidget) this.onHideWidget();
      },
      hideWidget: function hideWidget() {
        if (!this.hideWidget) {
          this.dom.style.display = 'block';
          return;
        }

        this.onHideWidget();
      },
      dom: function dom() {
        if (this.hideWidget) {
          this.onHideWidget();
        }
      }
    },
    methods: {
      onHideWidget: function onHideWidget() {
        if (!this.dom) return;

        if (this.isOpen) {
          this.dom.style.display = 'block';
        } else {
          this.dom.style.display = 'none';
        }
      }
    }
  });
  var freshchat = {
    _vm: vm
  };
  Object.defineProperties(freshchat, mapInstanceToProps(vm, ['ready', 'isOpen']));

  freshchat._init = function () {
    vm.ready = true;

    freshchat._boot();
  };

  freshchat._boot = function () {
    window.fcWidget.init({
      token: appToken,
      host: host !== null && host !== void 0 ? host : 'https://wchat.freshchat.com'
    });
    window.fcWidget.setExternalId(vm.externalId);
    window.fcWidget.user.setMeta(vm.user);
    window.fcWidget.on('widget:opened', function () {
      vm.isOpen = true;
    });
    window.fcWidget.on('widget:closed', function () {
      vm.isOpen = false;
    });
    vm.dom = document.querySelector('#fc_frame');
  };

  freshchat.setExternalId = function (externalId) {
    vm.externalId = externalId;
    if (!vm.ready) return;
    window.fcWidget.setExternalId(vm.externalId);
  };

  freshchat.setUserProperties = function () {
    var user = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    vm.user = _objectSpread2(_objectSpread2({}, vm.user), user);
    if (!vm.ready) return;
    window.fcWidget.user.setProperties(vm.user);
  };

  freshchat.open = function (payload) {
    if (!vm.ready) return;
    window.fcWidget.open(payload);
  };

  freshchat.close = function () {
    if (!vm.ready) return;
    window.fcWidget.close();
  };

  freshchat.toggle = function () {
    var isOpen = vm.isOpen;

    if (isOpen) {
      freshchat.close();
    } else {
      freshchat.open();
    }
  };

  freshchat.hideWidget = function () {
    vm.hideWidget = true;
  };

  return freshchat;
};

VueFreshchat.loadScript = function loadScript(done) {
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://wchat.freshchat.com/js/widget.js';
  var firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(script, firstScript);
  script.onload = done;
};

var installed;

VueFreshchat.install = function install(_Vue, _ref2) {
  var appToken = _ref2.appToken,
      host = _ref2.host;
  assert(!Vue, 'already installed.');
  Vue = _Vue;
  var vueFreshchat = getFreshchatInstance({
    appToken: appToken,
    host: host
  });
  Vue.mixin({
    mounted: function mounted() {
      var _this = this;

      if (!installed) {
        installed = true;

        if (typeof window.fcWidget === 'function') {
          this.$freshchat._init();

          return;
        }

        var loaded = function loaded() {
          return VueFreshchat.loadScript(function () {
            return _this.$freshchat._init();
          });
        };

        if (document.readyState === 'complete') {
          loaded();
        } else if (window.attachEvent) {
          window.attachEvent('onload', loaded);
        } else {
          window.addEventListener('load', loaded, false);
        }
      }
    }
  });
  Object.defineProperty(Vue.prototype, '$freshchat', {
    get: function get() {
      return vueFreshchat;
    }
  });
};

export default VueFreshchat;
