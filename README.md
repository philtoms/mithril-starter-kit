# Mithril.Elements Starter Kit
Mithril.Elements is a thin wrapper around the [Mithril] JavaScript framework that allows you to create composable custom element types:
```javascript
m('greet', 'Bob')
```
becomes:
```html
<div class="greet">
  <span>Hi</span><span>Bob!</span>
</div>
```

Custom elements are first class Mithril citizens and compose naturally with existing DOM elements:
```javascript
m('accordion', [
  m('.item', ['Title 1','item line one']),
  m('.item', ['Title 2','item line two']),
  m('.item', ['Title 3','item line three']),
  m('.item', ['Title 4','item line four'])
])
```
[view in plunkr](http://embed.plnkr.co/FuSEJtlhvv4yqKN8Ohjd/preview)
 
Application element types lend themselves to a feature oriented program structure: 
```javascript
m('#todoapp',[
  m('header',[
    m('new-task')
  ]),
  m('list-of-tasks', [
    m('$task')
  ]),
  m('footer')
])
```
[view in plunkr](http://embed.plnkr.co/WIOF43ObW3NL2nW2XPkr/preview)

Overloading existing DOM tags works too. A huge table might be tamed this way:
```javascript
m('table', [
  m('thead', ['Name','Posts','Last Topic']),
  m('tbody',{state:{rows:12, content:hugeArray}}, function(content){return [
    m('td', content.name),
    m('td', content.posts),
    m('td', content.lastTopic)
  ]})
])
```
compiles to:
```html
<table style="display: block; overflow: scroll; height: 240px;">
  <thead style="display: block; position: fixed;">
    <th>Name</th>
    <th>Posts</th>
    <th>Last Topic</th>
  </thead>
  <tbody style="height: 100000px; display: block; position: relative; top: 20px;">
    <tr>
      <td>Bob</td>
      <td>47</td>
      <td>About occlusion scrolling</td>
    </tr>
    <!-- + 11 more rows -->
  </tbody>
</table>
```
[view in plunkr](http://embed.plnkr.co/TQuzWpBzP4AMN874gOfF/preview)


## Getting Started
Three ways to use Mithril.Elements:

1. download [this project](
https://github.com/philtoms/mithril.elements/archive/master.zip
) and link to mithril and mithril.elements in the head of your app
 ```html
    <head>
        <meta charset="utf-8">
        <script src="mithril.js"></script>
        <script src="mithril.elementsjs"></script>
    </head>
 ```
2. easier - npm install mithril.elements into your current Mithril project and require in your app
 ```shell
npm install --save mithril.elements
```
 ```javascript
 //  (Broswerify or WebPack)
 var m =  require('mithril.elements'); 
 ```

3. easiest - [clone] or [fork] this repro and start hacking

 ```shell
$ git clone -o upstream https://github.com/philtoms/mithril-starter-kit.git MyApp
$ cd MyApp
$ npm install -g gulp           # Install Gulp task runner globally
$ npm install                   # Install Node.js components listed in ./package.json
 ```
 shell commands:
 ```
gulp build --release            # minify and build to release folder 
gulp serve                      # open browser on port 3000
gulp jest                       # single pass test runner
gulp tdd                        # watch + test runner
npm test                        # run tests in CI (e.g. travis)
npm run-script debug-test       # run tests in node-inspector
 ```

## Using Mithril.Elements
Mithril.Elements are extended Mithril [components], bound to an element tag name and registered with the application, so that they can be used in-line with default element types in Mithril views.

An element registration:
```javascript
m.element('accordion', {
  controller: function() {
    this.toggle = function(id){
      this.open=id;
    }
  },
  view: function(ctrl, content) {
    display = function(id) {
      return 'display:'+(ctrl.open===id? 'block':'none') 
    }
    return m('.accordion', content.map(function(line,id){
      return m(line,{
        onclick:ctrl.toggle.bind(ctrl,id)
      },[
        line.children[0],
        m('div',{style:display(id)},line.children[1])
      ])
    }))
  }
})
```
In the view:
```javascript
m('accordion', [
  m('.item', ['Title 1','item line one']),
  m('.item', ['Title 2','item line two']),
  m('.item', ['Title 3','item line three']),
  m('.item', ['Title 4','item line four'])
])
```

[view in plunkr](http://embed.plnkr.co/FuSEJtlhvv4yqKN8Ohjd/preview)

Sometimes you don't need to use the controller part of an element. In this situation you can leave it out of the definition and Mithril.Elements will provide a default controller:
```javascript
m.element('jumbotron', {
  view: function(ctrl,inner) {
    return m('.jumbotron',[
      m('.container',[
        inner
      ])
    ])
  }
})
```
Note that the view can still receive the controller instance and can therefore access any state passed to the view through the controller.state property:
```javascript
view: function(ctrl) {
  var count = ctrl.state.count;
}
```
### Element state and the Mithril page life-cycle
All Mithril components have program state - encapsulated in controller logic and typically maintained hierarchically through [m.module] registration. A custom elements program state on the other hand is tied to the life-cycle of its own parent view. This is the main difference between a custom element component and a standard Mithril component: Mithril.Element life-cycle is consistent with DOM element life-cycle.

Element state come into existence lazily when the element in the view is first created and is maintained until the view is discarded (on a route change for example). In Mithril terms, element state is tied to the ongoing [redraw strategy] so that:

- **all** - creates element state via a *new* controller instance - *always*
- **diff** - uses the state of the *current* controller instance 
 - *if it exists*
 - *otherwise as*  **all**

### Element identity
In most cases, this extended state management strategy is silently implemented by the Mithril.Elements. In all of the examples presented so far, explicit reference to state management is not mentioned. However there are some programming scenarios where this strategy will fail. 

Mithril.Elements does not attempt to track element state through dynamically changing page layouts and relies instead on view generated identity using the following logical sequence:

- use the virtual Element key attribute if it exists:

 ```javascript
 m('greet',{key:'bob1'}, 'Bob') // component identity is bob1
 ```

- use the virtual Element id attribute if it exists:

 ```javascript
 m('greet#bob2', 'Bob')         // component identity is bob2
 m('greet',{id:'bob2'}, 'Bob')  // component identity is bob2
 ```
- use the element state.id attribute if it exists:
 
 ```javascript
 m('greet',{state:{id='bob3'}}) // component identity is bob3
 ```
 
- Default: generate a sequential id, keyed on page refresh. This option is not suitable
for lists or for pages that are composed logically:
 
 ```javascript
m('greet', 'Bob')              // component identity is greet1
 ```

### Creating element singletons
Mithril.Elements are designed to be composed in-line with the current view life-cycle. Nevertheless, there are situations where it can be useful to create an instance outside of the view life-cycle and feed the instance into the view directly:

```javascript
{
  controller: function(){
   var page1 = page.instance('one')
   var page2 = page.instance('two')
  },
  view: function(){
    return m('tabset', {}, 
      function(){ return [
        m('tab', ['Page 1', m(page1)]),
        m('tab', ['Page 2', m(page2)])
      ]}
    )
  }
}
```

Note that this pattern effectivey emulates the standard Mithril component pattern, with the semantic difference being that the singleton instance can be composed directly and interchangebly with other element types.

Element singletons are also a useful pattern to use when you need to expose an extended API:

```javascript
var launcherFactory = m.element('unicornLauncher', {
  controller: function(){
    // borrowed from https://docs.angularjs.org/guide/providers
    var useTinfoilShielding=false
    this.useTinfoilShielding = function(value) {
      useTinfoilShielding = !!value;
    }
    this.launch = function(useTinfoilShielding){...}
  },
  view: function(){
    return m('button', {onclick:ctrl.launch})
  }
}
// tally ho!!
launcherFactory.instance().useTinfoilShielding(true);
```

### Escaping element tag names
Element tag names can be escaped by preceeding them with the **$** sign to prevent them from being compiled into components. There are two situations where this can be useful:

1. Using custom elements as templates in a parent-child relationship
```javascript
m('#todoapp',[
    m('header',[
      m('new-task')
    ]),
    m('list-of-tasks', [
      m('$task')          // use task as a template
    ]),
    m('footer')
])
```

2. Preventing recursion when overriding native elements

```javascript
view:function(ctrl){
  return m('$table',{style:{ // escape table to prevent recursion
    display:'block',
    overflow:'scroll',
    height:ctrl.height
  },
  config:ctrl.setup})
}
```
  
## Composability
Mithril.Elements supports two composability patterns: lexical and parent-child.

Lexical composability (the standard mithril pattern) means that sibling elements are compiled in order of definition and child elements before parents:
```javascript
m('.main', [         // order of compilation -->
   m('sib-1'),       // sib-1 :         :
   m('sib-2',[       //       :         : sib-2
      m('child-1')   //       : child-1 :
   ])
])
```
Normally this does not matter because the elements are [orthogonal] and they all end up being compiled before the DOM build phase. However, when creating higher order custom elements, compilation order becomes an issue for parent-child relationships.

Parent-child composibility uses the factory pattern to reverse the compilation order so that the child is compiled in the context of the parent:
```javascript
m('table', [                            //       :    :    :    : table
  m('tbody', function(content){return [ // tbody :    :    :    :
    m('td', content.name),              //       : td :    :    :
    m('td', content.posts),             //       :    : td :    :
    m('td', content.lastTopic)          //       :    :    : td :
  ]}
])
```
In the parent-child pattern, the parent component is responsible for compiling the child. Given this pattern, the parent has the opportunity to pass context into the child:
```javascript
view: function(ctrl,child) {
  return ctrl.data.map(function(rowData){
    return child(rowData)
  }
}
```

## Mithril API extensions

### m.element
Use the m.element API to register mithril components as custom element types:
```javascript
m.element('accordion', {
  controller: function() {
    this.toggle = function(id){
      this.open=id;
    }
  },
  view: function(ctrl, content) {
    display = function(id) {
      return 'display:'+(ctrl.open===id? 'block':'none') 
    }
    return m('.accordion', content.map(function(line,id){
      return m(line,{
        onclick:ctrl.toggle.bind(ctrl,id)
      },[
        line.children[0],
        m('div',{style:display(id)},line.children[1])
      ])
    }))
  }
})
```
[view in plunkr](http://embed.plnkr.co/FuSEJtlhvv4yqKN8Ohjd/preview)

The Mithril component signature has been modified for semantic components in the following ways:

- **Controller** - the controller accepts an optional state argument. The state can be any valid JavaScript type and will be passed on to the controller constructor function at the start of the current page life-cycle.

- **View** - the view accepts an optional inner argument. The inner argument can be one of:
 - Functor - a function callback that is used to provide context to complex element compositions.
 - Template - a virtual DOM element that will provide the component element structure.
 - Content - an array of virtual Elements that form the children of the component.
 
- **Instance** - an additional component method that can be used to programatically create a component instance. The method returns a new element Controller instance that can be used inline in view composition.

Signature:

```clike
Module element(string elementName, Module module)

where:
  Module :: Object { Controller, View, Instance }
  Controller :: void controller([State state])
    { prototype: void unload(UnloadEvent e) }
  State :: Object | Array | Literal | undefined
  View :: void view(Object controllerInstance [, Inner inner]) 
    Inner :: Functor | VirtualElement | Array<VirtualElement> | undefined
    UnloadEvent :: Object {void preventDefault()}
  Instance :: Controller instance(State state)

```

### m
A thin wrapper around the mithril [m()] signature function that lets Mithril.Elements intercept semantically registered element tags and integrate components bound to these tags with the current Mithril page life-cycle. 

The signature has been modified in the following ways:

- **tag** - the tag argument can be any HTML5 tag name or a semantically registered component name, or a pre-compiled component instance:

 ```javascript
  m('greet', 'Bob') // hi Bob!

  var greeter = greet.instance('hola')
  m(greeter, 'Bob')  // hola Bob!
```

 Mithril.Elements will use the tag name to look up registered components. If a component has been registered under a tag name, one of two behaviours will occur depending on the current redraw strategy:
 
 - **all** - creates element state via a *new* controller instance. Optional initial state will be passed on to the controller constructor function.
 
 - **diff** - uses the state of the *current* controller instance. Therefore does not pass state.
 
 In both cases, the component view will be called on every redraw, but only after the controller has been invoked.
 
- **attrs** - The attrs argument accepts a spcial property named **state**. The value of the state property will be passed unchanged to the controller constructor. The full signature must be used when passing state data to a component constructor:

 ```javascript
  // Note that the full signature must be used 
  // when passing data to the controller
  m('tbody', {state:{rows:12, content:hugeArray}}, function(content){return [
    m('td', content.name),
    m('td', content.posts),
    m('td', content.lastTopic)
  ]})
 ```
 
- **children** - the children argument can be overloaded with a functor that provides a context for composing complex elements.

 ```javascript
  m('shopping-cart-item',function(ctx){ return 
    m('item', ctx.name),
    m('price', ctx.price),
    m('qnty', ctx.quantity])
  ]})
 ``` 

Signature:

```clike
VirtualElement m(String selector [, Attributes attributes] [, Children... children])

where:
  VirtualElement :: Object { String tag, Attributes attributes, Children children }
  Attributes :: Object<any | void config(DOMElement element, Boolean isInitialized, Object context)>
  Children :: String text | VirtualElement virtualElement | SubtreeDirective directive | Functor | Array<Children children>
  SubtreeDirective :: Object { String subtree }
  Functor :: Function definition
```

## and finally
A special thanks to:

- Konstantin Tarkus - This starter kit owes a lot to [React Starter Kit](https://github.com/kriasoft/react-starter-kit)
- Sean Adkinson - [npm-debug / node-inspector integration](http://stackoverflow.com/a/26415442/2708419)
- Barney Carroll - [Ideas and encouragement for this project](https://groups.google.com/forum/#!topic/mithriljs/kt3JburQb1o)

### Copyright

Source code is licensed under the MIT License (MIT). See [LICENSE.txt](./LICENSE.txt)
file in the project root. Documentation to the project is licensed under the
[CC BY 4.0](http://creativecommons.org/licenses/by/4.0/) license. 


[Mithril]: http://lhorie.github.io/mithril/index.html
[m()]:http://lhorie.github.io/mithril/mithril.html
[components]: http://lhorie.github.io/mithril/components.html
[redraw strategy]:http://lhorie.github.io/mithril/mithril.redraw.html#strategy
[m.module]:http://lhorie.github.io/mithril/mithril.module.html
[referential integrity]:http://lhorie.github.io/mithril/mithril.html#dealing-with-sorting-and-deleting-in-lists
[semantic]: http://html5doctor.com/lets-talk-about-semantics/
[orthogonal]:http://stackoverflow.com/questions/1527393/what-is-orthogonality
[custom elements]: http://w3c.github.io/webcomponents/spec/custom/
[idiomatically scripted]: http://lhorie.github.io/mithril/getting-started.html
[clone]: github-windows://openRepo/https://github.com/philtoms/mithril-starter-kit
[fork]: https://github.com/philtoms/mithril-starter-kit/fork
