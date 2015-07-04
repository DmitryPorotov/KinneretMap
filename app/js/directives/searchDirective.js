mapApp.directive("kmSearch", function () {
    return {
        restrict: "E",
        scope: {
            searchResults: "="
        },
        template: '<div ng-repeat="r in searchResults">{{r.id}} - Building: {{r.buildingId}}, floor {{r.floorNum}}</div>'
    }
})