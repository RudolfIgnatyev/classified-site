import { createElement, createEvents, prepareArrayValues, checkInitial } from '../constants/constants.js';

class rSlider {
  constructor(conf) {
    this.input = null;
    this.inputDisplay = null;
    this.slider = null;
    this.sliderWidth = 0;
    this.sliderLeft = 0;
    this.pointerWidth = 0;
    this.pointerR = null;
    this.pointerL = null;
    this.activePointer = null;
    this.selected = null;
    this.scale = null;
    this.step = 0;
    this.tipL = null;
    this.tipR = null;
    this.timeout = null;
    this.valRange = false;
    this.tipsContainer = null;
    this.values = {
      start: null,
      end: null
    };
    this.conf = {
      target: null,
      values: null,
      set: null,
      range: false,
      width: null,
      scale: true,
      labels: true,
      tooltip: true,
      step: null,
      disabled: false,
      onChange: null
    };
    this.cls = {
      container: 'rs-container',
      background: 'rs-bg',
      selected: 'rs-selected',
      pointer: 'rs-pointer',
      scale: 'rs-scale',
      noscale: 'rs-noscale',
      tip: 'rs-tooltip',
      tips: 'rs-tooltip-container'
    };

    for (let i in this.conf) {
      if (conf.hasOwnProperty(i))
        this.conf[i] = conf[i];
    }

    this.init();
  }
  init() {
    if (typeof this.conf.target === 'object')
      this.input = this.conf.target;
    else
      this.input = document.getElementById(this.conf.target.replace('#', ''));

    if (!this.input)
      return console.log('Cannot find target element...');

    this.inputDisplay = getComputedStyle(this.input, null).display;
    this.input.style.display = 'none';
    this.valRange = !(this.conf.values instanceof Array);

    if (this.valRange) {
      if (!this.conf.values.hasOwnProperty('min') || !this.conf.values.hasOwnProperty('max'))
        return console.log('Missing min or max value...');
    }
    return this.createSlider();
  }
  createSlider() {
    this.slider = createElement('div', this.cls.container);
    this.tipsContainer = createElement('div', this.cls.tips);
    this.slider.innerHTML = '<div class="rs-bg"></div>';
    this.selected = createElement('div', this.cls.selected);
    this.pointerL = createElement('div', this.cls.pointer, ['dir', 'left']);
    this.scale = createElement('div', this.cls.scale);

    if (this.conf.tooltip) {
      this.tipL = createElement('div', this.cls.tip);
      this.tipR = createElement('div', this.cls.tip);
      this.tipsContainer.appendChild(this.tipL);
    }
    this.slider.appendChild(this.selected);
    this.slider.appendChild(this.scale);
    this.slider.appendChild(this.pointerL);

    if (this.conf.range) {
      this.pointerR = createElement('div', this.cls.pointer, ['dir', 'right']);
      if (this.conf.tooltip)
        this.tipsContainer.appendChild(this.tipR);
      this.slider.appendChild(this.pointerR);
    }

    this.input.parentNode.insertBefore(this.slider, this.input.nextSibling);

    if (this.conf.width)
      this.slider.style.width = parseInt(this.conf.width) + 'px';
    this.sliderLeft = this.slider.getBoundingClientRect().left;
    this.sliderWidth = this.slider.clientWidth;
    this.pointerWidth = this.pointerL.clientWidth;

    if (!this.conf.scale)
      this.slider.classList.add(this.cls.noscale);

    this.slider.insertAdjacentElement('afterbegin', this.tipsContainer);

    return this.setInitialValues();
  }
  setInitialValues() {
    this.disabled(this.conf.disabled);

    if (this.valRange)
      this.conf.values = prepareArrayValues(this.conf);

    this.values.start = 0;
    this.values.end = this.conf.range ? this.conf.values.length - 1 : 0;

    if (this.conf.set && this.conf.set.length && checkInitial(this.conf)) {
      const vals = this.conf.set;

      if (this.conf.range) {
        this.values.start = this.conf.values.indexOf(vals[0]);
        this.values.end = this.conf.set[1] ? this.conf.values.indexOf(vals[1]) : null;
      }
      else
        this.values.end = this.conf.values.indexOf(vals[0]);
    }
    return this.createScale();
  }
  createScale(resize) {
    this.step = this.sliderWidth / (this.conf.values.length - 1);

    for (let i = 0, iLen = this.conf.values.length; i < iLen; i++) {
      const span = createElement('span'), ins = createElement('ins');

      span.appendChild(ins);
      this.scale.appendChild(span);

      span.style.width = i === iLen - 1 ? 0 : this.step + 'px';

      if (!this.conf.labels) {
        if (i === 0 || i === iLen - 1)
          ins.innerHTML = this.conf.values[i];
      }
      else
        ins.innerHTML = this.conf.values[i];

      ins.style.marginLeft = (ins.clientWidth / 2) * -1 + 'px';
    }
    return this.addEvents();
  }
  updateScale() {
    this.step = this.sliderWidth / (this.conf.values.length - 1);

    const pieces = this.slider.querySelectorAll('span');

    for (let i = 0, iLen = pieces.length; i < iLen; i++)
      pieces[i].style.width = this.step + 'px';

    return this.setValues();
  }
  addEvents() {
    const pointers = this.slider.querySelectorAll('.' + this.cls.pointer), pieces = this.slider.querySelectorAll('span');

    createEvents(document, 'mousemove touchmove', this.move.bind(this));
    createEvents(document, 'mouseup touchend touchcancel', this.drop.bind(this));

    for (let i = 0, iLen = pointers.length; i < iLen; i++)
      createEvents(pointers[i], 'mousedown passive', this.drag.bind(this));

    for (let i = 0, iLen = pieces.length; i < iLen; i++)
      createEvents(pieces[i], 'click', this.onClickPiece.bind(this));

    window.addEventListener('resize', this.onResize.bind(this));

    return this.setValues();
  }
  drag(e) {
    e.preventDefault();

    if (this.conf.disabled)
      return;

    const dir = e.target.getAttribute('data-dir');
    if (dir === 'left')
      this.activePointer = this.pointerL;
    if (dir === 'right')
      this.activePointer = this.pointerR;

    return this.slider.classList.add('sliding');
  }
  move(e) {
    if (this.activePointer && !this.conf.disabled) {
      const coordX = e.type === 'touchmove' ? e.touches[0].clientX : e.pageX;
      let index = coordX - this.sliderLeft - (this.pointerWidth / 2);

      index = Math.round(index / this.step);

      if (index <= 0)
        index = 0;
      if (index > this.conf.values.length - 1)
        index = this.conf.values.length - 1;

      if (this.conf.range) {
        if (this.activePointer === this.pointerL)
          this.values.start = index;
        if (this.activePointer === this.pointerR)
          this.values.end = index;
      }
      else
        this.values.end = index;

      return this.setValues();
    }
  }
  drop() {
    this.activePointer = null;
  }
  setValues(start, end) {
    const activePointer = this.conf.range ? 'start' : 'end';

    if (start && this.conf.values.indexOf(start) > -1)
      this.values[activePointer] = this.conf.values.indexOf(start);

    if (end && this.conf.values.indexOf(end) > -1)
      this.values.end = this.conf.values.indexOf(end);

    if (this.conf.range && this.values.start > this.values.end)
      this.values.start = this.values.end;

    this.pointerL.style.left = (this.values[activePointer] * this.step - (this.pointerWidth / 2)) + 'px';

    if (this.conf.range) {
      if (this.conf.tooltip) {
        this.tipL.innerHTML = 'от ' + this.conf.values[this.values.start];
        this.tipR.innerHTML = 'до ' + this.conf.values[this.values.end];
      }
      this.input.value = this.conf.values[this.values.start] + ',' + this.conf.values[this.values.end];
      this.pointerR.style.left = (this.values.end * this.step - (this.pointerWidth / 2)) + 'px';
    }
    else {
      if (this.conf.tooltip)
        this.tipL.innerHTML = 'от ' + this.conf.values[this.values.end];
      this.input.value = this.conf.values[this.values.end];
    }

    if (this.values.end > this.conf.values.length - 1)
      this.values.end = this.conf.values.length - 1;
    if (this.values.start < 0)
      this.values.start = 0;

    this.selected.style.width = (this.values.end - this.values.start) * this.step + 'px';
    this.selected.style.left = this.values.start * this.step + 'px';

    return this.onChange();
  }
  onClickPiece(e) {
    if (this.conf.disabled)
      return;

    let idx = Math.round((e.clientX - this.sliderLeft) / this.step);

    if (idx > this.conf.values.length - 1)
      idx = this.conf.values.length - 1;
    if (idx < 0)
      idx = 0;

    if (this.conf.range) {
      if (idx - this.values.start <= this.values.end - idx) {
        this.values.start = idx;
      }
      else
        this.values.end = idx;
    }
    else
      this.values.end = idx;

    this.slider.classList.remove('sliding');

    return this.setValues();
  }
  onChange() {
    const _this = this;

    if (this.timeout)
      clearTimeout(this.timeout);

    this.timeout = setTimeout(function () {
      if (_this.conf.onChange && typeof _this.conf.onChange === 'function') {
        return _this.conf.onChange(_this.input.value);
      }
    }, 500);
  }
  onResize() {
    this.sliderLeft = this.slider.getBoundingClientRect().left;
    this.sliderWidth = this.slider.clientWidth;
    return this.updateScale();
  }
  disabled(disabled) {
    this.conf.disabled = disabled;
    this.slider.classList[disabled ? 'add' : 'remove']('disabled');
  }
  getValue() {
    return this.input.value;
  }
  destroy() {
    this.input.style.display = this.inputDisplay;
    this.slider.remove();
  }
}

export { rSlider };
