'use strict';

function merge(obj1,obj2,filter){
  var classAttrName = 'class' in obj1 ? 'class' : 'className';
  var classes = obj1[classAttrName]|| '';
  Object.keys(obj2).forEach(function(k){
    if (k.indexOf('class')>=0){
      classes += ' ' + obj2[k];
    } else if ((filter||' ').indexOf(k)<0) {
      obj1[k] = obj2[k];
    }
  }); 
  if (classes && classes.trim()) {
    obj1[classAttrName]=classes.trim();
  }
  return obj1;
}

m.tags.occlusionScroller = {

  // Component controllers are instanced with optional data.
  // This data is part of the interface definition that users
  // of a component are expected to comply with. In this case
  // the data must contain:
  //  items:  function returning a set of scrollable items 
  //  page:   the number of line to display on a page
  controller: function(data) {

    this.items = data.attrs.items;
    this.page = data.attrs.page;
    this.itemHeight=58;
    var scroller={scrollTop:0};

    this.setup = function(element,done){
      if (!done){
        scroller = element;
        element.addEventListener('scroll', function(e) {
          m.redraw(); //notify view
        });
      }
    };

    this.pageY = function(){
      return scroller.scrollTop;
    };

  },

  view: function(ctrl) {

    var template = ctrl.children[0];

    // calculate the begin and end indicies of the scrollable section
    var pageY = ctrl.pageY(), begin = pageY / ctrl.itemHeight | 0;

    // Add 2 so that the top and bottom of the page are filled with
    // next/prev item, not just whitespace if item not in full view
    var end = begin + ctrl.page + 2;

    // fetch the item list into local scope. Typically this
    // controller method will be bound to the component controller
    // through the model interface and will return a reference to an 
    // external list.
    var items = (typeof ctrl.items === 'function'? ctrl.items():ctrl.items);
    var page = items.slice(begin, end);

    var offset = ctrl.attrs.step? 0: pageY % ctrl.itemHeight;
    var height = Math.min(items.length,ctrl.page) * ctrl.itemHeight + 'px';

    // add our own identity and style to the element. Note that any instance
    // attributes must be preserved
    return m('.occlusionScroller', merge({style:{overflow:'scroll', height: height},config:ctrl.setup},ctrl.attrs,'items'), [
      
      m('.list', {style: {height: items.length * ctrl.itemHeight + 'px', position: 'relative', top: -offset + 'px'}}, [
        m('ul', {style: {paddingTop: ctrl.pageY() + 'px'}}, [

          // merge the page content into the flow with a standard map
          page.map(function(item, idx) {

            // create the child from the template and give it a unique key.
            return m('div',{key:begin+idx}, [m(template.tag,{item:item})]);
          })

        ])
      ])
    ]);  
  }
};
