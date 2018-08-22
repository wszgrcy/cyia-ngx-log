import { LogStyle } from '../shared/log-style.define';
import { LogConfigure, LabelTemplate } from '../shared/log.configure';
export declare class LogService {
    /**保存要输出的  */
    private dataStr;
    /**保存要输出的对象 */
    private dataArray;
    /**保存样式 */
    private outStyle;
    /**是否将对象和数字显示为表格类型 */
    flag: {
        Array: boolean;
        Object: boolean;
    };
    private label;
    static test1: any;
    timeHeap: TimeHeapItem[];
    constructor(logConfigure: LogConfigure);
    /**
     * 将数据初始化
     *
     * @memberof LogService
     */
    private setDataInit;
    /**
     *设置开始,计算,结束的输出格式
     *
     * @param {LabelTemplate} label {start,end,compute}
     * @memberof LogService
     */
    setPrintLabel(label: LabelTemplate): void;
    /**
     *样式初始化
     *
     * @param {string} [str=''] 字符串css
     * @param {(LogStyle | null)} [styleObj=null] js配置,驼峰
     * @memberof LogService
     */
    setDataStyle(str?: string, styleObj?: LogStyle | null): void;
    /**
     *ngOnInit或constructor使用
     * todo 运行时间,记录this,开始时间,当结束时返回现在时间记录
     * @param {*} [component=null] this,传入组件或服务,
     * @param {string} [desc=''] 描述
     * @memberof LogService
     */
    start(component?: any, desc?: string): void;
    compute(component: any): void;
    /**
     * 建议在ngOnDestroy使用
     *
     * @memberof LogService
     */
    end(component: any): void;
    /**
     *
     * @param param
     */
    log(...param: any[]): void;
    warn(...param: any[]): void;
    error(...param: any[]): void;
    info(...param: any[]): void;
    /**
     * log,warn,error,info调用
     *
     * @private
     * @param {ConsoleMethod} method 调用方法
     * @param {...any[]} param 参数
     * @memberof LogService
     */
    private _printOut;
    /**两种方式,
     * 1.普通输出
     * 2.表格输出
     */
    private logprint;
    private getLine;
    /**
     * 判断数组或对象是否包含函数,如果包含那么就仍然普通导出
     * todo 如果有循环的引用怎么办
     * @param {jsNativeType} type 类型
     * @param {(Object | Array<any>)} param 需要判断的参数
     * @returns {boolean} 返回是否在对象/数组中出现函数
     * @memberof LogService
     */
    private containFunction;
    private _searchObject;
    private _searchArray;
    /**
     * 样式名的大小写转换
     * @private
     * @param {string} name
     * @returns {string}
     * @memberof LogService
     */
    private coverName;
    private printOutLabelStr;
}
export interface TimeHeapItem {
    time: number;
    this: any;
    thisname: string;
    desc?: string;
}
