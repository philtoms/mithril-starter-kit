'use strict';

module.exports = m.element('modal-demo', {
  controller: function() {
    this.trigger = m.prop();
  },
  view: function(ctrl, content) {
  	return [
      m('button.btn.btn-primary.btn-lg[type="button"]', {onclick:ctrl.trigger.bind(ctrl,true)}, 'Launch demo modal'),
      m('modal', {state:{trigger:ctrl.trigger}}, function(){ return {
        title:'A Modal Title',
        body: ['Another fine example...',
          m('p',' of a work in progress')
        ]
      };
    })];
  }
});