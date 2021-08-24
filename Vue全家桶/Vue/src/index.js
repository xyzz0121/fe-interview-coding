import { initMixin } from "./init";

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

export default Vue;