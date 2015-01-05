/*
 * Mithril.Elements Starter Kit
 * Copyright (c) 2014 Phil Toms (@PhilToms3).
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

// global mithril.elements (alternatively, local require in each module)
window.m = require('mithril.elements');

// experimental - will probably be npm'd in next version
require('./components/mithril.bootstrap');

// tab routes
var ACCORDION1 = 0;
var ACCORDION2 = 1;
var MODAL = 2;
var TODOS = 3;
var XP = 4;

var app = function(tabNumber){
  return {
    controller: function() {
      // initialize the pages as singletons
      this.todos       = require('./components/todos').instance();
      this.accordion1  = require('./components/demos/accordion').instance();
      this.accordion2  = require('./components/demos/accordion').instance({toggle:true});
      this.modal       = require('./components/demos/modal').instance();
      this.experimental= require('./components/experimental/todosX').instance();
    },
    
    view: function(ctrl) {
      return [
        m('jumbotron',[
          m('h1','Mithril Starter Kit'),
          m('h3','with Mithrel.Elements v0.1.0')
        ]),
        m('h2.text-center', 'Click on any of the tab pills below'),
        m('h4.text-center','to reveal some custom elements in action'),
        m('tabset', {state:{active:tabNumber, style:'pills'}}, 
          // provide routng to the tabs to engage route history
          function(){ return [
            m('tab', {state:{href:'/accordion-1'}}, ['Accordion 1', m(ctrl.accordion1)]),
            m('tab', {state:{href:'/accordion-2'}}, ['Accordion 2', m(ctrl.accordion2)]),
            m('tab', {state:{href:'/modal'}},       ['Modal dialog', m(ctrl.modal)]),
            m('tab', {state:{href:'/todos'}},       ['Todo List', m(ctrl.todos)]),
            m('tab', {state:{href:'/todos-xp'}},    ['Experimental', m(ctrl.experimental)])
          ];
        })
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
  '/todos-xp/:filter': app(XP)
});
