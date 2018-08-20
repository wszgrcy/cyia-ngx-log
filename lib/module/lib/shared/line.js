"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._log = (function (undefined) {
    var Log = Error; // does this do anything?  proper inheritance...?
    Log.prototype['write'] = function (args) {
        var suffix = {
            "@": (this.lineNumber
                ? this.fileName + ':' + this.lineNumber + ":1"
                : extractLineNumberFromStack(this.stack))
        };
        args = args.concat([suffix]);
        if (console && console.log) {
        }
    };
    var extractLineNumberFromStack = function (stack) {
        var line = stack.split('\n')[3];
        line = (line.indexOf(' (') >= 0
            ? line.split(' (')[1].substring(0, line.length - 1)
            : line.split('at ')[1]);
        return line;
    };
    return function (params) {
        if (typeof DEBUGMODE === typeof undefined || !DEBUGMODE)
            return;
        // call handler extension which provides stack trace
        Log()['write'](Array.prototype.slice.call(arguments, 0));
    }; //--	fn	_log
})();
exports._log('this should not appear');
var DEBUGMODE = true;
// _log('you should', 'see this', { a: 1, b: 2, c: 3 });
// console.log('--- regular log ---');
// _log('you should', 'also see this', { a: 4, b: 8, c: 16 });
// turn it off
DEBUGMODE = false;
exports._log('disabled, should not appear');
console.log('--- regular log2 ---');
//# sourceMappingURL=line.js.map