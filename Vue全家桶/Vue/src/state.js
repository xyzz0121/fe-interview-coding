import { observe } from "./observer/index";
import { proxy } from "./util";

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
    vm._data = data = typeof data ? data.call(vm) : data;

    //把vm.arr 代理到 vm._data.arr 实现真正的获取data
    for (const key in data) {
        proxy(vm, "_data", key);
    }
    //有对象了 就要劫持 
    //对象的劫持方案：object.defineProperty();
    //对象里嵌套数组的劫持方案: 单独处理
    observe(data);
}

function initWatch() {}

function initComputed() {}