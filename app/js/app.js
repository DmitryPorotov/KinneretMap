var mapApp = angular.module('mapApp', ['ngRoute','angularTreeview'],
    function ($routeProvider, $locationProvider) {
        $routeProvider
            .when("/:lang", {
                controller: "menuController",
                templateUrl: "templates/main.html",
                access: "all"
            })
            .otherwise({
                redirectTo: '/he'
            })
    }
).constant("langConst",{
        "buildings":{
            "eng":"Buildings",
            "heb":"בניינים"
        },
        "searchResults":{
            "eng":"Search Results",
            "heb":"תוצאות חיפוש"
        }
    });