import { generate } from "./generate";
import { parseHTML } from "./perse";

//把template编译成render函数
export function compileToFunctions(template) {
    //1、html转成AST
    const ast = parseHTML(template);

    //2、TODO:优化静态节点

    //3、AST重新生成代码
    const code = generate(ast);
    
    //4、把code字符串转化成真正的函数 通过with进行设置取值
    const render = new Function(`with(this){return ${code}}`);

    return render;
    
}