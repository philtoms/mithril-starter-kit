'use strict';

module.exports = {
	view: function(ctrl) {
  	return [
	  	m('h3', ctrl.state.toggle? 'Accordion with toggle state':'Single item accordion'),
	  	m('accordion', {state:ctrl.state}, [
	      m('.item', ['Title 1','item line one']),
	      m('.item', ['Title 2','item line two']),
	      m('.item', ['Title 3','item line three']),
	      m('.item', ['Title 4','item line four'])
	    ])
	  ];
	}
};
