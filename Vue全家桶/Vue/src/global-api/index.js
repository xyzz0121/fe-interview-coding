import { mergeOptions } from "../util";

export function initGlobalApi(Vue){
    Vue.options = {};
    Vue.mixin = function(mixin){
        //合并所有配置项
        this.options = mergeOptions(this.options, mixin);
        //我们目标结构是 this.options = {created: [createdA,ceatedB,...]}
    }

}