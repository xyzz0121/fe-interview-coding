### 流程图及笔记
由表及里，由浅入深

#### 0、项目构建
- rollup 专注打包js 简洁 包小 也没有webpack require那一堆东西 做项目webpack  写js库用rollup更好 vue 和react 都是用的rollup
#### 1、Vue用法是
```
const vm = new Vue({
    el: "#app",
    data : function(){
        return { value : 1}
    }
})
```
#### 2、所以 Vue 应该是一个类
```
function Vue(){}
为啥不用class，不方便拓展，class原型一般都写在{}里，不利于拆分，所以也源码也没用class
为啥要拆分，也不能所有原型方法都写在一个文件里，不方便阅读，不利于之策划分，所以拆成不同的插件
插件是什么？函数。
函数里面是什么？为构造函数添加原型方法。
所以有一堆插件，来拼出完成的vue原型方法
```
#### 3、数据是一切的基础，所以我们先初始化数据
写一个 initMixin 插件用于初始化
这里实现
1、实例的$options 
2、状态初始化 data props watch computed 

vue 不是一个mvvm框架，因为它可以操作dom（$ref）。mvvm是啥意思？数据变化视图会更新，视图变化数据会被影响，不能跳过数据去直接去更新视图

#### 4、初始化完数据，需要把数据变成响应式（对象）

使用defineproperty，全递归，把一个普通对象变成1个响应式对象
vue2 响应式 性能差 也是因为这个

#### 5、实现对象响应式之后，实现数组响应式

为什么数组单独实现？ 因为我们开发的时候很少对数组索引进行操作，而且如果数组非常大，100万项，遍历整个数组添加get set变成一个响应式数据，啥也不用干，就卡死了，所以为了性能问题，不用defineProperty对数组进行拦截。

那怎么把数组进行响应式呢？
重写可以改变数组的方法，数组改变时，进行通知。

这里需要注意，数组中对象如何进行响应式
以及后添加的数组元素，也需要重新进行数组对象检测

#### 5、之前一直用 vm._data.xx取值和设置值，代理vm.xx到vm._data.xx,实现真正的vm.xx

还是使用Object.defineProperty

其他事情：抽离一些工具方法

#### 6、数据初始化都完成了，该把数据渲染到模板上了， 把html编译成AST

vue渲染逻辑优先级
1、优先找render函数
2、template模板
3、el内的html结构

开启渲染
1、new vue的时候有el
2、调用$mount方法

AST和虚拟dom有啥区别？
一个是对语法转义的，一个是对dom转义的，虚拟dom还可以自定义属性来描述一个dom。
AST可以描述所有语法，html\css\js，虚拟dom只能描述dom。

尤大：前端会编译原理，想干啥干啥

前端必须要掌握的数据结构：树 （遍历、生成等等）

解析流程：
一堆判断标签开始结束、属性等等的正则
按照 面向过程 思考 ， 把html字符串边匹配、边截取

通过栈判断标签的父子关系

#### 7、然后把AST转化为render方法字符串

遍历AST，一点点拼接字符串

正则全局匹配的 lastIndex

#### 8、核心1-调用render，生成虚拟dom
实现 _c（创建元素） _s （字符串化） _v (创建文本元素)
调用render，生成虚拟dom

#### 9、根据虚拟dom生成真实dom

createElm方法，递归创建元素，找到旧的元素的父元素，插到旧元素的后面，删除旧的元素 通过updateProperties 添加各种属性

#### 10、全局options的合并和部分生命周期的触发

Vue.mixin Vue.xxx 等全局配置或者方法，需要合并到每个Vue文件的配置里。合并到一个数组里，比如 created:[created1, created2, created3] 从前到后，从全局到自己，依次执行
生命周期也一样，需要合并到一起，
生命周期是什么？是一个回调函数。会在特定的时机去调用。
使用
beforeCreated 初始化所有数据之前
created 初始化完所有数据
beforeMount 挂载之前
mounted 挂载之后

#### 11、属性依赖更新

数据变化，不更新视图，怎么办？ 调用 vm._update(vm._render);
Vue的更新策略是以组件为单位的，给每个组件都增加一个watcher，属性变化后会重新调用这个watcher，这个也叫渲染watcher。

1、渲染的时候创建watcher
2、渲染之前把watcher放到全局上，之后开始取值，取值走get，就会收集当前watcher
3、属性变化，把所有watcher 拿出来 执行一遍

