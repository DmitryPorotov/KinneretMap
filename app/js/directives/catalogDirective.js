mapApp.directive("kmCatalog", function () {
    return {
        restrict: "E",
        //template: '<div ng-repeat="b in data">{{b[0].building}}' +
        //    '<div ng-repeat="r in b">{{r.id}}' +
        //    '</div></div>',
        templateUrl: "templates/catalog.html",
        link: function (scope, element, attrs) {
            scope.$watch("rooms", function () {
                scope.data = _.groupBy(scope.rooms, function (item) {
                    return item.building;
                });
            });
        }
    }
})