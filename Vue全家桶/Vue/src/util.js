//访问和设置vm，代理到访问和设置vm[data]
export function proxy(vm, data, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[data][key]
        },
        set(newValue) {
            vm[data][key] = newValue
        }
    })
}
//添加不可枚举、不可遍历的属性
export function defineProperty(data, key, value) {
    Object.defineProperty(data, key, {
        enumerable: false, //不可枚举，不能被循环出来，相当于隐藏属性
        configurable: false,
        value
    })
}


export const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestory',
    'destroyed'
];

//策略模式
const strats = {};
strats.data = function(parentVal, childVal){
    return childVal
};
strats.computed = function(){};
strats.watch = function(){};
//生命周期的合并
function mergeHook(parentVal, childVal){
    if (childVal) {
        if (parentVal) {
            return parentVal.concat(childVal);
        }else{
            return [childVal]
        }
    }else{ 
        return parentVal
    }
}
//每个生命周期的合并策略都是上面的mergeHook
LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeHook
})

//合并选项
export function mergeOptions(parent, child) {
    const options = {};
    //遍历父亲 可能是父亲有
    for (const key in parent) {
        mergeField(key);
    }

    //父亲没有 儿子有
    for (const key in child) {
        if (!parent.hasOwnProperty(key)) {
            mergeField(key);
        }
    }


    function mergeField(key){
        if (strats[key]) {
            options[key] = strats[key](parent[key], child[key]);
        }else{
            options[key] = child[key];
        }
    }

    return options;
}

let callbacks = [];
let pending = false;
function flushCallbacks(){
    // callbacks.forEach(cb => cb());
    while (callbacks.length) {
        let cb = callbacks.pop();
        cb();
    }
    pending = false;
}
let timerFunc;
if (Promise) {
    timerFunc = () => {
        Promise.resolve().then(flushCallbacks);
    };
}else if(MutationObserver){
    let observer = new MutationObserver(flushCallbacks);
    let textNode = document.createTextNode(1);
    observer.observe(textNode, { characterData: true });
    timerFunc = () => {
        textNode.textContent = 2;
    }
}else if(setImmediate){
    timerFunc = () => {
        setImmediate(flushCallbacks);
    }
}else{
    timerFunc = () => {
        setTimeout(flushCallbacks);
    }
}

export function nextTick(cb){
    callbacks.push(cb);
    if (!pending) {
        timerFunc();
        pending = true;
    }
    // Promise.resolve().then();
}