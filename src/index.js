/* eslint-disable */
import Common from './modules/common';
import EventEmitter from './modules/eventEmitter';
import file from './modules/file';
import izExif from './modules/izExif';

class BetterUtilTools extends Common {
  constructor(options) {
    super(options);
    console.log('better-util-tools is ok');
    this.EventEmitter = EventEmitter;
    this.options = options || {};
    //文件操作
    this.file = file;
    //获取文件属性（经纬度...）
    this.izExif = izExif;
  }
}
export default BetterUtilTools;
