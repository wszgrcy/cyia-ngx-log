import { LogStyle } from "./log-style.define";
import { jsNativeType } from 'cyia-ngx-common';

/**配置log初始化 */
export interface LogConfigure {
    /**控制编译后是否输出,0b1111二进制格式,依次为log,info,warn,error */
    printControl: number;
}

/**
 * @description 用于输出的模版 [{name}-{desc}] 结束,用时{time}秒 这样的格式
 * @author cyia
 * @date 2018-09-06
 * @export
 */
export interface LabelTemplate {
    start?: string;
    end?: string;
    compute?: string;
    [name: string]: string;
}
export interface DebuggerParam {
    /**显示级别0b1111 */
    level?: number;
    /**输出样式 */
    style?: LogStyle;
    /**对象显示类型*/
    objectType?: 'table' | 'normal';
    /**数组显示类型*/
    arrayType?: 'table' | 'normal';
    /**函数显示类型*/
    functionType?: 'string' | 'object';
    /**暂时未添加功能 */
    trace?: boolean;
}
export interface LogParam {
    type: jsNativeType;
    value: any
}