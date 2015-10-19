## Synopsis

This is a primitive grid service for AngularJS with basic logic for filtering, sorting, paging, and selecting

[Live Demo!](http://bodom0015.game-server.cc/bower_components/angular-grid/demo.html)

## Motivation
Tables are a common occurence in management dashboard UIs, so I have had to create quite a few of these in the past. Many grids already exist for AngularJS, and I decided to try and make one myself as an exercise.

Unfortunately, it takes a lot of bindings to get it working to the point that the demo works. I am working toward simplifying the markup by making a grid directive to wrap around the service soon, which should alleviate much of the custom binding and events.

I will also work toward creating add / remove / edit / save / cancel logic for the grid as well, so you may need to handle that logic yourself in the controller.

NOTE: Bootstrap is not necessary to use this wizard, I have simply used it below in the example to display the wizard.

## Installation
Bower integration possibly in the future.

Until then, running the following command should retrieve a copy of the source code:
```git
git clone https://github.com/bodom0015/angular-grid.git
```

The source code includes a `demo.html` page which illustrates the usage of this module.

To use the module, add a reference to the javascript to your `index.html`:
```html
<script src="angular-grid/angular-grid.js"></script>
```
    
## Usage
    
Add the `ngGrid` module to your module's instantiation and pass the Grid service into your Controller:
```js
angular
.module('gridTest', [ 'ngGrid' ])
.controller('GridController', [ '$scope', 'Grid', function($scope, Grid) {
  var arrayOfPageSizes = [ 5, 10, 15, 20 ];
  $scope.data = [
    { id: 2, name: 'Alice', number:1234 },
    { id: 1, name: 'Brian', number:2345 },
    { id: 4, name: 'Craig', number:3456 },
    { id: 3, name: 'Dana', number:4567 },
    { id: 6, name: 'Ellen', number:5678 },
    { id: 5, name: 'Frank', number:6789 },
    { id: 8, name: 'Greta', number:7890 },
    { id: 7, name: 'Henry', number:8901 },
    { id: 10, name: 'Ixtchel', number:9012 },
    { id: 9, name: 'Jesus', number:0123 },
    { id: 12, name: 'Karl', number:0000 },
    { id: 11, name: 'Laura', number:1111 },
    { id: 14, name: 'Mike', number:2222 },
    { id: 13, name: 'Nora', number:3333 },
    { id: 16, name: 'Othello', number:4444 },
    { id: 15, name: 'Persephone', number:5555 },
    { id: 18, name: 'Quartz', number:6666 },
    { id: 17, name: 'Ryan', number:7777 },
    { id: 20, name: 'Serpentine', number:8888 },
    { id: 19, name: 'Toronto', number:9999 },
    { id: 22, name: 'Uranium', number:1010 },
    { id: 21, name: 'Volt', number:1212 },
    { id: 24, name: 'Warhead', number:1313 },
    { id: 23, name: 'Xylophone', number:1414 },
    { id: 26, name: 'Yalda', number:1515 },
    { id: 25, name: 'Zlotnicki', number:1616 },
  ];
  
  // Pass in the pageSizes and a callback to retrieve the scope data
  $scope.grid = new Grid(arrayOfPageSizes, function() { return $scope.data; });
}]);
```

You should then be able to bind to this grid in the view template:
```html
<div ng-controller="GridController" class="container">
  <table class="table table-striped table-condensed table-hover" ng-if="grid.data(grid.query).length > 0">
    <thead>
      <tr>
        <td style="width:5%" ng-click="grid.selector.select.all('name')"><input type="checkbox" ng-checked="grid.selector.selection.length === grid.data(grid.query).length"/></td>
        <th style="width:20%" ng-click="grid.sort.sortBy('id')">
          ID&nbsp;&nbsp;<i class="fa" ng-show="grid.sort.orderByFieldName === 'id'" ng-class="{ 'fa-sort-numeric-asc': !grid.sort.reverse, 'fa-sort-numeric-desc':  grid.sort.reverse }"></i>
        </th>
        <th style="width:50%" ng-click="grid.sort.sortBy('name')">
          Name&nbsp;&nbsp;<i class="fa" ng-show="grid.sort.orderByFieldName === 'name'" ng-class="{ 'fa-sort-alpha-asc': !grid.sort.reverse, 'fa-sort-alpha-desc': grid.sort.reverse }"></i>
        </th>
        <th style="width:25%" ng-click="grid.sort.sortBy('number')">
          Number&nbsp;&nbsp;<i class="fa" ng-show="grid.sort.orderByFieldName === 'number'" ng-class="{ 'fa-sort-asc': !grid.sort.reverse, 'fa-sort-desc': grid.sort.reverse }"></i>
        </th>
      <tr>
     </thead>
     <tbody>
      <tr ng-click="grid.selector.select.toggle(item.name)" ng-repeat="item in grid.data(grid.query) | orderBy:grid.sort.orderByFieldName:grid.sort.reverse | limitTo:grid.pager.pageSize:(grid.pager.pageNum * grid.pager.pageSize)">
        <td><input type="checkbox" ng-checked="grid.selector.selection.indexOf(item.name) !== -1" /></td>
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.number }}</td>
      </tr>
    </tbody>
  </table>
</div>
```

## License

MIT