export function patch(oldVnode, vnode){
    //将虚拟dom转化为真实节点 递归创建元素的过程

    let el = createElm(vnode); //产生真实dom
    let parentElm = oldVnode.parentNode; // 获取旧的节点的父亲
    console.log(parentElm);
    parentElm.insertBefore(el, oldVnode.nextSibiling);//当前真实元素插入到app的后面
    parentElm.removeChild(oldVnode); //删除旧的节点
}

function createElm(vnode){
    let { tag, data, key, children, text} = vnode;
    if (typeof tag === "string") { //创建元素，放到vnode.el上
        vnode.el = document.createElement(tag);
        children.forEach(child => {
            vnode.el.appendChild(createElm(child));
        });
    }else{ 
        vnode.el = document.createTextNode(text)
    }
    return vnode.el;
}