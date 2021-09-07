export function renderMixin(Vue){
    //创建元素
    Vue.prototype._c = function(){
        return createElement(...arguments);
    }
    //stringify
    Vue.prototype._s = function(val){
        return val == null ? "" : typeof val === "object" ? JSON.stringify(val) : val;
    }
    //创建文本元素
    Vue.prototype._v = function(text){
        return createTextVnode(text);
    }
 
    Vue.prototype._render = function(){
        const vm = this;
        const render = vm.$options.render;
        let vnode = render.call(vm);
        console.log(vnode);
        return vnode ;
    }
}

function createElement(tag, data={}, ...children){
    return vnode(tag, data, data.key, children);
}

function createTextVnode(text){
    return vnode(undefined, undefined, undefined, undefined, text);
}

//产生虚拟dom的
function vnode(tag, data, key, children, text){
    return {
        tag,
        data,
        key,
        children,
        text
    }
}