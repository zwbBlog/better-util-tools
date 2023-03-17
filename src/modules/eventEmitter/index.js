class IEventEmitter {
  constructor() {
    //存放订阅事件名字
    this.events = {};
  }
  //订阅事件的方法
  on(eventName, cb) {
    if (!this.events[eventName]) {
      this.events[eventName] = [cb];
    } else {
      this.events[eventName].push(cb);
    }
  }
  //触发订阅事件
  emit(eventName, args) {
    if(this.events[eventName]) { this.events[eventName].forEach(cb => cb(args)); }
  }
  //移除订阅事件
  removeListener(eventName, cb) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(callback => callback !== cb);
    }
  }
  //只执行一次订阅
  once(eventName, cb) {
    let fn = () => {
      cb();
      this.removeListener(eventName, fn);
    };
    this.on(eventName, fn);
  }
}
const eventEmitter = new IEventEmitter();
export default eventEmitter;