# better-util-tools
## 一个简单的方法合集
### *使用方法*
- *npm i better-util-tools*
- *or*
- *yarn add better-util-tools*
#### way1：
```
import BetterUtilTools from "better-util-tools"
```
#### way2：
```
<script src="xxx/xxx/better-util-tools.js"></script>
or
<script src="xxx/xxx/better-util-tools.min.js"></script>
```
- 具体使用
```
const _ = new BetterUtilTools()
_.random(2,10) `//8`
```
##### 方法集合如下：
```
* 判断两个数组是否相等
  arrayEqual(arr1, arr2) {},
* 判断是否为对象
  isObject(obj) {},
* 判断该属性是否在json中的key存在
  JsonHasKey(json, key) {},
* 判断对象为空
  isEmptyObj(obj) {},
*判断类型
  typeIs(instance){},
* 判断是否为Promise
  isPromise(obj) {},
* 判断元素是否有某个class
  hasClass(ele, cls) {},
* 为元素添加class
  addClass(ele, cls) {},
* 为元素移除class
  removeClass(ele, cls) {},
* 获取浏览器类型和版本
  getExplore() {},
* 获取操作系统类型
  getOS() {},
* 随机生成颜色
  randomColor() {},
* 范围内随机数
  random(low, high) {},
* 范围内随机字符串
  randomName(randomFlag, min, max) {},
* 判断是否为身份证号
  isIdCard(str) {},
* 判断是否为手机号
  isPhoneNum(str) {},
* 判断是否为URL
  isUrl(str) {},
* 判断是否为Email
  isEmail(str) {},
* 判断是否含有中文
  isChineseName(str) {},
* 现金额转大写
  digitUppercase(n) {},
* 倒计时
  formatRemainTime(endTime) {},
* 获取元素属性值
  getStyle(elem, style) {},
* 时间格式化
  formatDateTime({timestamp, type}) {},
* 获取相对时间
  getAbsoluteDay,
* 调用支付宝验证银行卡接口
  isBankCard(bankCard) {},
* url参数转换
  getParamsForUrl(url) {},
* 获取url参数
  getUrlParams(str){}
* 对象参数转字符串
  queryString(obj) {},
* 节流函数--规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。
  throttle(fun, delay) {},
* 防抖函数--在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时 */
  debounce(fun, delay) {},
* 下划线转换驼峰
  toHump(name) {},
* 驼峰转换下划线
  toLine(name) {},
* 图片上传转base64
  imgChange(file) {},
* 深克隆
  deepCopy(obj, copyObj) {}
```
