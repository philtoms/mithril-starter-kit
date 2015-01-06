'use strict';

var scrollbarWidth = (function () {
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
})();

var accordion = m.element('accordion', {
  controller: function(options) {
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
  view: function(ctrl, content) {
    return m('.accordian.panel.panel-default', content.map(function(line,id){
      var title=line.children[0],content=line.children[1];
      return [
        m(line,{
          class:'panel-heading',
          onclick:ctrl.toggle.bind(ctrl,id)
        },
        m('.panel-title',title)),
        m('div.panel-body',{style:'display:'+(ctrl.isOpen(id)? 'block':'none')},content)
      ];
    }));
  }
});


var jumbotron = m.element('jumbotron', {

  view: function(ctrl,inner) {
    return m('.jumbotron',[
      m('.container',[
        inner
      ])
    ]);
  }
});

var modal = m.element('modal', {

  controller: function(options) {
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

  view: function(ctrl,inner) {
    inner = inner();
    var isOpen = ctrl.state();
    return m((isOpen? '.is-open':'.modal.fade'), {config:ctrl.bind}, [
      (isOpen? m('.modal-backdrop.fade.in'):''),
      m('.modal-dialog', [
        m('.modal-content', [
          m('.modal-header', [
            m('button.close[type="button" data-dismiss="modal" aria-label="Close"]',
              m('span[aria-hidden=true]', ctrl.close, m.trust('&times;'))),
            m('h4.modal-title', inner.title)
          ]),
          m('.modal-body', inner.body),
          m('.modal-footer', [
            m('button.btn.btn-default[type="button" data-dismiss="modal"]', ctrl.close, inner.cancel || 'Close'),
            inner.ok? m('button.btn.btn-primary[type="button"]', ctrl.close, inner.ok):''
          ])
        ])
      ])
    ]);
  }
});

// tabset based on bootstrap navs markup.
// Options = 
//  active: current (default) tab
//  style: 'tabs' | 'pills'

var tabset = m.element('tabset', {

  controller: function(options){

    var currentTab = options.active;
    var count = 0;
    var tabs = this.tabs = [];
    var content = this.content = [];

    this.style=options.style || 'tabs';

    function Select(){
      currentTab = this.tabIdx;
    }

    function active(tabIdx) {
      return tabIdx===currentTab? 'active':'';
    }

    function display(tabIdx) {
      return {display: (tabIdx===currentTab? 'block':'none')};
    }

    m.element('tab', {
      controller: function(options){
        this.tabIdx=count++;
        this.href=function(){
          return options.href? {config: m.route,href:options.href}:{href:'#'};
        };
      },
      
      view: function(ctrl,inner) {
        var tabName=inner[0], tabContent=inner[1];
        tabs[ctrl.tabIdx] = m('li.tab', {onclick:Select.bind(ctrl),class:active(ctrl.tabIdx)}, m('a', ctrl.href(), tabName));
        content[ctrl.tabIdx] = m('.tabcontent', {style:display(ctrl.tabIdx)}, tabContent);
      }
    });

  },

  view: function(ctrl,tabs) {
    // tabs needs to be a factory in order to compile 
    // directly into ctrl (ie parent / child) context
    tabs();
    return m('.tabset',[
      m('ul.nav.nav-'+ctrl.style, ctrl.tabs),
      m('div',ctrl.content)
    ]);
  }

});

module.exports = {
  accordion:accordion,
  jumbotron:jumbotron,
  modal:modal,
  tabset:tabset
};
