import { DebuggerParam, LogParam } from "../shared/log.configure";
import { LogType } from '../shared/log-style.define';
import { getLogParamList, getDataStyle, allowPrintOutList } from './log';
import { jsNativeType } from 'cyia-ngx-common';
import { DEBUGGERPARAM_INIT } from './log.const';
const fnObjAddNormal = (list: any[], item: LogParam) => {
    list[0] += `%o`;
    list.push(item.value);
    return list;
}
const fnObjAddTable = (list: any[], item: LogParam) => {
    // console.table(item.value);
    return undefined
}
const typehandle = new Map([
    [
        { type: jsNativeType.array, displayType: 'array_normal' }, fnObjAddNormal
    ],
    [
        { type: jsNativeType.array, displayType: 'array_table' }, fnObjAddTable,
    ],
    [
        { type: jsNativeType.object, displayType: 'object_normal' }, fnObjAddNormal
    ],
    [
        { type: jsNativeType.object, displayType: 'object_table' }, fnObjAddTable,
    ],
    [
        { type: jsNativeType.function, displayType: 'function_string' }, (list: any[], item: LogParam) => {
            list[0] += `%o`;
            list.push(item.value);
            return list;
        },
    ],
    [
        { type: jsNativeType.function, displayType: 'function_object' }, (list: any[], item: LogParam) => {
            list[0] += `%O`;
            list.push(item.value);
            return list;
        },
    ],
    [
        { type: 'default', }, (list: any[], item: LogParam) => {
            list[0] += `${item.value}`
            return list;
        },
    ],

])


/**
 * @description
 * 
 * @author cyia
 * @date 2018-11-27
 * @export
 * @param [param]
 * @returns
 */
export function Debugger(param?: DebuggerParam) {
    param = Object.assign({}, DEBUGGERPARAM_INIT, param);

    return (target, name: string, descriptor: PropertyDescriptor) => {
        let typeList: LogType[] = allowPrintOutList(param.level);
        if (!typeList.length) return descriptor;
        let fn: Function = descriptor.value;
        descriptor.value = function () {
            /**重写方法的列表 */
            let orgConsole = { log: console.log, info: console.info, warn: console.warn, error: console.error, }
            /**样式列表 */
            let dataStyle = getDataStyle(param.style);
            let displayTypeList = [`array_${param.arrayType}`, `object_${param.objectType}`, `function_${param.functionType}`];
            const tableList = ['array_table', 'object_table']
            typeList.forEach((type) => {
                console[type] = function () {
                    /**调试的参数列表 */
                    let logParamList = getLogParamList(...Array.from(arguments)) || [];
                    let callParamList = ['%c', dataStyle];
                    logParamList.forEach((item) => {
                        callParamList = [...typehandle].find(([key], i) => {
                            if (item.type === key.type && tableList.some((val) => val === key.displayType)) {
                                orgConsole[type](...callParamList)
                                console.table(item.value);
                            }
                            return key.type == item.type && !!displayTypeList.find((val) => val == key.displayType) || key.type == 'default'
                        })[1](callParamList, item) || ['%c', dataStyle]
                    })
                    orgConsole[type](...callParamList)
                }
            });
            if (param.level) {
                console.group(`${target.constructor.name}-${name}`)
                console.time(`${name}用时`)
            }
            let returnValue = fn.apply(this, arguments)
            if (param.level) {
                console.timeEnd(`${name}用时`)
                console.groupEnd()
            }
            //doc 还原
            typeList.forEach((type) => {
                console[type] = orgConsole[type]
            })
            return returnValue
        }
        return descriptor
    }
}