import { jsNativeType, TypeJudgment } from "cyia-ngx-common";
import { LogParam } from '../shared/log.configure';
import { LogStyle, LogType } from '../shared/log-style.define';

/**
 * @description 
 * TODO 字符串正常压入,函数要处理,对象%o,颜色%c,要保存两个变量,一个是字符串,一个是参数
 * 函数处理1.原封输出.2.变成对象输出2.属性?
 * 对象数组输出table还是正常的
 * @author cyia
 * @date 2018-11-26
 * @export
 * @param param
 */
export function getLogParamList(...param): LogParam[] {
    return param.map((val) => ({ type: TypeJudgment.getType(val), value: val }))
}


/**
 * @description 驼峰法命名转化
 * @author cyia
 * @date 2018-09-06
 * 
 * @param name
 * @returns
 * @memberof LogService
 */
function coverName(name: string): string {
    let wordArray = name.match(/([A-Z])/g) || [];
    wordArray.forEach((word) => {
        name = name.replace(word, `-${word.toLocaleLowerCase()}`);
    })
    return name;
}

/**
 * @description 设置输出的样式,
 * @author cyia
 * @date 2018-09-06
 * @param [str=''] 字符串传参,和标签中style=""的格式一致
 * @param [styleObj=null] 驼峰对象
 * @memberof LogService
 */
export function getDataStyle(styleObj: LogStyle = {}): string {
    let outStyle = '';
    for (let propertyName in styleObj) {
        if (!(styleObj).hasOwnProperty(propertyName)) continue;
        outStyle += `${coverName(propertyName)}:${styleObj[propertyName]};`;//doc正常情况
    }
    return outStyle
}
/**
 * @description 返回重写的方法列表
 * @author cyia
 * @date 2018-11-28
 * @export
 * @param value
 * @returns
 */
export function allowPrintOutList(value: number): LogType[] {
    return [
        { value: 'info', toggle: 0b0001 },
        { value: 'log', toggle: 0b0010 },
        { value: 'warn', toggle: 0b0100 },
        { value: 'error', toggle: 0b1000 }
    ].map((val) => {
        return val.toggle & value ? val.value : ''
    }).filter((val) => val) as LogType[]
}