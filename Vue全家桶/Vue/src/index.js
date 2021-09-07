import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./vdom/index";

/**
 * Vue 类的声明
 * @param {object} options 用户 new Vue() 时传的配置对象
 */
function Vue(options) {
    this._init(options);
}

//Vue把原型方法拆成一个一个又一个的插件，利于拆分，结构拆分，所有原型拓展都在这里

//插件1：初始化操作都在这里
initMixin(Vue);
//插件2：生命周期，其实就是渲染
lifecycleMixin(Vue);
//插件3：render生成虚拟dom
renderMixin(Vue);


export default Vue;