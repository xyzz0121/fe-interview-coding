import Watcher from "./observer/watcher";
import { patch } from "./vdom/patch";

export function lifecycleMixin(Vue){
    Vue.prototype._update = function(vnode){
        const vm = this;
        //新创建的替换老的
        vm.$el = patch(vm.$el, vnode);
    }
}

export function mountComponent(vm, el){ 
    callHook(vm, 'beforeMount');
    //先调用render方法创建虚拟节点，再将虚拟节点渲染到页面上 vue核心！！！！
    const updateComponent = () => {
        vm._update(vm._render());
    }
    new Watcher(vm,updateComponent,() => {
        callHook(vm, 'beforeUpdate');
    },true)
    // vm._update(vm._render());

    callHook(vm, 'mounted');
}

export function callHook(vm, hook){
    const handlers = vm.$options[hook];
    if (handlers) {
        for (let i = 0; i < handlers.length; i++) {
            handlers[i].call(vm);
        }
    }
}