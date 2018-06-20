# iexbit-web
This is the source of iexbit

## 开发

```shell
$ npm run dev
```

### 新增页面

在`webpack/`目录下，在`routers.deploy.json`和`routers.dev.json`中增加路由即可。

### 调试market页面

需要登录到线上测试环境，启动开发模式，然后代理如下两个文件到本地即可：

```shell
/https://assets.bitrabbit.com/market/vendors.*.js/ http://localhost:8111/vendors.bundle.js
/https://assets.bitrabbit.com/market/market.*.js/ http://localhost:8111/market.bundle.js
```


## 部署

```shell
$ npm run deploy
```

然后在`dist`目录下找到各个文件。

## 线上部署
将dist目录下的`market.html`文件中的内容替换toastio项目中的`app/views/markets/show.html.erb`文件内容，然后提交代码让老龚部署
**注：各个文件放在`toastio`项目中，是不同的路径，切记！**

