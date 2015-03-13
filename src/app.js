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
require('./components/bootstrap.elements')();

// tab routes
var ACCORDION1 = 0;
var ACCORDION2 = 1;
var MODAL = 2;
var TODOS = 3;
var XP = 4;

m.element('todos-page', require('./components/todos'));
m.element('accordion-page', require('./components/demos/accordion'));
m.element('modal-page', require('./components/demos/modal'));
m.element('experimental-page', require('./components/experimental/todosX'));

var app = function(tabNumber){
  return {    
    view: function(ctrl) {
      return [
        m('jumbotron',[
          m('h1','Mithril Starter Kit'),
          m('h3','with Mithril.Elements v0.1.1')
        ]),
        m('h2.text-center', 'Click on any of the tab pills below'),
        m('h4.text-center','to reveal some custom elements in action'),
        m('tabset', {state:{active:tabNumber, style:'pills'}}, 
          // provide routng to the tabs to engage route history
          [
            m('tab[href="/accordion-1"]', ['Accordion 1', m('accordion-page')]),
            m('tab[href="/accordion-2"]', ['Accordion 2', m('accordion-page')]),
            m('tab[href="/modal"]',       ['Modal dialog', m('modal-page')]),
            m('tab[href="/todos"]', {state:{redrawIfVisible:false}}, ['Todo List', m('todos-page')]),
            m('tab[href="/todos-xp"]', {state:{redrawIfVisible:false}} , ['Experimental', m('experimental-page')])
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
  '/todos-xp/:filter': app(XP)
});