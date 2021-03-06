import { compileToFunctions } from "./compiler/index";
import { callHook, mountComponent } from "./lifecycle";
import { initState } from "./state";
import { mergeOptions } from "./util";

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this;
        vm.$options = mergeOptions(vm.constructor.options, options);
        callHook(vm, 'beforeCreate');
        //所有初始化操作，都在initState里
        initState(vm);
        callHook(vm, 'created');
        // initEvents();
        //需要渲染元素
        if (vm.$options.el) {
            vm.$mount(vm.$options.el);
        }
    }

    Vue.prototype.$mount = function (el) {
        const vm = this;
        const options = vm.$options;
        el = document.querySelector(el);
        vm.$el = el;
        //按照优先级处理，保证最后统一为 render函数渲染
        if (!options.render) {
            let template = options.template;
            if (!template && el) {
                template = el.outerHTML;
            }
            const render = compileToFunctions(template);
            options.render = render;
        }
        //这里保证有render方法，开始渲染挂载元素
        mountComponent(vm, el)
    }
}