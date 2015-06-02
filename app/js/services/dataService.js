mapApp.service("dataService", ["$http", function ($http) {

    function getRooms() {
        return $http.get("mockData/rooms.json");
    }

    return {
        getRooms: getRooms
    }
}]);