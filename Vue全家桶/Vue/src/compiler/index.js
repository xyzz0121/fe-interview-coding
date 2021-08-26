import { generate } from "./generate";
import { parseHTML } from "./perse";

//把template编译成render函数
export function compileToFunctions(template) {
    //1、html转成AST
    const ast = parseHTML(template);

    //2、TODO:优化静态节点

    //3、AST重新生成代码
    const code = generate(ast);

    console.log(code);
}