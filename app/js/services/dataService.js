mapApp.service("dataService", ["$http", function ($http) {

    var rooms, buildings;

    function getRooms() {
        return $http.get("mockData/rooms.json");
    }

    function getBuildings(){
        return $http.get("mockData/buildings.json");
    }

    return {
        getRooms: getRooms,
        getBuildings: getBuildings
    }
}]);