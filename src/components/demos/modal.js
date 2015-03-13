'use strict';

module.exports = {
  controller: function(state) {
    this.options = state;
    // provide a boolean trigger for the dialog to
    // read open / closed state
    state.trigger = m.prop(false);

    this.save = function(){
      setTimeout(function(){window.alert('saved');},100);
    };
  },

  view: function(ctrl) {
  	return [
      m('button.btn.btn-primary.btn-lg[type="button"]', {onclick:ctrl.options.trigger.bind(ctrl,true)}, 'Launch demo modal'),
      m('modal', {state:ctrl.options}, [{
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
