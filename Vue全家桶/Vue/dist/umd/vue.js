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

  function observe(data) {
    console.log(data);
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
    data = _typeof(data) ? data.call(vm) : data; //有对象了 就要劫持 
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
