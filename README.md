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
http://test.exchange.grootapp.com/test/market2.bundle.js http://localhost:8080/market.bundle.js
http://test.exchange.grootapp.com/test/market2.css http://localhost:8080/market2.css
```

其中这里的`test.exchange.grootapp.com`是线上测试地址

## 部署

```shell
$ npm run deploy
```

然后在`dist`目录下找到各个文件。

**注：各个文件放在`toastio`项目中，是不同的路径，切记！**

