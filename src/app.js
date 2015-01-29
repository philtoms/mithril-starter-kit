/*
 * Mithril.Elements Starter Kit
 * Copyright (c) 2014 Phil Toms (@PhilToms3).
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

window.m = require('./mithril');

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

require('./components/demos/accordion');
require('./components/demos/accordion');
require('./components/demos/modal');
require('./components/todos');
require('./components/experimental/todosX');

var app = function(tabNumber){
  return {
    controller: function() {
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
            m('tab', {href:'/accordion-1'}, ['Accordion 1', m('accordion-demo',{animate:true})]),
            m('tab', {href:'/accordion-2'}, ['Accordion 2', m('accordion-demo',{toggle:true})]),
            m('tab', {href:'/modal'},       ['Modal dialog', m('modal-demo')]),
            m('tab', {href:'/todos'},       ['Todo List', m('todos-demo')]),
            m('tab', {href:'/todos-xp'},    ['Experimental', m('todosX-demo')])
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
