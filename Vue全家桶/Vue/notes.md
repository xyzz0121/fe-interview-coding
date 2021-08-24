#### 第一节
- rollup 专注打包js 简洁 包小 也没有webpack require那一堆东西 做项目webpack  写js库用rollup更好 vue 和react 都是用的rollup
#### 第二节
- 写成一个个插件 进行对原型的拓展。只要是插件 就是一个函数。
- vue 不是一个mvvm框架，因为它可以操作dom（$ref）。mvvm是啥意思？数据变化视图会更新，视图变化数据会被影响，不能跳过数据去直接去更新视图
- vue2 性能差 因为全递归 defineproperty 