
'use strict';

module.exports = m.element('header',{
  view: function(ctrl,content){
    return m('$header#header', [
      m('h1', 'todos'),
      content
    ]);
  }
});
