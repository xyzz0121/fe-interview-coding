import { popTarget, pushTarget } from "./dep";

let id = 0;
class Watcher{
    constructor(vm, exprOrFn, cb, options){
        this.vm = vm; //vm实例
        this.exprOrFn = exprOrFn; //表达式或者函数 如 vm._update(vm._render);
        this.cb = cb;
        this.options = options;
        this.id = id++;
        this.deps = [];
        this.depsId = new Set();
        if (typeof exprOrFn === 'function') {
            this.getter = exprOrFn;
        }
        this.get(); //默认调用get方法
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
        this.getter(); //渲染页面就要取值，就要调用get方法
        popTarget();
    }
    update(){
        this.get();
    }
}

export default Watcher