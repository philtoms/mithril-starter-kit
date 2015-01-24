
'use strict';

module.exports = me.element('header',{
  view: function(ctrl,content){
    return me('$header#header', [
      m('h1', 'todos'),
      content
    ]);
  }
});
