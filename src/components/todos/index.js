
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

module.exports = m.element('todos-demo', {
  controller: function(){

    // Todo collection
    app.todos = new model.Todos();
    
  	// Todo list filter
  	app.filter = m.prop(m.route.param('filter') || '');
    
  }, 
  view: function(){
    return m('#todoapp',[
    	m('header',[
    		m('new-task')
    	]),
  		m('list-of-tasks', [
  			m('$task')
  		]),
    	m('footer')
    ]);
	}
});