整体时间线：
1、组件有el或者template，是不是要渲染
2、渲染靠什么？靠的watcher
3、watcher主要干嘛的？调用 vm._update(vm.render())
 
 dep和watcher 多对多
 dep对多watcher，一个属性的渲染watcher和自定义watcher 等
 watcher对多dep，记录哪些dep依赖了这个watcher，实现computed时候用的到

 #### 12、数组更新
 1、取arr的值，会调用get方法，然后我们希望数组记住这个渲染watcher
 2、我们给所有对象类型都增加一个dep属性
 3、页面取值时，dep.depend 这个watcher
 4、数组更新时，(push/shift等)，找到数组依赖的watcher进行更新
 
 #### 13、nextTick
 1、watcher去重，顺序执行nextTick回调，异步修改数据

 #### 14、watch的原理

 定义一个用户watcher，字符串拆分变量，关联变量和用户watcher，变化时更新watcher

 #### 15、diff算法

 patch:对比新旧虚拟节点 创建更新真实dom

 直接对比两棵树的时间复杂度是On3, 按层比较，如果一样，再比较儿子，复杂度On，父级都不一样的话，就不用接着比了


 伪代码：
 1、先比较两个元素的标签、标签不一样直接替换即可。
 if(oldVnode.tag !== vnode.tag){
     return oldVnode.pareat.replaceChild(createEl(vnode), oldVnod.el);
 }
 2、标签一样，都是undefined，说明是文本，比较文本，不一样直接替换
 oldVnode.el.textCountent = vnode.text
 3、标签一样，上面都没命中，复用老节点（html结构不会更新，只更新变化的属性），新老属性对比，更新属性（以新节点的属性为基准，老的有新的没有，删除；新的有老的没有，增加；都有，覆盖等）
 vnode.el = oldVnode.el;
 updateProperties(vnode, oldNode.data)
 4、属性比较完了，该比较儿子了（以新节点为基准，老的有新的没有，干掉老的；老的没，新的有，增加；
 都有 => 真正的diff算法）
 oldChildren = oldValue.children 
 newChildren = vnode.children

 if(oldChildren.length>0 && newChildren.length>0){ //都有
     //!!!diff算法 核心算法
     updateChildren(oldChildren,newChildren);
 }else if(oldChildren.length>0){ //老的有，新的没有
    //置空
    innerHTML = "";
 }else if(newChildren.length>0){ //新的有，老的没有
    //遍历新的孩子数组 都插入进去
    el.appendChild(createELm(child))
 }

 function updateChildren(oldChildren,newChildren){
     //这里vue diff做了很多优化
     //1、节点插入头、尾、正序倒序等，vue2采取双指针（其实就是数组下标）的方式，为什么双指针？因为可能在头部或者尾部插入，如果只有一个，那有可能出现对比孩子全都不一样。
     oldstart=0;
     oldend=old.length-1;
     newstart=0;
     newend=new.length-1;
     //谁先结束就停止
     while(oldstart <= oldend && newoldstart <= newend){
         //如果头一样，就从前向后比
         if(isSameVnode(oldStartVnode,newStartVnode)){
             patch(oldStartVnode,newStartVnode)
             ++oldstart;
             ++newstart;
         }
        //如果尾一样 就从后向前比
         else if(isSameVnode(oldEndVnode,newEndVnode)){
            patch(oldEndVnode,newEndVnode)
             --oldEnd;
             --newEnd;
         }
         //头尾交叉比 老尾新头
         else if(){

         }
         //头尾交叉比 老头新尾
         else if(){

         }
         //儿子之间完全没关系，暴力比对 遍历新节点 一个一个在老节点里找，找到复用 找不到插入到老的前面
         else{
             008889
         }
     }
     //结束之后 newStart < newEnd 将多余的插入
 }
//判断是不是一个相同的虚拟节点 
为什么要有key？移动元素的速度要快于修改或者创建；
如果不写key 节点就会复用，会重新创建元素，性能差，涉及表单input的话，顺序变化，可能第一个框的值出现在第二个框里。
为什么不能用index当key？
同上

 function isSameVnode(old,new){
     return old.tag === new.tag && old.key === new.key;
 }

#### 15、computed

内部也使用了defineProperty,每次取值， 多一个变量dirty，如果是脏的，就取值，取过值之后就标识为干净的，就不会重新取值。什么时候修改dirty，watcher更新的时候， 包装一个getter方法， 控制computed要不要执行
computed 也是一个watcher 内部依赖的属性会收集这个watcher

#### 16、Vue.extend

为什么要拆分小组件？
1、可复用
2、方便维护 
3、减少diff，提高渲染效率

 #### 17、源码


#### 18、服务端渲染


通过一份代码，打包出两份js
后端通过 rernder 把js 打包成html
html + 客户端的js，就OK了