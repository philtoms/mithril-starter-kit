
'use strict';
/*global m */

// todo modules
var app = require('./app');
var model = require('./model');

m.element('header',require('./header'));
m.element('newTask', require('./new-task'));
m.element('listOfTasks', require('./list-of-tasks'));
m.element('task', require('./task'));
m.element('footer', require('./footer'));

module.exports = {
  controller: function(){

    // Todo collection
    app.todos = new model.Todos();
    
  	// Todo list filter
  	app.filter = m.prop(m.route.param('filter') || '');
    
  }, 
  view: function(){
    return m('#todoapp',{key:'todos'},[
    	m('header',[
    		m('newTask')
    	]),
  		m('listOfTasks', [
  			'task'
  		]),
    	m('footer')
    ]);
	}
};
