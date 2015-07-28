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
        },
        "staff":{
            "eng":"Staff",
            "heb":"סגל"
        },
        "classroom":{
            "eng":"Classroom",
            "heb":"כיתה"
        },
        "compRoom":{
            "eng":"Computer room",
            "heb":"כיתת מחשבים"
        },
        "auditorium":{
            "eng":"Auditorium",
            "heb":"אודיטוריום"
        },
        "office":{
            "eng":"Office",
            "heb":"משרד"
        },
        "building":{
            "eng":"Building",
            "heb":"בניין"
        },
        "numOfSeats":{
            "eng":"number of seats",
            "heb":"מספר מושבים"
        },
        "noData":{
            "eng":"no data",
            "heb":"אין מידע"
        }
    });