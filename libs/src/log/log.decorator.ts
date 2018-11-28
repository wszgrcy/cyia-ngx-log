import { DebuggerParam } from "../shared/log.configure";
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
    param = Object.assign({}, DEBUGGERPARAM_INIT, param)

    return (target, name: string, descriptor: PropertyDescriptor) => {
        let typeList: LogType[] = allowPrintOutList(param.level);
        if (!typeList.length) return descriptor;
        let fn: Function = descriptor.value;
        descriptor.value = function () {
            /**重写方法的列表 */
            let orgConsole = { log: console.log, info: console.info, warn: console.warn, error: console.error, }
            /**样式列表 */
            let dataStyle = getDataStyle(param.style);
            typeList.forEach((type) => {
                console[type] = function () {
                    /**调试的参数列表 */
                    let logParamList = getLogParamList(...Array.from(arguments)) || [];
                    let callParamList = ['%c', dataStyle];
                    logParamList.forEach((item) => {
                        switch (item.type) {
                            case jsNativeType.array:
                                if (param.arrayType == 'normal') {
                                    callParamList[0] += `%o`
                                    callParamList.push(item.value)
                                } else if (param.arrayType == 'table')
                                    console.table(item.value)
                                break;
                            case jsNativeType.object:
                                if (param.objectType == 'normal') {
                                    callParamList[0] += `%o`
                                    callParamList.push(item.value)
                                } else if (param.objectType == 'table')
                                    console.table(item.value)
                                break;
                            case jsNativeType.function:
                                if (param.functionType == 'string') callParamList[0] += `%o`;
                                else if (param.functionType == 'object') callParamList[0] += `%O`;
                                callParamList.push(item.value)
                                break;
                            default:
                                callParamList[0] += `${item.value}`
                                break;
                        }
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