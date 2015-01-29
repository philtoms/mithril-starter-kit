
'use strict';
/*global m */

// todo modules
var app = require('./app');
var model = require('./model');

m.tags['td-header'] = require('./header');
m.tags['td-new-task'] = require('./new-task');
m.tags['td-list-of-tasks'] = require('./list-of-tasks');
m.tags['td-task'] = require('./task');
m.tags['td-footer'] = require('./footer');

m.tags['todos-demo'] = {
  controller: function(){

    // Todo collection
    app.todos = new model.Todos();
    
  	// Todo list filter
  	app.filter = m.prop(m.route.param('filter') || '');
    
  }, 
  view: function(){
    return m('#todoapp',[
    	m('td-header',[
    		m('td-new-task')
    	]),
  		m('td-list-of-tasks', [
  			m('td-task')
  		]),
    	m('td-footer')
    ]);
	}
};
