'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _MeasureBox = require('./MeasureBox');

var _MeasureBox2 = _interopRequireDefault(_MeasureBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const styles = {
  layer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    cursor: 'pointer'
  }
};

class EditLayer extends _react.Component {

  onTouchStart(evt) {
    this._sp = this._mp = null;
    this._start = true;
    this._sp = this._getPosition(evt);
    this.forceUpdate();
  }
  onTouchMove(evt) {
    if (this._start) {
      let mp = this._getPosition(evt);
      let w = Math.abs(mp.x - this._sp.x);
      let h = Math.abs(mp.y - this._sp.y);
      if (w > 10 || h > 10) {
        this._mp = mp;
        this.forceUpdate();
      }
    }
  }
  onTouchEnd(evt) {
    if (this.props.onMeasure && this._measureBox) {
      this.props.onMeasure(this._measureBox);
    }
    this._start = false;;
  }
  _getPosition(evt) {
    let position = {
      x: 0,
      y: 0
    };

    let touches = evt.changedTouches;
    if (touches) {
      let touch = touches[0];
      position.x = touch.pageX;
      position.y = touch.pageY;
    } else {
      position.x = evt.pageX;
      position.y = evt.pageY;
    }
    return position;
  }
  renderMeasureBox() {
    let p1 = this._sp;
    let p2 = this._mp;
    if (p1 && p2) {
      let scale = this.props.scale || 1;
      let w = Math.abs(p2.x - p1.x);
      w = (w / scale).toFixed(0);
      let h = Math.abs(p2.y - p1.y);
      h = (h / scale).toFixed(0);
      let layout = this._measureBox = {
        top: Math.min(p2.y, p1.y),
        left: Math.min(p2.x, p1.x),
        width: Number(w),
        height: Number(h)
      };
      return _react2.default.createElement(_MeasureBox2.default, _extends({}, layout, { lnUnit: _MeasureBox.UNIT_TYPE.CSS }));
    }
    return null;
  }
  render() {
    return _react2.default.createElement(
      'div',
      { style: styles.layer,
        ref: el => {
          this.el = el;
        },
        onTouchStart: this.onTouchStart.bind(this),
        onMouseDown: this.onTouchStart.bind(this),
        onTouchMove: this.onTouchMove.bind(this),
        onMouseMove: this.onTouchMove.bind(this),
        onTouchEnd: this.onTouchEnd.bind(this),
        onMouseUp: this.onTouchEnd.bind(this),
        onTouchCancel: this.onTouchEnd.bind(this) },
      this.renderMeasureBox()
    );
  }
}
exports.default = EditLayer;
EditLayer.propTypes = {
  onMeasure: _propTypes2.default.func
};