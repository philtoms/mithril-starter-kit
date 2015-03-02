'use strict';

var accordion = require('../bootstrap.elements').accordion;

// expose this element as a function and object
var component = function(options) {
  options=options||{};
	return {
		view: function(ctrl) {
	  	return [
		  	m('h3', options.toggle? 'Accordion with toggle state':'Single item accordion'),
		  	m(accordion(options), [
		      m('.item', ['Title 1','item line one']),
		      m('.item', ['Title 2','item line two']),
		      m('.item', ['Title 3','item line three']),
		      m('.item', ['Title 4','item line four'])
		    ])
		  ];
		}
	};
};

component.view = component().view;
component.controller = component().controller;

module.exports = component;