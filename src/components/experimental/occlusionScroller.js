'use strict';

module.exports = m.element('occlusionScroller',{

  // Component controllers are instanced with optional data.
  // This data is part of the interface definition that users
  // of a component are expected to comply with. In this case
  // the data must contain:
  //  items:  function returning a set of scrollable items 
  //  page:   the number of line to display on a page
  controller: function(model) {

    this.items = model.items;
    this.page = model.page;
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

  // Component views accept a controller and an optional inner argument.
  // 
  //  
  view: function(ctrl, template) {

    // fetch the item list into local scope. Typically this
    // controller method will be bound to the component controller
    // throuth the model interface and will return a reference to an 
    // external list.
    var items = typeof ctrl.items === 'function'? ctrl.items():ctrl.items;

    // calculate the begin and end indicies of the scrollable section
    var begin = ctrl.pageY() / ctrl.itemHeight | 0;

    // Add 2 so that the top and bottom of the page are filled with
    // next/prev item, not just whitespace if item not in full view
    var end = begin + ctrl.page + 2;

    var offset = ctrl.pageY % ctrl.itemHeight;
    var height = Math.min(items.length,ctrl.page) * ctrl.itemHeight + 'px';

    // add our own identity and style to the element. Note that any values
    // created here may be overridden by the component instance
    return m('.occlusionScroller', {style:{overflow:'scroll', height: height},config:ctrl.setup}, [
      
      m('.list', {style: {height: items.length * ctrl.itemHeight + 'px', position: 'relative', top: -offset + 'px'}}, [
        m('ul', {style: {paddingTop: ctrl.pageY() + 'px'}}, [

          // merge the page content into the flow with a standard map
          items.slice(begin, end).map(function(item, idx) {

            // register the child template. Notice that we 
            // are passing it as an object and not as a string tagname.
            // Mithril.Element can distinguish between compiled components 
            // and precompiled cells
            // 
            return m(template, {id:idx+begin,state:item});
          })

        ])
      ])
    ]);  
  }
});
