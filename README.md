# openlayers

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### push dist to gh-pages
```shell
npm run build
cd dist
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:Icestains/OpenLayers-Vue.git master:gh-pages
cd ..

```

### 功能

#### 已实现
- √图层切换 地图源切换
- √点标记 点击地图上的点添加标记
- √线标记 在地图上绘制线段，用于测量距离和角度
- √测量角度
- √测量距离
- √面标记 在地图上绘制平面
- √删除绘制中的点 绘制中的平面可以撤销上一个标记的点
- √图片 添加图片标记 实现和点标记类似
- √文字 添加文字说明，用于标记测量的角度和距离结果

---

#### 开发中

- 面积
    - 显示距离和面积的div为什么总是opacity: 0;??
- 编辑
    - 选中
    - 删除图层或删除元素（图片 线段 平面等）
    - 更换线段平面颜色
- 比例尺
- 以路由的方式切换加载各项功能
    - 路由切换的时候需要修改图层，如何在各个模块或组件之间使用一个或者不同的图层？
    
    

