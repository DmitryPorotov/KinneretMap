mapApp.service("dataService", ["$http", function ($http) {

    return {
        getRooms: getRooms,
        getBuildings: getBuildings,
        getFloors: getFloors,
        getCubicles:getCubicles
    }

    function getRooms() {
        return $http.get("http://localhost/api/rooms.php");
        //return $http.get("mockData/rooms.json");
    }

    function getBuildings(){
        return $http.get("http://localhost/api/buildings.php");
       // return $http.get("mockData/buildings.json");
    }

    function getFloors(){
        return $http.get("http://localhost/api/floors.php");
        //return $http.get("mockData/floors.json");
    }

    function getCubicles(){
        return $http.get("mockData/cubicles.json");
    }

}]);