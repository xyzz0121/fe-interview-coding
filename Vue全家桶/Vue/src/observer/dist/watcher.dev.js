"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dep = require("./dep");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var id = 0;

var Watcher =
/*#__PURE__*/
function () {
  function Watcher(vm, exprOrFn, cb, options) {
    _classCallCheck(this, Watcher);

    this.vm = vm; //vm实例

    this.exprOrFn = exprOrFn; //表达式或者函数 如 vm._update(vm._render);

    this.cb = cb;
    this.options = options;
    this.id = id++;
    this.deps = [];
    this.depsId = new Set();

    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn;
    }

    this.get(); //默认调用get方法
  }

  _createClass(Watcher, [{
    key: "addDep",
    value: function addDep(dep) {
      var id = dep.id;

      if (!this.depsId.has(id)) {
        this.deps.push(dep);
        this.depsId.add(id);
        dep.addSub(this);
      }
    }
  }, {
    key: "get",
    value: function get() {
      //Dep.target加了一个watcher
      (0, _dep.pushTarget)(this); //当前watcher实例

      this.getter(); //渲染页面就要取值，就要调用get方法

      (0, _dep.popTarget)();
    }
  }, {
    key: "update",
    value: function update() {
      this.get();
    }
  }]);

  return Watcher;
}();

var _default = Watcher;
exports["default"] = _default;