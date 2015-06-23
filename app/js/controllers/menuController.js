mapApp.controller("menuController", ["$scope", "dataService", "$rootScope", "$routeParams",function ($scope, dataService, $rootScope, $routeParams) {
    $rootScope.currentBuildingId = null;
    $scope.searchField = null;
    $scope.searchResults = [];
    $scope.rooms = null;
    $scope.buildings = null;
    $scope.isSearchShown = false;
    $scope.isBuildingsCatalogShown = false;
    $scope.isStaffCatalogShown = false;
    $scope.isRoomDetailsShown = false;
    $scope.isFloorPlanShown = false;
    $scope.curRoom = null;

    dataService.getRooms().success(function (data) {
        $scope.rooms = data;
    });

    dataService.getBuildings().success(function (data) {
        $scope.buildings = data;
    });

    $scope.search = function () {
        $scope.isBuildingsCatalogShown = false;
        $scope.isStaffCatalogShown = false;
        $scope.isSearchShown = true;
        filterResults($scope.rooms);
    }

    $scope.showBuildingsCatalog = function () {
        $scope.isBuildingsCatalogShown = true;
        $scope.isStaffCatalogShown = false;
        $scope.isSearchShown = false;
    }

    function filterResults(rooms) {
        $scope.searchResults = [];
        $scope.rooms.forEach(function (v, i) {
            if (v.id.toString().indexOf(this.searchField) > -1 ) {
                this.searchResults.push(v);
            }
        }, $scope);
    }

    $scope.$watch("roomsTree.currentNode",function (n, o) {
        if (n) {
            $scope.isRoomDetailsShown = true;
            $scope.isFloorPlanShown = true;
            $scope.curRoom = n;
            $rootScope.currentBuilding = _.find($scope.buildings, function (building) {
                return building.id === $scope.curRoom.building;
            });
        }
    });

/*    $scope.showDetails = function (r) {
        $scope.isRoomDetailsShown = true;
        $scope.isFloorPlanShown = true;
        $scope.curRoom = r;
        $rootScope.currentBuildingId =_.find($scope.buildings, function (building) { return building.id == $scope.curRoom.building;});
    }*/

    $scope.selectRoom = function(roomNum) {
        $scope.curRoom = _.find($scope.rooms, function (room) { return room.id == roomNum;});

        $rootScope.currentBuilding =_.find($scope.buildings, function (building) { return building.id == $scope.curRoom.building;});
    }

}]);