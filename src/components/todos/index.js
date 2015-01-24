
'use strict';
/*global m */

// todo modules
var app = require('./app');
var model = require('./model');

require('./header');
require('./new-task');
require('./list-of-tasks');
require('./task');
require('./footer');

module.exports = me.element('todos-demo', {
  controller: function(){

    // Todo collection
    app.todos = new model.Todos();
    
  	// Todo list filter
  	app.filter = m.prop(m.route.param('filter') || '');
    
  }, 
  view: function(){
    return m('#todoapp',[
    	me('header',[
    		me('new-task')
    	]),
  		me('list-of-tasks', [
  			me('$task')
  		]),
    	me('footer')
    ]);
	}
});
