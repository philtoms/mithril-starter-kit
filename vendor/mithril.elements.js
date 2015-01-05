/*
 * Mithril.Elements
 * Copyright (c) 2014 Phil Toms (@PhilToms3).
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';
var m = (function app(window, mithril) {

  var OBJECT = '[object Object]', ARRAY = '[object Array]', STRING = '[object String]', FUNCTION = "[object Function]";
  var type = {}.toString;

  // save the mithril API
  mithril = mithril || require('mithril');
  var redraw = mithril.redraw;
  var strategy = redraw.strategy;

  function merge(obj1,obj2,filter){
    var classAttrName = 'class' in obj1 ? 'class' : 'className';
    var classes = obj1[classAttrName]|| '';
    Object.keys(obj2).forEach(function(k){
      if (k.indexOf('class')>=0){
        classes += ' ' + obj2[k];
      } else if ((filter||' ').indexOf(k)<0) {
        obj1[k] = obj2[k];
      }
    }); 
    if (classes && classes.trim()) {
      obj1[classAttrName]=classes.trim();
    }
    return obj1;
  }

  mithril.redraw = function(force) { 
    // key into mithril page lifecycle
    if (strategy()==='all'){ 
      controllers={}; 
    } 
    lastId=0;
    return redraw(force); 
  }; 

  mithril.redraw.strategy = strategy;

  var elements = {}, controllers={},lastId=0;
  var m = function(module, attrs, children) { 
    var tag = module.tag || module;
    var args = [tag].concat([].slice.call(arguments,1));
    var cell = mithril.apply(null,args);
    var element = elements[cell.tag];
    // pass through if not registered or escaped
    if (element && tag[0]!=='$') {
      var hasAttrs = attrs != null && type.call(attrs) === OBJECT && !("tag" in attrs) && !("subtree" in attrs);
      if (!hasAttrs && !children){
        children=attrs;
      }
      attrs = merge(module.attrs || {}, cell.attrs);
      var state = hasAttrs && attrs.state;
      var id = module.id || (state && state.id!==undefined? state.id : (attrs.key!==undefined? attrs.key : (attrs.id!==undefined? attrs.id :undefined)));
      id = cell.tag + (id===undefined? lastId++ : id);
      // once-only element initialization. But note:
      //  module.id - singleton
      //  controllers[id] - cached
      //  default - new instance
      var ctrl = (module.id && module) || controllers[id] || new element.controller(state);
      controllers[id]=ctrl;
      var inner = cell.children.length==1? cell.children[0]:cell.children;
      var c_cell = element.view(ctrl, inner);
      if (c_cell){
        cell=c_cell;
        if (type.call(cell) !== ARRAY) {
          merge(cell.attrs,attrs,'state');
        }
      }
    }
    // tidy up tag
    if (cell.tag && cell.tag[0]==='$'){
      cell.tag=cell.tag.substr(1);
    }
    return cell;
  };

  function DefaultController(state){
    this.state = state;
  }
  
  var sId=0;
  m.element = function(root, module){
    if (type.call(root) !== STRING) throw new Error('selector m.element(selector, module) should be a string');

    // all elements have controllers
    module.controller = module.controller || DefaultController;

    // add a programmable interface to the element
    module.instance = function(state){
      var ctrl = new module.controller(state);
      ctrl.tag = root;
      ctrl.id = '$ctrl_' + root + sId++;
      return ctrl;
    }

    // nothing more to do here, element initialization is lazily
    // deferred to first redraw
    return (elements[root] = module);
  };

  // build the new API
  return merge(m,mithril);

})(typeof window != "undefined" ? window : {},m);

if (typeof module != "undefined" && module !== null && module.exports) module.exports = m;
else if (typeof define == "function" && define.amd) define(function() {return m});