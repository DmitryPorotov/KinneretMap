var mapApp = angular.module('mapApp', ['ngRoute','angularTreeview'],
    function ($routeProvider, $locationProvider) {
        $routeProvider
            .when("/:lang", {
                controller: "menuController",
                templateUrl: "templates/main.html",
                access: "all"
            })
            //.when("/he", {
            //    controller: "menuController",
            //    templateUrl: "templates/main.html",
            //    access: "all"
            //})
            .otherwise({
                redirectTo: '/he'
            })

    }
);