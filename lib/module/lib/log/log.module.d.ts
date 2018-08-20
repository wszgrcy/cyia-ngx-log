import { ModuleWithProviders } from '@angular/core';
import { LogConfigure } from '../shared/log.configure';
export declare class LogModule {
    /**
     *
     * @static
     * @param {LogConfigure} control
     * @returns {ModuleWithProviders}
     * @memberof LogModule
     */
    static forRoot(control: LogConfigure): ModuleWithProviders;
}
