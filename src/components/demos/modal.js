'use strict';

var modal = require('../bootstrap.elements').modal;

var component = function(options) {
  return {
    controller: function() {
      // provide a boolean trigger for the dialog to
      // read open / closed state
      this.trigger = m.prop(false);

      this.save = function(){
        setTimeout(function(){window.alert('saved');},100);
      };
    },

    view: function(ctrl) {
    	return [
        m('button.btn.btn-primary.btn-lg[type="button"]', {onclick:ctrl.trigger.bind(ctrl,true)}, 'Launch demo modal'),
        m(modal({trigger:ctrl.trigger}), [{
          title:'A Modal Title',
          body: ['Another fine example...',
            m('p',' of a work in progress')
          ],
          cancel: 'Cancel',
          ok: m('.save', {onclick:ctrl.save.bind(ctrl)}, 'Save Changes')
        }]
      )];
    }
  };
};

component.view = component().view;
component.controller = component().controller;

module.exports = component;