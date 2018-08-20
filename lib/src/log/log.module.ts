import { NgModule, ModuleWithProviders } from '@angular/core';
import { LogService } from './log.service';
import { CONTROLLER } from '../shared/token';
import { LogConfigure } from '../shared/log.configure';

@NgModule({
    //todo需要注入或者其他声明,生产环境还算开发环境,并声明显示哪些
    providers: [
    ],
})
export class LogModule {
    /**
     *
     * @static
     * @param {LogConfigure} control
     * @returns {ModuleWithProviders}
     * @memberof LogModule
     */
    static forRoot(control: LogConfigure): ModuleWithProviders {
        return {
            ngModule: LogModule,
            providers: [
                { provide: CONTROLLER, useValue: control },
                LogService
            ]
        }
    }

}