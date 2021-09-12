"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pushTarget = pushTarget;
exports.popTarget = popTarget;
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var id = 0;

var Dep =
/*#__PURE__*/
function () {
  function Dep() {
    _classCallCheck(this, Dep);

    this.subs = [];
    this.id = id++;
  } //get 收集watcher


  _createClass(Dep, [{
    key: "depend",
    value: function depend() {
      Dep.target.addDep(this); //实现双向记忆 dep和watcher
    } //dep 收集watcher

  }, {
    key: "addSub",
    value: function addSub(watcher) {
      this.subs.push(watcher);
    } //set 执行watcher

  }, {
    key: "notify",
    value: function notify() {
      this.subs.forEach(function (watcher) {
        return watcher.update();
      });
    }
  }]);

  return Dep;
}();

var _default = Dep;
exports["default"] = _default;
Dep.target = null;

function pushTarget(watcher) {
  Dep.target = watcher; //全局变量保留watcher
}

function popTarget() {
  Dep.target = null; //将变量删除掉
} //多对多的关系，每个属性都有一个dep  dep是干嘛的，用来收集watcher 的
//dep 可以存多个watcher 其他的比如还有 vm.$watcher
//一个watcher可以对应多个dep