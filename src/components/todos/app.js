
'use strict';

var ENTER_KEY = 13;
var ESC_KEY = 27;

var app = {
	watchInput: function (onenter, onescape) {
    return function(e) {
      if (e.keyCode === ENTER_KEY) onenter();
      if (e.keyCode === ESC_KEY) onescape();
    };
  },
  isVisible: function (todo) {
    switch (app.filter()) {
      case 'active':
        return !todo.completed();
      case 'completed':
        return todo.completed();
      default:
        return true;
    }
  }
};

module.exports = app;
