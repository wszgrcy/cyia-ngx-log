/**配置log初始化 */
export interface LogConfigure {
    printControl: number;
}
export interface LabelTemplate {
    start?: string;
    end?: string;
    compute?: string;
    [name: string]: string;
}
