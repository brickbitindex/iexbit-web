# iexbit-web
This is the source of iexbit

## 开发

```shell
$ npm run dev
```

### 新增页面

在`webpack/`目录下，在`routers.deploy.json`和`routers.dev.json`中增加路由即可。

### 调试market页面

本地代理流程：https://www.jianshu.com/p/8fc16719d590

需要登录到线上测试环境，启动开发模式，然后代理如下两个文件到本地即可：

```shell
/https://assets.bitrabbit.com/market/vendors.*.js/ http://localhost:8111/vendors.bundle.js
/https://assets.bitrabbit.com/market/market.*.js/ http://localhost:8111/market.bundle.js
```
#### 本地开发调试
```
$ npm run dev
```

## staging部署
1. 首先执行命令行（**记住本地代码也要提交**）
```shell
$ npm run deploy
$ npm run release
```
2. 将dist目录下的`market.html`文件中的内容替换toastio项目中的`app/views/markets/show.html.erb`文件内容
3. 从develop分支checkout一个分支提交，提交代码
4. 执行`$ bundle exec cap staging deploy`，确定两次，大概4分钟部署完成。


## 线上部署
1. 首先执行命令行（**记住本地代码也要提交**）
```shell
$ npm run deploy
$ npm run release
```
2. 将dist目录下的`market.html`文件中的内容替换toastio项目中的`app/views/markets/show.html.erb`文件内容
3. 从develop分支checkout一个分支提交，提交代码
4. 然后找晓孟合并分支并让老龚部署


**注：各个文件放在`toastio`项目中，是不同的路径，切记！**

