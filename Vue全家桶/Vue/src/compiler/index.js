//解析html的正则表达式们
const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z" + (unicodeRegExp.source) + "]*";
const qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
const startTagOpen = new RegExp(("^<" + qnameCapture));
const startTagClose = /^\s*(\/?)>/;
const endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));

//html to ast
function parseHTML(html) {
    function createASTElement(tagName, attrs) {
        return {
            tag: tagName,
            type: 1, //html 元素 type是1
            children: [],
            attrs,
            parent: null
        }
    }
    let root;
    let currentParent;
    let stack = []; //用栈 判断标签时候合法
    function start(tagName, attrs) {
        let element = createASTElement(tagName, attrs);
        if (!root) {
            root = element;
        }
        currentParent = element;
        stack.push(element);
    }

    function end(tagName) {
        let element = stack.pop(); //取出栈最后一个 进行比较 看看标签是否配对
        currentParent = stack[stack.length-1];
        if (currentParent) { //闭合时知道，当前标签的父子关系
            element.parent = currentParent;
            currentParent.children.push(element);
        }
    }

    function chars(text) {
        text = text.replace(/\s/g, '');
        if (text) {
            currentParent.children.push({
                type: 3,//html 文本 type是3
                text
            })
        }
    }

    //解析过程 边解析边删除，直到所有解析完成
    while (html) { //只要Html不空，就一直解析
        //观察规律，看当前第一个字符是不是 < ，是 < 就一定是一个标签
        let textEnd = html.indexOf("<");
        if (textEnd === 0) {
            //TODO: v-bind :value 等等
            //先看看是不是开始标签，那么先解析开始标签
            const startTagMatch = parseStartTag();
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs);
                continue;
            }
            //不是开始标签，就是结束标签
            const endTagMatch = html.match(endTag);
            if (endTagMatch) {
                end(endTagMatch[0]);
                advance(endTagMatch[0].length);
                continue;
            }
        }
        let text;
        //< 位置 大于0 当前字符串是文本
        if (textEnd > 0) {
            text = html.substring(0, textEnd);
        }
        //有文本 记录文本 删除文本
        if (text) {
            advance(text.length);
            chars(text);
        }
    }

    function advance(n) { //截取掉匹配到内容，重新更新html
        html = html.substring(n);
    }

    function parseStartTag() {
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            };
            advance(start[0].length);
            //开始标签截取完了，该匹配属性了, 好多属性，所以要遍历
            //如果是开始标签结束了，那么没有属性了，所以先判断 开始标签没有结束
            let end, attr;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5] //属性的三种写法，match出来结果，在数组的不同位置
                });
                advance(attr[0].length);
            }
            //如果开始标签结束了
            if (end) {
                advance(end[0].length);
                return match;
            }
        }
    }
    return root;
}

//把template编译成render函数
export function compileToFunctions(template) {
    let ast = parseHTML(template);
    console.log(ast);
}