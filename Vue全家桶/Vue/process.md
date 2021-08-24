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
