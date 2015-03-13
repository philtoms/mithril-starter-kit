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

var accordion = {
  controller: function(state) {
    var open=[];
    this.toggle = function(id){
      if (state.toggle){
        open[id]=!open[id];
      }
      else {
        open = id;
      }
    };
    this.isOpen = function(id){
      return id === open || state.toggle && open[id];
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

var dropdown = {
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

var jumbotron = {
  view: function(ctrl) {
    return m('.jumbotron',[
      m('.container',[
        ctrl.inner
      ])
    ]);
  }
};

var modal = {
  controller: function(state) {
    var open, backdrop, saveBodyClass='';
    function close(e){
      open = false;
      state.trigger(false);
      document.body.className=saveBodyClass;
      if (e) m.redraw();
    }
    this.close = {onclick:function(){close();}};
    this.triggerState = state.trigger;
    this.bind = function(element){
      if (!open && state.trigger()){
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
    var isOpen = ctrl.triggerState();
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

// tabset based on bootstrap navs markup.
// state = 
//  active: current (default) tab
//  style: 'tabs' | 'pills'

var tabset = {
  controller: function(state){
    var currentTab = state.active;
    this.count = 0;
    this.tabs = [];
    this.content = [];

    this.style=state.style || 'tabs';

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

var tab = {
  controller: function(state, tabset) {
    this.tabset = tabset;
    this.redrawIfVisible = state.redrawIfVisible;
    this.tabIdx=this.tabset.count++;
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
    if (ctrl.redrawIfVisible!==false || style.display!='none'){
      content[ctrl.tabIdx] = m('.tabcontent', {style:style}, tabContent);
    }
  }
};

module.exports = function(prefix){
  prefix = prefix || '';
  m.element(prefix + 'accordion', accordion);
  m.element(prefix + 'dropdown', dropdown);
  m.element(prefix + 'jumbotron', jumbotron);
  m.element(prefix + 'modal', modal);
  m.element(prefix + 'tabset', tabset);
  m.element(prefix + 'tab', tab);
};