"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.observe = observe;

var _util = require("../util");

var _array = require("./array");

var _dep = _interopRequireDefault(require("./dep"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * 用 defineProperty 递归把data所有属性都变成响应式
 */
var Observer =
/*#__PURE__*/
function () {
  function Observer(data) {
    _classCallCheck(this, Observer);

    //hack骚操作，把observeArray挂在调用函数的this上，在array.js里还可以使用。同时也可以标记对象或者数组已经被观测。
    (0, _util.defineProperty)(data, "__ob__", this); //一步一步把defineProperty全都重新定义一下 使原来的对象每个属性发生变化的时候 都能get到，也就是将一个普通对象变成一个响应式对象

    if (Array.isArray(data)) {
      //函数劫持 考虑性能原因 不使用defineproperty 选择重新方法
      data.__proto__ = _array.arrayMethods; //如果数组里嵌套对象，还需要监控对象

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
  var dep = new _dep["default"](); //每个属性都有一个dep dep用来存watcher

  Object.defineProperty(data, key, {
    //当页面取值时，说明这个值用来渲染了，那么我就将这个watcher和这个属性对应起来
    //收集watcher
    get: function get() {
      if (_dep["default"].target) {
        //让这个属性的dep记住这个watcher
        dep.depend();
      }

      console.log(dep.subs);
      return value;
    },
    //更新watcher
    set: function set(newValue) {
      if (value === newValue) return;
      observe(newValue);
      value = newValue;
      dep.notify();
    }
  });
}

function observe(data) {
  if (_typeof(data) !== "object" || data == null || data.__ob__) {
    return;
  }

  return new Observer(data);
}