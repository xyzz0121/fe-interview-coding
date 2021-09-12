import { defineProperty } from "../util";
import { arrayMethods } from "./array";
import Dep from "./dep";

/**
 * 用 defineProperty 递归把data所有属性都变成响应式
 */
class Observer{
    constructor(data){
        //hack骚操作，把observeArray挂在调用函数的this上，在array.js里还可以使用。同时也可以标记对象或者数组已经被观测。
        defineProperty(data, "__ob__", this);
        //一步一步把defineProperty全都重新定义一下 使原来的对象每个属性发生变化的时候 都能get到，也就是将一个普通对象变成一个响应式对象
        if (Array.isArray(data)) {
            //函数劫持 考虑性能原因 不使用defineproperty 选择重新方法
            data.__proto__ = arrayMethods;
            //如果数组里嵌套对象，还需要监控对象
            this.observeArray(data);
        } else {
            this.walk(data);
        }
    }
    observeArray(data){
        data.forEach(item => {
            observe(item);
        })
    }
    walk(data){
        const keys = Object.keys(data);
        keys.forEach(key => {
            defineReactive(data, key, data[key]); 
        })
    }
}
//Vue.util.defineReactive 把对象的某个属性变成响应式
function defineReactive(data, key, value) {
    observe(value);
    let dep = new Dep(); //每个属性都有一个dep dep用来存watcher
    Object.defineProperty(data, key, {
        //当页面取值时，说明这个值用来渲染了，那么我就将这个watcher和这个属性对应起来
        //收集watcher
        get(){
            if (Dep.target) { //让这个属性的dep记住这个watcher
                dep.depend();
            }
            console.log(dep.subs);
            return value
        },
        //更新watcher
        set(newValue){
            if(value === newValue) return ;
            observe(newValue);
            value = newValue;
            dep.notify();
        }
    })
}



export function observe(data) {
    if(typeof data !== "object" || data == null || data.__ob__){
        return ;
    }
    return new Observer(data);
}