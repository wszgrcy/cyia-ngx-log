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