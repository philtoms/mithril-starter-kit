'use strict';

var app = require('./app');

module.exports = me.element('todosX-item',{

  controller: function(task) {

    var state = {
      editing: false,
      task: task,
      setClass: function() {
        var cls = '' + (task.completed() ? 'completed ' : '') + (state.editing ? 'editing': '');
        return cls? { class: cls}:'';
      },

      setEdit: function() {
        state.editing=task.title();
      },

      update: function() {
        state.editing=false;
      },

      remove: function() {
        task.remove();
        m.redraw.strategy('all');
      },

      reset: function() {
        task.title(state.editing);
        state.editing=false;
      }
    };

    return state;
  },

  view: function(ctrl) {
    var task = ctrl.task;
    return m('li', ctrl.setClass(), [
      m('.view', [
        m('input.toggle[type=checkbox]', {
          onclick: m.withAttr('checked', task.completed),
          checked: task.completed()
        }),
        m('label', {ondblclick:ctrl.setEdit}, task.title()),
        m('button.destroy', { onclick: ctrl.remove})
      ]),
      m('input.edit', {
        value:task.title(),
        onkeyup: app.watchInput(
          m.withAttr('value', task.title),
          ctrl.update,
          ctrl.reset  
        ),
        onblur: ctrl.update,
        config: function (element) {
          if (ctrl.editing){
            element.focus();
          }
        }
      })
    ]);
  }
});
