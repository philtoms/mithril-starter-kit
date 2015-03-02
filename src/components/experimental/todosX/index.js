'use strict';

// todo modules
var app = require('./app');
var model = require('./model');
var item = require('./item');
var footer = require('./footer');

// mithril.elements
var scroller = require('../occlusionScroller');

module.exports = {

  controller: function() {

    this.title = m.prop('');        // Temp title placeholder
    this.filter = m.prop(m.route.param('filter') || '');       // TodoList filter
    this.completeAll = model.completeAll;
    this.allCompleted = model.allCompleted;
    this.clearCompleted = model.clearCompleted;

    // Add a Todo 
    this.add = function(title) {
      if(this.title()) {
        model.add(title());
        this.title('');
      }
    };

    //check whether a todo is visible
    this.isVisible = function(filter,todo) {
      if(filter === '')
        return true;
      if (filter === 'active')
        return !todo.completed();
      if (filter === 'completed')
        return todo.completed();
    }.bind(this,this.filter());
    
    this.clearTitle = function() {
      this.title('');
    };

    // Total amount of Todos completed
    this.amountCompleted = function() {
      var amount = 0;
      for(var i = 0, len=list.length; i < len; i++)
        if(list[i].completed())
          amount++;

      return amount;
    };

    // Todo collection - lazily filtered
    var list = [], filtered=[]; 
    app.todoCount = -1;
    this.list = function(){
      list = model.TodoList(); 
      if (app.todoCount !== list.length) {
        app.todoCount = list.length;
        filtered = list.filter(this.isVisible);
      }
      return filtered;
    }.bind(this);
  },

  view: function(ctrl) {
    return m('section#todoapp.exp',[
      m('header#header', [
        m('h1', 'too many todos'),
        m('input#new-todo[placeholder="What needs to be done?"]', { 
          onkeypress: app.watchInput(
            m.withAttr('value', ctrl.title),
            ctrl.add.bind(ctrl, ctrl.title),
            ctrl.clearTitle.bind(ctrl)
          ),
          value: ctrl.title()
        })
      ]),
      m('section#main', [
        m('input#toggle-all[type=checkbox]',{
            onclick: ctrl.completeAll,
            checked: ctrl.allCompleted()
        }),
        m(scroller({items:ctrl.list,page:6}), {id:'todo-list'},[
          item
        ])
      ]),
      app.todoCount === 0 ? '' : footer(ctrl)
    ]);
  }
};
