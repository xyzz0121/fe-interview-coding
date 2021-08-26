//把ast元素的属性，生成render字符串
function genProps(attrs){
    console.log(attrs);
    let str = '' ;
    attrs.forEach(attr => {
        if (attr.name === "style") { //style比较特殊 进行特殊处理
            let obj = {};
            attr.value.split(';').forEach(item => {
                let [key, value] = item.split(':');
                obj[key] = value;
            });
            attr.value = obj;
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    });
    return `{${str.slice(0, -1)}}`;  //去掉多余逗号
}

function gen(node) {
    if (node.type === 1) {
        generate(node);
    }else{
        const text = node.text;
        return `_v(${JSON.stringify(text)})`
    }
}

function genChildren(el) {
    const children = el.children;
    if (children) {
        return children.map(child => gen(child)).join(',')
    }
}

//核心就是拼遍历ast，然后生成render函数的字符串
export function generate(el) {
    const children = genChildren(el);
    // _c: 创建元素  _v: 创建文本  _s: {{}}变量
    let code = `_c('${el.tag}', ${
        el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'        //有属性、组合属性字符串
    }${
        children ? `, ${children}` : ''
    })`;

    return code;
}