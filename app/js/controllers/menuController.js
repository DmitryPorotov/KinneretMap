mapApp.controller("menuController", ["$scope", "dataService", function ($scope, dataService) {
    $scope.searchField = null;
    $scope.searchResults = [];
    $scope.rooms = null;
    $scope.isSearchShown = false;
    $scope.isBuildingsCatalogShown = false;
    $scope.isStaffCatalogShown = false;
    $scope.isRoomDetailsShown = false;
    $scope.isFloorPlanShown = false;
    $scope.curRoom = null;

    dataService.getRooms().success(function (data) {
        $scope.rooms = data;
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

    $scope.showDetails = function (r) {
        $scope.isRoomDetailsShown = true;
        $scope.isFloorPlanShown = true;
        $scope.curRoom = r;
    }

    $scope.selectRoom = function(roomNum) {
        $scope.curRoom = _.find($scope.rooms, function (room) { return room.id == roomNum;})
    }

}]);