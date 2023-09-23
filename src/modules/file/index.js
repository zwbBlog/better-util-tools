
import ICommon from '../common';
class IFile extends ICommon {
  constructor() {
    super();
  }
  //file转base64
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      ///FileReader类就是专门用来读文件的
      const reader = new FileReader();
      //开始读文件
      //readAsDataURL: dataurl它的本质就是图片的二进制数据， 进行base64加密后形成的一个字符串，
      reader.readAsDataURL(file);
      // 成功和失败返回对应的信息，reader.result一个base64，可以直接使用
      reader.onload = () => resolve(reader.result);
      // 失败返回失败的信息
      reader.onerror = error => reject(error);
    });
  }
  /**
   * blob转file
   * @param blob       {Blob}   blob
   * @param fileName   {String} 文件名
   * @param mimeType   {String} 文件类型
   * @returns file     {File}   文件
   */
  blobToFile(blob, fileName, mimeType) {
    return new File([blob], fileName, { type: mimeType })
  }
  /**
   * base64转file
   * @param base64     {String} base64
   * @param fileName   {String} 文件名 
   * @returns file     {File}   文件
  */
  base64ToFile(base64, filename) {
    let arr = base64.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let suffix = mime.split('/')[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], `${filename}.${suffix}`, { type: mime });
  }
  //base64转blob
  base64ToBlob(base64) {
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
  //根据文件生成url
  getObjectURL(file) {
    if (window.URL) {
      return window.URL.createObjectURL(file);
    }
    if (window.webkitURL) {
      return window.webkitURL.createObjectURL(file);
    }
  }
  /**
     * res:原始response对象
     * preview:是否预览
     * success:成功回调
     * fail:失败回调
     */
  //文件流下载
  streamToFile({ res = {}, preview = false, success, fail }) {
    if (this.isEmptyObj(res)) {
      throw new Error('请传入正确的response参数');
    }
    const { headers = {} } = res;
    const {
      msg = '文件下载失败,请检查response参数是否正确',
      down = false,
    } = headers;
    if (down) {
      return window.open(decodeURIComponent(down), '_blank');
    }
    if (headers['content-disposition']) {
      let fileName;
      const contentDisposition = headers['content-disposition'];
      const contentType = headers['content-type'];
      if (contentDisposition) {
        if (contentDisposition.indexOf('filename*=UTF-8\'\'') > -1) {
          fileName = contentDisposition
            .split(';')[1]
            .split('filename*=UTF-8\'\'')[1]
            .replace(/"/g, '');
        } else if (contentDisposition.indexOf('filename=') > -1) {
          fileName = contentDisposition
            .split(';')[1]
            .split('filename=')[1]
            .replace(/"/g, '');
        }
      }
      fileName = decodeURIComponent(fileName);
      const blob = new Blob([res.data], { type: contentType });
      const ObjectURL = this.getObjectURL(blob);
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, fileName);
      } else {
        const a = document.createElement('a');
        if (preview) {
          a.target = '_blank';
        } else {
          a.download = fileName;
        }
        a.href = ObjectURL;
        document.body.append(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(ObjectURL);
      }
      if (success) {
        success();
      }
    } else if (fail) {
      fail(decodeURIComponent(msg));
    }
  }
}
const iFile = new IFile();
export default iFile;