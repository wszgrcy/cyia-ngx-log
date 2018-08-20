export declare enum jsNativeType {
    function = "Function",
    array = "Array",
    string = "String",
    bool = "Boolean",
    number = "Number",
    math = "Math",
    date = "Date",
    regexp = "RegExp",
    error = "Error",
    json = "JSON",
    arguments = "Arguments",
    object = "Object",
    wrong = "WRONG"
}
/**判断类型 */
export declare class TypeJudgment {
    /**
     * 获得类型
     *
     * @static
     * @param {*} param 变量
     * @returns {jsNativeType}
     * @memberof TypeJudgment
     */
    static getType(param: any): jsNativeType;
    private static transform2Enum;
    static type4Object(): void;
}
