mapApp.service("dataService", ["$http", function ($http) {

    function getRooms() {
        return $http.get("mockData/rooms.json");
    }

    function getBuildings(){
        return $http.get("mockData/buildings.json");
    }

    function getFloors(){
        return $http.get("mockData/floors.json");
    }

    function getCubicles(){
        return $http.get("mockData/cubicles.json");
    }

    return {
        getRooms: getRooms,
        getBuildings: getBuildings,
        getFloors: getFloors,
        getCubicles:getCubicles
    }
}]);