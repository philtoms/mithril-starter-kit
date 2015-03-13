'use strict';

module.exports = {
  controller: function(state) {
    this.options = state;
    this.action = function(){
      var fn = arguments[0];
      var args = [].slice.call(arguments,1);
      return function(e){
        setTimeout(function(){fn.apply(null,args);},100);
        m.redraw.strategy('none');
      };
    };
  },

  view: function(ctrl) {
    return [
      m('dropdown',{state:ctrl.options}, [{
        title: 'Dropdown',
        body:[
          m('.item', 'item one'),
          m('.item', 'item two'),
          m('.item', 'item three'),
          m('.item', {onclick:ctrl.action(window.alert,'item 4 clicked')}, 'item four')
        ]
      }])
    ];
  }
};
