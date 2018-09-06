
/**
 * @description 样式类型,有-的属性请以驼峰法写出,font-size=>fontSize
 * @author cyia
 * @date 2018-09-06
 * @export
 */
export interface LogStyle {
    color?: string;
    background?: string;
    padding?: string;
    margin?: string;
    border?: string;
    [name: string]: string;
}