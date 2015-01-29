
'use strict';

var app = require('./app');

module.exports = {
  controller:function(){
    var task = this.attrs.task;

    this.classes = function(){
			var classes = '';
			classes += task.completed() ? 'completed' : '';
			classes += task.editing() ? ' editing' : '';
			return classes;
    };

    var previousTitle;    
    this.title = task.title;
    this.completed = task.completed.bind(task);
  	this.remove = task.remove.bind(task);
    this.editing = task.editing.bind(task);
    
  	this.edit = function () {
  		previousTitle = task.title();
  		task.editing(true);
  	};
  
    this.complete = function() {
      var state = !task.completed();
      task.completed(state);
    };
    
    this.doneEditing = function () {
  		task.editing(false);
  	};

  	this.cancelEditing = function () {
  		task.title(previousTitle);
  		task.editing(false);
  	};

  },
  view: function(ctrl){
    return m('li', { class: ctrl.classes()}, [
		  m('.view', [
  			m('input.toggle[type=checkbox]', {
  				onclick: m.withAttr('checked', ctrl.complete),
  				checked: ctrl.completed()
  			}),
  			m('label', {
  				ondblclick: ctrl.edit
  			}, ctrl.title()),
  			m('button.destroy', {
  				onclick: ctrl.remove
  			})
  		]), 
  		m('input.edit', {
  			value: ctrl.title(),
  			onkeyup: app.watchInput(ctrl.doneEditing, ctrl.cancelEditing),
  			oninput: m.withAttr('value', ctrl.title),
  			config: function (element) {
  				if (ctrl.editing()) {
  					element.focus();
  				}
  			},
  			onblur: ctrl.doneEditing
  		})
    ]);
  }
};

