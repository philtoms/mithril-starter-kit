/*
 * Mithral Starter Kit
 * Copyright (c) 2014 Phil Toms (@PhilToms3).
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* global jest, describe, it, expect */

'use strict';

jest.dontMock('../app');

describe('app.watchInput', function() {

	var appstate = require('../app');

  var onType;
  var onEnter;
  var onEscape;

	var watchInput;
  var ENTER_KEY = 13;
  var ESC_KEY = 27;

	beforeEach(function(){
  	onEnter = jasmine.createSpy('onEnter');
  	onEscape = jasmine.createSpy('onEscape');

		watchInput = appstate.watchInput(onEnter,onEscape);

	});

  it('calls event handler on CR', function() {
  	watchInput({keyCode:ENTER_KEY});
    expect(onEnter).toHaveBeenCalled();
  });

  it('calls escape handler on ESC', function() {
  	watchInput({keyCode:ESC_KEY});
    expect(onEscape).toHaveBeenCalled();
  });
});
