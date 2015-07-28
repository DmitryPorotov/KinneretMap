mapApp.service("dataService", ["$http", function ($http) {

    var isCached = true;

    return {
        getRooms: getRooms,
        getBuildings: getBuildings,
        getFloors: getFloors,
        getCubicles:getCubicles,
        getDepartments:getDepartments,
        getStaff:getStaff
    }

    function getRooms() {
        //return $http.get("http://localhost/api/rooms.php",{cache: isCached});
        return $http.get("mockData/rooms.json",{cache: isCached});
    }

    function getBuildings(){
        //return $http.get("http://localhost/api/buildings.php",{cache: isCached});
        return $http.get("mockData/buildings.json",{cache: isCached});
    }

    function getFloors(){
        //return $http.get("http://localhost/api/floors.php",{cache: isCached});
        return $http.get("mockData/floors.json",{cache: isCached});
    }

    function getCubicles(){
        return $http.get("mockData/cubicles.json",{cache: isCached});
    }

    function getDepartments(){
        //return $http.get("http://localhost/api/departments.php",{cache: isCached});
        return $http.get("mockData/departments.json",{cache: isCached});
    }

    function getStaff(){
        return $http.get("http://localhost/api/staff.php",{cache: isCached});
        return $http.get("mockData/staff.json",{cache: isCached});
    }

}]);