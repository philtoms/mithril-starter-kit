
'use strict';
/*global m */

// todo modules
var app = require('./app');
var model = require('./model');

var header = require('./header');
var newTask = require('./new-task');
var listOfTasks = require('./list-of-tasks');
var task = require('./task');
var footer = require('./footer');

module.exports = {
  controller: function(){

    // Todo collection
    app.todos = new model.Todos();
    
  	// Todo list filter
  	app.filter = m.prop(m.route.param('filter') || '');
    
  }, 
  view: function(){
    return m('#todoapp',{key:'todos'},[
    	m(header,[
    		m(newTask)
    	]),
  		m(listOfTasks, [
  			task
  		]),
    	m(footer)
    ]);
	}
};
