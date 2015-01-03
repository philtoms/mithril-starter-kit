
'use strict';

var app = require('./app');

module.exports = m.element('list-of-tasks',{
  controller:function(){
    this.completeAll = app.todos.completeAll;
    this.allCompleted = app.todos.allCompleted;
  },
  view: function(ctrl,template){
    return m('section#main', {
        style: {
          display: app.todos.list.length ? '' : 'none'
        }
      }, [
      m('input#toggle-all[type=checkbox]', {
        onclick: ctrl.completeAll,
        checked: ctrl.allCompleted()
      }),
      m('ul#todo-list', [
        app.todos.list.filter(app.isVisible).map(function (task) {
          return m(template,{id:task.id,state:task});
        })
      ])
    ]);
  }
});
