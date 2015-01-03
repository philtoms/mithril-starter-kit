'use strict';

var ENTER_KEY = 13;
var ESC_KEY = 27;

module.exports = {
  todoCount: 0,
	watchInput: function watchInput(ontype, onenter, onescape) {
    return function(e) {
      ontype(e);
      if (e.keyCode === ENTER_KEY) onenter();
      if (e.keyCode === ESC_KEY) onescape();
    };
  }
};
