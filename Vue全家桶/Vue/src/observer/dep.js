let id = 0;
class Dep{
    constructor(){
        this.subs = [];
        this.id = id++;
    }
    //get 收集watcher
    depend(){
        Dep.target.addDep(this); //实现双向记忆 dep和watcher
    }
    //dep 收集watcher
    addSub(watcher){  
        this.subs.push(watcher);
    }
    //set 执行watcher
    notify(){
        this.subs.forEach( watcher => watcher.update() );
    }
}

export default Dep;


Dep.target = null;

export function pushTarget(watcher){
    Dep.target = watcher;  //全局变量保留watcher
}


export function popTarget(){
    Dep.target = null; //将变量删除掉
}

//多对多的关系，每个属性都有一个dep  dep是干嘛的，用来收集watcher 的

//dep 可以存多个watcher 其他的比如还有 vm.$watcher
//一个watcher可以对应多个dep