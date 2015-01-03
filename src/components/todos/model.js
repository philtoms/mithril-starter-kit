
'use strict';

var storage = require('./storage');

var list = [];
var topId = 0;

// prop utility  
function gettersetter(store,cb) {
  var prop = function() {
    if (arguments.length) {
      store = arguments[0];
      if (cb){
        cb.call(this,store);
      }
    }
    return store;
  };

  prop.toJSON = function() {
    return store;
  };

  return prop;
}

function prop(store,cb) {
  return gettersetter(store,cb);
}
  
var model = {
  Todo: function (data) {

    this.id = data.id || ++topId;
    this.title = prop(data.title);

    this.completed = prop(data.completed || false,function(){
      storage.put(list);
    });

    this.editing = prop(data.editing || false, function(){
      this.title(this.title().trim());
      if (!this.title()) {
        this.remove();
      }
      storage.put(list);
    });
    
    this.remove = function () {
      list.splice(list.indexOf(this), 1);
      storage.put(list);
    };
    
  },
  
  Todos: function(){

    list = storage.get();
    
    // Update with props
    list = list.map(function(item) {
      topId = Math.max(item.id,topId);
      return new model.Todo(item);
    });

    this.add = function(title){    
      list.push(new model.Todo({title: title}));
      storage.put(list);
    };
    
    this.completeAll = function () {
      var complete = allCompleted();
      for (var i = 0; i < list.length; i++) {
        list[i].completed(!complete);
      }
      storage.put(list);
    };
    
    var allCompleted = this.allCompleted = function () {
      for (var i = 0; i < list.length; i++) {
        if (!list[i].completed()) {
          return false;
        }
      }
      return true;
    };
    
    this.clearCompleted = function () {
      for (var i = list.length - 1; i >= 0; i--) {
        if (list[i].completed()) {
          list.splice(i, 1);
        }
      }
      storage.put(list);
    };
  
    this.amountCompleted = function () {
      var amount = 0;
      for (var i = 0; i < list.length; i++) {
        if (list[i].completed()) {
          amount++;
        }
      }
      return amount;
    };

    this.list = list;
    
  }
};

module.exports = model;
