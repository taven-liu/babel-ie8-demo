# 基于webpack的多页应用demo
一些项目可能需要兼容ie8，又不大适合用一些大框架。该demo使用jquery的老套路和postcss，并对图片、js、css分开发布
## 项目目录结构

```
├── config                                      // 项目配置目录
│    └── entries.js                             // 生成wepack入口、html模板等
├── docs                                        // 项目文档目录
├── node_modules                                // 依赖库
├── publish                                     // 发布目录
│   ├── img                                     // 图片资源
│   ├── templates                               // 模板目录
│   │   ├── index
│   │   │   └── home.html
│   │   └── news
│   │       └── detail.html
│   └── static                                 // 构建后的js、css目录
│       ├── index
│       ├── news
│       └── vendor.dbe4e836.js
├── src                                         // 源码目录
│   ├── common                                  // 项目公共库目录（工具类、各种全局的公共方法）
│   │   ├── css                                 // 全局公共样式、与css变量等
│   │   ├── img                                 // 全局公共图片、字体等资源
│   │   └── js                                  // 全局公共js
│   │       ├── dateFormater.js                 // 日期格式化工具类
│   │       └── request.js                      // 接口请求工具类
│   ├── components                              // 公共组件库（提供给所有模块使用，和业务无关，包括UI组件和功能组件等）
│   │   ├── footer                              // 底部UI组件
│   │   │   ├── img                             // footer组件依赖的图片资源目录
│   │   │   ├── index.html                      // UI组件html（在需要的page中通过 html-loader引入）
│   │   │   ├── index.js                        // footer相关逻辑的js（在需要的page中的入口文件import该文件）
│   │   │   └── style.css                       // UI组件样式 (index.js直接import)
│   │   └── header                              // header功能组件
│   │       ├── index.js                        // header组件相关逻辑的js（在需要的page中的入口文件import该文件）
│   │       └── style.css                       // 组件样式
│   └── modules                                 // 模块目录
│       ├── inde                                // 首页模块目录
│       │   ├── common                          // 首页公共库目录（工具类、图片、样式）
│       │   │   ├── style                       // 首页模块公共样式、与css变量等
│       │   │   ├── img                         // 首页模块公共图片、字体等资源
│       │   │   └── js                          // 首页模块公共js目录
│       │   ├── components                      // 首页模块组件目录(提供给所有首页模块使用，包括UI组件和功能组件等)
│       │   ├── page                            // 首页模块页面目录
│       │   │   └── home                        // home页模块页面目录
│       │   │       ├── rightArea               // home页模块右侧组件
│       │   │       │   ├── img                 // 图片资源目录
│       │   │       │   ├── index.html
│       │   │       │   ├── index.js
│       │   │       │   └── style.css
│       │   │       ├── img                     // 图片资源目录
│       │   │       ├── index.html              // home入口页面入口html(必须使用index.html)
│       │   │       ├── index.js                // home入口页面入口js(必须使用index.js)
│       │   │       └── style.css               // home页模块详情页面样式
│       └── news                                // 新闻模块目录
│           ├── components
│           │   └── slide
│           │       ├── index.js
│           │       └── style.css
│           └── page
│               ├── detail
│               │    ├── index.html
│               │    ├── index.js
│               │    └── style.css
│               └── list
│                   ├── index.html
│                   ├── index.js
│                   └── style.css
├── .babelrc
├── .editorconfig
├── .eslintignore
├── .eslintrc
├── .gitignore
├── .stylelintrc
├── package-lock.json
├── package.json
└── webpack.config.babel.js
```

## 资源引入

目前一个页面对应一个构建入口js，即page目录下对应页面目录中的`index.js`，例如:`src/modules/${moduleName}/page/${submoduleName}/index.js`。一个页面对应一个入口html模板，即page目录下对应页面目录中的`index.html`，例如:`src/modules/${moduleName}/page/${submoduleName}/html.js`。

## 入口html注入对应样式与js

所有的入口html需要在顶部（部分页面的`head`标签通过其依赖的`html`资源中）或者`head`标签中添加如下代码（构建工具扫描该代码并注入link标签）
```
<% for (var css in htmlWebpackPlugin.files.css) { %>
<link rel="stylesheet" type="text/css" href="${htmlWebpackPlugin.files.css[css]}">
<% } %>
```
所有的入口html需要在底部或者`</body>`标签前添加如下代码（构建工具扫描该代码并注入script标签）
```
<% for (var js in htmlWebpackPlugin.files.js) { %>
<script src="${htmlWebpackPlugin.files.js[js]}"></script>
<% } %>
```
## 引入js

在对应的入口js中通过`import`引入即可

## 引入html

在对应的入口html中对应的位置添加对应的模板依赖即可(`${require('html-loader?interpolate=require!{htmlPath})`),例如home页中需要依赖右侧组件模板，代码如下
```
${require('html-loader?interpolate=require!./rightArea/index.html')}
```

## 引入css

在css中可以通过`import`方式引入一些公共样式
- 引入全局样式 `src/common/css/theme.css`
```
@import 'theme.css';
```
- 引入模块公共样式 `src/modules/ask/common/css/style.css`

```
/* src/modules/ask/page/detail/style.css */
@import '../../common/style/style.css';
```
## 引入图片

图片资源都放在对面模块目录下，全局的公共图片放在`src/common/img`中，所有项目中依赖的图片资源在引入时都使用相对路径。

### html中引入图片

```
<img src="${require('./img/big.jpg')}">
```

### js中引入图片

```
import bgImgSrc from './images/bg.jpg'

const img = `<img src="${bgImgSr}">`

$('#container').append(img)

```

### css中引入图片
直接使用相对路径即可
```
.foo {
  background: url('./img/foo.jpg');
}
```
