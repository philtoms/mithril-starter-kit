'use strict';

module.exports = m.element('accordion-demo', {
	controller: function() {},
  view: function(ctrl, content) {
  	return m('accordion', [
      m('.item', ['Title 1','item line one']),
      m('.item', ['Title 2','item line two']),
      m('.item', ['Title 3','item line three']),
      m('.item', ['Title 4','item line four'])
    ]);
  }
});