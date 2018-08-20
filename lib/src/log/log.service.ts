import { TypeJudgment, jsNativeType } from './../shared/type-judgment';
import { Injectable, Inject } from '@angular/core';
import { CONTROLLER } from '../shared/token';
import { LogStyle } from '../shared/log-style.define';
import { LogConfigure } from '../shared/log.configure';

@Injectable()
export class LogService {
    /**保存要输出的  */
    private dataStr = '';
    /**保存要输出的对象 */
    private dataArray: any[] = [];
    /**保存样式 */
    private outStyle = '';
    /**是否将对象和数字显示为表格类型 */
    flag = {
        Array: false,
        Object: false,
    }
    static test1: any;
    timeHeap: TimeHeapItem[] = []
    //log info warn error
    constructor(@Inject(CONTROLLER) logConfigure: LogConfigure) {
        !(logConfigure.printControl & 0b1000) && (this.log = () => { });
        !(logConfigure.printControl & 0b0100) && (this.log = () => { });
        !(logConfigure.printControl & 0b0010) && (this.log = () => { });
        !(logConfigure.printControl & 0b0001) && (this.log = () => { });
    }

    /**
     * 将数据初始化
     *
     * @memberof LogService
     */
    private setDataInit() {
        this.dataStr = '%c';
        this.dataArray = [this.outStyle]
    }

    /**
     *样式初始化
     *
     * @param {string} [str=''] 字符串css
     * @param {(LogStyle | null)} [styleObj=null] js配置,驼峰
     * @memberof LogService
     */
    setDataStyle(str: string = '', styleObj: LogStyle | null = null) {
        if (str) {//doc 直接赋值
            this.outStyle = str
        } else {
            this.outStyle = '';
            for (const x in styleObj as LogStyle) {
                if ((<LogStyle>styleObj).hasOwnProperty(x)) {
                    let propertyName = x
                    const propertyValue = (<LogStyle>styleObj)[x] as string;
                    propertyName = this.coverName(propertyName)
                    this.outStyle += `${propertyName}:${propertyValue};`;//doc正常情况
                }
            }
        }
    }

    /**
     *ngOnInit或constructor使用
     * todo 运行时间,记录this,开始时间,当结束时返回现在时间记录
     * @param {*} [component=null] this,传入组件或服务,
     * @param {string} [desc=''] 描述
     * @memberof LogService
     */
    start(component: any = null, desc: string = '') {
        try {
            let name = component['__proto__']['constructor']['name']
            this.timeHeap.push({ time: Date.now(), thisname: name, this: component, desc: desc })
            console.group(`${name}-${desc}`);
        } catch (error) {
            console.group(`${desc}`);
        }
    }
    compute(component: any) {
        let item: TimeHeapItem = this.timeHeap.find((val) => {
            return val.this === component
        });
        if (item) {
            this.log(`[${item.thisname}-${item.desc || ''}] 运行至此用时${(Date.now() - item.time) / 1000}秒`)
        } else {
            this.warn('该组件并没有调用start初始化')
        }
    }
    /**
     * 建议在ngOnDestroy使用
     *
     * @memberof LogService
     */
    end(component: any) {
        console.groupEnd();
        let i = this.timeHeap.length - 1;
        while (i >= 0) {
            if (this.timeHeap[i].this === component) {
                this.log(`[${this.timeHeap[i].thisname}-${this.timeHeap[i].desc || ''}] 结束,用时${(Date.now() - this.timeHeap[i].time) / 1000}秒`);
                this.timeHeap.splice(i, 1)
                break;
            }
            i--;
        }
    }

    /**
     * 
     * @param param 
     */
    // @controlOpen(Boolean(GLOBAL_VAR.control & 0b0001))
    log(...param: any[]) {
        this._printOut('log', ...param);
    }
    warn(...param: any[]) {
        this._printOut('warn', ...param);
    }
    error(...param: any[]) {
        this._printOut('error', ...param);
    }
    info(...param: any[]) {
        this._printOut('info', ...param);
    }

