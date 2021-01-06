## 更新日誌

### 1.2.2

*2018-10-16*

- 修复判断当前路由類型 bug
- 默认开放element-ui所有组件
- 修复子菜单同级出现子菜单项會同時选中bug
- 捕获首次請求菜单列表和权限異常，自動跳转至登录页
- 修复菜单按钮权限錯誤bug [#41](https://github.com/renrenio/renren-fast-vue/issues/41)
- 提供重置登录信息狀態方法。修复登出或替换账号還保留之前账号操作信息和痕迹bug
- 优化token失效、退出後，為了强制清空整站临時存储資料而刷新页面问题。注意: 此次vux資料并未做重置處理！

### 1.2.1

*2018-06-08*

- 修复tabs關闭最後一個tab後，再次打开會保留最後一個tab bug
- 优化完善mock模拟資料
- 修复linux系统，引入主题色檔案名大小写编译錯誤bug [#22](https://github.com/daxiongYang/renren-fast-vue/issues/22)
- 新增echarts圖表、ueditor富文本编辑器demo
- 移除登录成功token前端设置的失效時间
- 修复退出／token失效後，返回登录页面未清空整站临時存储資料bug
- 修复手机号码验证正則bug
- 同步後台 修改config模块key vulue子段為paramKey paramValue
- 修复角色管理 新增修改授权接口請求錯誤bug
- 修复1.2 新版本的导航栏Tab錯位bug [#14](https://github.com/daxiongYang/renren-fast-vue/issues/14)
- 修复動態菜单路由 最前面带/bug
- 修复其它已知bug

### 1.2.0

*2018-05-03*

- 支持菜单管理操作動態(菜单)路由
- 移除api檔案夹目录，简化api請求方式
- 新增element-ui组件主题12套，可同步修改配置设置成整站主题
- 調整store狀態目录结構，改变设置／取得方式
- 調整views视圖層结構，更友好的支持動態(菜单)路由
- 修复其它已知bug

### 1.1.0

*2018-04-15*

- 使用SVG Sprite矢量圖標，替换fontawesome字體圖標
- 新增内容tabs標签页，關闭当前／其它／全部、刷新当前功能
- 新增scss变量皮肤定制
- 优化路由机制，通過meta isTab屬性，设定是否通過tab標签页展示内容
- 更新element-ui 2.3.2 用于修复左侧菜单收縮卡顿问题
- 新增mock本地开发模拟資料功能
- 修复本地开发找不到baseUrl问题
- 更新element-ui 2.2.1 用于修复tree半选中狀態项不能傳给後台接口问题
- 修复其它已知bug

### 1.0.0

*2018-02-11*
