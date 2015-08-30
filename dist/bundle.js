"format register";
(function(global) {

  var defined = {};

  // indexOf polyfill for IE8
  var indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++)
      if (this[i] === item)
        return i;
    return -1;
  }

  function dedupe(deps) {
    var newDeps = [];
    for (var i = 0, l = deps.length; i < l; i++)
      if (indexOf.call(newDeps, deps[i]) == -1)
        newDeps.push(deps[i])
    return newDeps;
  }

  function register(name, deps, declare, execute) {
    if (typeof name != 'string')
      throw "System.register provided no module name";
    
    var entry;

    // dynamic
    if (typeof declare == 'boolean') {
      entry = {
        declarative: false,
        deps: deps,
        execute: execute,
        executingRequire: declare
      };
    }
    else {
      // ES6 declarative
      entry = {
        declarative: true,
        deps: deps,
        declare: declare
      };
    }

    entry.name = name;
    
    // we never overwrite an existing define
    if (!defined[name])
      defined[name] = entry; 

    entry.deps = dedupe(entry.deps);

    // we have to normalize dependencies
    // (assume dependencies are normalized for now)
    // entry.normalizedDeps = entry.deps.map(normalize);
    entry.normalizedDeps = entry.deps;
  }

  function buildGroups(entry, groups) {
    groups[entry.groupIndex] = groups[entry.groupIndex] || [];

    if (indexOf.call(groups[entry.groupIndex], entry) != -1)
      return;

    groups[entry.groupIndex].push(entry);

    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      var depEntry = defined[depName];
      
      // not in the registry means already linked / ES6
      if (!depEntry || depEntry.evaluated)
        continue;
      
      // now we know the entry is in our unlinked linkage group
      var depGroupIndex = entry.groupIndex + (depEntry.declarative != entry.declarative);

      // the group index of an entry is always the maximum
      if (depEntry.groupIndex === undefined || depEntry.groupIndex < depGroupIndex) {
        
        // if already in a group, remove from the old group
        if (depEntry.groupIndex !== undefined) {
          groups[depEntry.groupIndex].splice(indexOf.call(groups[depEntry.groupIndex], depEntry), 1);

          // if the old group is empty, then we have a mixed depndency cycle
          if (groups[depEntry.groupIndex].length == 0)
            throw new TypeError("Mixed dependency cycle detected");
        }

        depEntry.groupIndex = depGroupIndex;
      }

      buildGroups(depEntry, groups);
    }
  }

  function link(name) {
    var startEntry = defined[name];

    startEntry.groupIndex = 0;

    var groups = [];

    buildGroups(startEntry, groups);

    var curGroupDeclarative = !!startEntry.declarative == groups.length % 2;
    for (var i = groups.length - 1; i >= 0; i--) {
      var group = groups[i];
      for (var j = 0; j < group.length; j++) {
        var entry = group[j];

        // link each group
        if (curGroupDeclarative)
          linkDeclarativeModule(entry);
        else
          linkDynamicModule(entry);
      }
      curGroupDeclarative = !curGroupDeclarative; 
    }
  }

  // module binding records
  var moduleRecords = {};
  function getOrCreateModuleRecord(name) {
    return moduleRecords[name] || (moduleRecords[name] = {
      name: name,
      dependencies: [],
      exports: {}, // start from an empty module and extend
      importers: []
    })
  }

  function linkDeclarativeModule(entry) {
    // only link if already not already started linking (stops at circular)
    if (entry.module)
      return;

    var module = entry.module = getOrCreateModuleRecord(entry.name);
    var exports = entry.module.exports;

    var declaration = entry.declare.call(global, function(name, value) {
      module.locked = true;
      exports[name] = value;

      for (var i = 0, l = module.importers.length; i < l; i++) {
        var importerModule = module.importers[i];
        if (!importerModule.locked) {
          var importerIndex = indexOf.call(importerModule.dependencies, module);
          importerModule.setters[importerIndex](exports);
        }
      }

      module.locked = false;
      return value;
    });
    
    module.setters = declaration.setters;
    module.execute = declaration.execute;

    if (!module.setters || !module.execute)
      throw new TypeError("Invalid System.register form for " + entry.name);

    // now link all the module dependencies
    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      var depEntry = defined[depName];
      var depModule = moduleRecords[depName];

      // work out how to set depExports based on scenarios...
      var depExports;

      if (depModule) {
        depExports = depModule.exports;
      }
      else if (depEntry && !depEntry.declarative) {
        depExports = { 'default': depEntry.module.exports, __useDefault: true };
      }
      // in the module registry
      else if (!depEntry) {
        depExports = load(depName);
      }
      // we have an entry -> link
      else {
        linkDeclarativeModule(depEntry);
        depModule = depEntry.module;
        depExports = depModule.exports;
      }

      // only declarative modules have dynamic bindings
      if (depModule && depModule.importers) {
        depModule.importers.push(module);
        module.dependencies.push(depModule);
      }
      else
        module.dependencies.push(null);

      // run the setter for this dependency
      if (module.setters[i])
        module.setters[i](depExports);
    }
  }

  // An analog to loader.get covering execution of all three layers (real declarative, simulated declarative, simulated dynamic)
  function getModule(name) {
    var exports;
    var entry = defined[name];

    if (!entry) {
      exports = load(name);
      if (!exports)
        throw new Error("Unable to load dependency " + name + ".");
    }

    else {
      if (entry.declarative)
        ensureEvaluated(name, []);
    
      else if (!entry.evaluated)
        linkDynamicModule(entry);

      exports = entry.module.exports;
    }

    if ((!entry || entry.declarative) && exports && exports.__useDefault)
      return exports['default'];

    return exports;
  }

  function linkDynamicModule(entry) {
    if (entry.module)
      return;

    var exports = {};

    var module = entry.module = { exports: exports, id: entry.name };

    // AMD requires execute the tree first
    if (!entry.executingRequire) {
      for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
        var depName = entry.normalizedDeps[i];
        var depEntry = defined[depName];
        if (depEntry)
          linkDynamicModule(depEntry);
      }
    }

    // now execute
    entry.evaluated = true;
    var output = entry.execute.call(global, function(name) {
      for (var i = 0, l = entry.deps.length; i < l; i++) {
        if (entry.deps[i] != name)
          continue;
        return getModule(entry.normalizedDeps[i]);
      }
      throw new TypeError('Module ' + name + ' not declared as a dependency.');
    }, exports, module);
    
    if (output)
      module.exports = output;
  }

  /*
   * Given a module, and the list of modules for this current branch,
   *  ensure that each of the dependencies of this module is evaluated
   *  (unless one is a circular dependency already in the list of seen
   *  modules, in which case we execute it)
   *
   * Then we evaluate the module itself depth-first left to right 
   * execution to match ES6 modules
   */
  function ensureEvaluated(moduleName, seen) {
    var entry = defined[moduleName];

    // if already seen, that means it's an already-evaluated non circular dependency
    if (entry.evaluated || !entry.declarative)
      return;

    // this only applies to declarative modules which late-execute

    seen.push(moduleName);

    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      if (indexOf.call(seen, depName) == -1) {
        if (!defined[depName])
          load(depName);
        else
          ensureEvaluated(depName, seen);
      }
    }

    if (entry.evaluated)
      return;

    entry.evaluated = true;
    entry.module.execute.call(global);
  }

  // magical execution function
  var modules = {};
  function load(name) {
    if (modules[name])
      return modules[name];

    var entry = defined[name];

    // first we check if this module has already been defined in the registry
    if (!entry)
      throw "Module " + name + " not present.";

    // recursively ensure that the module and all its 
    // dependencies are linked (with dependency group handling)
    link(name);

    // now handle dependency execution in correct order
    ensureEvaluated(name, []);

    // remove from the registry
    defined[name] = undefined;

    var module = entry.declarative ? entry.module.exports : { 'default': entry.module.exports, '__useDefault': true };

    // return the defined module object
    return modules[name] = module;
  };

  return function(main, declare) {

    var System;

    // if there's a system loader, define onto it
    if (typeof System != 'undefined' && System.register) {
      declare(System);
      System['import'](main);
    }
    // otherwise, self execute
    else {
      declare(System = {
        register: register, 
        get: load, 
        set: function(name, module) {
          modules[name] = module; 
        },
        newModule: function(module) {
          return module;
        },
        global: global 
      });
      System.set('@empty', System.newModule({}));
      load(main);
    }
  };

})(typeof window != 'undefined' ? window : global)
/* ('mainModule', function(System) {
  System.register(...);
}); */

