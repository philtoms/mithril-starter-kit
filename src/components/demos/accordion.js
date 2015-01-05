'use strict';

module.exports = m.element('accordion-demo', {
	controller: function(options) {
		this.options=options||{};
	},
  view: function(ctrl, content) {
  	return [
	  	m('h3', ctrl.options.toggle? 'Accordion with toggle state':'Single item accordion'),
	  	m('accordion', {state:ctrl.options}, [
	      m('.item', ['Title 1','item line one']),
	      m('.item', ['Title 2','item line two']),
	      m('.item', ['Title 3','item line three']),
	      m('.item', ['Title 4','item line four'])
	    ])
	  ];
	}
});