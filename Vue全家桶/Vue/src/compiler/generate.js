//把ast元素的属性，生成render字符串
function genProps(attrs){
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
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

function gen(node) {
    if (node.type === 1) {
        return generate(node);
    }else{
        const text = node.text;
        //如果不存在 {{}} 这种变量
        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`
        }
        //存在的话，用正则一点点把字符串拆开，给变量加上 _s()
        let tokens = []; //存放每一段代码
        let lastIndex = defaultTagRE.lastIndex = 0; //全局模式，每次index置为0 , 因为上面执行了一次 defaultTagRE.test 所以政策而index要归位
        let match, index; // 匹配到的结果
        while (match = defaultTagRE.exec(text)) {
            index = match.index;
            //说明匹配到的结果不是第一个元素，那说明前面这部分是普通字符串
            if (index > lastIndex) {
                tokens.push(JSON.stringify(text.slice(lastIndex, index)));
            }
            tokens.push(`_s(${match[1].trim()})`);
            lastIndex = index + match[0].length;
        }
        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)));
        }
        return `_v(${tokens.join('+')})`;

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