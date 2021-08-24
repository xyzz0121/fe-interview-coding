### 流程图
由表及里，由浅入深

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
```
写一个 initMixin 插件用于初始化
这里实现
1、实例的$options 
2、状态初始化 data props watch computed 

```