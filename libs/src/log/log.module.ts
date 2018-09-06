import { NgModule, ModuleWithProviders } from '@angular/core';
import { LogService } from './log.service';
import { CONTROLLER } from '../shared/token';
import { LogConfigure } from '../shared/log.configure';

@NgModule({ providers: [] })
export class LogModule {

    /**
     * @description 传入配置
     * @author cyia
     * @date 2018-09-06
     * @param control LogConfigure
     * @returns
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