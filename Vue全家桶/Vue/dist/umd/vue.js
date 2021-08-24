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
   * 重写数组方法
   * 思路：先继承，后重写，用的时候，先找实例
   */
  var oldArrayProtoMethods = Array.prototype;
  var arrayMethods = Object.create(oldArrayProtoMethods);
  var methods = ["push", "pop", "shift", "unshift", "sort", "reverse", "splice"]; //先走自己的逻辑，然后调用原来的逻辑

  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      console.log("数组方法被调用了", method);
      var ob = this.__ob__;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayProtoMethods[method].apply(this, args); //this 就是 observer constructor里的data

      var inserted; //数组增加项，有可能是对象类型，应该再次被观测

      switch (method) {
        case "push":
        case "unshift":
          inserted = args;
          break;

        case "splice":
          inserted = args.slice(2);
      }

      if (inserted) {
        ob.observeArray(inserted);
      }

      return result;
    };
  });

  /**
   * 用 defineProperty 递归把data所有属性都变成响应式
   */

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      //hack骚操作，把observeArray挂在调用函数的this上，在array.js里还可以使用。同时也可以标记对象或者数组已经被观测。
      Object.defineProperty(data, "__ob__", {
        enumerable: false,
        //不可枚举，不能被循环出来，相当于隐藏属性
        configurable: false,
        value: this
      }); //一步一步把defineProperty全都重新定义一下 使原来的对象每个属性发生变化的时候 都能get到，也就是将一个普通对象变成一个响应式对象

      if (Array.isArray(data)) {
        //函数劫持
        data.__proto__ = arrayMethods; //如果数组里嵌套对象，还需要监控对象

        this.observeArray(data);
      } else {
        this.walk(data);
      }
    }

    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          observe(item);
        });
      }
    }, {
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
        console.log("获取", key, value);
        return value;
      },
      set: function set(newValue) {
        console.log("设置", key, value);
        if (value === newValue) return;
        observe(newValue);
        value = newValue;
      }
    });
  }

  function observe(data) {
    if (_typeof(data) !== "object" || data == null || data.__ob__) {
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
