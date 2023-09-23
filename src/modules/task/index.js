export default class Scheduler {
    constructor(max) {
        this.max = max;
        this.count = 0;//用来记录当前正在执行的异步函数
        this.queue = [];//表示等待队列
    }
    async add(p) {
        /*
            此时count已经满了，不能执行本次add需要阻塞在这里，将resolve放入队列中等待唤醒,
            等到count<max时，从队列中取出执行resolve,执行，await执行完毕，本次add继续
        */
        if (this.count >= this.max) {
            await new Promise(resolve => this.queue.push(resolve));
        }
        this.count++;
        let res = await p();
        this.count--;
        if (this.queue.length) {
            // 依次唤醒add
            // 若队列中有值，将其resolve弹出，并执行
            // 以便阻塞的任务，可以正常执行
            this.queue.shift()();
        }
        return res;
    }
}

