mapApp.service("dataService", ["$http", function ($http) {

    var isCached = true;

    return {
        getRooms: getRooms,
        getBuildings: getBuildings,
        getFloors: getFloors,
        //getCubicles:getCubicles,
        getStaff:getStaff,
        getLessons:getLessons
    };

    function getRooms() {
        return $http.get("http://localhost/api/rooms.php",{cache: isCached});
        return $http.get("mockData/rooms.json",{cache: isCached});
    }

    function getBuildings(){
        return $http.get("http://localhost/api/buildings.php",{cache: isCached});
        return $http.get("mockData/buildings.json",{cache: isCached});
    }

    function getFloors(){
        return $http.get("http://localhost/api/floors.php",{cache: isCached});
        return $http.get("mockData/floors.json",{cache: isCached});
    }

    //function getCubicles(){
    //    return $http.get("http://localhost/api/cubicles.php",{cache: isCached});
    //    return $http.get("mockData/cubicles.json",{cache: isCached});
    //}

    function getStaff(term){
        return $http.get("http://localhost/api/staff2.php?term=" + term,{cache: isCached});
        return $http.get("mockData/staff.json",{cache: isCached});
    }

    function getLessons(date){
        return $http.get("http://localhost/api/lessons.php?date=" + date,{cache: isCached});
        return $http.get("mockData/lessons.json?date=" + date,{cache: isCached});
    }

}]);