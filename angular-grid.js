angular
.module('ngGrid', [])
.filter('filterBy', [function () {
  return function (input, keyName, query, caseInsensitive) {
    if (!angular.isArray(input) || query === '') {
      return input;
    }
    
    var ret = [];
    angular.forEach(input, function(item) {
      var name = caseInsensitive ? angular.lowercase(item[keyName]) : item[keyName];
      var q = caseInsensitive ? angular.lowercase(query) : query;
      if (name && q && name.indexOf(q) !== -1) {
        ret.push(item);
      }
    });
    
    return ret;
  };
}])
.service('Grid', [ '$filter', function($filter){
    return function(pageSize, getData) {
        var grid = {};
        
        grid.query = '';
        grid.exact = false;
        
        // This is a function with a single parameter that should perform filtering for us
        grid.data = function(query) { 
          if (grid.query) {
            return $filter('filterBy')(getData(), 'name', grid.query, !grid.exact);
          } else {
            return getData();
          }
        };
        
        // Define grid selection functions / variables here
        var selector = {};
        
        selector.selection = [];
        selector.select = {
            none: function() {
                selector.selection = [];
            },
            single: function(id) {
                if (selector.selection === id) {
                    selector.selection = [];
                } else {
                    selector.selection = id;
                }
            },
            toggle: function(id) {
                var index = selector.selection.indexOf(id);
                if (index === -1) {
                    selector.selection.push(id);
                } else if (index > -1) {
                    selector.selection.splice(index, 1);
                }
            },
            all: function(fieldName) {
                if (selector.selection.length === grid.data(grid.query).length) {
                    // De-select all
                    selector.selection = [];
                } else {
                    // Select all
                    angular.forEach(grid.data(grid.query), function(value) {
                        if (selector.selection.indexOf(value[fieldName]) === -1) {
                            selector.selection.push(value[fieldName]);
                        }
                    });
                }
            }
        };
        grid.selector = selector;
        
        // Define grid sorting functions / variables here
        var sorter = {};
        
        sorter.reverse = false;
        sorter.orderByFieldName = 'id';
        sorter.sortBy = function(fieldName) {
            if (sorter.orderByFieldName === fieldName) {
                sorter.reverse = !sorter.reverse;
            } else {
                sorter.reverse = false;
                sorter.orderByFieldName = fieldName;
            }
        };

        grid.sort = sorter;
        
        // Define grid paging functions / variables here
        var pager = {};
        
        pager.pageNum = pager.numberOfPages = 0;        
        if (angular.isArray(pageSize) && pageSize.length > 0) {
            pager.pageSizes = pageSize;
            pager.pageSize = pageSize[0];
        } else if (angular.isNumber(pageSize)) {
            pager.pageSizes = [ pageSize ];
            pager.pageSize = pageSize;
        }
        pager.getPageRange = function(pageNum) {
          var range = [ pageNum-2, pageNum-1, pageNum, pageNum+1, pageNum+2 ];
          var sanitized = [];
          angular.forEach(range, function(item) {
            //if (pager.isValidPage(item)) {
              sanitized.push(item);
            //}
          });
          return sanitized;
        };
        pager.isValidPage = function(page) {
          return page >= 0 && page < grid.pager.numberOfPages;
        };
        pager.isCurrentPage = function(page) {
          return grid.pager.pageNum === page;
        };
        pager.firstPage = function() {
            pager.pageNum = 0;
        };
        pager.disableFirstPage = function() {
            return pager.disablePrevPage();
        };
        pager.prevPage = function() {
            pager.pageNum = pager.pageNum - 1;
        };
        pager.disablePrevPage = function() {
            return pager.pageNum === 0;
        };
        pager.nextPage = function() {
            pager.pageNum = pager.pageNum + 1;
        };
        pager.disableNextPage = function() {
            return (pager.pageNum + 1) * pager.pageSize >= grid.data(grid.query).length;
        };
        pager.lastPage = function() {
            grid.pager.pageNum = grid.pager.numberOfPages - 1;
        };
        pager.disableLastPage = function() {
            return pager.pageNum === (pager.numberOfPages - 1);
        };
        pager.pageSizeChanged = function() {
            var totalItems = grid.data(grid.query).length;
            pager.numberOfPages = Math.ceil(totalItems / pager.pageSize) || 1;
            if (pager.pageNum > pager.numberOfPages) {
                pager.pageNum = pager.numberOfPages - 1;
            }
        };

        grid.pager = pager;
        
        return grid;
    }
  }]);