    /**
     * log,warn,error,info调用
     *
     * @private
     * @param {ConsoleMethod} method 调用方法
     * @param {...any[]} param 参数
     * @memberof LogService
     */
    private _printOut(method: ConsoleMethod, ...param: any[]) {
        this.setDataInit()
        let type: jsNativeType;
        param.forEach((val) => {
            type = TypeJudgment.getType(val);
            switch (type) {
                case jsNativeType.object:
                case jsNativeType.array:
                    if (this.flag[type] && !this.containFunction(type, val)) {
                        this.logprint(1, null, method);
                        this.setDataInit();
                        this.logprint(2, val, method)
                    } else {
                        this.dataStr += '%o';
                        this.dataArray.push(val);
                    }
                    break
                default:
                    this.dataStr += val;
                    break;
            }
            //1.最后一个参数正好是普通数据.2.正好输入完成,只有初始化
        })
        if (this.dataArray.length >= 1 && this.dataStr.length > 2)
            this.logprint(1, null, method);
    }


    /**两种方式,
     * 1.普通输出
     * 2.表格输出
     */
    private logprint(index = 1, table: Object | Array<any> | null = null, method: ConsoleMethod) {
        // this.dataArray.push(this.getLine())
        switch (index) {
            case 1:
                console[method](this.dataStr, ...this.dataArray);
                break;
            case 2:
                console.table(table);
                break;
            default:
                break;
        }
        console.log(this.getLine())
    }
    private getLine() {
        let a = new Error();
        let tmp = (a.stack as string).split('\n');
        for (let i = tmp.length - 1; i < tmp.length; i--) {
            const element = tmp[i].trim();
            if (/LogService/.test(element)) {
                tmp.splice(i + 2, 999);
                tmp.splice(1, i);
                break;
            }
        }
        return tmp.join('\n');
    }


    /**
     * 判断数组或对象是否包含函数,如果包含那么就仍然普通导出
     * todo 如果有循环的引用怎么办
     * @param {jsNativeType} type 类型
     * @param {(Object | Array<any>)} param 需要判断的参数
     * @returns {boolean} 返回是否在对象/数组中出现函数
     * @memberof LogService
     */
    private containFunction(type: jsNativeType, param: Object | Array<any>): boolean {
        if (type == jsNativeType.object) {
            return this._searchObject(param)
        } else if (type == jsNativeType.array) {
            return this._searchArray(param as Array<any>)
        }
        return true;//理论上执行不到
    }
    private _searchObject(param: Object): boolean {
        for (const x in param) {
            if (param.hasOwnProperty(x)) {
                const element: any = (<any>param)[x];
                if (TypeJudgment.getType(element) == jsNativeType.object) {
                    return this._searchObject(element)
                } else if (TypeJudgment.getType(element) == jsNativeType.array) {
                    return this._searchArray(element)
                } else if (TypeJudgment.getType(element) == jsNativeType.function) {
                    return true;
                }
            }
        }
        return false;
    }
    private _searchArray(param: Array<any>): boolean {
        for (let i = 0; i < param.length; i++) {
            const element = param[i];
            if (TypeJudgment.getType(element) == jsNativeType.object) {
                return this._searchObject(element)
            } else if (TypeJudgment.getType(element) == jsNativeType.array) {
                return this._searchArray(param)
            } else if (TypeJudgment.getType(element) == jsNativeType.function) {
                return true;
            }
        }
        return false;
    }

    private coverName(name: string): string {
        let wordArray = name.match(/([A-Z])/g);
        for (let i = 0; wordArray && i < wordArray.length; i++) {
            const word = wordArray[i];
            name = name.replace(word, `-${word.toLocaleLowerCase()}`);
        }
        return name;
    }

}
// function controlOpen(bool: boolean) {
//     console.log('查看传入', bool)
//     return function (target: any, name: string, desc: PropertyDescriptor) {
//         if (bool) { } else {
//             desc.value = () => { }
//         }
//         return desc
//     }
// }
function testParam(bool: any) {
    console.log('查看传入', bool)
    return function (target: any, name: string, desc: PropertyDescriptor) {

    }
}
type ConsoleMethod = 'log' | 'warn' | 'error' | 'info'
export interface TimeHeapItem {
    time: number,
    this: any,
    thisname: string,
    desc?: string
}

