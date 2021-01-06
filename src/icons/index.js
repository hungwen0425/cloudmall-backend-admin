/**
 * 字體圖標, 统一使用SVG Sprite矢量圖標(http://www.iconfont.cn/）
 *
 * 使用:
 *  1. 在阿里矢量圖標站创建一個项目, 并添加圖標(这一步非必须, 创建方便项目圖標管理)
 *  2-1. 添加icon, 选中新增的icon圖標, 复制代码 -> 下载 -> SVG下载 -> 粘贴代码(重命名)
 *  2-2. 添加icons, 下载圖標库對應[iconfont.js]檔案, 替换项目[./iconfont.js]檔案
 *  3. 组件模版中使用 [<icon-svg name="canyin"></icon-svg>]
 *
 * 注意:
 *  1. 通過2-2 添加icons, getNameList方法無法返回對應資料
 */
import Vue from 'vue'
import IconSvg from '@/components/icon-svg'
import './iconfont.js'

Vue.component('IconSvg', IconSvg)

const svgFiles = require.context('./svg', true, /\.svg$/)
const iconList = svgFiles.keys().map(item => svgFiles(item))

export default {
  // 取得圖標icon-(*).svg名称列表, 例如[shouye, xitong, zhedie, ...]
  getNameList() {
    return iconList.map(item => item.default.id.replace('icon-', ''))
  }
}