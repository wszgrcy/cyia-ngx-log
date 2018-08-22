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

# todo 
- 对于调试的定位到行现在处理的有点low,但是好歹能定位.不知道能不能做到重写console指定,希望大牛赐教
- 英文版...由于英文水平一般,就不献丑了,如果有大牛能帮忙翻译下,感激不禁

# 反馈
- 邮箱wszgrcy@gmail.com,如果有问题,bug或建议请发送到这里来
