# better-util-tools

## 一个简单的方法合集

### _使用方法_

- npm i better-util-tools
- or
- yarn add better-util-tools

#### way1：

```
import BetterUtilTools from "better-util-tools"
or
const BetterUtilTools = require('better-util-tools')
```

#### way2：

```
<script src="xxx/xxx/better-util-tools.js"></script>
or
<script src="xxx/xxx/better-util-tools.min.js"></script>
```

- 具体使用

```
const UtilTools = new BetterUtilTools()
UtilTools.random(2,10)  //8
```

##### 方法集合如下：

```
* 判断两个数组是否相等
  arrayEqual(arr1, arr2),
* 判断该属性是否在json中的key存在
  jsonHasKey(json, key),
* 判断对象为空
  isEmptyObj(obj),
* 判断类型
  typeIs(instance),
* 判断元素是否有某个class
  hasClass(ele, cls),
* 为元素添加class
  addClass(ele, cls),
* 为元素移除class
  removeClass(ele, cls),
* 获取浏览器类型和版本
  getExplore(),
* 获取操作系统类型 MacOSX|windows|linux
  getOS(),
* 获取移动端运行系统 ios|android|windowsPhone
  getMobileSys(),
* 获取微信环境 enterprise:企业微信 wechat:微信
  getWechatEnv(),
* 判断终端 pc|mobile
  getClient(),
* 随机生成颜色
  randomColor(),
* 16进制颜色转RGB/RGBA字符串
  colorToRGB(val, opa)
* 范围内随机数
  random(low, high),
* 范围内随机字符串
  randomName(randomFlag=true, min=8, max=20),
* 判断是否为身份证号
  isIdCard(str),
* 判断是否为手机号
  isPhoneNum(str),
* 判断是否为URL
  isUrl(str),
* 判断是否为Email
  isEmail(str),
* 判断是否含有中文
  isChineseName(str),
* 现金额转大写
  digitUppercase(n),
* 倒计时
  formatRemainTime(endTime),
* 获取元素属性值
  getStyle(elem, style),
* 时间格式化
  date:new Date()
  type:YYYY MM DD hh mm ss任意组合
  formatDateTime({date, type}),
* 根据年月日得知星期几
  getWeek(year, month, day),
* 获取指定年月的日历
  getMonthData(year, month),
* 获取指定年月的最大日
  getMonthMaxDay(year, month),
* 获取相对时间 day:天
  getAbsoluteDay(day=1),
* 调用支付宝验证银行卡接口
  isBankCard(axios,bankCard, cb),
* 获取url参数
  getUrlParams(url),
* 对象参数转字符串
  queryString(obj),
* 节流函数--规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。
  var throttleFn = _.throttle(() => console.log('throttleFn函数执行了'+_.formatDateTime({ type: 'hh:mm:ss' })), 1000)
  setInterval(throttleFn, 10)
  throttle(fun, delay),
* 防抖函数--在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
  const debounceFn = _.debounce(() =>{}, 1000);
  document.addEventListener('scroll', debounceFn)
  debounce(fun, delay),
* 下划线转换驼峰
  toHump(name),
* 驼峰转换下划线
  toLine(name),
* 图片上传转base64
  imgChange(file,cb),
* 深克隆
  deepCopy(obj, copyObj)
* 数组去重合并
  unique([1,2,3,1,2,3,6,8,4,2])
  unique(originArray,objectArray=false,objectKey='')
* 合并对象 第一个参数为true代表深度合并（可选参数）
  extend([boolean],obj1,obj2,...objN)
* 千分位逗号格式化
  formatDecimals(num)
* 求两个集合的交集
  intersect(a, b)
* 求两个集合的并集
  union(a, b)
* 判断一个元素是否在数组中
  contains(arr, val)
* 加
  add(a, b)
* 减
  cut(a, b)
* 乘
  mul(a, b)
* 除
  div(a, b)
* 指定小数点位数取值,非四舍五入
  toFixed(n=12.681, fixed=2)
* 劫持粘贴板
  copyTextToClipboard(value,cb)
* 动态引入js
  injectScript(src)
* 去除html标签
  removeHtmlTag(str)
* el是否在视口范围内
  elementIsVisibleInViewport(el, partiallyVisible = false)
* 根据url地址下载
  download(url)
* 文件操作
  fileUtil:{
    fileToBase64(file),
    blobToFile(blob, fileName),
    base64ToFile(base64, filename),
    base64ToBlob(base64),
  }
* 订阅观察者模式
  EventEmitter:{
    //订阅事件的方法
    on(eventName, cb)
    //触发订阅事件
    emit(eventName, args)
    //移除订阅事件
    removeListener(eventName, cb)
    //只执行一次订阅
    once(eventName, cb)
  }
  example:let em = UtilTools.EventEmitter;
          let w = 0;
          let timer = setInterval(() => {
              em.emit('work', { a: Date.now() });
              if (w == 5) {
                  console.log('w>=5');
                  clearInterval(timer)
              }
              w++;
          }, 20);
          em.on('work', (args) => {
              console.log(args)
          });  
```
