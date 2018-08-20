export enum jsNativeType {
    function = 'Function',
    array = 'Array',
    string = 'String',
    bool = 'Boolean',
    number = 'Number',
    math = 'Math',
    date = 'Date',
    regexp = 'RegExp',
    error = 'Error',
    json = 'JSON',
    arguments = 'Arguments',
    object = 'Object',
    wrong = 'WRONG'
}
/**判断类型 */
export class TypeJudgment {

    /**
     * 获得类型
     *
     * @static
     * @param {*} param 变量
     * @returns {jsNativeType}
     * @memberof TypeJudgment
     */
    static getType(param: any): jsNativeType {
        return this.transform2Enum(Object.prototype.toString.call(param))
    }

    private static transform2Enum(str: string): jsNativeType {
        let result = str.match(/^\[object ([A-Z][a-zA-Z]{1,10})\]$/)
        let type: jsNativeType;
        if (result)
            type = result[1] as jsNativeType;
        else
            type = jsNativeType.wrong
        return type;
    }
    static type4Object() {

    }
}