
'use strict';

var app = require('./app');

module.exports = {

  controller:function(){
    
  	this.clearCompleted = app.todos.clearCompleted;
  	this.amountCompleted = app.todos.amountCompleted;

  },
  
  view: function(ctrl){
    if (app.todos.list.length===0){
      return '';
    }
  	var amountCompleted = ctrl.amountCompleted();
  	var amountActive = app.todos.list.length - amountCompleted;
  
  	return m('$footer#footer', [
  		m('span#todo-count', [
  			m('strong', amountActive), ' item' + (amountActive !== 1 ? 's' : '') + ' left'
  		]),
  		m('ul#filters', [
  			m('li', [
  				m('a[href=/todos]', {
  					config: m.route,
  					class: app.filter() === '' ? 'selected' : ''
  				}, 'All')
  			]),
  			m('li', [
  				m('a[href=/todos/active]', {
  					config: m.route,
  					class: app.filter() === 'active' ? 'selected' : ''
  				}, 'Active')
  			]),
  			m('li', [
  				m('a[href=/todos/completed]', {
  					config: m.route,
  					class: app.filter() === 'completed' ? 'selected' : ''
  				}, 'Completed')
  			])
  		]), amountCompleted === 0 ? '' : m('button#clear-completed', {
  			onclick: ctrl.clearCompleted
  		}, 'Clear completed (' + amountCompleted + ')')
  	]);
  }
};
