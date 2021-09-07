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

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  //把ast元素的属性，生成render字符串
  function genProps(attrs) {
    var str = '';
    attrs.forEach(function (attr) {
      if (attr.name === "style") {
        //style比较特殊 进行特殊处理
        var obj = {};
        attr.value.split(';').forEach(function (item) {
          var _item$split = item.split(':'),
              _item$split2 = _slicedToArray(_item$split, 2),
              key = _item$split2[0],
              value = _item$split2[1];

          obj[key] = value;
        });
        attr.value = obj;
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    });
    return "{".concat(str.slice(0, -1), "}"); //去掉多余逗号
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  function gen(node) {
    if (node.type === 1) {
      return generate(node);
    } else {
      var text = node.text; //如果不存在 {{}} 这种变量

      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")");
      } //存在的话，用正则一点点把字符串拆开，给变量加上 _s()


      var tokens = []; //存放每一段代码

      var lastIndex = defaultTagRE.lastIndex = 0; //全局模式，每次index置为0 , 因为上面执行了一次 defaultTagRE.test 所以政策而index要归位

      var match, index; // 匹配到的结果

      while (match = defaultTagRE.exec(text)) {
        index = match.index; //说明匹配到的结果不是第一个元素，那说明前面这部分是普通字符串

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function genChildren(el) {
    var children = el.children;

    if (children) {
      return children.map(function (child) {
        return gen(child);
      }).join(',');
    }
  } //核心就是拼遍历ast，然后生成render函数的字符串


  function generate(el) {
    var children = genChildren(el); // _c: 创建元素  _v: 创建文本  _s: {{}}变量

    var code = "_c('".concat(el.tag, "', ").concat(el.attrs.length ? "".concat(genProps(el.attrs)) : 'undefined' //有属性、组合属性字符串
    ).concat(children ? ", ".concat(children) : '', ")");
    return code;
  }

  //解析html的正则表达式们
  var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z" + unicodeRegExp.source + "]*";
  var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
  var startTagOpen = new RegExp("^<" + qnameCapture);
  var startTagClose = /^\s*(\/?)>/;
  var endTag = new RegExp("^<\\/" + qnameCapture + "[^>]*>"); //html to ast

  function parseHTML(html) {
    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        type: 1,
        //html 元素 type是1
        children: [],
        attrs: attrs,
        parent: null
      };
    }

    var root;
    var currentParent;
    var stack = []; //用栈 判断标签时候合法

    function start(tagName, attrs) {
      var element = createASTElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      currentParent = element;
      stack.push(element);
    }

    function end(tagName) {
      var element = stack.pop(); //取出栈最后一个 进行比较 看看标签是否配对

      currentParent = stack[stack.length - 1];

      if (currentParent) {
        //闭合时知道，当前标签的父子关系
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    }

    function chars(text) {
      text = text.replace(/\s/g, '');

      if (text) {
        currentParent.children.push({
          type: 3,
          //html 文本 type是3
          text: text
        });
      }
    } //解析过程 边解析边删除，直到所有解析完成


    while (html) {
      //只要Html不空，就一直解析
      //观察规律，看当前第一个字符是不是 < ，是 < 就一定是一个标签
      var textEnd = html.indexOf("<");

      if (textEnd === 0) {
        //TODO: v-bind :value 等等
        //先看看是不是开始标签，那么先解析开始标签
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        } //不是开始标签，就是结束标签


        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          end(endTagMatch[0]);
          advance(endTagMatch[0].length);
          continue;
        }
      }

      var text = void 0; //< 位置 大于0 当前字符串是文本

      if (textEnd > 0) {
        text = html.substring(0, textEnd);
      } //有文本 记录文本 删除文本


      if (text) {
        advance(text.length);
        chars(text);
      }
    }

    function advance(n) {
      //截取掉匹配到内容，重新更新html
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); //开始标签截取完了，该匹配属性了, 好多属性，所以要遍历
        //如果是开始标签结束了，那么没有属性了，所以先判断 开始标签没有结束

        var _end, attr;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5] //属性的三种写法，match出来结果，在数组的不同位置

          });
          advance(attr[0].length);
        } //如果开始标签结束了


        if (_end) {
          advance(_end[0].length);
          return match;
        }
      }
    }

    return root;
  }

  function compileToFunctions(template) {
    //1、html转成AST
    var ast = parseHTML(template); //2、TODO:优化静态节点
    //3、AST重新生成代码

    var code = generate(ast); //4、把code字符串转化成真正的函数 通过with进行设置取值

    var render = new Function("with(this){return ".concat(code, "}"));
    return render;
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {};
  }
  function mountComponent(vm, el) {
    //先调用render方法创建虚拟节点，再将虚拟节点渲染到页面上 vue核心！！！！
    vm._update(vm._render());
  }

  //访问和设置vm，代理到访问和设置vm[data]
  function proxy(vm, data, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[data][key];
      },
      set: function set(newValue) {
        vm[data][key] = newValue;
      }
    });
  } //添加不可枚举、不可遍历的属性

  function defineProperty(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      //不可枚举，不能被循环出来，相当于隐藏属性
      configurable: false,
      value: value
    });
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
      defineProperty(data, "__ob__", this); //一步一步把defineProperty全都重新定义一下 使原来的对象每个属性发生变化的时候 都能get到，也就是将一个普通对象变成一个响应式对象

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
        return value;
      },
      set: function set(newValue) {
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
    vm._data = data = _typeof(data) ? data.call(vm) : data; //把vm.arr 代理到 vm._data.arr 实现真正的获取data

    for (var key in data) {
      proxy(vm, "_data", key);
    } //有对象了 就要劫持 
    //对象的劫持方案：object.defineProperty();
    //对象里嵌套数组的劫持方案: 单独处理


    observe(data);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options; //所有初始化操作，都在initState里

      initState(vm); // initEvents();
      //需要渲染元素

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el); //按照优先级处理，保证最后统一为 render函数渲染

      if (!options.render) {
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        }

        var render = compileToFunctions(template);
        options.render = render;
      } //这里保证有render方法，开始渲染挂载元素


      mountComponent(vm);
    };
  }

  function renderMixin(Vue) {
    //创建元素
    Vue.prototype._c = function () {
      return createElement.apply(void 0, arguments);
    }; //stringify


    Vue.prototype._s = function (val) {
      return val == null ? "" : _typeof(val) === "object" ? JSON.stringify(val) : val;
    }; //创建文本元素


    Vue.prototype._v = function (text) {
      return createTextVnode(text);
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      var vnode = render.call(vm);
      console.log(vnode);
      return vnode;
    };
  }

  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return vnode(tag, data, data.key, children);
  }

  function createTextVnode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  } //产生虚拟dom的


  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
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


  initMixin(Vue); //插件2：生命周期，其实就是渲染

  lifecycleMixin(Vue); //插件3：render生成虚拟dom

  renderMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
