mapApp.directive("kmSearch", function () {
    return {
        restrict: "E",
        scope: {
            searchResults: "="
        },
        template: '<div ng-repeat="r in searchResults">{{r.id}} - Building: {{r.building}}, floor {{r.floor}}</div>'
    }
})