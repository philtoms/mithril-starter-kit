
'use strict';

module.exports = {
  view: function(ctrl){
    return m('header#header', [
      m('h1', 'todos'),
      ctrl.children[0]
    ]);
  }
};
