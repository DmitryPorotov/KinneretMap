mapApp.directive("kmCatalog", function () {
    return {
        restrict: "E",
        template:'<div data-angular-treeview="true" data-tree-id="roomsTree" data-tree-model="buildingsData" ></div>'
    }
});