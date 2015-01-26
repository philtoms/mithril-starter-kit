/*
 * Mithril.Elements Starter Kit
 * Copyright (c) 2014 Phil Toms (@PhilToms3).
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

// global mithril.elements (alternatively, local require in each module)
window.m = require('mithril');
window.me = require('mithril.elements');

// experimental - will probably be npm'd in next version
require('./components/mithril.bootstrap');//.init({
  //animate:require('melimate')
//});

// tab routes
var ACCORDION1 = 0;
var ACCORDION2 = 1;
var MODAL = 2;
var TODOS = 3;
var XP = 4;

// initialize the pages as singletons
var accordion1  = require('./components/demos/accordion').instance({animate:true});
var accordion2  = require('./components/demos/accordion').instance({toggle:true});
var modal       = require('./components/demos/modal').instance();

var app = function(tabNumber){
  return {
    controller: function() {
      this.todos       = require('./components/todos').instance();
      this.experimental= require('./components/experimental/todosX').instance();
    },
    
    view: function(ctrl) {
      return [
        m('jumbotron',[
          m('h1','Mithril Starter Kit'),
          m('h3','using Mithril custom tags')
        ]),
        m('h2.text-center', 'Click on any of the tab pills below'),
        m('h4.text-center','to reveal some custom elements in action'),
        m('tabset', {active:tabNumber, style:'pills'}, 
          // provide routng to the tabs to engage route history
          [
            m('tab', {href:'/accordion-1'}, ['Accordion 1', me(accordion1)]),
            m('tab', {href:'/accordion-2'}, ['Accordion 2', me(accordion2)]),
            m('tab', {href:'/modal'},       ['Modal dialog', me(modal)]),
            m('tab', {href:'/todos'},       ['Todo List', me(ctrl.todos)]),
            m('tab', {href:'/todos-xp'},    ['Experimental', me(ctrl.experimental)])
          ]
        )
      ];
    }
  };
};

m.route(document.getElementById('app'), '/', {
  '/': app(),
  '/accordion-1': app(ACCORDION1),
  '/accordion-2': app(ACCORDION2),
  '/modal': app(MODAL),
  '/todos': app(TODOS),
  '/todos/:filter': app(TODOS),
  '/todos-xp': app(XP),
  '/todos-xp/:filter': app(XP),
  '/...' : {controller:function(){
    location.href='./404.html';
  }}
});
