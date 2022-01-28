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
    function EventEmitter() {
        //存放订阅事件名字
        this.events = {}
    }
    EventEmitter.prototype = {
        //订阅事件的方法
        on(eventName, cb) {
            if (!this.events[eventName]) {
                this.events[eventName] = [cb]
            } else {
                this.events[eventName].push(cb)
            }
        },
        //触发订阅事件
        emit(eventName, args) {
            this.events[eventName] && this.events[eventName].forEach(cb => cb(args))
        },
        //移除订阅事件
        removeListener(eventName, cb) {
            if (this.events[eventName]) {
                this.events[eventName] = this.events[eventName].filter(callback => callback != cb)
            }
        },
        //只执行一次订阅
        once(eventName, cb) {
            let fn = () => {
                cb();
                this.removeListener(eventName, fn)
            };
            this.on(eventName, fn)
        }
    }
      
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
        //判断对象为空
        isEmptyObj(obj) {
            return JSON.stringify(obj) === '{}' || Object.keys(obj).length === 0;
        },
        //判断类型
        typeIs(instance) {
            return Object.prototype.toString.call(instance).slice(8, -1).toLowerCase();  //array object boolean number...
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
        // 获取浏览器类型和版本
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
        },
        //获取移动端运行系统
        getMobileSys() {
            const userAgent = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '';
            if (/iphone/i.test(userAgent) || /ipad/i.test(userAgent) || /ipod/i.test(userAgent)) {
                return 'ios';
            }
            if (/android/i.test(userAgent)) {
                return 'android';
            }
            if (/win/i.test(appVersion) && /phone/i.test(userAgent)) {
                return 'windowsPhone';
            }
        },
        //获取微信环境
        getWechatEnv() {
            const userAgent = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '';
            if ((userAgent.match(/MicroMessenger/i) === 'micromessenger') && (userAgent.match(/wxwork/i) === 'wxwork')) {
                return 'enterprise';
            } else if (userAgent.match(/micromessenger/i) === 'micromessenger') {
                return 'wechat';
            }
        },
        // 判断终端（pc/mobile）
        getClient() {
            if ((navigator.userAgent.match(/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i))) {
                return 'mobile'
            }
            return 'pc'
        },
        // 随机生成颜色
        randomColor() {
            return '#' + (
                '00000' + (
                    Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
        },
        //16进制颜色转RGBRGBA字符串
        colorToRGB(val, opa) {
            var pattern = /^(#?)[a-fA-F0-9]{6}$/; //16进制颜色值校验规则
            var isOpa = typeof opa == 'number'; //判断是否有设置不透明度
            if (!pattern.test(val)) { //如果值不符合规则返回空字符
                return '';
            }
            var v = val.replace(/#/, ''); //如果有#号先去除#号
            var rgbArr = [];
            var rgbStr = '';
            for (var i = 0; i < 3; i++) {
                var item = v.substring(i * 2, i * 2 + 2);
                var num = parseInt(item, 16);
                rgbArr.push(num);
            }
            rgbStr = rgbArr.join();
            rgbStr = 'rgb' + (isOpa ? 'a' : '') + '(' + rgbStr + (isOpa ? ',' + opa : '') + ')';
            return rgbStr;
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
        //根据url地址下载
        download(url) {
            var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
            var isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
            if (isChrome || isSafari) {
                var link = document.createElement('a');
                link.href = url;
                if (link.download !== undefined) {
                    var fileName = url.substring(url.lastIndexOf('/') + 1, url.length);
                    link.download = fileName;
                }
                if (document.createEvent) {
                    var e = document.createEvent('MouseEvents');
                    e.initEvent('click', true, true);
                    link.dispatchEvent(e);
                    return true;
                }
            }
            if (url.indexOf('?') === -1) {
                url += '?download';
            }
            window.open(url, '_self');
            return true;
        },
        //文件操作
        fileUtil: {
            //file转base64
            fileToBase64: file => {
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    return e.target.result
                }
            },
            //blob转file
            blobToFile: (blob, fileName) => {
                blob.lastModifiedDate = new Date();
                blob.name = fileName;
                return blob;
            },
            //base64转file
            base64ToFile: (base64, filename) => {
                let arr = base64.split(',');
                let mime = arr[0].match(/:(.*?);/)[1];
                let suffix = mime.split('/')[1];
                let bstr = atob(arr[1]);
                let n = bstr.length;
                let u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n)
                }
                return new File([u8arr], `${filename}.${suffix}`, { type: mime })
            },
            //base64转blob
            base64ToBlob: base64 => {
                let arr = base64.split(','),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new Blob([u8arr], { type: mime });
            }
        },
        //el是否在视口范围内
        elementIsVisibleInViewport(el, partiallyVisible = false) {
            const { top, left, bottom, right } = el.getBoundingClientRect();
            const { innerHeight, innerWidth } = window;
            return partiallyVisible
                ? ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) &&
                ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
                : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
        },
        //去除html标签
        removeHtmlTag(str) {
            return str.replace(/<[^>]+>/g, '')
        },
        //动态引入js
        injectScript(src,insertType='after') {
            const insertAfter = (newElement,targetElement) => {
                var parent = targetElement.parentNode;
                if (parent.lastChild == targetElement) {
                    // 如果最后的节点是目标元素，则直接添加。因为默认是最后
                    parent.appendChild(newElement);
                } else {
                    //如果不是，则插入在目标元素的下一个兄弟节点的前面。也就是目标元素的后面。
                    parent.insertBefore(newElement,targetElement.nextSibling);
                 }
            }
            const insertBefore = (newElement,targetElement) => {
                targetElement.parentNode.insertBefore(newElement, targetElement);
            }
            const s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = src;
            const origin = document.getElementsByTagName('head')[0].children;
            const t = origin[origin.length - 1];
            if (insertType === 'before') {
                insertBefore(s, t);  
            } else {
                insertAfter(s,t)
            }
        },
        //劫持粘贴板
        copyTextToClipboard(value, cb) {
            var textArea = document.createElement("textarea");
            textArea.style.background = 'transparent';
            textArea.value = value;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                var successful = document.execCommand('copy');
                if (successful) cb && cb()
            } catch (err) {
                console.log('Oops, unable to copy');
            }
            document.body.removeChild(textArea);
        },
        //数字转大写中文
        numberToChinese(num) {
            var AA = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十");
            var BB = new Array("", "十", "百", "仟", "萬", "億", "点", "");
            var a = ("" + num).replace(/(^0*)/g, "").split("."),
                k = 0,
                re = "";
            for (var i = a[0].length - 1; i >= 0; i--) {
                switch (k) {
                    case 0:
                        re = BB[7] + re;
                        break;
                    case 4:
                        if (!new RegExp("0{4}//d{" + (a[0].length - i - 1) + "}$")
                            .test(a[0]))
                            re = BB[4] + re;
                        break;
                    case 8:
                        re = BB[5] + re;
                        BB[7] = BB[5];
                        k = 0;
                        break;
                }
                if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0)
                    re = AA[0] + re;
                if (a[0].charAt(i) != 0)
                    re = AA[a[0].charAt(i)] + BB[k % 4] + re;
                k++;
            }
            if (a.length > 1) // 加上小数部分(如果有小数部分)
            {
                re += BB[6];
                for (var i = 0; i < a[1].length; i++)
                    re += AA[a[1].charAt(i)];
            }
            if (re == '一十')
                re = "十";
            if (re.match(/^一/) && re.length == 3)
                re = re.replace("一", "");
            return re;
        },
        //加
        add(arg1, arg2, fixed) {
            var r1, r2, m;
            try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
            try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
            m = Math.pow(10, Math.max(r1, r2))
            const tempNum = (arg1 * m + arg2 * m) / m
            if (fixed>=0) return this.toFixed(tempNum,fixed)
            return tempNum;
        },
        //减
        cut(arg1, arg2,fixed) {
            var r1, r2, m, n;
            try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
            try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
            m = Math.pow(10, Math.max(r1, r2));
            n = (r1 >= r2) ? r1 : r2;
            const tempNum = ((arg1 * m - arg2 * m) / m).toFixed(n)*1
            if (fixed>=0) return this.toFixed(tempNum,fixed)
            return tempNum;
        },
        //乘
        mul(arg1, arg2,fixed) {
            var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
            try { m += s1.split(".")[1].length } catch (e) { }
            try { m += s2.split(".")[1].length } catch (e) { }
            const tempNum = Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
            if (fixed>=0) return this.toFixed(tempNum,fixed)
            return tempNum;
        },
        //除
        div(arg1, arg2, fixed) {
            var t1 = 0, t2 = 0, r1, r2;
            try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
            try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
            r1 = Number(arg1.toString().replace(".", ""))
            r2 = Number(arg2.toString().replace(".", ""))
            const tempNum = (r1 / r2) * Math.pow(10, t2 - t1)
            if (fixed>=0) return this.toFixed(tempNum,fixed)
            return tempNum;
        },
        //指定小数点位数取值,非四舍五入
        toFixed(n, fixed) {
            const type = this.typeIs(n)
            if (type === 'number' || (type === 'string' && !window.isNaN(n * 1))) {
                n = n + ''
                const fixedNum = n.indexOf('.') > -1 ? n.indexOf('.') + fixed + 1 : n.length
                return n.substr(0, fixedNum)*1
            }
            return new Error(n + '不是合法的')
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
                s += (digit[Math.floor(this.mul(n, 10 * Math.pow(10, i))) % 10] + fraction[i]).replace(/零./, '');
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
        //获取北京时间
        getBJDate (date) {
            //获得当前运行环境时间
            let d = date && this.typeIs(new Date(date)) === 'date' ? new Date(date) : new Date(),
                currentDate = date && this.typeIs(new Date(date)) === 'date' ? new Date(date) : new Date(), 
                tmpHours = currentDate.getHours();
            //算得时区
            let time_zone = -d.getTimezoneOffset() / 60;
            //少于0的是西区 西区应该用时区绝对值加京八区 重新设置时间（西区时间比东区时间早 所以加时区间隔）
            if (time_zone < 0) {
                time_zone = Math.abs(time_zone) + 8; currentDate.setHours(tmpHours + time_zone);
            } else {
                //大于0的是东区  东区时间直接跟京八区相减
                time_zone -= 8; currentDate.setHours(tmpHours - time_zone);
            }
            return currentDate;
        },
        //时间格式化
        formatDateTime({ date, type = 'YYYY/MM/DD hh:mm:ss',timeZoneBJ = true }) {
            date = date && this.typeIs(new Date(date)) === 'date' ? new Date(date) : new Date();
            if (timeZoneBJ) {
                date = this.getBJDate(date)
            }
            let o = {
                "Y+": date.getFullYear(),       // 年份
                "M+": date.getMonth() + 1,      // 月份 
                "D+": date.getDate(),           // 日 
                "h+": date.getHours(),          // 小时 
                "m+": date.getMinutes(),        // 分 
                "s+": date.getSeconds(),        // 秒 
                "q+": ((date.getMonth() + 3) / 3) | 0, // 季度 
                "S": date.getMilliseconds()     // 毫秒 
            }
            for (let k in o) {
                if (new RegExp("(" + k + ")").test(type)) {
                    type = type.replace(RegExp.$1, (a, b) => {
                        if ( (b !== 0  || b< 10) && String(o[k]).length < 2 && a.length === 2) return `0${o[k]}`
                        return o[k]
                    })
                }
            }
            return type
        },
        // 当前月最大日
        getMonthMaxDay(year, month) {
            return new Date(year, month, 0).getDate()
        },
        // 根据年月日得知星期几
        getWeek(year, month, day) {
            return new Date(year + '/' + month + '/' + day).getDay()
        },
        // 获取指定年月日历
        getMonthData(year, month) {
            if (year > 0 && month >= 1 && month <= 12) {
                let start = 1,
                    end = new Date(year, month, 0).getDate()
                const data = []
                for (; start < end + 1; start++) {
                    data.push({
                        year,
                        month,
                        day: start,
                        week: this.getWeek(year, month, start),
                    })
                }
                return data
            } else {
                return []
            }
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
        // 获取url参数
        getUrlParams(url) {
            var reg1 = new RegExp('(?<==).*?(?=(&|$))', 'ig');
            var reg2 = new RegExp('(?<=&).*?(?=(=|$))', 'ig');
            if (this.isUrl(url)) {
                var u1 = url.split('?')[0]
                var u2 = url.split('?')[1]
                if (u2.substring(0, 1) != '&') {
                    url = u1 + '&' + u2
                }
                var ValueArr = url.match(reg1)
                var keyArr = url.match(reg2)
                var obj = {}
                for (var i = 0, len = keyArr.length; i < len; i++) {
                    obj[keyArr[i]] = ValueArr[i]
                }
                return this.extend(obj, {
                    value: url.match(reg1),
                    key: url.match(reg2)
                });
            } else {
                return {}
            }

        },
        //对象参数转字符串
        queryString(obj) {
            let str = '';
            for (let k in obj) {
                const transformType = ['string', 'number', 'boolean']
                if (transformType.includes(this.typeIs(obj[k]))) {
                    str += `${k}=${encodeURIComponent(obj[k])}&`;
                } else {
                    str += `${k}=${encodeURIComponent(JSON.stringify(obj[k]))}&`;
                }
            }
            return str.substr(0, str.length - 1);
        },
        //节流函数--规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。
        throttle(fn, wait = 50) {
            // 上一次执行 fn 的时间
            let previous = 0;
            // 将 throttle 处理结果当作函数返回
            return function (...args) {
                // 获取当前时间，转换成时间戳，单位毫秒
                let now = Date.now();
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
        imgChange(file, cb) {
            // 生成一个文件读取的对象
            var reader = new FileReader();
            reader.onload = function (ev) {
                // base64码
                var imgFile = ev.target.result;//或e.target都是一样的
                if (cb) cb(imgFile)
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
        //判断该属性是否在json中的key存在
        jsonHasKey(json, key) {
            if (typeof json != 'object' || typeof key != 'string') return false;
            return Object.keys(json).some(k => k === key || this.jsonHasKey(json[k], key));
        },
        // 数组去重合并
        unique(originArray, objectArray = false, objectKey = '') {
            const tempArr = [];
            for (let i = 0; i < originArray.length; i++) {
                const cur = originArray[i];
                if (!objectArray) {
                    if (tempArr.indexOf(cur) === -1) {
                        tempArr.push(cur);
                    }
                } else {
                    if (tempArr.filter(t => t[objectKey] === cur[objectKey]).length === 0) {
                        tempArr.push(cur);
                    }
                }

            }
            return tempArr;
        },
        //判断一个元素是否在数组中
        contains(arr, val) {
            return arr.indexOf(val) != -1 ? true : false;
        },
        //求两个集合的并集
        union(a, b) {
            var newArr = a.concat(b);
            return this.unique(newArr);
        },
        //求两个集合的交集
        intersect(a, b) {
            var _this = this;
            a = this.unique(a);
            const newArr = a.map(function (o) {
                return _this.contains(b, o) ? o : null;
            })
            for (var i = 0, len = newArr.length; i < len; i++) {
                if (newArr[i] === null) {
                    newArr.splice(i, 1)
                }
            }
            return newArr;
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
                        if (this.typeIs(obj[prop]) === 'object') {
                            if (deep) {
                                extended[prop] = this.extend(extended[prop], obj[prop]);
                            } else {
                                extended[prop] = obj[prop];
                            }
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
        EventEmitter:new EventEmitter()
    };


    return BetterUtilTools;
});
