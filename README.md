# 重现bug
- 原导出如下
```ts  
export * from './log.module';
export * from './log.service';
export * from './shared/log-style.define';
```
- 现导出如下
```ts  
export * from './log'
export * from './shared/log-style.define';
```
- 于是引用这个library的项目就出现了下面的错误
> 直接执行ng build --prod即可出现

``` ts
ERROR in Error during template compile of 'AppModule'
  Function calls are not supported in decorators but 'LogModule' was called.
```