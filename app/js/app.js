var mapApp = angular.module('mapApp', ['ngRoute','angularTreeview',/*'ngAnimate',*/ 'ui.bootstrap','tmh.dynamicLocale'],
    function ($routeProvider, $locationProvider) {
        $routeProvider
            .when("/:lang/", {
                //controller: "menuController",
                templateUrl: "templates/main.html",
                access: "all"
            })
            .when("/:lang/:sType/:sTerm", {
                //controller: "menuController",
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
        "search":{
            "eng":"Search",
            "heb":"חפש"
        },
        "staff":{
            "eng":"Staff",
            "heb":"סגל"
        },
        "roomType1":{
            "eng":"Classroom",
            "heb":"כיתה"
        },
        "roomType2":{
            "eng":"Computer room",
            "heb":"כיתת מחשבים"
        },
        "roomType7":{
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
            "eng":"Number of seats",
            "heb":"מספר מושבים"
        },
        "noData":{
            "eng":"no data",
            "heb":"אין מידע"
        },
        //"floor":{
        //    eng:"floor",
        //    heb:"קומה"
        //}
        "name":{
            "eng":"Name",
            "heb":"שם"
        },
        "position":{
            "eng":"Position",
            "heb":"תפקיד"
        },
        "phones": {
            "eng":"Phones",
            "heb":"טלפונים"
        },
        "fax":{
            "eng":"Fax",
            "heb":"פקס"
        },
        "email":{
            "eng":"E-mail",
            "heb":'דו"אל'
        },
        "receptionHours":{
            "eng":"Reception hours",
            "heb":"שעות קבלה"
        },
        "receptionPlace":{
            "eng":"Room",
            "heb":"חדר"
        },
        "homepage":{
            "eng":"Home page",
            "heb":"דף הבית"
        },
        "noSearchResults":{
            "eng":"No results",
            "heb":"אין תוצאות"
        },
        "from":{
            "eng":"From:",
            "heb":"מ-"
        },
        "to":{
            "eng":"To:",
            "heb":"ל-"
        },
        "usage":{
            "eng":"Usage",
            "heb":"שימוש"
        },
        "classesTakingPlace": {
            "eng":"Today's classes",
            "heb":"שיעורים של היום"
        }
    });