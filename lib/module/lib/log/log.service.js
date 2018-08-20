"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var type_judgment_1 = require("./../shared/type-judgment");
var core_1 = require("@angular/core");
var token_1 = require("../shared/token");
var LogService = /** @class */ (function () {
    //log info warn error
    function LogService(logConfigure) {
        /**保存要输出的  */
        this.dataStr = '';
        /**保存要输出的对象 */
        this.dataArray = [];
        /**保存样式 */
        this.outStyle = '';
        /**是否将对象和数字显示为表格类型 */
        this.flag = {
            Array: false,
            Object: false,
        };
        this.timeHeap = [];
        !(logConfigure.printControl & 8) && (this.log = function () { });
        !(logConfigure.printControl & 4) && (this.log = function () { });
        !(logConfigure.printControl & 2) && (this.log = function () { });
        !(logConfigure.printControl & 1) && (this.log = function () { });
    }
    /**
     * 将数据初始化
     *
     * @memberof LogService
     */
    LogService.prototype.setDataInit = function () {
        this.dataStr = '%c';
        this.dataArray = [this.outStyle];
    };
    /**
     *样式初始化
     *
     * @param {string} [str=''] 字符串css
     * @param {(LogStyle | null)} [styleObj=null] js配置,驼峰
     * @memberof LogService
     */
    LogService.prototype.setDataStyle = function (str, styleObj) {
        if (str === void 0) { str = ''; }
        if (styleObj === void 0) { styleObj = null; }
        if (str) { //doc 直接赋值
            this.outStyle = str;
        }
        else {
            this.outStyle = '';
            for (var x in styleObj) {
                if (styleObj.hasOwnProperty(x)) {
                    var propertyName = x;
                    var propertyValue = styleObj[x];
                    propertyName = this.coverName(propertyName);
                    this.outStyle += propertyName + ":" + propertyValue + ";"; //doc正常情况
                }
            }
        }
    };
    /**
     *ngOnInit或constructor使用
     * todo 运行时间,记录this,开始时间,当结束时返回现在时间记录
     * @param {*} [component=null] this,传入组件或服务,
     * @param {string} [desc=''] 描述
     * @memberof LogService
     */
    LogService.prototype.start = function (component, desc) {
        if (component === void 0) { component = null; }
        if (desc === void 0) { desc = ''; }
        try {
            var name_1 = component['__proto__']['constructor']['name'];
            this.timeHeap.push({ time: Date.now(), thisname: name_1, this: component, desc: desc });
            console.group(name_1 + "-" + desc);
        }
        catch (error) {
            console.group("" + desc);
        }
    };
    LogService.prototype.compute = function (component) {
        var item = this.timeHeap.find(function (val) {
            return val.this === component;
        });
        if (item) {
            this.log("[" + item.thisname + "-" + (item.desc || '') + "] \u8FD0\u884C\u81F3\u6B64\u7528\u65F6" + (Date.now() - item.time) / 1000 + "\u79D2");
        }
        else {
            this.warn('该组件并没有调用start初始化');
        }
    };
    /**
     * 建议在ngOnDestroy使用
     *
     * @memberof LogService
     */
    LogService.prototype.end = function (component) {
        console.groupEnd();
        var i = this.timeHeap.length - 1;
        while (i >= 0) {
            if (this.timeHeap[i].this === component) {
                this.log("[" + this.timeHeap[i].thisname + "-" + (this.timeHeap[i].desc || '') + "] \u7ED3\u675F,\u7528\u65F6" + (Date.now() - this.timeHeap[i].time) / 1000 + "\u79D2");
                this.timeHeap.splice(i, 1);
                break;
            }
            i--;
        }
    };
    /**
     *
     * @param param
     */
    // @controlOpen(Boolean(GLOBAL_VAR.control & 0b0001))
    LogService.prototype.log = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this._printOut.apply(this, ['log'].concat(param));
    };
    LogService.prototype.warn = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this._printOut.apply(this, ['warn'].concat(param));
    };
    LogService.prototype.error = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this._printOut.apply(this, ['error'].concat(param));
    };
    LogService.prototype.info = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this._printOut.apply(this, ['info'].concat(param));
    };
    /**
     * log,warn,error,info调用
     *
     * @private
     * @param {ConsoleMethod} method 调用方法
     * @param {...any[]} param 参数
     * @memberof LogService
     */
    LogService.prototype._printOut = function (method) {
        var _this = this;
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        this.setDataInit();
        var type;
        param.forEach(function (val) {
            type = type_judgment_1.TypeJudgment.getType(val);
            switch (type) {
                case type_judgment_1.jsNativeType.object:
                case type_judgment_1.jsNativeType.array:
                    if (_this.flag[type] && !_this.containFunction(type, val)) {
                        _this.logprint(1, null, method);
                        _this.setDataInit();
                        _this.logprint(2, val, method);
                    }
                    else {
                        _this.dataStr += '%o';
                        _this.dataArray.push(val);
                    }
                    break;
                default:
                    _this.dataStr += val;
                    break;
            }
            //1.最后一个参数正好是普通数据.2.正好输入完成,只有初始化
        });
        if (this.dataArray.length >= 1 && this.dataStr.length > 2)
            this.logprint(1, null, method);
    };
    /**两种方式,
     * 1.普通输出
     * 2.表格输出
     */
    LogService.prototype.logprint = function (index, table, method) {
        if (index === void 0) { index = 1; }
        if (table === void 0) { table = null; }
        // this.dataArray.push(this.getLine())
        switch (index) {
            case 1:
                console[method].apply(console, [this.dataStr].concat(this.dataArray));
                break;
            case 2:
                console.table(table);
                break;
            default:
                break;
        }
        console.log(this.getLine());
    };
    LogService.prototype.getLine = function () {
        var a = new Error();
        var tmp = a.stack.split('\n');
        for (var i = tmp.length - 1; i < tmp.length; i--) {
            var element = tmp[i].trim();
            if (/LogService/.test(element)) {
                tmp.splice(i + 2, 999);
                tmp.splice(1, i);
                break;
            }
        }
        return tmp.join('\n');
    };
    /**
     * 判断数组或对象是否包含函数,如果包含那么就仍然普通导出
     * todo 如果有循环的引用怎么办
     * @param {jsNativeType} type 类型
     * @param {(Object | Array<any>)} param 需要判断的参数
     * @returns {boolean} 返回是否在对象/数组中出现函数
     * @memberof LogService
     */
    LogService.prototype.containFunction = function (type, param) {
        if (type == type_judgment_1.jsNativeType.object) {
            return this._searchObject(param);
        }
        else if (type == type_judgment_1.jsNativeType.array) {
            return this._searchArray(param);
        }
        return true; //理论上执行不到
    };
    LogService.prototype._searchObject = function (param) {
        for (var x in param) {
            if (param.hasOwnProperty(x)) {
                var element = param[x];
                if (type_judgment_1.TypeJudgment.getType(element) == type_judgment_1.jsNativeType.object) {
                    return this._searchObject(element);
                }
                else if (type_judgment_1.TypeJudgment.getType(element) == type_judgment_1.jsNativeType.array) {
                    return this._searchArray(element);
                }
                else if (type_judgment_1.TypeJudgment.getType(element) == type_judgment_1.jsNativeType.function) {
                    return true;
                }
            }
        }
        return false;
    };
    LogService.prototype._searchArray = function (param) {
        for (var i = 0; i < param.length; i++) {
            var element = param[i];
            if (type_judgment_1.TypeJudgment.getType(element) == type_judgment_1.jsNativeType.object) {
                return this._searchObject(element);
            }
            else if (type_judgment_1.TypeJudgment.getType(element) == type_judgment_1.jsNativeType.array) {
                return this._searchArray(param);
            }
            else if (type_judgment_1.TypeJudgment.getType(element) == type_judgment_1.jsNativeType.function) {
                return true;
            }
        }
        return false;
    };
    LogService.prototype.coverName = function (name) {
        var wordArray = name.match(/([A-Z])/g);
        for (var i = 0; wordArray && i < wordArray.length; i++) {
            var word = wordArray[i];
            name = name.replace(word, "-" + word.toLocaleLowerCase());
        }
        return name;
    };
    LogService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(token_1.CONTROLLER)),
        __metadata("design:paramtypes", [Object])
    ], LogService);
    return LogService;
}());
exports.LogService = LogService;
// function controlOpen(bool: boolean) {
//     console.log('查看传入', bool)
//     return function (target: any, name: string, desc: PropertyDescriptor) {
//         if (bool) { } else {
//             desc.value = () => { }
//         }
//         return desc
//     }
// }
function testParam(bool) {
    console.log('查看传入', bool);
    return function (target, name, desc) {
    };
}
//# sourceMappingURL=log.service.js.map