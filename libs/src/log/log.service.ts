import { TypeJudgment, jsNativeType } from 'cyia-ngx-common';
import { Injectable, Inject } from '@angular/core';
import { CONTROLLER } from '../shared/token';
import { LogStyle } from '../shared/log-style.define';
import { LogConfigure, LabelTemplate } from '../shared/log.configure';

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
    private _label: LabelTemplate = {
        start: `[{name}-{desc}]`,
        end: `[{name}-{desc}] 结束,用时{time}秒`,
        compute: `[{name}-{desc}] 运行至此用时{time}秒`,
    }

    timeHeap: TimeHeapItem[] = []
    //log info warn error


    constructor(@Inject(CONTROLLER) logConfigure: LogConfigure) {
        !(logConfigure.printControl & 0b1000) && (this.log = () => { });
        !(logConfigure.printControl & 0b0100) && (this.info = () => { });
        !(logConfigure.printControl & 0b0010) && (this.warn = () => { });
        !(logConfigure.printControl & 0b0001) && (this.error = () => { });
    }

    /**
     * 将数据初始化
     *
     * 
     */
    private setDataInit() {
        this.dataStr = '%c';
        this.dataArray = [this.outStyle]
    }


    /**
     *设置开始,计算,结束的输出格式
     *
     * 
     * 
     */

    /**
     * @description
     * @author cyia
     * @date 2018-09-06
     * @param label 传入模版
     * @memberof LogService
     */
    set label(label: LabelTemplate) {
        this._label = Object.assign({}, this._label, label)
    }
    get label() {
        return this._label
    }


    /**
     * @description 设置输出的样式,
     * @author cyia
     * @date 2018-09-06
     * @param [str=''] 字符串传参,和标签中style=""的格式一致
     * @param [styleObj=null] 驼峰对象
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
     *
     * todo 运行时间,记录this,开始时间,当结束时返回现在时间记录
     * 
     * 
     * 
     */

    /**
     * @description ngOnInit或constructor使用
     * @author cyia
     * @date 2018-09-06
     * @param [component=null] angular组件this
     * @param [desc=''] group的描述
     * @memberof LogService
     */
    start(component: any = null, desc: string = '') {
        try {
            let name = component['__proto__']['constructor']['name']
            console.group(this.printOutLabelStr(this.label.start, this.timeHeap[this.timeHeap.push({ time: Date.now(), thisname: name, this: component, desc: desc }) - 1]))
        } catch (error) {
            console.group(`${desc}`);
        }
    }

    /**
     * @description 计算从组件开始运行到此的时间
     * @author cyia
     * @date 2018-09-06
     * @param component angular组件this
     * @memberof LogService
     */
    compute(component: any) {
        let item: TimeHeapItem = this.timeHeap.find((val) => {
            return val.this === component
        });
        if (item) {
            this.log(this.printOutLabelStr(this.label.compute, item))
        } else {
            this.warn('该组件并没有调用start初始化')
        }
    }

    /**
     * @description 调用this可以使用
     * @author cyia
     * @date 2018-09-06 
     * @param component angular组件this
     * @memberof LogService
     */
    end(component: any) {
        console.groupEnd();
        let i = this.timeHeap.length - 1;
        while (i >= 0) {
            if (this.timeHeap[i].this === component) {
                this.log(this.printOutLabelStr(this.label.end, this.timeHeap[i]))
                this.timeHeap.splice(i, 1)
                break;
            }
            i--;
        }
    }


    /**
     * @description 与普通log一样使用
     * @author cyia
     * @date 2018-09-06
     * @param param
     * @memberof LogService
     */
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
     * 
     * 
     * 
     * 
     */
    /**
     * @description 打印使用
     * @author cyia
     * @date 2018-09-06
     * 
     * @param method 输出方法
     * @param param 参数
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
                    break;
                case jsNativeType.number:
                case jsNativeType.string:
                    this.dataStr += val;
                    break;
                default:
                    this.dataStr += '%o';
                    this.dataArray.push(val);
                    break;
            }
            //1.最后一个参数正好是普通数据.2.正好输入完成,只有初始化
        })
        if (this.dataArray.length > 1 || this.dataStr.length > 2)
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
                if (this.dataArray.length > 1 || this.dataStr.length > 2) {
                    console[method](this.dataStr, ...this.dataArray);
                    console.log(this.getLine())
                }
                break;
            case 2:
                console.table(table);
                console.log(this.getLine())
                break;
            default:
                break;
        }

    }

    /**
     * @description 从堆栈里获得行数
     * @author cyia
     * @date 2018-09-06
     * 
     * @returns
     * @memberof LogService
     */
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
     * @description 计算是否有函数,判断数组或对象是否包含函数,如果包含那么就仍然普通导出
     * @author cyia
     * @date 2018-09-06
     * 
     * @param type
     * @param param
     * @returns
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

    /**
     * @description 在对象中搜索类型
     * @author cyia
     * @date 2018-09-06
     * 
     * @param param
     * @returns
     * @memberof LogService
     */
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

    /**
     * @description 在数组中搜索类型
     * @author cyia
     * @date 2018-09-06
     * 
     * @param param
     * @returns
     * @memberof LogService
     */
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


    /**
     * @description 驼峰法命名转化
     * @author cyia
     * @date 2018-09-06
     * 
     * @param name
     * @returns
     * @memberof LogService
     */
    private coverName(name: string): string {
        let wordArray = name.match(/([A-Z])/g);
        for (let i = 0; wordArray && i < wordArray.length; i++) {
            const word = wordArray[i];
            name = name.replace(word, `-${word.toLocaleLowerCase()}`);
        }
        return name;
    }

    /**
     * @description 往模版添加值
     * @author cyia
     * @date 2018-09-06
     * 
     * @param label
     * @param obj
     * @returns
     * @memberof LogService
     */
    private printOutLabelStr(label: string, obj: TimeHeapItem): string {
        return label.replace('{time}', `${(Date.now() - obj.time) / 1000}`).replace('{desc}', obj.desc || '').replace('{name}', obj.thisname)
    }
}
