(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  /**
   * 用 defineProperty 递归把data所有属性都变成响应式
   */
  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      //一步一步把defineProperty全都重新定义一下 使原来的对象每个属性发生变化的时候 都能get到，也就是将一个普通对象变成一个响应式对象
      this.walk(data);
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);
        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }(); //Vue.util.defineReactive 把对象的某个属性变成响应式


  function defineReactive(data, key, value) {
    observe(value);
    Object.defineProperty(data, key, {
      get: function get() {
        console.log("获取", data, key, value);
        return value;
      },
      set: function set(newValue) {
        console.log("设置", data, key, value);
        if (value === newValue) return;
        observe(newValue);
        value = newValue;
      }
    });
  }

  function observe(data) {
    if (_typeof(data) !== "object" || data === null) {
      return;
    }

    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options; //按照优先级先后初始化，如果后面的和前面的重名了，怎么怎么样

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.watch) ;

    if (opts.computed) ;
  }

  function initData(vm) {
    var data = vm.$options.data;
    vm._data = data = _typeof(data) ? data.call(vm) : data; //有对象了 就要劫持 
    //对象的劫持方案：object.defineProperty();
    //对象里嵌套数组的劫持方案: 单独处理

    observe(data);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options; //所有初始化操作，都在initState里

      initState(vm); // initEvents();
    };
  }

  /**
   * Vue 类的声明
   * @param {object} options 用户 new Vue() 时传的配置对象
   */

  function Vue(options) {
    this._init(options);
  } //Vue把原型方法拆成一个一个又一个的插件，利于拆分，结构拆分，所有原型拓展都在这里
  //插件1：初始化操作都在这里


  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
