import { Component } from '@angular/core';
import { LogService } from 'cyia-ngx-log';
// import { LogService } from 'lib/src/log/log.service';
import { Debugger } from '../../../libs/src/log/log.decorator';
const param: any = {
  level: 0b1111, style: { color: 'red', fontSize: '20px' }, functionType: 'object', arrayType: 'table',
  objectType: 'table'
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private log: LogService) { }
  ngOnInit(): void {
    this.log.label = { start: `[组件{name}开始{desc}]` }
    let a = { b: 123 }
    this.log.flag.Array = true;
    this.log.flag.Object = true;
    this.log.start(this, '服务测试')
    this.log.setDataStyle(null, {
      color: 'red',
      background: 'black',
      fontSize: '20px'
    });
    this.log.log('测试字符串', 123243, a)
    this.log.setDataStyle(null, {
      fontSize: '25px'
    })
    this.log.error('错误')
    this.log.warn('警告')
    this.log.info('提示')
    this.log.end(this)
    this.t1('传入参数')
  }
  ngOnDestroy(): void { }
  @Debugger(param)
  async t1(a) {
    console.log('装饰器调试')
    console.log(a)
    console.log('内容测试', a, { a: 23424 }, () => {
      let a = 555
    }, [123456, '字符串'], 654321, true)
    return 896
  }
}
