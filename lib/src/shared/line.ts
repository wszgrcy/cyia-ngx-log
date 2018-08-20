export const _log = (function (undefined) {
    var Log = Error; // does this do anything?  proper inheritance...?
    (Log as any).prototype['write'] = function (args: any) {
        var suffix = {
            "@": (this.lineNumber
                ? this.fileName + ':' + this.lineNumber + ":1"
                : extractLineNumberFromStack(this.stack)
            )
        };

        args = args.concat([suffix]);
        if (console && console.log) {
        }
    };
    var extractLineNumberFromStack = function (stack: any) {
        var line = stack.split('\n')[3];
        line = (line.indexOf(' (') >= 0
            ? line.split(' (')[1].substring(0, line.length - 1)
            : line.split('at ')[1]
        );
        return line;
    };

    return function (params: any) {
        if (typeof DEBUGMODE === typeof undefined || !DEBUGMODE) return;

        // call handler extension which provides stack trace
        (Log() as any)['write'](Array.prototype.slice.call(arguments, 0));
    };//--	fn	_log

})();

_log('this should not appear');

let DEBUGMODE = true;

// _log('you should', 'see this', { a: 1, b: 2, c: 3 });
// console.log('--- regular log ---');
// _log('you should', 'also see this', { a: 4, b: 8, c: 16 });

// turn it off
DEBUGMODE = false;

_log('disabled, should not appear');
console.log('--- regular log2 ---');