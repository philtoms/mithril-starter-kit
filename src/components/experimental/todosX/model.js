'use strict';

var list = [];


// Todo Model
function Todo(data){
  this.id = list.length;
  this.title = m.prop(data.title);
  this.completed = m.prop(false);  
  this.remove = function(){
    var _item=this;
    list = list.filter(function(item){
      return (item!==_item);
    });
  };
}

var model = {

  // List of Todos
  TodoList: function () {
    return list;
  },

  // Add a Todo 
  add: function(title) {
    list.push(new Todo({title: title }));
  },

  // Remove all Todos where Completed == true
  clearCompleted: function() {
    for(var i = 0; i < list.length; i++) {
      if(list[i].completed())
        list.splice(i, 1);
    }
  },

  completeAll: function () {
    var complete = model.allCompleted();
    for (var i = 0; i < list.length; i++) {
      list[i].completed(!complete);
    }
  },
  
  allCompleted: function () {
    for (var i = 0; i < list.length; i++) {
      if (!list[i].completed()) {
        return false;
      }
    }
    return true;
  }
  
};

for (var i = 0; i < 50000; i++){
  model.add('List item no ' + (i+1));
}

module.exports = model;
