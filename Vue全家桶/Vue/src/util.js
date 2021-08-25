//访问和设置vm，代理到访问和设置vm[data]
export function proxy(vm, data, key) {
    Object.defineProperty(vm, key, {
        get(){
            return vm[data][key]
        },
        set(newValue){
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