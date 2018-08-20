"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsNativeType;
(function (jsNativeType) {
    jsNativeType["function"] = "Function";
    jsNativeType["array"] = "Array";
    jsNativeType["string"] = "String";
    jsNativeType["bool"] = "Boolean";
    jsNativeType["number"] = "Number";
    jsNativeType["math"] = "Math";
    jsNativeType["date"] = "Date";
    jsNativeType["regexp"] = "RegExp";
    jsNativeType["error"] = "Error";
    jsNativeType["json"] = "JSON";
    jsNativeType["arguments"] = "Arguments";
    jsNativeType["object"] = "Object";
    jsNativeType["wrong"] = "WRONG";
})(jsNativeType = exports.jsNativeType || (exports.jsNativeType = {}));
/**判断类型 */
var TypeJudgment = /** @class */ (function () {
    function TypeJudgment() {
    }
    /**
     * 获得类型
     *
     * @static
     * @param {*} param 变量
     * @returns {jsNativeType}
     * @memberof TypeJudgment
     */
    TypeJudgment.getType = function (param) {
        return this.transform2Enum(Object.prototype.toString.call(param));
    };
    TypeJudgment.transform2Enum = function (str) {
        var result = str.match(/^\[object ([A-Z][a-zA-Z]{1,10})\]$/);
        var type;
        if (result)
            type = result[1];
        else
            type = jsNativeType.wrong;
        return type;
    };
    TypeJudgment.type4Object = function () {
    };
    return TypeJudgment;
}());
exports.TypeJudgment = TypeJudgment;
//# sourceMappingURL=type-judgment.js.map