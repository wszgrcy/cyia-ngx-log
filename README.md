# 简介
- 封装的一个用于输出调试的模块,目前仅限于Chrome
- 针对log,info,warn,error可以分别开关,只要设置好生产环境和开发环境即可
- 可以针对每个组件确定范围
- 确定每个组件运行时间

# 方法
- `log`/`info`/`warn`/`error`用法与console用法基本一致
- `setDataStyle` 设置显示样式
- `start(this)` 开始时使用
- `end(this)` 结束时使用
- `compute(this)` 计算从开始到现在到时间
- `setPrintLabel({})` 传入设置start,end,compute的输出模版,参数有{time},{name},{desc}


# 属性
- flag中的Array,Object当开启时会输出为表格(当含有数组或对象时不会输出为表格)

# 装饰器
- `@Debugger()` 对装饰方法内的`console.info/log/warn/error`进行重写
## 参数
```ts
export interface DebuggerParam {
    /**显示级别0b1111 */
    level?: number;
    /**输出样式 */
    style?: LogStyle;
    /**对象显示类型*/
    objectType?: 'table' | 'normal';
    /**数组显示类型*/
    arrayType?: 'table' | 'normal';
    /**函数显示类型*/
    functionType?: 'string' | 'object';
    /**暂时未添加功能 */
    trace?: boolean;
}
```

# 使用
``` ts 
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LogModule } from "cyia-ngx-log";
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LogModule.forRoot({ printControl: 0b1111 })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```
- ![代码](https://raw.githubusercontent.com/wszgrcy/cyia-ngx-log/master/lib/src/pic/cyia-ngx-log1.png)
- ![显示](https://raw.githubusercontent.com/wszgrcy/cyia-ngx-log/master/lib/src/pic/cyia-ngx-log2.png)

``` ts
private label: LabelTemplate = {//模版写法
    start: `[{name}-{desc}]`,
    end: `[{name}-{desc}] 结束,用时{time}秒`,
    compute: `[{name}-{desc}] 运行至此用时{time}秒`,
}
```
# 配置
``` ts
export interface LogConfigure {
    printControl: number; 0b1111; //log info warn error 当这一位为1时输出开启
}
```
# 更新日志
## 1.2.0
- 升级ng7编译
- 增加装饰器`@Debugger`用于单方法的快速调试
## 1.1.9
- 修复生产模式下输出
## 1.1.7
- 使用angular的library方式重新生成
## 1.1.5
- 修正屏蔽选项
## 1.1.3
- 更新测试用例
## 1.1.2
- 修正以表格输出时多出来空行的问题
## 1.1.1
- 修正了一个由于依赖包更新导致编译失败的严重问题
# todo 
- 对于调试的定位到行现在处理的有点low,但是好歹能定位.不知道能不能做到重写console指定,希望大牛赐教
- 英文版...由于英文水平一般,就不献丑了,如果有大牛能帮忙翻译下,感激不禁
# 更多
- 可以查看源码获得更多数据
# 反馈
- 邮箱wszgrcy@gmail.com,如果有问题,bug或建议请发送到这里来
