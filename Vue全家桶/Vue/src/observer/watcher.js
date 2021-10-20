import { nextTick } from "../util";
import { popTarget, pushTarget } from "./dep";

let id = 0;
class Watcher{
    constructor(vm, exprOrFn, cb, options){
        this.vm = vm; //vm实例
        this.exprOrFn = exprOrFn; //表达式或者函数 如 vm._update(vm._render);
        this.cb = cb;
        this.options = options;
        this.user = options.user; //用户watcher
        this.id = id++;
        this.deps = [];
        this.depsId = new Set();
        if (typeof exprOrFn === 'function') {
            this.getter = exprOrFn;
        }else{
            this.getter = function(){
                let path = exprOrFn.split('.');
                let obj = vm;
                for (let i = 0; i < path.length; i++) {
                    obj = obj[path[i]]
                }
                return obj;
            }
        }
        this.value = this.get(); //默认调用get方法
    }
    addDep(dep){
        let id = dep.id;
        if (!this.depsId.has(id)) {
            this.deps.push(dep);
            this.depsId.add(id);
            dep.addSub(this);
        }
    }
    get(){ 
        //Dep.target加了一个watcher
        pushTarget(this); //当前watcher实例
        let result = this.getter(); //渲染页面就要取值，就要调用get方法
        popTarget();
        return result;
    }
    run(){
        const newValue = this.get();
        const oldValue = this.value;
        if (this.user) {
            this.cb.call(this.vm, newValue, oldValue);
        }
    }
    update(){
        queueWatcher(this);
    }
}

let queue = [];
let has = {};
let pending = false;

function flushSchedulerQueue(){
    queue.forEach(watcher => { 
        watcher.run();
        if (!watcher.user) {
            watcher.cb();
        }
    
    });
    queue = [];
    has = {};
    pending = false;
}

function queueWatcher(watcher){
    const id = watcher.id;
    if (has[id] == null) {
        queue.push(watcher);
        has[id] = true;
        if (!pending) {
            nextTick(flushSchedulerQueue);
            pending = true;
        }
    }
}



export default Watcher