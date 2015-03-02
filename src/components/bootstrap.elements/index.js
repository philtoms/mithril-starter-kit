'use strict';

var uiState = {
  isOpen: function(ctrlId,id){
    var isOpen = ctrlId === uiState.ctrlId && id === uiState.itemId;
    if (isOpen){
      setTimeout(function(){document.addEventListener('click', uiState.clear);});
    }
    return {style:'display:'+(isOpen? 'block':'none')};
  },
  clear:function(){
   uiState.ctrlId = undefined;
   document.removeEventListener('click', uiState.clear);
   m.redraw();
  },
  scrollbarWidth: (function () {
    var scrollbarWidth;
    return function(){
      if (scrollbarWidth===undefined){
        var scrollDiv = document.createElement('div');
        scrollDiv.className = 'modal-scrollbar-measure';
        document.body.appendChild(scrollDiv);
        scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
      }
      return scrollbarWidth;    
    };
  })()
};

var registerId = 0;
var parents = [];
function register(inner,id){
  parents.unshift(id);
  inner = inner();
  parents.shift();
  return inner;
}

var accordion = function(options) {
  return {
    controller: function() {
      options = options || {};
      var open=[];
      this.toggle = function(id){
        if (options.toggle){
          open[id]=!open[id];
        }
        else {
          open = id;
        }
      };
      this.isOpen = function(id){
        return id === open || options.toggle && open[id];
      };
    },

    view: function(ctrl) {
      return m('.accordian.panel.panel-default', ctrl.inner.map(function(line,id){
        var title=line.children[0],content=line.children[1];
        return [
          m('.panel-heading',{
            onclick:ctrl.toggle.bind(ctrl,id)
          },
          m('.panel-title',title)),
          m('div.panel-body',{style:'display:'+(ctrl.isOpen(id)? 'block':'none')},content)
        ];
      }));
    }
  };
};
accordion.view = accordion().view;
accordion.controller = accordion().controller;

var dropdown = function(options) {
  return {
    controller: function(){
      this.parent = parents[0];
      this.id = ++registerId;
      this.toggle = function(e){
        var open = this.id===uiState.ctrlId;
        uiState.ctrlId = open? undefined:this.id;
        if (open) e.target.blur();
      }.bind(this);
    },

    view: function(ctrl) {
      return m('.dropdown', [
        m('button.btn.btn-default.dropdown-toggle', {type:'button',onclick:ctrl.toggle}, [ctrl.inner.title, m('span.caret')]),
        m('ul.dropdown-menu[role="menu" aria-labelledby="dLabel"]',uiState.isOpen(ctrl.id),ctrl.inner.body.map(function(menu){
          return m('li', menu);
        }))
      ]);
    }
  };
};

var jumbotron = function(options) {
  return {
    view: function(ctrl) {
      return m('.jumbotron',[
        m('.container',[
          ctrl.inner
        ])
      ]);
    }
  };
};
jumbotron.view = jumbotron().view;

var modal = function(options) {

  return {
    controller: function() {
      var open, backdrop, saveBodyClass='';
      function close(e){
        open = false;
        options.trigger(false);
        document.body.className=saveBodyClass;
        if (e) m.redraw();
      }
      this.close = {onclick:function(){close();}};
      this.state = options.trigger;
      this.bind = function(element){
        if (!open && options.trigger()){
          open=element;
          saveBodyClass = document.body.className;
          document.body.className += ' modal-open';
          backdrop = element.getElementsByClassName('modal-backdrop')[0];
          backdrop.setAttribute('style', 'height:'+document.documentElement.clientHeight+'px');
          backdrop.addEventListener('click', close);
        }
      };
    },

    view: function(ctrl) {
      var isOpen = ctrl.state();
      return m((isOpen? '.is-open':'.modal.fade'), {config:ctrl.bind}, [
        (isOpen? m('.modal-backdrop.fade.in'):''),
        m('.modal-dialog', [
          m('.modal-content', [
            m('.modal-header', [
              m('button.close[type="button" data-dismiss="modal" aria-label="Close"]',
                m('span[aria-hidden=true]', ctrl.close, m.trust('&times;'))),
              m('h4.modal-title', ctrl.inner.title)
            ]),
            m('.modal-body', ctrl.inner.body),
            m('.modal-footer', [
              m('button.btn.btn-default[type="button" data-dismiss="modal"]', ctrl.close, ctrl.inner.cancel || 'Close'),
              ctrl.inner.ok? m('button.btn.btn-primary[type="button"]', ctrl.close, ctrl.inner.ok):''
            ])
          ])
        ])
      ]);
    }
  };
};

// tabset based on bootstrap navs markup.
// Options = 
//  active: current (default) tab
//  style: 'tabs' | 'pills'

var tabset = function(options) {
  options = options ||{};
  return {
    controller: function(){
      var currentTab = options && options.active;
      this.count = 0;
      this.tabs = [];
      this.content = [];

      this.style=options.style || 'tabs';

      this.select = function(tabIdx){
        currentTab = tabIdx;
      };

      this.active = function(tabIdx) {
        return tabIdx===currentTab? 'active':'';
      };

      this.display = function(tabIdx) {
        return {display: (tabIdx===currentTab? 'block':'none')};
      };
    },

    view: function(ctrl) {
      return m('.tabset',[
        m('ul.nav.nav-'+ctrl.style, ctrl.tabs),
        m('div',ctrl.content)
      ]);
    }
  };
};

tabset.tab = function(tabOptions){
  tabOptions = tabOptions || {};
  return {
    controller: function(tabset) {
      this.tabIdx=tabset.count++;
      this.tabset = tabset;
    },
    
    view: function(ctrl) {
      var ctx = ctrl.tabset,
          tabs = ctx.tabs,
          content = ctx.content,
          tabName=ctrl.inner[0], 
          tabContent=ctrl.inner[1],
          href = ctrl.attrs.href? {config: m.route,href:ctrl.attrs.href}:{href:'#'};

      var style = ctx.display(ctrl.tabIdx);
      tabs[ctrl.tabIdx] = m('li.tab', {onclick:ctx.select.bind(ctx, ctrl.tabIdx),class:ctx.active(ctrl.tabIdx)}, m('a', href, tabName));
      if (tabOptions.redrawIfVisible!==false || style.display!='none'){
        content[ctrl.tabIdx] = m('.tabcontent', {style:style}, tabContent);
      }
    }
  };
};
tabset.tab.controller = tabset.tab().controller;
tabset.tab.view = tabset.tab().view;

module.exports = {
  accordion:accordion,
  dropdown: dropdown,
  jumbotron:jumbotron,
  modal:modal,
  tabset:tabset
};