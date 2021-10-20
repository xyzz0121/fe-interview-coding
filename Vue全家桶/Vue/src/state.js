import {
    observe
} from "./observer/index";
import Watcher from "./observer/watcher";
import {
    nextTick,
    proxy
} from "./util";

export function initState(vm) {
    const opts = vm.$options;
    //按照优先级先后初始化，如果后面的和前面的重名了，怎么怎么样
    if (opts.props) {
        initProps(vm);
    }
    if (opts.methods) {
        initMethods(vm);
    }
    if (opts.data) {
        initData(vm);
    }
    if (opts.watch) {
        initWatch(vm);
    }
    if (opts.computed) {
        initComputed(vm);
    }
}

function initProps() {}

function initMethods() {}

function initData(vm) {
    let data = vm.$options.data;
    //保存所有data，
    vm._data = data = typeof data ? data.call(vm) : data;

    //把vm.arr 代理到 vm._data.arr 实现真正的获取data
    for (const key in data) {
        proxy(vm, "_data", key);
    }
    //有对象了 就要劫持 
    //对象的劫持方案：object.defineProperty();
    //对象里嵌套数组的劫持方案: 单独处理
    observe(data); //让对象重新定义set get
}

function initWatch(vm) {
    const watch = vm.$options.watch;
    for (const key in watch) {
        const handler = watch[key];
        if (Array.isArray(handler)) {
            handler.forEach(handle => {
                createWatcher(vm, key, handle);
            })
        }else{
            createWatcher(vm, key, handler);
        }
    }
}

function createWatcher(vm, exprOrFn, handler, options){
    if (typeof handler == "object") {
        options = handler;
        handler = handler.handler
    }
    if (typeof handler == "string") {
        handler = vm[handler];
    }
    return vm.$watch(exprOrFn, handler, options);
}

function initComputed() {}

export function stateMixin(Vue) {
    Vue.prototype.$nextTick = function (cb) {
        nextTick(cb);
    }
    Vue.prototype.$watch = function(exprOrFn, cb, options){
        let watcher = new Watcher(this, exprOrFn, cb, {...options, user: true});
    }
}