
'use strict';

module.exports = {
  view: function(ctrl,content){
    return m('header#header', [
      m('h1', 'todos'),
      content
    ]);
  }
};
