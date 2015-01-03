
'use strict';

var app = require('./app');

module.exports = m.element('new-task',{
  controller:function(){
    
  	// Temp title placeholder
	  this.title = m.prop('');

  	this.add = function () {
  		var title = this.title().trim();
  		if (title) {
  			app.todos.add(title);
  		}
  		this.title('');
  	};

  	this.clearTitle = function () {
  		this.title('');
  	};
  	
    this.editing=false;
  },
  view: function(ctrl){
    return m('input#new-todo[placeholder="What needs to be done?"]', {
			onkeyup: app.watchInput(ctrl.add.bind(ctrl),
				ctrl.clearTitle.bind(ctrl)),
			value: ctrl.title(),
			oninput: m.withAttr('value', ctrl.title),
			config:function(element){
			  if (!ctrl.editing){
			    ctrl.editing = true;
			    element.focus();
			  }
			}});
  }
});

