import { TypeJudgment } from 'cyia-ngx-common';
import { TestBed } from '@angular/core/testing';
import { LogService } from './log.service';
import { CONTROLLER } from '../shared/token';

describe('测试', () => {
    let service: LogService
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: CONTROLLER, useValue: { printControl: 0b1111 } },
                LogService]
        })
        service = TestBed.get(LogService)
    });

    it('普通输出', () => {
        service.setDataStyle(null, { fontSize: '20px' })
        service.log('测试')
        console.log('-------')
    });
    it('表格输出', () => {
        service.flag.Array = true;
        service.log([1, 2, 5, 4, 2385, 4])
        console.log('-------')
    });
    it('对象输出', () => {
        service.flag.Object = true;
        service.log({ a: 5 })
        console.log('-------')

    });
    it('非对象输出', () => {
        service.flag.Object = true;
        console.log('测试', TypeJudgment.getType(window))
        service.log(window)
        console.log('-------')

    });

});