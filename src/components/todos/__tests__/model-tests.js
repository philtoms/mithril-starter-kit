/*
 * Mithral Starter Kit
 * Copyright (c) 2014 Phil Toms (@PhilToms3).
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* global jest, describe, it, expect */

'use strict';

jest.dontMock('../model');

describe('model.persistence', function() {

  debugger
	var model = require('../model');
  var storage = require('../storage');

	beforeEach(function(){
	});

  it('saves to local storage', function() {
    var task = new model.Todo({title:'a task'})
    expect (storage.put).toBeCalled();
  });

});
