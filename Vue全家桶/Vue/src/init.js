import { initState } from "./state";

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this;
        vm.$options = options;
        //所有初始化操作，都在initState里
        initState(vm);
        // initEvents();
    }
}