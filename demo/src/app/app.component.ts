import { Component } from '@angular/core';
import { LogService } from 'cyia-ngx-log';
// import { LogService } from 'lib/src/log/log.service';

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
    this.log.start(this, '测试')
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
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

  }
}