('app', function(System) {

System.register("router", [], function(_export) {
  var Router;
  function Router($stateProvider, $urlRouterProvider) {
    "use strict";
    $urlRouterProvider.otherwise("/home");
    $stateProvider.state("home", {
      url: "/home",
      controller: "HomeCtrl as homeCtrl",
      templateUrl: "components/home/home.html"
    }).state("class", {
      url: "/class",
      controller: "ClassCtrl as classCtrl",
      templateUrl: "components/class/class.html"
    }).state("scope", {
      url: "/scope",
      controller: "ScopeCtrl as scopeCtrl",
      templateUrl: "components/scope/scope.html"
    }).state("arrow", {
      url: "/arrow",
      controller: "ArrowCtrl as arrowCtrl",
      templateUrl: "components/arrow/arrow.html"
    }).state("details", {
      url: "/details",
      controller: "DetailsCtrl as detailsCtrl",
      templateUrl: "components/home/details.html"
    });
  }
  return {
    setters: [],
    execute: function() {
      "use strict";
      Router.$inject = ["$stateProvider", "$urlRouterProvider"];
      Router = Router;
      _export("Router", Router);
    }
  };
});

System.register("components/home/home-controller", [], function(_export) {
  var _classCallCheck,
      HomeController;
  return {
    setters: [],
    execute: function() {
      "use strict";
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      HomeController = function HomeController() {
        _classCallCheck(this, HomeController);
      };
      _export("default", HomeController);
    }
  };
});

System.register("components/class/class-controller", [], function(_export) {
  var _createClass,
      _classCallCheck,
      ClassController,
      Person;
  return {
    setters: [],
    execute: function() {
      "use strict";
      _createClass = (function() {
        function defineProperties(target, props) {
          for (var key in props) {
            var prop = props[key];
            prop.configurable = true;
            if (prop.value)
              prop.writable = true;
          }
          Object.defineProperties(target, props);
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
          if (staticProps)
            defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      ClassController = function ClassController() {
        _classCallCheck(this, ClassController);
        var vm = this;
        var person = new Person("Bob");
        vm.result = person.greet();
      };
      Person = (function() {
        function Person(firstName) {
          _classCallCheck(this, Person);
          this._first = firstName;
        }
        _createClass(Person, {
          first: {get: function() {
              return this._first;
            }},
          greet: {value: function greet() {
              return "Hello, " + this.first;
            }}
        });
        return Person;
      })();
      _export("default", ClassController);
    }
  };
});

System.register("components/scope/scope-controller", [], function(_export) {
  var _classCallCheck,
      ScopeController;
  return {
    setters: [],
    execute: function() {
      "use strict";
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      ScopeController = function ScopeController($timeout) {
        _classCallCheck(this, ScopeController);
        var vm = this;
        Object.assign(vm, {
          a: 0,
          b: 0,
          c: 0,
          varResult: "",
          letResult: ""
        });
        letAndVarDemo();
        varTest();
        letTest();
        function letAndVarDemo() {
          c = "var test";
          var a = 5;
          if (a === 5) {
            var bValue = b ? 3 : "Exception";
            var b = 4;
            var c = "var test 1";
          }
          vm.a = a;
          vm.b = bValue;
          vm.c = c;
        }
        function varTest() {
          for (var i = 0; i < 5; i++) {
            $timeout(function() {
              vm.varResult = vm.varResult + i + " ";
            }, i * 100);
          }
        }
        function letTest() {
          for (var i = 0; i < 5; i++) {
            (function(i) {
              $timeout(function() {
                vm.letResult = vm.letResult + i + " ";
              }, i * 100);
            })(i);
          }
        }
      };
      ScopeController.$inject = ["$timeout"];
      _export("default", ScopeController);
    }
  };
});

System.register("components/arrow/arrow-controller", [], function(_export) {
  var _classCallCheck,
      ArrowController;
  return {
    setters: [],
    execute: function() {
      "use strict";
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      ArrowController = function ArrowController() {
        _classCallCheck(this, ArrowController);
        var vm = this;
        var list = [1, 2, 3];
        vm.result = list.map(function(x) {
          return x * 2;
        });
      };
      _export("default", ArrowController);
    }
  };
});

System.register("app", ["router", "components/home/home-controller", "components/class/class-controller", "components/scope/scope-controller", "components/arrow/arrow-controller"], function(_export) {
  var Router,
      HomeController,
      ClassController,
      ScopeController,
      ArrowController,
      app;
  return {
    setters: [function(_router) {
      Router = _router.Router;
    }, function(_componentsHomeHomeController) {
      HomeController = _componentsHomeHomeController["default"];
    }, function(_componentsClassClassController) {
      ClassController = _componentsClassClassController["default"];
    }, function(_componentsScopeScopeController) {
      ScopeController = _componentsScopeScopeController["default"];
    }, function(_componentsArrowArrowController) {
      ArrowController = _componentsArrowArrowController["default"];
    }],
    execute: function() {
      "use strict";
      app = angular.module("app", ["ui.router"]);
      app.controller("HomeCtrl", HomeController);
      app.controller("ClassCtrl", ClassController);
      app.controller("ScopeCtrl", ScopeController);
      app.controller("ArrowCtrl", ArrowController);
      app.config(Router);
    }
  };
});

});