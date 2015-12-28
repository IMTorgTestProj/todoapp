angular.module("todomvc",["ngRoute","ngResource"]).config(["$routeProvider",function(a){"use strict";var b={controller:"TodoCtrl",templateUrl:"/app/todomvc-index.html",resolve:{store:["todoStorage",function(a){return a.then(function(a){return a.get(),a})}]}};a.when("/",b).when("/:status",b).otherwise({redirectTo:"/"})}]),angular.module("todomvc").controller("TodoCtrl",["$scope","$routeParams","$filter","store",function(a,b,c,d){"use strict";var e=a.todos=d.todos;a.newTodo="",a.editedTodo=null,a.$watch("todos",function(){a.remainingCount=c("filter")(e,{completed:!1}).length,a.completedCount=e.length-a.remainingCount,a.allChecked=!a.remainingCount},!0),a.$on("$routeChangeSuccess",function(){var c=a.status=b.status||"";a.statusFilter="active"===c?{completed:!1}:"completed"===c?{completed:!0}:{}}),a.$on("$viewContentLoaded",function(){document.getElementById("new-todo").focus()}),a.addTodo=function(){var b={title:a.newTodo.trim(),completed:!1};b.title&&(a.saving=!0,d.insert(b).then(function(){a.newTodo=""})["finally"](function(){a.saving=!1}))},a.editTodo=function(b){a.editedTodo=b,a.originalTodo=angular.extend({},b)},a.saveEdits=function(b,c){return"blur"===c&&"submit"===a.saveEvent?void(a.saveEvent=null):(a.saveEvent=c,a.reverted?void(a.reverted=null):(b.title=b.title.trim(),b.title===a.originalTodo.title?void(a.editedTodo=null):void d[b.title?"put":"delete"](b).then(function(){},function(){b.title=a.originalTodo.title})["finally"](function(){a.editedTodo=null})))},a.revertEdits=function(b){e[e.indexOf(b)]=a.originalTodo,a.editedTodo=null,a.originalTodo=null,a.reverted=!0},a.removeTodo=function(a){d["delete"](a)},a.saveTodo=function(a){d.put(a)},a.toggleCompleted=function(a,b){angular.isDefined(b)&&(a.completed=b),d.put(a,e.indexOf(a)).then(function(){},function(){a.completed=!a.completed})},a.clearCompletedTodos=function(){d.clearCompleted()},a.markAll=function(b){e.forEach(function(c){c.completed!==b&&a.toggleCompleted(c,b)})}}]),angular.module("todomvc").directive("todoEscape",function(){"use strict";var a=27;return function(b,c,d){c.bind("keydown",function(c){c.keyCode===a&&b.$apply(d.todoEscape)}),b.$on("$destroy",function(){c.unbind("keydown")})}}),angular.module("todomvc").directive("todoFocus",["$timeout",function(a){"use strict";return function(b,c,d){b.$watch(d.todoFocus,function(b){b&&a(function(){c[0].focus()},0,!1)})}}]),angular.module("todomvc").factory("todoStorage",["$http","$injector",function(a,b){"use strict";return a.get("/api/todos").then(function(){return b.get("api")},function(){return b.get("localStorage")})}]).factory("api",["$resource","$location",function(a,b){"use strict";var c={todos:[],api:a("api/todos/:id",null,{update:{method:"PUT"}}),clearCompleted:function(){var a=c.todos.slice(0),b=[],d=[];c.todos.forEach(function(a){a.completed?b.push(a):d.push(a)}),angular.copy(d,c.todos),b.forEach(function(b){return c.api["delete"]({id:b._id},function(){},function(){angular.copy(a,c.todos)})})},"delete":function(a){var b=c.todos.slice(0);return c.todos.splice(c.todos.indexOf(a),1),c.api["delete"]({id:a._id},function(){},function(){angular.copy(b,c.todos)})},get:function(){return c.api.query(function(a){angular.copy(a,c.todos)})},insert:function(a){var d=c.todos.slice(0);return c.api.save(a,function(d){b.path("/api/todos"),a.id=d.id,c.todos.push(a)},function(){angular.copy(d,c.todos)}).$promise},put:function(a){return c.api.update({id:a._id},a).$promise}};return c}]).factory("localStorage",["$q",function(a){"use strict";var b="todos-angularjs",c={todos:[],_getFromLocalStorage:function(){return JSON.parse(localStorage.getItem(b)||"[]")},_saveToLocalStorage:function(a){localStorage.setItem(b,JSON.stringify(a))},clearCompleted:function(){var b=a.defer(),d=[],e=[];return c.todos.forEach(function(a){a.completed?d.push(a):e.push(a)}),angular.copy(e,c.todos),c._saveToLocalStorage(c.todos),b.resolve(c.todos),b.promise},"delete":function(b){var d=a.defer();return c.todos.splice(c.todos.indexOf(b),1),c._saveToLocalStorage(c.todos),d.resolve(c.todos),d.promise},get:function(){var b=a.defer();return angular.copy(c._getFromLocalStorage(),c.todos),b.resolve(c.todos),b.promise},insert:function(b){var d=a.defer();return c.todos.push(b),c._saveToLocalStorage(c.todos),d.resolve(c.todos),d.promise},put:function(b,d){var e=a.defer();return c.todos[d]=b,c._saveToLocalStorage(c.todos),e.resolve(c.todos),e.promise}};return c}]);