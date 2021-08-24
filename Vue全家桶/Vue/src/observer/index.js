/**
 * 用 defineProperty 递归把data所有属性都变成响应式
 */
class Observer{
    constructor(data){
        //一步一步把defineProperty全都重新定义一下 使原来的对象每个属性发生变化的时候 都能get到，也就是将一个普通对象变成一个响应式对象
        this.walk(data);
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
    Object.defineProperty(data, key, {
        get(){
            console.log("获取", data, key, value);
            return value
        },
        set(newValue){
            console.log("设置", data, key, value);
            if(value === newValue) return ;
            observe(newValue);
            value = newValue;
        }
    })
}



export function observe(data) {
    if(typeof data !== "object" || data === null){
        return ;
    }
    return new Observer(data);
}