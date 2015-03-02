'use strict';

var dropdown = require('../bootstrap.elements').dropdown;

var component = function(options) {
  options=options||{};
  return {
    controller: function() {
      this.action = function(){
        var fn = arguments[0];
        var args = [].slice.call(arguments,1);
        return function(e){
          setTimeout(function(){fn.apply(null,args);},100);
          m.redraw.strategy('none');
        };
      };
    },

    view: function(ctrl) {
      return [
        m(dropdown(options), [{
          title: 'Dropdown',
          body:[
            m('.item', 'item one'),
            m('.item', 'item two'),
            m('.item', 'item three'),
            m('.item', {onclick:ctrl.action(window.alert,'item 4 clicked')}, 'item four')
          ]
        }])
      ];
    }
  };
};

component.view = component().view;
component.controller = component().controller;

module.exports = component;