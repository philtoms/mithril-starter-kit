'use strict';

module.exports = me.element('modal-demo', {
  controller: function() {
    // provide a boolean trigger for the dialog to
    // read open / closed state
    this.trigger = m.prop(false);

    this.save = function(){
      setTimeout(function(){window.alert('saved');},100);
    };
  },
  view: function(ctrl, content) {
  	return [
      m('button.btn.btn-primary.btn-lg[type="button"]', {onclick:ctrl.trigger.bind(ctrl,true)}, 'Launch demo modal'),
      me('modal', {state:{trigger:ctrl.trigger}}, function(){ return {
        title:'A Modal Title',
        body: ['Another fine example...',
          m('p',' of a work in progress')
        ],
        cancel: 'Cancel',
        ok: m('.save', {onclick:ctrl.save.bind(ctrl)}, 'Save Changes')
      };
    })];
  }
});