import buf2pix from './buf2pix';

let itemId = 0;
/* list使用的数据源。主要有两类：一类是图像数据，一类是测量矩形
 * 图片数据特殊处理： 由于图片一直以流的方式显示，不仅ui需要动态删除，数据也需要删除，不然可能撑爆内存
 */
export default class Store {
  constructor(options = {}) {
    this._maxLn = options.maxLn;
    this._fMaxLn = options.fMaxLn;
    this._minLn = 0;
    this._startIdx = 0;
    this.setData(options.data);
  }
  getDataAt(idx) {
    return this._data[idx - this._startIdx];
  }
  getLast() {
    return this._data[this._data.length - 1];
  }
  getData() {
    return this._data;
  }
  addImageData(imgs=[], options={}) {
    const {
      imgWidth,
      imgHeight,
      webgl,
    } = options;

    // 先填满store中最后一个未填满的data
    let lastData = this.getLast();

    // webgl: single channel does the work
    let method = webgl ? 'bufCopy' : 'grayBuf2RgbaBuf';

    imgs.forEach((img, idx) => {
      if (!lastData || lastData.src.full) {
        lastData = {
          idx: itemId++,
          src: buf2pix[method](img, null, imgWidth, imgHeight),
          width: imgWidth,
          height: imgHeight,
          webgl,
        };
        this.addData([lastData]);
      } else {
        buf2pix[method](img, lastData.src, imgWidth, imgHeight);
      }
    });
  }
  addData(data = []) {
    this.setData(this._data.concat(data));
  }
  // 图片的矩形测量框
  getMeasureBoxs() {
    return this._measureBoxs;
  }
  setMeasureBoxs(measureBoxs) {
    this._measureBoxs = measureBoxs;
  }
  addMeasureBox(measureBox) {
    this._measureBoxs = this._measureBoxs || [];
    // store中的_measureBoxs 先要确保没有重复.
    if (!this._measureBoxs.find(thisBox => (thisBox.id === measureBox.id))) {
      this._measureBoxs.push(measureBox);
    }
  }
  setData(data = []) {
    if (this._froze) return;
    if (this._fMaxLn && data.length > this._fMaxLn) {
      let delLn = data.length - this._maxLn;
      this._data = data.slice(delLn);
      this._startIdx += delLn;
    } else if (data.length > this._maxLn) {
      let delLn = data.length - this._maxLn;
      this._startIdx += delLn;
      if (this._startIdx > this._minLn) {
        this._data = data.slice(delLn - (this._startIdx - this._minLn));
        this._startIdx = this._minLn;
      } else {
        this._data = data.slice(delLn);
      }
    } else {
      this._startIdx = 0;
      this._data = data;
    }
  }
  setMin(minLn) {
    this._minLn = minLn;
  }
  getMin() {
    return this._minLn;
  }
  setMax(maxLn) {
    this._maxLn = maxLn;
  }
  size() {
    return this._data.length + this._startIdx;
  }
  isWritable() {
    return this._data.length < this._maxLn;
  }
  start() {
    return this._startIdx;
  }
  clear() {
    this._startIdx = 0;
  }
}
