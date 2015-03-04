/*
 * Mithril.Elements Starter Kit
 * Copyright (c) 2014 Phil Toms (@PhilToms3).
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

// global mithril (alternatively, local require in each module)
//window.m = require('mithril.elements');
window.m = require('./mithril');

// experimental - will probably be npm'd in next version
var bs = require('./components/bootstrap.elements');

// tab routes
var DROPDOWNS = 0;
var ACCORDION1 = 1;
var ACCORDION2 = 2;
var MODAL = 3;
var TODOS = 4;
var XP = 5;

var accordion   = require('./components/demos/accordion');
var accordion2  = require('./components/demos/accordion');
var modal       = require('./components/demos/modal');
var dropdowns   = require('./components/demos/dropdown');
var todos       = require('./components/todos');
var experimental= require('./components/experimental/todosX');

var app = function(tabNumber){

  // localise element ns
  var jumbotron = bs.jumbotron,
      tabset = bs.tabset,
      tab = tabset.tab;

  return {
    view: function(ctrl) {
      return [
        m(jumbotron,[
          m('h1','Mithril Starter Kit'),
          m('h3','with custom elements')
        ]),
        m('h2.text-center', 'Click on any of the tab pills below'),
        m('h4.text-center','to reveal some custom elements in action'),
        m(tabset({active:tabNumber, style:'pills'}), [
          // provide routng to the tabs to engage route history
          m(tab, {href:'/dropdowns'},   ['Dropdowns', m(dropdowns)]),
          m(tab, {href:'/accordion-1'}, ['Accordion 1', m(accordion)]),
          m(tab, {href:'/accordion-2'}, ['Accordion 2', m(accordion({toggle:true}))]),
          m(tab, {href:'/modal'},       ['Modal dialog', m(modal)]),
          // thee exampls share Ids so make them exclusive
          m(tab({redrawIfVisible:false}), {href:'/todos'},       ['Todo List', m(todos)]),
          m(tab({redrawIfVisible:false}), {href:'/todos-xp'},    ['Experimental', m(experimental)])
        ])
      ];
    }
  };
};

m.route(document.getElementById('app'), '/', {
  '/': app(),
  '/dropdowns': app(DROPDOWNS),
  '/accordion-1': app(ACCORDION1),
  '/accordion-2': app(ACCORDION2),
  '/modal': app(MODAL),
  '/todos': app(TODOS),
  '/todos/:filter': app(TODOS),
  '/todos-xp': app(XP),
  '/todos-xp/:filter': app(XP)
});
