const createElement = function (el, cls, dataAttr) {
  const element = document.createElement(el);
  if (cls) element.className = cls;
  if (dataAttr && dataAttr.length === 2)
    element.setAttribute('data-' + dataAttr[0], dataAttr[1]);

  return element;
},
  createEvents = function (el, ev, callback) {
    const events = ev.split(' ');

    for (let i = 0, iLen = events.length; i < iLen; i++)
      el.addEventListener(events[i], callback);
  },

  prepareArrayValues = function (conf) {
    const values = [],
      range = conf.values.max - conf.values.min;

    if (!conf.step) {
      console.log('No step defined...');
      return [conf.values.min, conf.values.max];
    }

    for (let i = 0, iLen = (range / conf.step); i < iLen; i++)
      values.push(conf.values.min + i * conf.step);

    if (values.indexOf(conf.values.max) < 0) values.push(conf.values.max);

    return values;
  },

  checkInitial = function (conf) {
    if (!conf.set || conf.set.length < 1) return null;
    if (conf.values.indexOf(conf.set[0]) < 0) return null;

    if (conf.range) {
      if (conf.set.length < 2 || conf.values.indexOf(conf.set[1]) < 0) return null;
    }
    return true;
  };

export { createElement, createEvents, prepareArrayValues, checkInitial };
