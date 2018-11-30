import { DebuggerParam, LogParam } from "../shared/log.configure";
import { LogType } from '../shared/log-style.define';
import { getLogParamList, getDataStyle, allowPrintOutList } from './log';
import { jsNativeType } from 'cyia-ngx-common';
import { DEBUGGERPARAM_INIT } from './log.const';


/**
 * @description
 * @已知问题 当数组或对象被设置为table输出时,会被提升,等待下一次更新
 * @author cyia
 * @date 2018-11-27
 * @export
 * @param [param]
 * @returns
 */
export function Debugger(param?: DebuggerParam) {
    param = Object.assign({}, DEBUGGERPARAM_INIT, param);
    let fnObjAddNormal = (list: any[], item: LogParam) => {
        list[0] += `%o`;
        list.push(item.value);
        return list;
    }
    let fnObjAddTable = (list: any[], item: LogParam) => {
        console.table(item.value);
        return list
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
            typeList.forEach((type) => {
                console[type] = function () {
                    /**调试的参数列表 */
                    let logParamList = getLogParamList(...Array.from(arguments)) || [];
                    let callParamList = ['%c', dataStyle];
                    logParamList.forEach((item) => {
                        callParamList = [...typehandle].find(([key, value], i) => {
                            return key.type == item.type && !!displayTypeList.find((val) => val == key.displayType) || key.type == 'default'
                        })[1](callParamList, item)
                    })
                    orgConsole[type](...callParamList)
                }
            });
            console.group(`${target.constructor.name}-${name}`)
            console.time(`${name}用时`)
            let returnValue = fn.apply(this, arguments)
            console.timeEnd(`${name}用时`)
            console.groupEnd()
            typeList.forEach((type) => {
                console[type] = orgConsole[type]
            })
            return returnValue
        }
        return descriptor
    }
}