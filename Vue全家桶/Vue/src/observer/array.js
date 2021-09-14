/**
 * 重写数组方法
 * 思路：先继承，后重写，用的时候，先找实例
 */

const oldArrayProtoMethods = Array.prototype;

export const arrayMethods = Object.create(oldArrayProtoMethods);

const methods = [
    "push",
    "pop",
    "shift",
    "unshift",
    "sort",
    "reverse",
    "splice",
];
//先走自己的逻辑，然后调用原来的逻辑
methods.forEach(method => {
    arrayMethods[method] = function (...args) {
        
        const ob = this.__ob__;
        const result = oldArrayProtoMethods[method].apply(this, args); //this 就是 observer constructor里的data
        let inserted;
        //数组增加项，有可能是对象类型，应该再次被观测
        switch (method) {
            case "push":
            case "unshift":
                inserted = args;
                break;
            case "splice":
                inserted = args.slice(2);
            default:
                break;
        }
        if (inserted) {
            ob.observeArray(inserted);
        }
        ob.dep.notify();
        return result;
    }
})