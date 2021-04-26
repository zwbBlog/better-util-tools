/**
 *  Created by zlgb on 2020-11-24 17:27:14
 *  ------------------修改记录-------------------
 *  修改人      修改日期                 修改目的
 *  zlgb        2020-11-24               创建
 **/
(function (global, definition) {
    if (typeof define === 'function' && define.amd) {
        // AMD环境或CMD环境
        define(definition);
    } else if (typeof module !== 'undefined' && module.exports) {
        // 定义为普通Node模块
        module.exports = definition();
    } else {
        // 将模块的执行结果挂在全局变量中，在浏览器中指向window对象
        global = typeof globalThis !== 'undefined' ? globalThis : global;
        global.BetterUtilTools = definition();
    }
})(this, function () {
    var BetterUtilTools = function (options) {
        options = options || {};
    };

    BetterUtilTools.prototype = {
        _init() {
            console.log('better-util-tools is ok');
        },
        //判断两个数组是否相等
        arrayEqual(arr1, arr2) {
            if (arr1 === arr2) return true;
            if (arr1.length !== arr2.length) return false;
            for (let i = 0; i < arr1.length; ++i) {
                if (arr1[i] !== arr2[i]) return false;
            }
            return true;
        },
        //判断该属性是否在json中的key存在
        JsonHasKey(json, key) {
            if (typeof json != 'object' || typeof key != 'string') return false;
            return Object.keys(json).some(k => k === key || this.JsonHasKey(json[k], key));
        },
        //判断对象为空
        isEmptyObj(obj) {
            return JSON.stringify(obj) === '{}' || Object.keys(obj).length === 0;
        },
        //判断类型
        typeIs(instance) {
            return Object.prototype.toString.call(instance).slice(8, -1).toLowerCase();  //array object boolean number...
        },
        //判断是否为Promise
        isPromise(obj) {
            return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
        },
        //判断元素是否有某个class
        hasClass(ele, cls) {
            return (new RegExp('(\\s|^)' + cls + '(\\s|$)')).test(ele.className);
        },
        // 为元素添加class
        addClass(ele, cls) {
            if (!this.hasClass(ele, cls)) {
                ele.className += ' ' + cls;
            }
        },
        //为元素移除class
        removeClass(ele, cls) {
            if (this.hasClass(ele, cls)) {
                let reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                ele.className = ele.className.replace(reg, ' ');
            }
        },
        //获取浏览器类型和版本
        getExplore() {
            let sys = {};
            let ua = navigator.userAgent.toLowerCase();
            let s;
            (s = ua.match(/rv:([\d.]+)\) like gecko/))
                ? sys.ie = s[1]
                : (s = ua.match(/msie ([\d\.]+)/))
                    ? sys.ie = s[1]
                    : (s = ua.match(/edge\/([\d\.]+)/))
                        ? sys.edge = s[1]
                        : (s = ua.match(/firefox\/([\d\.]+)/))
                            ? sys.firefox = s[1]
                            : (s = ua.match(/(?:opera|opr).([\d\.]+)/))
                                ? sys.opera = s[1]
                                : (s = ua.match(/chrome\/([\d\.]+)/))
                                    ? sys.chrome = s[1]
                                    : (s = ua.match(/version\/([\d\.]+).*safari/))
                                        ? sys.safari = s[1]
                                        : 0;
            // 根据关系进行判断
            if (sys.ie) {
                return ('IE: ' + sys.ie);
            }
            if (sys.edge) {
                return ('EDGE: ' + sys.edge);
            }
            if (sys.firefox) {
                return ('Firefox: ' + sys.firefox);
            }
            if (sys.chrome) {
                return ('Chrome: ' + sys.chrome);
            }
            if (sys.opera) {
                return ('Opera: ' + sys.opera);
            }
            if (sys.safari) {
                return ('Safari: ' + sys.safari);
            }
            return 'Unkonwn';
        },
        // 获取操作系统类型
        getOS() {
            let userAgent = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '';
            let vendor = 'navigator' in window && 'vendor' in navigator && navigator.vendor.toLowerCase() || '';
            let appVersion = 'navigator' in window && 'appVersion' in navigator && navigator.appVersion.toLowerCase() || '';
            if (/mac/i.test(appVersion)) {
                return 'MacOSX';
            }
            if (/win/i.test(appVersion)) {
                return 'windows';
            }
            if (/linux/i.test(appVersion)) {
                return 'linux';
            }
            if (/iphone/i.test(userAgent) || /ipad/i.test(userAgent) || /ipod/i.test(userAgent)) {
                return 'ios';
            }
            if (/android/i.test(userAgent)) {
                return 'android';
            }
            if (/win/i.test(appVersion) && /phone/i.test(userAgent)) {
                return 'windowsPhone';
            }
            if ((userAgent.match(/MicroMessenger/i) === 'micromessenger') && (userAgent.match(/wxwork/i) === 'wxwork')) {
                return '企业微信客户端';
            } else if (userAgent.match(/micromessenger/i) === 'micromessenger') {
                return '微信客户端';
            }

        },
        // 随机生成颜色
        randomColor() {
            return '#' + (
                '00000' + (
                    Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
        },
        // 范围内随机数
        random(low, high) {
            var a = high - low + 1;
            return Math.floor(Math.random() * a + low);
            //return Math.round(Math.random()*a+low)  [low,high+1]
        },
        // 范围内随机字符串
        randomName(randomFlag, min, max) {
            var str = '',
                range = min,
                arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            // 随机产生
            if (randomFlag) {
                range = Math.floor(Math.random() * (max - min + 1) + min);
            }
            for (var i = 0; i < range; i++) {
                var pos = Math.round(Math.random() * (arr.length - 1));
                str += arr[pos];
            }
            return str;
        },
        // 判断是否为身份证号
        isIdCard(str) {
            return /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(str);
        },
        // 判断是否为手机号
        isPhoneNum(str) {
            return /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(str);
        },
        //判断是否为URL
        isUrl(str) {
            return /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i.test(str);
        },
        //判断是否为Email
        isEmail(str) {
            return /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/i.test(str);
        },
        //判断是否含有中文
        isChineseName(str) {
            // return /^([\u4E00-\u9FFF]|\w){2,11}$/.test(str);
            return /^([\u4E00-\u9FFF]|\w)$/.test(str);
        },
        //现金额转大写
        digitUppercase(n) {
            let fraction = ['角', '分'];
            let digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
            let unit = [
                ['元', '万', '亿'],
                ['', '拾', '佰', '仟']
            ];
            let head = n < 0 ? '欠' : '';
            n = Math.abs(n);
            let s = '';
            for (let i = 0; i < fraction.length; i++) {
                s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
            }
            s = s || '整';
            n = Math.floor(n);
            for (let i = 0; i < unit[0].length && n > 0; i++) {
                let p = '';
                for (let j = 0; j < unit[1].length && n > 0; j++) {
                    p = digit[n % 10] + unit[1][j] + p;
                    n = Math.floor(n / 10);
                }
                s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
            }
            return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
        },
        // 千分位逗号格式化
        formatDecimals(num) {
            if (this.typeIs(num) === 'number' || this.typeIs(num * 1) === 'number') {
                var source = String(num).split(".");//按小数点分成2部分
                source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), "$1,");//只将整数部分进行都好分割
                return source.join(".");//再将小数部分合并进来
            }
            return num
        },
        //倒计时
        formatRemainTime(endTime) {
            let startDate = new Date(); //开始时间
            let endDate = new Date(endTime); //结束时间
            let t = endDate.getTime() - startDate.getTime(); //时间差
            let d = 0;
            let h = 0;
            let m = 0;
            let s = 0;
            if (t >= 0) {
                d = Math.floor(t / 1000 / 3600 / 24);
                h = Math.floor(t / 1000 / 60 / 60 % 24);
                m = Math.floor(t / 1000 / 60 % 60);
                s = Math.floor(t / 1000 % 60);
            }
            return d + '天 ' + h + '小时 ' + m + '分钟 ' + s + '秒';
        },
        // 获取元素属性值
        getStyle(elem, style) {
            let view = elem.ownerDocument ? elem.ownerDocument.defaultView : window;
            if (typeof style == 'string') {
                return view.getComputedStyle(elem)[style];
            } else if (typeof style === 'undefined') {
                return view.getComputedStyle(elem);
            } else if (style instanceof Array) {
                let styles = {};
                for (let i of style) {
                    styles[i] = view.getComputedStyle(elem)[i];
                }
                return styles;
            }

        },
        //时间格式化
        formatDateTime({ timestamp, type }) {
            var Time = timestamp ? new Date(timestamp) : new Date();
            var year = Time.getFullYear();
            var month = Time.getMonth() + 1;
            month = month < 10 ? ('0' + month) : month;
            var date = Time.getDate();
            date = date < 10 ? ('0' + date) : date;
            var hour = Time.getHours();
            var minute = Time.getMinutes();
            minute = minute < 10 ? ('0' + minute) : minute;
            var second = Time.getSeconds();
            second = second < 10 ? ('0' + second) : second;
            if (!type) return year + '/' + month + '/' + date + ' ' + hour + ':' + minute + ':' + second;
            return type.replace(/YYYY/i, year)
                .replace(/MM/, month)
                .replace(/DD/i, date)
                .replace(/hh/i, hour)
                .replace(/mm/, minute)
                .replace(/ss/i, second);
        },
        //获取相对时间
        getAbsoluteDay(day) {
            const doHandleMonth = (month) => {
                var m = month;
                if (month.toString().length == 1) {
                    m = '0' + month;
                }
                return m;
            };
            var today = new Date();
            var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
            today.setTime(targetday_milliseconds); //注意，这行是关键代码
            var tYear = today.getFullYear();
            var tMonth = today.getMonth();
            var tDate = today.getDate();
            tMonth = doHandleMonth(tMonth + 1);
            tDate = doHandleMonth(tDate);
            return tYear + '-' + tMonth + '-' + tDate;
        },
        //调用支付宝验证银行卡接口
        isBankCard(axios, bankCard, cb) {
            var url = `https://ccdcapi.alipay.com/validateAndCacheCardInfo.json?_input_charset=utf-8&cardNo=${bankCard}&cardBinCheck=true`;
            if (axios) {
                axios.get(url).then(({ data }) => {
                    cb && cb(data);
                }).catch(err => {
                    cb('验证失败');
                });
            } else {
                cb('需要axios依赖');
            }
        },
        // url参数转换
        getParamsForUrl(url) {
            url = url || 'http://www.gaodun6.com/api/stockMarket/getPcByPage?token=50a591d1db72491b9b39c7be3fd4f4d5&pageNo=1&pageSize=10&userId=53';
            var reg = /(\w)+=(\w+)/g, paramsArr = url.match(reg), obj = {};
            for (var i = 0, len = paramsArr.length; i < len; i++) {
                obj[paramsArr[i].split('=')[0]] = paramsArr[i].split('=')[1];
            }
            return obj;
        },
        //获取url参数
        getUrlParams(str) {
            var reg1 = /(?<==).*?(?=(&|$))/ig;
            var reg2 = /(?<=&).*?(?=(=|$))/ig;
            return {
                key: str.match(reg1),
                value: str.match(reg2)
            };
        },
        //对象参数转字符串
        queryString(obj) {
            let str = '';
            for (let k in obj) {
                str += `${k}=${obj[k]}`;
            }
            return str;
        },
        //节流函数--规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。
        throttle(fn, wait = 50) {
            // 上一次执行 fn 的时间
            let previous = 0;
            // 将 throttle 处理结果当作函数返回
            return function (...args) {
                // 获取当前时间，转换成时间戳，单位毫秒
                let now = Number(new Date());
                // 将当前时间和上一次执行函数的时间进行对比
                // 大于等待时间就把 previous 设置为当前时间并执行函数 fn
                if (now - previous > wait) {
                    previous = now;
                    fn.apply(this, args);
                }
            };
        },
        // 防抖函数--在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
        debounce(fn, wait = 50) {
            // 通过闭包缓存一个定时器 id
            let timer = null
            // 将 debounce 处理结果当作函数返回
            // 触发事件回调时执行这个返回函数
            return function (...args) {
                // 如果已经设定过定时器就清空上一次的定时器
                if (timer) clearTimeout(timer)
                // 开始设定一个新的定时器，定时器结束后执行传入的函数 fn
                timer = setTimeout(() => {
                    fn.apply(this, args)
                }, wait)
            }
        },
        // 下划线转换驼峰
        toHump(name) {
            return name.replace(/\_(\w)/g, function (all, letter) {
                return letter.toUpperCase();
            });
        },
        // 驼峰转换下划线
        toLine(name) {
            return name.replace(/([A-Z])/g, '_$1').toLowerCase();
        },
        // 图片上传转base64
        imgChange(file) {
            // 生成一个文件读取的对象
            var reader = new FileReader();
            reader.onload = function (ev) {
                // base64码
                var imgFile = ev.target.result;//或e.target都是一样的
                document.querySelector('img').src = imgFile;
            };
            //发起异步读取文件请求，读取结果为data:url的字符串形式，
            reader.readAsDataURL(file.files[0]);
        },
        // 深克隆
        deepCopy(obj, copyObj) {
            obj = obj || {};
            for (var k in copyObj) {
                // 只拷贝实例属性
                if (copyObj.hasOwnProperty(k)) {
                    if (typeof copyObj[k] == 'object') {
                        // 引用类型
                        // 判断是否是数组
                        if (this.typeIs(copyObj[k]) === 'array') {
                            obj[k] = []
                        } else if (this.typeIs(copyObj[k]) === 'object') {
                            obj[k] = {}
                        } else {
                            obj[k] = copyObj[k]
                        }
                        this.deepCopy(obj[k], copyObj[k]); //函数调用
                    } else {
                        // 值类型
                        obj[k] = copyObj[k];
                    }
                }
            }
            return obj;
        },
        // 数组去重合并
        unique(arr) {
            var array = arr;
            var len = array.length;
            array.sort(function (a, b) {
                return a - b;
            });
            function loop(index) {
                if (index >= 1) {
                    if (array[index] === array[index - 1]) {
                        array.splice(index, 1);
                    }
                    loop(index - 1); //递归loop，然后数组去重
                }
            }
            loop(len - 1);
            return array;
        },
        // 合并对象
        extend() {
            var extended = {};
            var deep = false;
            var i = 0;
            // 判断是否为深拷贝
            if (this.typeIs(arguments[0]) === 'boolean') {
                deep = arguments[0];
                //如果为深拷贝则初始的i为1或者为0
                i++;
            }
            // 将对象属性合并到已存在的对象中
            var merge = function (obj) {
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        // 如果属性为对象并且需要深拷贝时则使用函数递归、反之则将当前的属性替换现有的属性
                        if (deep && this.typeIs(obj[prop]) === 'object') {
                            extended[prop] = this.extend(extended[prop], obj[prop]);
                        } else {
                            extended[prop] = obj[prop];
                        }
                    }
                }
            }.bind(this);
            // 遍历所有对象属性
            for (; i < arguments.length; i++) {
                merge(arguments[i]);
            }
            return extended;
        },
    };
    return BetterUtilTools;
});
